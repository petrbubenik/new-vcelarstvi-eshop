"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useCartStore } from "@/lib/cart-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Check } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Czech-specific validation schema
const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, "Jméno musí mít alespoň 2 znaky")
    .max(100, "Jméno je příliš dlouhé"),
  email: z
    .string()
    .min(1, "E-mail je povinný")
    .email("Neplatný formát e-mailu"),
  phone: z
    .string()
    .min(9, "Telefonní číslo musí mít alespoň 9 znaků")
    .regex(/^(\+?\d{1,3}[- ]?)?\d{9}$/, "Neplatný formát telefonního čísla"),
  deliveryMethod: z.enum(["PPL", "SELF_COLLECTION"], {
    required_error: "Vyberte způsob doručení",
  }),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  paymentMethod: z.enum(["BANK_TRANSFER", "CASH_ON_DELIVERY", "CASH_IN_PERSON"], {
    required_error: "Vyberte způsob platby",
  }),
  notes: z.string().max(500, "Poznámka je příliš dlouhá").optional(),
});

// Dynamic schema for delivery address when PPL is selected
const checkoutSchemaWithAddress = checkoutSchema.refine(
  (data) => {
    if (data.deliveryMethod === "PPL") {
      return (
        data.address &&
        data.address.length >= 5 &&
        data.city &&
        data.city.length >= 2 &&
        data.postalCode &&
        /^\d{3}\s?\d{2}$/.test(data.postalCode)
      );
    }
    return true;
  },
  {
    message: "Vyplňte doručovací adresu",
    path: ["address"],
  }
);

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>({});
  const [deliveryMethod, setDeliveryMethod] = useState<"PPL" | "SELF_COLLECTION">("PPL");
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
    }).format(price / 100);
  };

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      deliveryMethod: "PPL",
      address: "",
      city: "",
      postalCode: "",
      paymentMethod: "BANK_TRANSFER",
      notes: "",
    },
  });

  // Watch delivery method to show/hide address fields
  const selectedDeliveryMethod = form.watch("deliveryMethod");

  // Watch payment method for COD fee calculation
  const selectedPaymentMethod = form.watch("paymentMethod");

  // Calculate delivery cost based on delivery method and subtotal
  const subtotal = getTotalPrice();
  const deliveryCost = selectedDeliveryMethod === "SELF_COLLECTION" ? 0 : (subtotal >= 250000 ? 0 : 12500);
  const codFee = selectedPaymentMethod === "CASH_ON_DELIVERY" ? 10000 : 0; // 100 Kč = 10000 cents
  const totalPrice = subtotal + deliveryCost + codFee;

  // Initialize quantity inputs when items change
  useEffect(() => {
    const inputs: Record<string, string> = {};
    items.forEach((item) => {
      inputs[item.id] = item.quantity.toString();
    });
    setQuantityInputs(inputs);
  }, [items]);

  // Reset payment method when delivery method changes
  useEffect(() => {
    const currentPaymentMethod = form.getValues("paymentMethod");
    if (selectedDeliveryMethod === "SELF_COLLECTION" && currentPaymentMethod === "CASH_ON_DELIVERY") {
      form.setValue("paymentMethod", "BANK_TRANSFER");
    } else if (selectedDeliveryMethod === "PPL" && currentPaymentMethod === "CASH_IN_PERSON") {
      form.setValue("paymentMethod", "BANK_TRANSFER");
    }
  }, [selectedDeliveryMethod, form]);

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error("Košík je prázdný");
      return;
    }

    // Validate address fields for PPL delivery
    if (data.deliveryMethod === "PPL") {
      if (!data.address || data.address.length < 5) {
        form.setError("address", {
          type: "manual",
          message: "Adresa je povinná při doručení PPL",
        });
        setIsSubmitting(false);
        return;
      }
      if (!data.city || data.city.length < 2) {
        form.setError("city", {
          type: "manual",
          message: "Město je povinné při doručení PPL",
        });
        setIsSubmitting(false);
        return;
      }
      if (!data.postalCode || !/^\d{3}\s?\d{2}$/.test(data.postalCode)) {
        form.setError("postalCode", {
          type: "manual",
          message: "PSČ je povinné při doručení PPL",
        });
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const currentSubtotal = getTotalPrice();
      const currentDeliveryCost = data.deliveryMethod === "SELF_COLLECTION" ? 0 : (currentSubtotal >= 250000 ? 0 : 12500);
      const currentCodFee = data.paymentMethod === "CASH_ON_DELIVERY" ? 10000 : 0;
      const currentTotal = currentSubtotal + currentDeliveryCost + currentCodFee;

      const orderData = {
        ...data,
        items: items.map((item) => ({
          productId: item.variantId ? item.variantId : item.id,
          quantity: item.quantity,
          priceAtPurchase: item.price,
          size: item.size,
        })),
        deliveryCost: currentDeliveryCost,
        codFee: currentCodFee,
        total: currentTotal,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Chyba při zpracování objednávky");
      }

      const result = await response.json();
      clearCart();
      toast.success("Objednávka úspěšně vytvořena!", {
        icon: <Check className="h-5 w-5 text-green-600" />,
      });
      router.push(`/dekujeme/${result.orderId}`);
    } catch (error) {
      console.error("Order error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Chyba při zpracování objednávky. Zkuste to prosím znovu."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-amber-700 hover:text-amber-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zpět na produkty
        </Link>

        <Card className="mx-auto max-w-md text-center">
          <CardContent className="p-6">
            <h2 className="mb-2 text-xl font-semibold text-stone-900">
              Košík je prázdný
            </h2>
            <p className="mb-4 text-stone-600">
              Přidejte nějaké produkty do košíku před pokračováním k objednávce.
            </p>
            <Link href="/">
              <Button className="bg-amber-600 hover:bg-amber-700">
                Zpět na produkty
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center text-sm text-amber-700 hover:text-amber-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Zpět na produkty
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-stone-900">Objednávka</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Osobní údaje</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jméno a příjmení *</FormLabel>
                        <FormControl>
                          <Input placeholder="Jan Novák" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="jan.novak@email.cz"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon *</FormLabel>
                        <FormControl>
                          <Input placeholder="+420 123 456 789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Delivery Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Způsob doručení</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="deliveryMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              setDeliveryMethod(value as "PPL" | "SELF_COLLECTION");
                            }}
                            value={field.value}
                            className="space-y-3"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-stone-200 p-4">
                              <FormControl>
                                <RadioGroupItem value="PPL" />
                              </FormControl>
                              <FormLabel className="flex-1 cursor-pointer font-normal">
                                <div>
                                  <p className="font-medium text-stone-900">
                                    Doručení PPL
                                  </p>
                                  <p className="text-sm text-stone-600">
                                    Zboží bude doručeno na Vaši adresu prostřednictvím
                                    přepravce PPL. Doručení obvykle do 2 pracovních dnů.
                                    ZDARMA při objednávce nad 2 500 Kč.
                                  </p>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-stone-200 p-4">
                              <FormControl>
                                <RadioGroupItem value="SELF_COLLECTION" />
                              </FormControl>
                              <FormLabel className="flex-1 cursor-pointer font-normal">
                                <div>
                                  <p className="font-medium text-stone-900">
                                    Osobní odběr
                                  </p>
                                  <p className="text-sm text-stone-600">
                                    Zboží si můžete vyzvednout po obdržení
                                    potvrzovacího e-mailu na adrese - Polní 46, 789
                                    61 Bludov.
                                  </p>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Delivery Address - only show for PPL */}
              {selectedDeliveryMethod === "PPL" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Doručovací adresa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ulice a číslo popisné *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ulice 123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Město *</FormLabel>
                          <FormControl>
                            <Input placeholder="Praha" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PSČ *</FormLabel>
                          <FormControl>
                            <Input placeholder="123 45" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Způsob platby</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            value={field.value}
                            className="space-y-3"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-stone-200 p-4">
                              <FormControl>
                                <RadioGroupItem value="BANK_TRANSFER" />
                              </FormControl>
                              <FormLabel className="flex-1 cursor-pointer font-normal">
                                <div>
                                  <p className="font-medium text-stone-900">
                                    Bankovní převod
                                  </p>
                                  <p className="text-sm text-stone-600">
                                    Úhrada předem na bankovní účet. Zboží
                                    expedujeme po připsání platby na účet.
                                  </p>
                                </div>
                              </FormLabel>
                            </FormItem>
                            {selectedDeliveryMethod === "PPL" && (
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-stone-200 p-4">
                                <FormControl>
                                  <RadioGroupItem value="CASH_ON_DELIVERY" />
                                </FormControl>
                                <FormLabel className="flex-1 cursor-pointer font-normal">
                                  <div>
                                    <p className="font-medium text-stone-900">
                                      Dobírka
                                    </p>
                                    <p className="text-sm text-stone-600">
                                      Zaplatíte při převzetí zboží. Příplatek za
                                      dobírku je 100 Kč.
                                    </p>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            )}
                            {selectedDeliveryMethod === "SELF_COLLECTION" && (
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-stone-200 p-4">
                                <FormControl>
                                  <RadioGroupItem value="CASH_IN_PERSON" />
                                </FormControl>
                                <FormLabel className="flex-1 cursor-pointer font-normal">
                                  <div>
                                    <p className="font-medium text-stone-900">
                                      Hotově v provozovně
                                    </p>
                                    <p className="text-sm text-stone-600">
                                      Platba při osobním vyzvednutí zboží.
                                    </p>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            )}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Poznámka (volitelné)</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Případná poznámka k objednávce..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                {isSubmitting
                  ? "Zpracovávám..."
                  : "Odeslat objednávku"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Cart Summary */}
        <div>
          <Card className="sticky top-36">
            <CardHeader>
              <CardTitle>Souhrn objednávky</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 pb-6"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-stone-900">{item.name}</h4>
                    <p className="text-sm text-stone-600">
                      {formatPrice(item.price)}
                    </p>
                    <div className="mt-1 pr-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newQty = Math.max(1, item.quantity - 1);
                            updateQuantity(item.id, newQty);
                            setQuantityInputs({ ...quantityInputs, [item.id]: newQty.toString() });
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded border border-stone-300 text-stone-600 hover:bg-stone-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <div className="w-16 text-center">
                          <div className="relative">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={(quantityInputs[item.id] || "").replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\s/g, ""); // Remove spaces
                                // Check if value contains only numbers
                                if (/^\d*$/.test(value)) {
                                  setQuantityInputs({ ...quantityInputs, [item.id]: value });
                                  const numValue = parseInt(value);
                                  if (!isNaN(numValue) && numValue >= 1) {
                                    updateQuantity(item.id, numValue);
                                  }
                                } else {
                                  // If non-numeric, set to 1
                                  updateQuantity(item.id, 1);
                                  setQuantityInputs({ ...quantityInputs, [item.id]: "1" });
                                }
                              }}
                              onBlur={() => {
                                const value = quantityInputs[item.id] || "";
                                if (value === "" || parseInt(value) < 1) {
                                  updateQuantity(item.id, 1);
                                  setQuantityInputs({ ...quantityInputs, [item.id]: "1" });
                                }
                              }}
                              className="h-8 w-full rounded border border-stone-300 px-2 text-center text-sm [appearance:textfield]"
                            />
                            <p className="absolute left-0 right-0 -bottom-4 text-center text-xs text-stone-500">ks</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newQty = item.quantity + 1;
                            updateQuantity(item.id, newQty);
                            setQuantityInputs({ ...quantityInputs, [item.id]: newQty.toString() });
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded border border-stone-300 text-stone-600 hover:bg-stone-100"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-stone-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t border-stone-200 pt-4">
                <div className="flex items-center justify-between text-stone-700">
                  <span>Mezisoučet</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {selectedDeliveryMethod === "PPL" && (
                  <div className="flex items-center justify-between text-stone-700">
                    <span>Doprava PPL</span>
                    <span>
                      {deliveryCost === 0 ? "Zdarma" : formatPrice(deliveryCost)}
                    </span>
                  </div>
                )}
                {selectedPaymentMethod === "CASH_ON_DELIVERY" && (
                  <div className="flex items-center justify-between text-stone-700">
                    <span>Dobírka</span>
                    <span>{formatPrice(codFee)}</span>
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between text-lg font-bold">
                  <span>Celkem</span>
                  <span className="text-amber-700">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-stone-600">
                  <span>Cena bez DPH</span>
                  <span>
                    {formatPrice(Math.round(totalPrice / 1.21))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
