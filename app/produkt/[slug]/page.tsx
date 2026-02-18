import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { VariantSelector } from "./variant-selector";
import { parseVariantParams, buildVariantParams, materialToSlug } from "@/lib/variant-utils";

// Force dynamic rendering - don't cache product pages
export const dynamic = 'force-dynamic';

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: {
        orderBy: { price: "asc" },
      },
    },
  });
  return product;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ material?: string; size?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const variantParams = await searchParams;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Produkt nenalezen",
    };
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
    }).format(price);
  };

  const lowestPrice = product.variants[0]?.price;
  const highestPrice = product.variants[product.variants.length - 1]?.price;

  let priceText = "";
  if (product.variants.length === 1) {
    priceText = formatPrice(lowestPrice);
  } else if (lowestPrice !== highestPrice) {
    priceText = `${formatPrice(lowestPrice)} – ${formatPrice(highestPrice)}`;
  } else {
    priceText = formatPrice(lowestPrice);
  }

  // Build canonical URL with variant parameters
  const canonicalParams = buildVariantParams(
    variantParams.material ? parseVariantParams(variantParams).material : undefined,
    variantParams.size
  );
  const canonicalUrl = `https://vcelarstvi-bubenik.cz/produkt/${slug}${canonicalParams.toString() ? `?${canonicalParams.toString()}` : ""}`;

  return {
    title: `${product.name} | Včelařské potřeby Bubeník`,
    description: product.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
      type: "website",
      url: canonicalUrl,
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ material?: string; size?: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  // Parse variant parameters from URL
  const variantParams = await searchParams;
  const initialVariant = parseVariantParams(variantParams);

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
    }).format(price);
  };

  const hasVariants = product.variants.length > 1;
  const inStock = product.variants.some((v) => v.stock > 0);
  const additionalImages = product.images ? JSON.parse(product.images) : [];

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `https://vcelarstvi-bubenik.cz${product.image}`,
    brand: {
      "@type": "Brand",
      name: "Včelařské potřeby Bubeník",
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: product.variants[0]?.price ?? 0,
      highPrice: product.variants[product.variants.length - 1]?.price ?? 0,
      priceCurrency: "CZK",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://vcelarstvi-bubenik.cz/produkt/${product.slug}`,
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Heureka.cz PRODUCT DETAIL script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(t, r, a, c, k, i, n, g) {t['ROIDataObject'] = k;
          t[k]=t[k]||function(){(t[k].q=t[k].q||[]).push(arguments)},t[k].c=i;n=r.createElement(a),
          g=r.getElementsByTagName(a)[0];n.async=1;n.src=c;g.parentNode.insertBefore(n,g)
          })(window, document, 'script', '//www.heureka.cz/ocm/sdk.js?version=2&page=product_detail', 'heureka', 'cz');`,
        }}
      />
      {/* End Heureka.cz PRODUCT DETAIL script */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-amber-700 hover:text-amber-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zpět na produkty
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {additionalImages.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {additionalImages.slice(1).map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - obrázek ${idx + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 16vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">{product.name}</h1>

            {hasVariants ? (
              <p className="mt-4 text-xl font-bold text-amber-700 sm:text-2xl">
                {formatPrice(product.variants[0].price)} –{" "}
                {formatPrice(product.variants[product.variants.length - 1].price)}
              </p>
            ) : (
              <p className="mt-4 text-xl font-bold text-amber-700 sm:text-2xl">
                {formatPrice(product.variants[0].price)}
              </p>
            )}

            <div className="mt-6 flex-1">
              <h2 className="mb-2 font-semibold text-stone-900">Popis produktu</h2>
              <p className="text-stone-700">{product.description}</p>
            </div>

            <div className="mt-6 space-y-4 rounded-lg border border-amber-100 bg-amber-50/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600">Dostupnost:</span>
                <span
                  className={`font-semibold ${
                    inStock ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {inStock ? "Skladem" : "Vyprodáno"}
                </span>
              </div>
            </div>

            <VariantSelector product={product} initialMaterial={initialVariant.material} initialSize={initialVariant.size} />
          </div>
        </div>
      </main>
    </>
  );
}
