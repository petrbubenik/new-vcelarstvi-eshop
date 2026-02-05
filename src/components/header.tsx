"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.items.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-700/30" style={{ backgroundColor: "#87544EFF" }}>
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

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-3 md:flex">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:text-[#87544EFF]">
              Produkty
            </Button>
          </Link>
          <Link href="/obchodni-podminky">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:text-[#87544EFF]">
              Obchodní podmínky
            </Button>
          </Link>
          <Link href="/doprava-a-platba">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:text-[#87544EFF]">
              Doprava a platba
            </Button>
          </Link>
          <Link href="/checkout">
            <Button
              variant="outline"
              size="sm"
              className="relative border-amber-200 bg-white text-amber-900 hover:bg-amber-600 hover:text-white group"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Košík</span>
              {mounted && totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white group-hover:bg-white group-hover:text-amber-600">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/checkout">
            <Button
              variant="outline"
              size="sm"
              className="relative border-amber-200 bg-white text-amber-900 hover:bg-amber-600 hover:text-white group"
            >
              <ShoppingBag className="h-4 w-4" />
              {mounted && totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white group-hover:bg-white group-hover:text-amber-600">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded p-2 text-white hover:bg-white/20"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="border-t border-white/20 bg-[#87544EFF] md:hidden">
          <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-2">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:text-[#87544EFF]">
                  Produkty
                </Button>
              </Link>
              <Link href="/obchodni-podminky" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:text-[#87544EFF]">
                  Obchodní podmínky
                </Button>
              </Link>
              <Link href="/doprava-a-platba" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:text-[#87544EFF]">
                  Doprava a platba
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
