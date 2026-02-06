import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Objednávka | Včelařské potřeby Bubeník",
  description: "Dokončete svou objednávku včelařských potřeb",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
