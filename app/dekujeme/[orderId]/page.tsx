import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, CreditCard, Package, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

async function getOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  return order;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>;
}): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Děkujeme za objednávku ${orderId}`,
    description: "Vaše objednávka byla úspěšně přijata.",
  };
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
    }).format(price / 100);
  };

  const formatPostalCode = (postalCode: string) => {
    return postalCode.replace(/^(\d{3})(\d{2})$/, "$1 $2");
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("cs-CZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // Bank details for Czech bank transfer
  const bankDetails = {
    accountNumber: "1209442007/2700",
    variableSymbol: orderId.slice(-8).toUpperCase(),
  };

  // Delivery and payment method texts
  const paymentMethodText = {
    BANK_TRANSFER: "Převodem",
    CASH_ON_DELIVERY: "Dobírka",
    CASH_IN_PERSON: "Hotově",
  };

  const deliveryMethodText = {
    PPL: "PPL",
    SELF_COLLECTION: "Osobní odběr",
  };

  // Calculate subtotal (products only)
  const subtotal = order.total - order.deliveryCost - order.codFee;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-stone-900 sm:text-3xl">
          Děkuji za vaši objednávku!
        </h1>
        <p className="text-base text-stone-600 sm:text-lg">
          Vaše objednávka byla úspěšně přijata.
        </p>
        <p className="mt-2 text-sm text-stone-500">
          Číslo objednávky:{" "}
          <span className="font-semibold text-stone-900">{orderId}</span>
        </p>
        <p className="text-sm text-stone-500">
          Datum objednávky: {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="space-y-6">
        {/* Payment Instructions */}
        {order.paymentMethod === "BANK_TRANSFER" ? (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-700" />
                Instrukce pro platbu bankovním převodem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-white p-4">
                <p className="mb-3 text-sm text-stone-600">
                  Pro uhrazení objednávky prosím proveďte platbu na níže
                  uvedený účet. Jako variabilní symbol uveďte číslo
                  objednávky.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-amber-100 pb-2">
                    <span className="font-medium text-stone-600">
                      Částka k úhradě:
                    </span>
                    <span className="font-bold text-amber-700">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-amber-100 pb-2">
                    <span className="font-medium text-stone-600">
                      Číslo účtu:
                    </span>
                    <span className="font-mono text-stone-900">
                      {bankDetails.accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-stone-600">
                      Variabilní symbol:
                    </span>
                    <span className="font-mono font-bold text-amber-700">
                      {bankDetails.variableSymbol}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-stone-500">
                {order.deliveryMethod === "SELF_COLLECTION"
                  ? "Zboží pro Vás bude připraveno na adrese provozovny po připsání platby na náš účet, obvykle do 1-2 pracovních dnů."
                  : "Zboží bude expedováno po připsání platby na náš účet, obvykle do 1-2 pracovních dnů."}
              </p>
            </CardContent>
          </Card>
        ) : order.paymentMethod === "CASH_IN_PERSON" ? (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-700" />
                Platba v hotovosti při osobním vyzvednutí
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-white p-4">
                <p className="text-sm text-stone-600">
                  O možnosti vyzvednout objednané zboží Vás budu informovat v dalším emailu.
                </p>
                <div className="mt-3 rounded border border-amber-200 bg-amber-100 p-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-stone-700">
                      Celková částka k úhradě:
                    </span>
                    <span className="font-bold text-amber-700">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-700" />
                Platba dobírkou
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-white p-4">
                <p className="text-sm text-stone-600">
                  Zaplatíte při převzetí zboží přímo kurýrovi PPL.
                </p>
                <div className="mt-3 rounded border border-amber-200 bg-amber-100 p-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-stone-700">
                      Celková částka k úhradě:
                    </span>
                    <span className="font-bold text-amber-700">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-stone-500">
                Zboží bude obvykle odesláno do 1-2 pracovních dnů. Doba
                doručení závisí na přepravci.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detail objednávky</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Info */}
            <div>
              <h3 className="mb-2 font-semibold text-stone-900">
                Kontaktní údaje
              </h3>
              <div className="space-y-1 text-sm text-stone-600">
                <p>{order.customerName}</p>
                <p>{order.email}</p>
                <p>{order.phone}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h3 className="mb-2 font-semibold text-stone-900">
                Doručovací adresa
              </h3>
              <div className="text-sm text-stone-600">
                <p>{order.address}</p>
                <p>
                  {order.postalCode && formatPostalCode(order.postalCode)} {order.city}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="mb-3 font-semibold text-stone-900">Objednané zboží</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border-b border-stone-100 pb-3 last:border-0"
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-stone-100">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-stone-900">
                        {item.product.name}
                        {item.size && (
                          <span className="text-sm font-normal text-stone-600">
                            {" "}({item.size})
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-stone-600">
                        {item.quantity} ks × {formatPrice(item.priceAtPurchase)}
                      </p>
                    </div>
                    <p className="font-semibold text-stone-900">
                      {formatPrice(item.priceAtPurchase * item.quantity)}
                    </p>
                  </div>
                ))}
                {/* Delivery */}
                {order.deliveryCost > 0 && (
                  <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
                    <div className="h-12 w-12 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-stone-600">
                        {deliveryMethodText[order.deliveryMethod as keyof typeof deliveryMethodText]}
                      </p>
                    </div>
                    <p className="font-semibold text-stone-900">
                      {formatPrice(order.deliveryCost)}
                    </p>
                  </div>
                )}
                {/* Payment */}
                {order.codFee > 0 && (
                  <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
                    <div className="h-12 w-12 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-stone-600">
                        {paymentMethodText[order.paymentMethod as keyof typeof paymentMethodText]}
                      </p>
                    </div>
                    <p className="font-semibold text-stone-900">
                      {formatPrice(order.codFee)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between border-t border-stone-200 pt-3">
              <span className="font-semibold text-stone-900">Celkem k úhradě</span>
              <span className="text-xl font-bold text-amber-700">
                {formatPrice(order.total)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-3 p-4">
            <Phone className="h-5 w-5 flex-shrink-0 text-amber-700" />
            <div className="text-sm">
              <p className="font-medium text-stone-900">
                Máte dotaz k objednávce?
              </p>
              <p className="text-stone-600">
                Kontaktujte mě na{" "}
                <a
                  href="tel:+420777553319"
                  className="font-semibold text-amber-700 hover:underline"
                >
                  +420 777 553 319
                </a>
                {" "}nebo e-mailu{" "}
                <a
                  href="mailto:obchod@vcelarstvi-bubenik.cz"
                  className="font-semibold text-amber-700 hover:underline"
                >
                  obchod@vcelarstvi-bubenik.cz
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/">
            <Button
              size="lg"
              className="bg-amber-600 hover:bg-amber-700"
            >
              Zpět na hlavní stránku
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
