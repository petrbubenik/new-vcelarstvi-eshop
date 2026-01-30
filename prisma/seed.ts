import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing products
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  // Create Mateří mřížka kovová with variants
  const mrizka = await prisma.product.create({
    data: {
      slug: "materi-mrizka-kovova",
      name: "Mateří mřížka kovová",
      description:
        "Kvalitní kovová mateří mřížka pro oddělení matky od pláství. Vyrobeno z odolného materiálu s přesným rozměrem drátků pro snadný průchod včel. Zabrání matce v přístupu do medných pláství.",
      image: "/images/mrizka.jpg",
      images: JSON.stringify([
        "/images/mrizka.jpg",
        "/images/mrizka2.jpg",
        "/images/mrizka_varianty.png",
      ]),
      variants: {
        create: [
          { size: "39×39 cm", price: 14000, stock: 50 },
          { size: "39×42 cm", price: 14500, stock: 50 },
          { size: "39×50 cm", price: 15000, stock: 50 },
          { size: "39×54 cm", price: 16000, stock: 50 },
          { size: "39×57 cm", price: 16500, stock: 50 },
          { size: "39×60 cm", price: 17000, stock: 50 },
          { size: "39×63 cm", price: 17500, stock: 50 },
          { size: "39×66 cm", price: 18000, stock: 50 },
          { size: "39×70 cm", price: 19000, stock: 50 },
        ],
      },
    },
  });

  // Create Odvíčkovací talíř
  const talir = await prisma.product.create({
    data: {
      slug: "odvickovaci-talir",
      name: "Odvíčkovací talíř",
      description:
        "Praktický odvíčkovací talíř pro ruční odvíčkování medných pláství. Povrch s odváděcím žlábkem pro efektivní sběr medu při zakrucování. Vyrobeno z kvalitního plastu.",
      image: "/images/talir.jpg",
      variants: {
        create: [{ size: null, price: 25000, stock: 30 }],
      },
    },
  });

  // Create Nádoba pod medomet
  const nadoba = await prisma.product.create({
    data: {
      slug: "nadoba-pod-medomet",
      name: "Nádoba pod medomet",
      description:
        "Nádoba pod medomet o objemu 30 litrů. Vyrobena z kvalitního nerezu s pevným dnem a výpustným kohoutkem. Ideální pro sběr medu při točení medometem. Snadná údržba a čištění.",
      image: "/images/nadoba.jpg",
      variants: {
        create: [{ size: null, price: 45000, stock: 20 }],
      },
    },
  });

  const products = [mrizka, talir, nadoba];

  console.log(`✅ Created ${products.length} products`);
  console.log("\n📦 Products created:");

  for (const product of products) {
    const variants = await prisma.productVariant.findMany({
      where: { productId: product.id },
    });

    if (variants.length === 1) {
      const price = new Intl.NumberFormat("cs-CZ", {
        style: "currency",
        currency: "CZK",
      }).format(variants[0].price / 100);
      console.log(`   - ${product.name} - ${price}`);
    } else {
      console.log(`   - ${product.name} (${variants.length} variant)`);
      for (const v of variants) {
        const price = new Intl.NumberFormat("cs-CZ", {
          style: "currency",
          currency: "CZK",
        }).format(v.price / 100);
        console.log(`     * ${v.size} - ${price}`);
      }
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
