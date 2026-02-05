import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { OrderConfirmationEmail } from "@/app/emails/order-confirmation";
import { readFile } from "fs/promises";
import { join } from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to read and convert PDF to base64 for attachment
async function getPdfAttachment(filename: string) {
  try {
    const filePath = join(process.cwd(), "public", "documents", filename);
    const fileContent = await readFile(filePath);
    return {
      filename,
      content: fileContent.toString("base64"),
    };
  } catch (error) {
    console.error(`Error reading PDF file ${filename}:`, error);
    return null;
  }
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Test order data
    const testOrderData = {
      customerName: "Jan Novák",
      customerEmail: email,
      customerPhone: "+420 777 553 319",
      orderId: "25020101",
      deliveryMethod: "PPL",
      billingAddress: "Ulice 123",
      billingCity: "Praha",
      billingPostalCode: "120 00",
      deliveryAddress: "Ulice 123",
      deliveryCity: "Praha",
      deliveryPostalCode: "120 00",
      deliveryName: "Jan Novák",
      differentDeliveryAddr: false,
      paymentMethod: "BANK_TRANSFER",
      items: [
        {
          name: "Nádoba pod medomet",
          quantity: 2,
          price: 45000, // 450 Kč in cents
          size: "39×39 cm",
          slug: "nadoba-pod-medomet",
        },
      ],
      deliveryCost: 12900, // 129 Kč
      codFee: 0,
      total: 102900, // 1 029 Kč
      notes: "Testovací poznámka",
      companyName: "",
      companyIc: "",
      companyDic: "",
    };

    // Get PDF attachments
    const [zoouAttachment, vopAttachment] = await Promise.all([
      getPdfAttachment("zoou_01022026.pdf"),
      getPdfAttachment("vop_01022026.pdf"),
    ]);

    const attachments = [
      zoouAttachment,
      vopAttachment,
    ].filter(Boolean);

    await resend.emails.send({
      from: "Včelařské potřeby Bubeník <obchod@vcelarstvi-bubenik.cz>",
      to: [email],
      subject: `TEST: Potvrzení objednávky ${testOrderData.orderId}`,
      reply_to: "obchod@vcelarstvi-bubenik.cz",
      html: await render(OrderConfirmationEmail(testOrderData)),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    return NextResponse.json({ success: true, message: `Test email sent to ${email}` });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Send a POST request with { email: 'your@email.com' } to send a test order confirmation email"
  });
}
