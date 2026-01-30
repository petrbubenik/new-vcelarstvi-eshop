import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for order submission
const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  priceAtPurchase: z.number().int().positive(),
  size: z.string().optional(),
});

const orderSchema = z.object({
  customerName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(9),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  postalCode: z.string().regex(/^\d{3}\s?\d{2}$/),
  paymentMethod: z.enum(["BANK_TRANSFER", "CASH_ON_DELIVERY"]),
  notes: z.string().max(500).optional(),
  items: z.array(orderItemSchema).min(1),
  total: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = orderSchema.parse(body);

    // Verify stock and calculate server-side total
    let serverTotal = 0;
    const orderItemsToCreate: Array<{
      productId: string;
      variantId: string | null;
      quantity: number;
      priceAtPurchase: number;
      size: string | null;
    }> = [];
    const variantsWithStock: Array<{
      where: { id: string };
      data: { stock: number };
    }> = [];

    for (const item of validatedData.items) {
      // Check if it's a variant (starts with cuid format) or product
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.productId },
        include: { product: true },
      });

      if (!variant) {
        return NextResponse.json(
          { error: `Varianta produktu s ID ${item.productId} neexistuje` },
          { status: 400 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Nedostatečná zásoba "${variant.product.name}" (${variant.size || ""}). Dostupno: ${variant.stock} ks`,
          },
          { status: 400 }
        );
      }

      serverTotal += variant.price * item.quantity;
      orderItemsToCreate.push({
        productId: variant.productId,
        variantId: variant.id,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        size: item.size || variant.size || null,
      });
      variantsWithStock.push({
        where: { id: variant.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Verify total matches
    if (serverTotal !== validatedData.total) {
      return NextResponse.json(
        { error: "Cena se neshoduje s aktuální cenou produktů" },
        { status: 400 }
      );
    }

    // Create order and update stock in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          customerName: validatedData.customerName,
          email: validatedData.email,
          phone: validatedData.phone,
          address: validatedData.address,
          city: validatedData.city,
          postalCode: validatedData.postalCode,
          paymentMethod: validatedData.paymentMethod,
          status: "PENDING",
          total: validatedData.total,
          items: {
            create: orderItemsToCreate,
          },
        },
      });

      // Update variant stock
      for (const item of variantsWithStock) {
        await tx.productVariant.update({
          where: item.where,
          data: item.data,
        });
      }

      return order;
    });

    return NextResponse.json(
      {
        orderId: result.id,
        message: "Objednávka úspěšně vytvořena",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Neplatná data objednávky", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Chyba při zpracování objednávky" },
      { status: 500 }
    );
  }
}
