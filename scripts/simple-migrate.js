/**
 * Simple migration script using direct SQLite queries and Prisma for Supabase
 */

const { PrismaClient } = require('@prisma/client');
const Database = require('better-sqlite3');
const path = require('path');

// Open SQLite database directly
const sqlitePath = path.join(__dirname, '../prisma/dev.db');
const sqlite = new Database(sqlitePath);

// Supabase Prisma client
const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
const supabasePrisma = new PrismaClient({
  datasources: {
    db: {
      url: supabaseUrl,
    },
  },
});

async function migrate() {
  console.log('🚀 Starting migration from SQLite to Supabase...');

  try {
    // Get all products from SQLite
    console.log('📦 Fetching products from SQLite...');
    const products = sqlite.prepare('SELECT * FROM Product').all();

    console.log(`Found ${products.length} products`);

    // Migrate products
    for (const product of products) {
      console.log(`  → Migrating: ${product.name}`);

      // Create product in Supabase
      await supabasePrisma.product.create({
        data: {
          id: product.id,
          slug: product.slug,
          name: product.name,
          description: product.description,
          image: product.image,
          images: product.images,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        },
      });

      // Get and migrate variants for this product
      const variants = sqlite.prepare('SELECT * FROM ProductVariant WHERE productId = ?').all(product.id);

      if (variants.length > 0) {
        for (const variant of variants) {
          await supabasePrisma.productVariant.create({
            data: {
              id: variant.id,
              productId: variant.productId,
              size: variant.size,
              materialType: variant.materialType,
              price: variant.price,
              stock: variant.stock,
            },
          });
        }
        console.log(`    ✓ ${variants.length} variants migrated`);
      }
    }

    console.log('');
    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`  - Products: ${products.length}`);

    const totalVariants = sqlite.prepare('SELECT COUNT(*) as count FROM ProductVariant').get();
    console.log(`  - Variants: ${totalVariants.count}`);
    console.log('');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    sqlite.close();
    await supabasePrisma.$disconnect();
  }
}

migrate();
