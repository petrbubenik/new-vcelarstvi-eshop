import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shop.vcelarstvi-bubenik.cz"),
  title: {
    default: "Včelařské potřeby Bubeník - eshop",
    template: "%s | Včelařské potřeby Bubeník"
  },
  description:
    "Kvalitní včelařské potřeby přímo od českého výrobce za skvělé ceny - mateří mřížky, odvíčkovací talíře, nádoby pod medomet.",
  openGraph: {
    title: "Včelařské potřeby Bubeník - eshop",
    description:
      "Kvalitní včelařské potřeby přímo od českého výrobce za skvělé ceny.",
    url: "https://shop.vcelarstvi-bubenik.cz",
    siteName: "Včelařské potřeby Bubeník",
    locale: "cs_CZ",
    type: "website",
    images: [
      {
        url: "https://shop.vcelarstvi-bubenik.cz/user/logos/default_1800.png",
      },
    ],
  },
  alternates: {
    canonical: "/"
  }
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="cs" className={inter.variable}>
      <body className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}

