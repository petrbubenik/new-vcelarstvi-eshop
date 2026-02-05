import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { OrderNotificationEmail } from "@/app/emails/order-notification";
import { OrderConfirmationEmail } from "@/app/emails/order-confirmation";
import { readFile } from "fs/promises";
import { join } from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

// Disable caching for this route
export const dynamic = "force-dynamic";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { type, orderId } = body;

    if (type === "notification") {
      // Send notification to seller about new order
      await resend.emails.send({
        from: "Včelařské potřeby Bubeník <obchod@vcelarstvi-bubenik.cz>",
        to: ["obchod@vcelarstvi-bubenik.cz"],
        subject: `Nová objednávka od ${body.data.customerName}`,
        reply_to: body.data.customerEmail,
        html: await render(OrderNotificationEmail(body.data)),
      });

      return NextResponse.json({ success: true });
    }

    if (type === "confirmation") {
      // Get PDF attachments
      const [zoouAttachment, vopAttachment] = await Promise.all([
        getPdfAttachment("zoou_01022026.pdf"),
        getPdfAttachment("vop_01022026.pdf"),
      ]);

      const attachments = [
        zoouAttachment,
        vopAttachment,
      ].filter(Boolean);

      // Render the email HTML once
      const emailHtml = await render(OrderConfirmationEmail({
        ...body.data,
        orderId,
      }));

      // Send confirmation to customer
      await resend.emails.send({
        from: "Včelařské potřeby Bubeník <obchod@vcelarstvi-bubenik.cz>",
        to: [body.data.customerEmail],
        subject: `Potvrzení objednávky #${orderId.slice(0, 8).toUpperCase()}`,
        reply_to: "obchod@vcelarstvi-bubenik.cz",
        html: emailHtml,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      // Send copy to seller
      await resend.emails.send({
        from: "Včelařské potřeby Bubeník <obchod@vcelarstvi-bubenik.cz>",
        to: ["obchod@vcelarstvi-bubenik.cz"],
        subject: `KOPIE: Potvrzení objednávky #${orderId.slice(0, 8).toUpperCase()}`,
        reply_to: body.data.customerEmail,
        html: emailHtml,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid email type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Chyba při odesílání e-mailu" },
      { status: 500 }
    );
  }
}
