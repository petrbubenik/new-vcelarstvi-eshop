import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { Metadata } from "next";

// Force dynamic rendering - don't cache this page
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Včelařské potřeby Bubeník - eshop | Kvalitní česká výroba",
  description:
    "Kvalitní včelařské potřeby přímo od českého výrobce. Mateří mřížky a další vybavení pro včelaře. Poctivá česká výroba bez prostředníků.",
};

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      variants: {
        orderBy: { price: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  return products;
}

export default async function HomePage() {
  const products = await getProducts();

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Včelařské potřeby Bubeník",
    description: "Kvalitní včelařské potřeby přímo od českého výrobce",
    url: "https://vcelarstvi-bubenik.cz",
    telephone: "+420 777 553 319",
    email: "obchod@vcelarstvi-bubenik.cz",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Polní 46",
      addressLocality: "Bludov",
      postalCode: "789 61",
      addressCountry: "CZ",
    },
    priceRange: "CZK",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  };

  const productListData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image,
        offers: {
          "@type": "Offer",
          price: product.variants[0]?.price
            ? (product.variants[0].price / 100).toFixed(2)
            : "0",
          priceCurrency: "CZK",
          availability: product.variants.some((v) => v.stock > 0)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `https://vcelarstvi-bubenik.cz/produkt/${product.slug}`,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productListData) }}
      />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            Včelařské potřeby &middot; Bubeník
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Poctivé včelařské vybavení přímo od výrobce
          </h1>
<p className="text-base text-stone-700 sm:text-lg">

            Máte atypické rozměry nebo specifické nároky na materiál? Jako

            výrobce se vám přizpůsobím. Mé mateří mřížky

            navrhuji tak, aby vám šetřily čas při práci s medem. Poctivá česká

            výroba bez prostředníků a za férové ceny.

          </p>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[4fr_6fr] lg:gap-8">
                  <section className="mt-12">

          {/* <h2 className="mb-6 text-2xl font-bold text-stone-900">Moje produkty</h2> */}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {products.map((product) => (

              <ProductCard key={product.id} product={product} />

            ))}

          </div>

        </section>
            <section>

          <h3 className="mb-6 text-2xl font-bold text-stone-900">

          Hlavní výhody mého řešení:

          </h3>

          <ul className="space-y-2 ml-6 list-disc marker:text-[#87544EFF] text-base text-stone-700 sm:text-lg">

            <li>

              <strong>Maximální průchodnost:</strong> Včely mřížkou procházejí přirozeně a bez odporu. Neztrácejí pylové rousky a rychleji nosí sladinu do medníku.

            </li>

            <li>

              <strong>Šetrnost k včelám:</strong> Dráty jsou dokonale hladké a oblé. Nehrozí poškození křídel ani odírání chloupků.

            </li>

            <li>

              <strong>Stoprocentní spolehlivost:</strong> Přesné rozestupy drátů (v toleranci desetin mm) nepustí matku nahoru. Už žádné zakladení plástů v medníku.

            </li>

            <li>

              <strong>Snadná údržba:</strong> Mřížku můžete vyvařit, opálit plamenem nebo oškrábat rozpěrákem. Nerez vydrží vše.

            </li>

          </ul>
          </section>
          </div>
        </section>




      </main>
    </>
  );
}

