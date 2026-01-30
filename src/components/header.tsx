"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";

export function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-100 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Včelařské potřeby Bubeník logo"
            width={110}
            height={32}
            className="object-contain"
          />
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-amber-900">
              Produkty
            </Button>
          </Link>
          <Link href="/obchodni-podminky">
            <Button variant="ghost" size="sm" className="text-amber-900">
              Obchodní podmínky
            </Button>
          </Link>
          <Link href="/doprava-a-platba">
            <Button variant="ghost" size="sm" className="text-amber-900">
              Doprava a platba
            </Button>
          </Link>
          <Link href="/checkout">
            <Button
              variant="outline"
              size="sm"
              className="relative border-amber-200 text-amber-900 hover:bg-amber-50"
            >
              <ShoppingBag className="h-4 w-4" />
              Košík
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
