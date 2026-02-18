import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { materialToSlug } from "@/lib/variant-utils";

const BASE_URL = "https://vcelarstvi-bubenik.cz";

// Helper to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Helper to format material for display (remove diacritics for URL/param)
function formatMaterialForUrl(material: string | null): string {
  if (!material) return "";
  return materialToSlug(material);
}

// Helper to build variant URL
function buildVariantUrl(productSlug: string, material: string | null, size: string | null): string {
  const params = new URLSearchParams();
  if (material) {
    params.set("material", formatMaterialForUrl(material));
  }
  if (size) {
    params.set("size", size);
  }
  const queryString = params.toString();
  return `${BASE_URL}/produkt/${productSlug}${queryString ? `?${queryString}` : ""}`;
}

// Helper to build product name with variant info
function buildProductName(productName: string, material: string | null, size: string | null): string {
  let name = productName;
  const parts: string[] = [];

  if (material) {
    parts.push(material);
  }
  if (size) {
    parts.push(`${size} mm`);
  }

  if (parts.length > 0) {
    name += ` – ${parts.join(" (").replace("(", "").replace(")", "")}`;
    // Add closing parenthesis if we added opening
    if (parts.length > 1) {
      name += ")";
    }
  }

  return name;
}

// Helper to build description with size
function buildDescription(description: string, size: string | null): string {
  if (!size) return description;
  return `${description} (Rozměr: ${size} mm)`;
}

// Helper to format material for PARAM display
function formatMaterialParam(material: string | null): string {
  if (!material) return "";
  // Map "pozinkovaná" -> "Pozink", "mosazná" -> "Mosaz"
  if (material === "pozinkovaná") return "Pozink";
  if (material === "mosazná") return "Mosaz";
  return material;
}

export async function GET(request: NextRequest) {
  try {
    // Fetch all products with variants
    const products = await prisma.product.findMany({
      include: {
        variants: {
          where: {
            stock: {
              gt: 0, // Only include in-stock items
            },
          },
        },
      },
    });

    // Build XML
    const xmlItems: string[] = [];

    for (const product of products) {
      // Skip products with no in-stock variants
      if (product.variants.length === 0) continue;

      for (const variant of product.variants) {
        const itemName = buildProductName(product.name, variant.materialType, variant.size);
        const itemDescription = buildDescription(product.description, variant.size);
        const itemUrl = buildVariantUrl(product.slug, variant.materialType, variant.size);
        const imageUrl = `${BASE_URL}${product.image}`;

        const shopItem = `
    <SHOPITEM>
        <ITEM_ID>${variant.id}</ITEM_ID>
        <PRODUCTNAME>${escapeXml(itemName)}</PRODUCTNAME>
        <DESCRIPTION>${escapeXml(itemDescription)}</DESCRIPTION>
        <URL>${escapeXml(itemUrl)}</URL>
        <IMGURL>${escapeXml(imageUrl)}</IMGURL>
        <PRICE_VAT>${variant.price}</PRICE_VAT>
        <DELIVERY_DATE>0</DELIVERY_DATE>
        <CATEGORYTEXT>Hobby | Chovatelství | Včelařství | Včelařské potřeby</CATEGORYTEXT>
        <MANUFACTURER>Petr Bubeník</MANUFACTURER>
        <ITEMGROUP_ID>${product.slug}</ITEMGROUP_ID>`;

        const params: string[] = [];

        // Add material parameter if exists
        if (variant.materialType) {
          params.push(`
        <PARAM>
            <PARAM_NAME>Materiál</PARAM_NAME>
            <VAL>${formatMaterialParam(variant.materialType)}</VAL>
        </PARAM>`);
        }

        // Add size parameter if exists
        if (variant.size) {
          params.push(`
        <PARAM>
            <PARAM_NAME>Rozměr</PARAM_NAME>
            <VAL>${variant.size} mm</VAL>
        </PARAM>`);
        }

        xmlItems.push(`${shopItem}${params.join("")}
    </SHOPITEM>`);
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<SHOP>
${xmlItems.join("")}
</SHOP>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Heureka feed generation error:", error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>Chyba při generování feedu</message>
</error>`,
      {
        status: 500,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
        },
      }
    );
  }
}
