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
  metadataBase: new URL("https://vcelarstvi-bubenik.cz"),
  title: {
    default: "Včelařské potřeby Bubeník - eshop | Kvalitní česká výroba",
    template: "%s | Včelařské potřeby Bubeník"
  },
  description:
    "Kvalitní včelařské potřeby přímo od českého výrobce za skvělé ceny. Mateří mřížky, odvíčkovací talíře, nádoby pod medomet a další vybavení pro včelaře. Poctivá česká výroba bez prostředníků.",
  keywords: [
    "včelařské potřeby",
    "mateří mřížka",
    "odvíčkovací talíř",
    "nádoba pod medomet",
    "včelařství",
    "včelí úly",
    "med",
    "včelařské vybavení",
    "Bubeník",
    "český výrobce"
  ],
  authors: [{ name: "Petr Bubeník" }],
  creator: "Petr Bubeník",
  publisher: "Včelařské potřeby Bubeník",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Včelařské potřeby Bubeník - eshop",
    description:
      "Kvalitní včelařské potřeby přímo od českého výrobce za skvělé ceny. Mateří mřížky, odvíčkovací talíře, nádoby pod medomet.",
    url: "https://vcelarstvi-bubenik.cz",
    siteName: "Včelařské potřeby Bubeník",
    locale: "cs_CZ",
    type: "website",
    images: [
      {
        url: "https://vcelarstvi-bubenik.cz/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Včelařské potřeby Bubeník"
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Včelařské potřeby Bubeník - eshop",
    description:
      "Kvalitní včelařské potřeby přímo od českého výrobce za skvělé ceny.",
    images: ["https://shop.vcelarstvi-bubenik.cz/images/logo.png"],
  },
  alternates: {
    canonical: "https://vcelarstvi-bubenik.cz"
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

