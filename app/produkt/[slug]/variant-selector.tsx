"use client";

import { useState, useMemo, useEffect } from "react";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
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
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantityInput, setQuantityInput] = useState<string>("1");
  const [isAdding, setIsAdding] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  // Check if product has material types (like mřížka)
  const hasMaterialTypes = product.variants.some((v) => v.materialType);

  // Get unique material types
  const materialTypes = useMemo(() => {
    if (!hasMaterialTypes) return [];
    const types = [...new Set(product.variants.map((v) => v.materialType).filter(Boolean))];
    return types as string[];
  }, [product.variants, hasMaterialTypes]);

  // Get variants for selected material type
  const filteredVariants = useMemo(() => {
    if (!hasMaterialTypes || !selectedMaterialType) return product.variants;
    return product.variants.filter((v) => v.materialType === selectedMaterialType);
  }, [product.variants, hasMaterialTypes, selectedMaterialType]);

  // Get unique sizes from filtered variants
  const sizes = useMemo(() => {
    const sizeList = filteredVariants.map((v) => v.size).filter(Boolean);
    return [...new Set(sizeList)] as string[];
  }, [filteredVariants]);

  // Find selected variant
  const selectedVariant = useMemo(() => {
    if (hasMaterialTypes) {
      if (selectedMaterialType && selectedSize) {
        return product.variants.find(
          (v) => v.materialType === selectedMaterialType && v.size === selectedSize
        );
      }
      return undefined;
    } else {
      // For products without material types
      if (sizes.length > 0 && selectedSize) {
        return filteredVariants.find((v) => v.size === selectedSize);
      } else if (filteredVariants.length === 1) {
        // Single variant - auto-select it
        return filteredVariants[0];
      }
      return undefined;
    }
  }, [product.variants, filteredVariants, hasMaterialTypes, selectedMaterialType, selectedSize, sizes]);

  // Auto-select first material type on mount
  useEffect(() => {
    if (hasMaterialTypes && materialTypes.length > 0 && !selectedMaterialType) {
      setSelectedMaterialType(materialTypes[0]);
    }
  }, [hasMaterialTypes, materialTypes, selectedMaterialType]);

  // Auto-select first size when available
  useEffect(() => {
    if (sizes.length > 0 && !selectedSize) {
      setSelectedSize(sizes[0]);
    }
  }, [sizes, selectedSize]);

  const hasMultipleVariants = product.variants.length > 1;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getQuantity = () => {
    const num = parseInt(quantityInput.replace(/\s/g, ""));
    return isNaN(num) || num < 1 ? 1 : num;
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    setIsAdding(true);

    const quantity = getQuantity();

    let itemName = product.name;
    if (hasMaterialTypes) {
      itemName = `${product.name} (${selectedMaterialType}, ${selectedSize})`;
    } else if (selectedVariant.size && hasMultipleVariants) {
      itemName = `${product.name} (${selectedVariant.size})`;
    }

    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      slug: product.slug,
      name: itemName,
      price: selectedVariant.price,
      image: product.image,
      stock: 999999,
      variantId: selectedVariant.id,
      size: selectedVariant.size || undefined,
    }, quantity);

    toast.success("Produkt přidán do košíku", {
      icon: <Check className="h-5 w-5 text-green-600" />,
      action: {
        label: "Zobrazit košík",
        onClick: () => (window.location.href = "/checkout"),
      },
    });

    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="space-y-4">
      {hasMaterialTypes && (
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Provedení
          </label>
          <Select
            value={selectedMaterialType}
            onValueChange={(value) => {
              setSelectedMaterialType(value);
              setSelectedSize("");
            }}
            disabled={isAdding}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Vyberte provedení" />
            </SelectTrigger>
            <SelectContent>
              {materialTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Velikost
          </label>
          <Select
            value={selectedSize}
            onValueChange={setSelectedSize}
            disabled={isAdding || (hasMaterialTypes && !selectedMaterialType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Vyberte velikost" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => {
                const variant = filteredVariants.find((v) => v.size === size);
                if (!variant) return null;
                return (
                  <SelectItem key={variant.id} value={size}>
                    <div className="flex items-center justify-between gap-4">
                      <span>{size}</span>
                      <span className="font-semibold text-amber-700">
                        {formatPrice(variant.price)}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedVariant && (
        <>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-600">Cena za kus:</span>
              <span className="text-xl font-bold text-amber-700">
                {formatPrice(selectedVariant.price)}
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Množství
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const newQty = Math.max(1, getQuantity() - 1);
                  setQuantityInput(newQty.toString());
                }}
                disabled={isAdding}
                className="flex h-10 w-10 items-center justify-center rounded border border-stone-300 text-stone-600 hover:bg-stone-100 disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={quantityInput.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, "");
                  // Only allow numbers, otherwise reset to 1
                  if (/^\d*$/.test(value)) {
                    setQuantityInput(value);
                  } else {
                    setQuantityInput("1");
                  }
                }}
                onBlur={() => {
                  const value = quantityInput.replace(/\s/g, "");
                  if (value === "" || parseInt(value) < 1) {
                    setQuantityInput("1");
                  }
                }}
                disabled={isAdding}
                className="h-10 w-24 rounded border border-stone-300 px-3 text-center text-sm [appearance:textfield]"
              />
              <button
                type="button"
                onClick={() => {
                  const newQty = getQuantity() + 1;
                  setQuantityInput(newQty.toString());
                }}
                disabled={isAdding}
                className="flex h-10 w-10 items-center justify-center rounded border border-stone-300 text-stone-600 hover:bg-stone-100 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
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
