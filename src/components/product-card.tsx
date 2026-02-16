"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Product, ProductVariant } from "@prisma/client";

interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}

interface ProductCardProps {
  product: ProductWithVariants;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const lowestPrice = product.variants[0]?.price || 0;
  const highestPrice = product.variants[product.variants.length - 1]?.price || 0;
  const inStock = product.variants.some((v) => v.stock > 0);

  const hasVariants = product.variants.length > 1;
  const priceText =
    hasVariants && lowestPrice !== highestPrice
      ? `${formatPrice(lowestPrice)} – ${formatPrice(highestPrice)}`
      : formatPrice(lowestPrice);

  return (
    <Link href={`/produkt/${product.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        {/* 1. Removed aspect-square. Added h-52 (208px tall) and w-full. */}
        {/* 2. Added p-6 to create empty space so the image doesn't touch the edges. */}
        <div className="relative h-52 w-full overflow-hidden rounded-t-xl bg-stone-100 p-6">
          <Image
            src={product.image}
            alt={product.name}
            fill
            {/* 3. Changed object-cover to object-contain so the whole grid is visible. */}
            className="object-contain transition-transform hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <h3 className="text-base font-semibold text-stone-900 sm:text-lg">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs text-stone-600 sm:text-sm">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2 p-3 pt-0 sm:p-4 sm:pt-0">
          <span className="text-base font-bold text-amber-700 sm:text-xl">{priceText}</span>
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-xs sm:text-sm"
          >
            Detail
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
