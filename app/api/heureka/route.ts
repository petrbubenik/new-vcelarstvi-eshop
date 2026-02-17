import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

interface Variant {
  id: string;
  size: string | null;
  materialType: string | null;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  variants: Variant[];
}

interface HeurekaItem {
  ITEM_ID: string;
  PRODUCTNAME: string;
  DESCRIPTION: string;
  URL: string;
  IMGURL: string;
  PRICE_VAT: number;
  DELIVERY_DATE: number;
  CATEGORYTEXT: string;
  MANUFACTURER: string;
  ITEMGROUP_ID: string;
  params: Array<{ name: string; value: string }>;
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
  const categoryText = "Hobby | Chovatelství | Včelařství | Včelařské potřeby";
  const manufacturer = "Petr Bubeník";

  // Build XML items
  const items: HeurekaItem[] = [];

  for (const product of products) {
    // Generate ITEMGROUP_ID from product name (slug-like)
    const itemGroupId = product.slug
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");

    for (const variant of product.variants) {
      const deliveryDate = variant.stock > 0 ? 0 : 14;

      // Build variant name for product title
      const variantParts: string[] = [];
      if (variant.materialType) {
        variantParts.push(variant.materialType);
      }
      if (variant.size) {
        variantParts.push(variant.size);
      }
      const variantSuffix = variantParts.length > 0 ? ` – ${variantParts.join(" ")}` : "";

      // Build description with dimensions
      const descriptionWithSize = variant.size
        ? `${product.description} (Rozměr: ${variant.size})`
        : product.description;

      // Build variant URL
      const variantParams: string[] = [];
      if (variant.materialType) {
        variantParams.push(`material=${encodeURIComponent(variant.materialType)}`);
      }
      if (variant.size) {
        variantParams.push(`size=${encodeURIComponent(variant.size)}`);
      }
      const variantUrl = variantParams.length > 0
        ? `${baseUrl}/produkt/${product.slug}?${variantParams.join("&")}`
        : `${baseUrl}/produkt/${product.slug}`;

      // Build params
      const params: Array<{ name: string; value: string }> = [];
      if (variant.materialType) {
        params.push({ name: "Materiál", value: variant.materialType });
      }
      if (variant.size) {
        params.push({ name: "Rozměr", value: variant.size });
      }

      const item: HeurekaItem = {
        ITEM_ID: variant.id,
        PRODUCTNAME: product.name + variantSuffix,
        DESCRIPTION: descriptionWithSize,
        URL: variantUrl,
        IMGURL: product.image.startsWith("http")
          ? product.image
          : `${baseUrl}${product.image}`,
        PRICE_VAT: variant.price,
        DELIVERY_DATE: deliveryDate,
        CATEGORYTEXT: categoryText,
        MANUFACTURER: manufacturer,
        ITEMGROUP_ID: itemGroupId,
        params,
      };

      items.push(item);
    }
  }

  // Generate XML
  const xmlItems = items.map((item) => {
    const paramsXml = item.params.map((param) =>
      `    <PARAM>
      <PARAM_NAME>${escapeXml(param.name)}</PARAM_NAME>
      <VAL>${escapeXml(param.value)}</VAL>
    </PARAM>`
    ).join("\n    ");

    return `  <SHOPITEM>
    <ITEM_ID>${escapeXml(item.ITEM_ID)}</ITEM_ID>
    <PRODUCTNAME>${escapeXml(item.PRODUCTNAME)}</PRODUCTNAME>
    <DESCRIPTION>${escapeXml(item.DESCRIPTION)}</DESCRIPTION>
    <URL>${escapeXml(item.URL)}</URL>
    <IMGURL>${escapeXml(item.IMGURL)}</IMGURL>
    <PRICE_VAT>${item.PRICE_VAT}</PRICE_VAT>
    <DELIVERY_DATE>${item.DELIVERY_DATE}</DELIVERY_DATE>
    <CATEGORYTEXT>${escapeXml(item.CATEGORYTEXT)}</CATEGORYTEXT>
    <MANUFACTURER>${escapeXml(item.MANUFACTURER)}</MANUFACTURER>
    <ITEMGROUP_ID>${escapeXml(item.ITEMGROUP_ID)}</ITEMGROUP_ID>
${paramsXml}
  </SHOPITEM>`;
  }).join("\n");

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
