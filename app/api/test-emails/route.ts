import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { OrderNotificationEmail } from "../../emails/order-notification";
import { OrderConfirmationEmail } from "../../emails/order-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = "force-dynamic";

const sampleItems = [
  { name: "Mateří mřížka kovová", quantity: 2, price: 25000, size: "Languages" },
  { name: "Odvíčkovací talíř", quantity: 1, price: 45000, size: undefined },
];

const testEmail = "petrbubenik@gmail.com";

export async function POST() {
  try {
    const results = [];

    // 1. Notification email to seller (PPL + Bank Transfer)
    const notification = await resend.emails.send({
      from: "Včelařské potřeby Bubeník <obchod@vcelarstvi-bubenik.cz>",
      to: [testEmail],
      subject: "[TEST] Nová objednávka - PPL + Bank Transfer",
      reply_to: "customer@example.com",
      html: await render(OrderNotificationEmail({
        customerName: "Jan Novák",
        customerEmail: "jan.novak@example.com",
        customerPhone: "+420 123 456 789",
        deliveryMethod: "PPL",
        address: "Hlavní 123",
        city: "Praha",
        postalCode: "110 00",
        paymentMethod: "BANK_TRANSFER",
        items: sampleItems,
        deliveryCost: 12500,
        codFee: 0,
        total: 102500,
      })),
    });
    console.log("Notification result:", JSON.stringify(notification, null, 2));
    results.push({ type: "Notification (PPL + Bank Transfer)", id: notification.data?.id, full: notification });

    // 2. Confirmation - PPL + Bank Transfer
    const conf1 = await resend.emails.send({
      from: "Včelařské potřeby Bubeník <obchod@vcelarstvi-bubenik.cz>",
      to: [testEmail],
      subject: "[TEST] Potvrzení - PPL + Bank Transfer",
      reply_to: "obchod@vcelarstvi-bubenik.cz",
      html: await render(OrderConfirmationEmail({
        customerName: "Jan Novák",
        orderId: "cm3a1b2c3d4e5f6g7h8i9j0k",
        deliveryMethod: "PPL",
        address: "Hlavní 123",
        city: "Praha",
        postalCode: "110 00",
        paymentMethod: "BANK_TRANSFER",
        items: sampleItems,
        deliveryCost: 12500,
        codFee: 0,
        total: 102500,
      })),
    });
    results.push({ type: "Confirmation (PPL + Bank Transfer)", id: conf1.data?.id });

    // 3. Confirmation - PPL + COD
    const conf2 = await resend.emails.send({
      from: "Včelařské potřeby Bubeník <obchod@vcelarstvi-bubenik.cz>",
      to: [testEmail],
      subject: "[TEST] Potvrzení - PPL + Dobírka",
      reply_to: "obchod@vcelarstvi-bubenik.cz",
      html: await render(OrderConfirmationEmail({
        customerName: "Jan Novák",
        orderId: "cm3a1b2c3d4e5f6g7h8i9j0k",
        deliveryMethod: "PPL",
        address: "Hlavní 123",
        city: "Praha",
        postalCode: "110 00",
        paymentMethod: "CASH_ON_DELIVERY",
        items: sampleItems,
        deliveryCost: 12500,
        codFee: 10000,
        total: 112500,
      })),
    });
    results.push({ type: "Confirmation (PPL + Dobírka)", id: conf2.data?.id });

    // 4. Confirmation - Self-collection + Bank Transfer
    const conf3 = await resend.emails.send({
      from: "Včelařské potřeby Bubeník <obchod@vcelarstvi-bubenik.cz>",
      to: [testEmail],
      subject: "[TEST] Potvrzení - Osobní odběr + Bank Transfer",
      reply_to: "obchod@vcelarstvi-bubenik.cz",
      html: await render(OrderConfirmationEmail({
        customerName: "Jan Novák",
        orderId: "cm3a1b2c3d4e5f6g7h8i9j0k",
        deliveryMethod: "SELF_COLLECTION",
        paymentMethod: "BANK_TRANSFER",
        items: sampleItems,
        deliveryCost: 0,
        codFee: 0,
        total: 95000,
      })),
    });
    results.push({ type: "Confirmation (Osobní odběr + Bank Transfer)", id: conf3.data?.id });

    // 5. Confirmation - Self-collection + Cash in person
    const conf4 = await resend.emails.send({
      from: "Včelařské potřeby Bubeník <obchod@vcelarstvi-bubenik.cz>",
      to: [testEmail],
      subject: "[TEST] Potvrzení - Osobní odběr + Hotově",
      reply_to: "obchod@vcelarstvi-bubenik.cz",
      html: await render(OrderConfirmationEmail({
        customerName: "Jan Novák",
        orderId: "cm3a1b2c3d4e5f6g7h8i9j0k",
        deliveryMethod: "SELF_COLLECTION",
        paymentMethod: "CASH_IN_PERSON",
        items: sampleItems,
        deliveryCost: 0,
        codFee: 0,
        total: 95000,
      })),
    });
    results.push({ type: "Confirmation (Osobní odběr + Hotově)", id: conf4.data?.id });

    return NextResponse.json({
      success: true,
      message: "5 test emails sent to " + testEmail,
      results,
    });
  } catch (error) {
    console.error("Test email error:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "Failed to send test emails", details: String(error) },
      { status: 500 }
    );
  }
}
