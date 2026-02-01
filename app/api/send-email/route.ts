import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { OrderNotificationEmail } from "../../emails/order-notification";
import { OrderConfirmationEmail } from "../../emails/order-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

// Disable caching for this route
export const dynamic = "force-dynamic";

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
      // Send confirmation to customer
      await resend.emails.send({
        from: "Včelařské potřeby Bubeník <obchod@vcelarstvi-bubenik.cz>",
        to: [body.data.customerEmail],
        subject: `Potvrzení objednávky #${orderId.slice(0, 8).toUpperCase()}`,
        reply_to: "obchod@vcelarstvi-bubenik.cz",
        html: await render(OrderConfirmationEmail({
          ...body.data,
          orderId,
        })),
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
