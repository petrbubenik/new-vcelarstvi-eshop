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
    }).format(price / 100);
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
          <div className="relative aspect-square overflow-hidden rounded-t-xl bg-stone-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-stone-900">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-stone-600">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <span className="text-xl font-bold text-amber-700">{priceText}</span>
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-700"
          >
            Detail
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
