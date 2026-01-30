import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

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

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Včelařské potřeby &middot; Bubeník
        </p>
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Kvalitní včelařské potřeby přímo od výrobce
        </h1>
        <p className="text-base text-stone-700 sm:text-lg">
          Nabízím mateří mřížky, odvíčkovací talíře, nádoby pod medomet a
          další včelařské potřeby za skvělé ceny. Jelikož nakupujete přímo od
          výrobce, nemusíte platit marži internetových obchodů a přeprodejců.
          Výrobě včelařských potřeb se věnuji od roku 2010. Během této doby jsem
          získal mnoho pravidelných a spokojených zákazníků.
        </p>
      </section>

      <section className="mt-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

