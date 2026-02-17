import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

interface HeurekaItem {
  ITEM_ID: string;
  PRODUCTNAME: string;
  DESCRIPTION: string;
  URL: string;
  IMGURL: string;
  PRICE_VAT: number;
  AVAILABILITY: string;
  DELIVERY_DATE: number;
  CATEGORYTEXT?: string;
}

async function getHeurekaFeed(): Promise<string> {
  const products = await prisma.product.findMany({
    include: {
      variants: {
        orderBy: { price: "asc" },
      },
    },
  });

  const baseUrl = "https://vcelarstvi-bubenik.cz";

  // Build XML items
  const items: HeurekaItem[] = [];

  for (const product of products) {
    for (const variant of product.variants) {
      const availabilityText = variant.stock > 0
        ? `${variant.stock} ks`
        : "Není skladem";

      const deliveryDate = variant.stock > 0 ? 0 : 14; // 0 = in stock, 14 = 2 weeks

      const item: HeurekaItem = {
        ITEM_ID: variant.id,
        PRODUCTNAME: product.name,
        DESCRIPTION: product.description,
        URL: `${baseUrl}/produkt/${product.slug}`,
        IMGURL: product.image.startsWith("http")
          ? product.image
          : `${baseUrl}${product.image}`,
        PRICE_VAT: variant.price / 100, // Convert from cents to CZK
        AVAILABILITY: availabilityText,
        DELIVERY_DATE: deliveryDate,
      };

      items.push(item);
    }
  }

  // Generate XML
  const xmlItems = items.map((item) => `
    <SHOPITEM>
      <ITEM_ID>${escapeXml(item.ITEM_ID)}</ITEM_ID>
      <PRODUCTNAME>${escapeXml(item.PRODUCTNAME)}</PRODUCTNAME>
      <DESCRIPTION>${escapeXml(item.DESCRIPTION)}</DESCRIPTION>
      <URL>${escapeXml(item.URL)}</URL>
      <IMGURL>${escapeXml(item.IMGURL)}</IMGURL>
      <PRICE_VAT>${item.PRICE_VAT}</PRICE_VAT>
      <AVAILABILITY>${escapeXml(item.AVAILABILITY)}</AVAILABILITY>
      <DELIVERY_DATE>${item.DELIVERY_DATE}</DELIVERY_DATE>
    </SHOPITEM>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<SHOP>
  ${xmlItems}
</SHOP>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const xml = await getHeurekaFeed();

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Heureka feed error:", error);
    return new NextResponse("Error generating feed", { status: 500 });
  }
}
