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
  deliveryMethod: z.enum(["PPL", "SELF_COLLECTION"]),
  address: z.string().min(5).max(200).optional(),
  city: z.string().min(2).max(100).optional(),
  postalCode: z.string().regex(/^\d{3}\s?\d{2}$/).optional(),
  // Company fields
  isCompany: z.boolean().optional(),
  companyName: z.string().optional(),
  companyIc: z.string().optional(),
  companyDic: z.string().optional(),
  // Different delivery address
  differentDeliveryAddr: z.boolean().optional(),
  deliveryName: z.string().optional(),
  deliveryAddress: z.string().optional(),
  deliveryCity: z.string().optional(),
  deliveryPostalCode: z.string().optional(),
  paymentMethod: z.enum(["BANK_TRANSFER", "CASH_ON_DELIVERY", "CASH_IN_PERSON"]),
  deliveryCost: z.number().int().min(0).optional(),
  codFee: z.number().int().min(0).optional(),
  notes: z.string().max(500).optional(),
  items: z.array(orderItemSchema).min(1),
  total: z.number().int().positive(),
});

// Helper function to generate custom order ID in format YYDDMM01
async function generateOrderId(prisma: any): Promise<string> {
  const now = new Date();

  // Format: YYDDMM - Year (2 digits), Day (2 digits), Month (2 digits)
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');

  const prefix = `${year}${day}${month}`;

  // Count existing orders for today with the same prefix
  const existingOrders = await prisma.order.findMany({
    where: {
      id: {
        startsWith: prefix,
      },
    },
    select: {
      id: true,
    },
  });

  // Extract sequence numbers and find the highest
  let maxSequence = 0;
  for (const order of existingOrders) {
    const sequencePart = order.id.slice(-2);
    const sequence = parseInt(sequencePart, 10);
    if (!isNaN(sequence)) {
      maxSequence = Math.max(maxSequence, sequence);
    }
  }

  // Next sequence number
  const nextSequence = maxSequence + 1;

  // Format as YYDDMMNN (e.g., 25020101)
  return `${prefix}${nextSequence.toString().padStart(2, '0')}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = orderSchema.parse(body);

    // Validate address for PPL delivery
    if (validatedData.deliveryMethod === "PPL") {
      if (!validatedData.address || !validatedData.city || !validatedData.postalCode) {
        return NextResponse.json(
          { error: "Při doručení PPL je vyplnění fakturační adresy povinné" },
          { status: 400 }
        );
      }

      // Validate company fields if buying as company
      if (validatedData.isCompany) {
        if (!validatedData.companyName || validatedData.companyName.length < 2) {
          return NextResponse.json(
            { error: "Název společnosti je povinný při nákupu na firmu" },
            { status: 400 }
          );
        }
        if (!validatedData.companyIc || validatedData.companyIc.length < 6) {
          return NextResponse.json(
            { error: "IČ je povinné při nákupu na firmu" },
            { status: 400 }
          );
        }
      }

      // Validate delivery address if different
      if (validatedData.differentDeliveryAddr) {
        if (!validatedData.deliveryName || validatedData.deliveryName.length < 2) {
          return NextResponse.json(
            { error: "Jméno pro doručovací adresu je povinné" },
            { status: 400 }
          );
        }
        if (!validatedData.deliveryAddress || validatedData.deliveryAddress.length < 5) {
          return NextResponse.json(
            { error: "Ulice pro doručovací adresu je povinná" },
            { status: 400 }
          );
        }
        if (!validatedData.deliveryCity || validatedData.deliveryCity.length < 2) {
          return NextResponse.json(
            { error: "Město pro doručovací adresu je povinné" },
            { status: 400 }
          );
        }
        if (!validatedData.deliveryPostalCode || !/^\d{3}\s?\d{2}$/.test(validatedData.deliveryPostalCode)) {
          return NextResponse.json(
            { error: "PSČ pro doručovací adresu je povinné" },
            { status: 400 }
          );
        }
      }
    }

    // Verify stock and calculate server-side total
    let serverTotal = (validatedData.deliveryCost || 0) + (validatedData.codFee || 0);
    const orderItemsToCreate: Array<{
      productId: string;
      variantId: string | null;
      quantity: number;
      priceAtPurchase: number;
      size: string | null;
    }> = [];
    const variantsWithStock: Array<{
      where: { id: string };
      data: { stock: { decrement: number } };
    }> = [];
    const emailItems: Array<{
      name: string;
      quantity: number;
      price: number;
      size?: string;
      slug: string;
      materialType?: string;
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
      emailItems.push({
        name: variant.product.name,
        quantity: item.quantity,
        price: item.priceAtPurchase,
        size: item.size || variant.size || undefined,
        slug: variant.product.slug,
        materialType: variant.materialType || undefined,
      });
    }

    // Verify total matches (allow small difference for delivery cost calculation)
    if (Math.abs(serverTotal - validatedData.total) > 1) {
      return NextResponse.json(
        { error: "Cena se neshoduje s aktuální cenou produktů" },
        { status: 400 }
      );
    }

    // Create order and update stock in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Generate custom order ID
      const orderId = await generateOrderId(tx);

      // Create order
      const order = await tx.order.create({
        data: {
          id: orderId,
          customerName: validatedData.customerName,
          email: validatedData.email,
          phone: validatedData.phone,
          deliveryMethod: validatedData.deliveryMethod,
          address: validatedData.address || null,
          city: validatedData.city || null,
          postalCode: validatedData.postalCode || null,
          isCompany: validatedData.isCompany || false,
          companyName: validatedData.companyName || null,
          companyIc: validatedData.companyIc || null,
          companyDic: validatedData.companyDic || null,
          differentDeliveryAddr: validatedData.differentDeliveryAddr || false,
          deliveryName: validatedData.deliveryName || null,
          deliveryAddress: validatedData.deliveryAddress || null,
          deliveryCity: validatedData.deliveryCity || null,
          deliveryPostalCode: validatedData.deliveryPostalCode || null,
          paymentMethod: validatedData.paymentMethod,
          deliveryCost: validatedData.deliveryCost || 0,
          codFee: validatedData.codFee || 0,
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

    // Send emails (fire and forget - don't block the response)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "notification",
        data: {
          customerName: validatedData.customerName,
          customerEmail: validatedData.email,
          customerPhone: validatedData.phone,
          deliveryMethod: validatedData.deliveryMethod,
          // Use the actual delivery address (different address if selected, otherwise billing address)
          address: validatedData.differentDeliveryAddr ? validatedData.deliveryAddress || "" : validatedData.address || "",
          city: validatedData.differentDeliveryAddr ? validatedData.deliveryCity || "" : validatedData.city || "",
          postalCode: validatedData.differentDeliveryAddr ? validatedData.deliveryPostalCode || "" : validatedData.postalCode || "",
          paymentMethod: validatedData.paymentMethod,
          items: emailItems,
          deliveryCost: validatedData.deliveryCost || 0,
          codFee: validatedData.codFee || 0,
          total: validatedData.total,
          // Add company info if applicable
          ...(validatedData.isCompany && {
            companyName: validatedData.companyName,
            companyIc: validatedData.companyIc,
            companyDic: validatedData.companyDic,
          }),
        },
      }),
    }).catch((err) => console.error("Failed to send notification email:", err));

    fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "confirmation",
        orderId: result.id,
        data: {
          customerName: validatedData.customerName,
          customerEmail: validatedData.email,
          customerPhone: validatedData.phone,
          deliveryMethod: validatedData.deliveryMethod,
          // Billing address (fakturační adresa)
          billingAddress: validatedData.address || "",
          billingCity: validatedData.city || "",
          billingPostalCode: validatedData.postalCode || "",
          // Delivery address (if different)
          deliveryAddress: validatedData.differentDeliveryAddr ? (validatedData.deliveryAddress || "") : (validatedData.address || ""),
          deliveryCity: validatedData.differentDeliveryAddr ? (validatedData.deliveryCity || "") : (validatedData.city || ""),
          deliveryPostalCode: validatedData.differentDeliveryAddr ? (validatedData.deliveryPostalCode || "") : (validatedData.postalCode || ""),
          deliveryName: validatedData.differentDeliveryAddr ? (validatedData.deliveryName || "") : validatedData.customerName,
          // Different delivery address flag
          differentDeliveryAddr: validatedData.differentDeliveryAddr || false,
          paymentMethod: validatedData.paymentMethod,
          items: emailItems,
          deliveryCost: validatedData.deliveryCost || 0,
          codFee: validatedData.codFee || 0,
          total: validatedData.total,
          notes: validatedData.notes || "",
          // Add company info if applicable
          ...(validatedData.isCompany && {
            companyName: validatedData.companyName,
            companyIc: validatedData.companyIc,
            companyDic: validatedData.companyDic,
          }),
        },
      }),
    }).catch((err) => console.error("Failed to send confirmation email:", err));

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
