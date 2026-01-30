"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/lib/cart-store";
import { toast } from "sonner";
import type { Product, ProductVariant } from "@prisma/client";

interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}

interface VariantSelectorProps {
  product: ProductWithVariants;
}

export function VariantSelector({ product }: VariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [isAdding, setIsAdding] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const hasVariants = product.variants.length > 1;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
    }).format(price / 100);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    setIsAdding(true);

    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      slug: product.slug,
      name: hasVariants
        ? `${product.name} (${selectedVariant.size})`
        : product.name,
      price: selectedVariant.price,
      image: product.image,
      stock: 999999, // High number to not limit quantity
      variantId: selectedVariant.id,
      size: selectedVariant.size || undefined,
    });

    toast.success("Produkt přidán do košíku", {
      action: {
        label: "Zobrazit košík",
        onClick: () => (window.location.href = "/checkout"),
      },
    });

    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="space-y-4">
      {hasVariants && (
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Vyberte velikost
          </label>
          <Select
            value={selectedVariantId}
            onValueChange={setSelectedVariantId}
            disabled={isAdding}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Vyberte velikost" />
            </SelectTrigger>
            <SelectContent>
              {product.variants.map((variant) => (
                <SelectItem key={variant.id} value={variant.id}>
                  <div className="flex items-center justify-between gap-4">
                    <span>{variant.size}</span>
                    <span className="font-semibold text-amber-700">
                      {formatPrice(variant.price)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedVariant && (
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-600">Cena za kus:</span>
            <span className="text-xl font-bold text-amber-700">
              {formatPrice(selectedVariant.price)}
            </span>
          </div>
        </div>
      )}

      <Button
        onClick={handleAddToCart}
        disabled={!selectedVariant || isAdding}
        size="lg"
        className="w-full bg-amber-600 hover:bg-amber-700"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Přidat do košíku
      </Button>
    </div>
  );
}
