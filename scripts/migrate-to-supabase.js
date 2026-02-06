/**
 * Migration script to migrate data from SQLite to Supabase PostgreSQL
 * Run this with: node scripts/migrate-to-supabase.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const sqlitePrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db',
    },
  },
});

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
    const products = await sqlitePrisma.product.findMany({
      include: { variants: true },
    });

    console.log(`Found ${products.length} products`);

    // Migrate products
    for (const product of products) {
      console.log(`  → Migrating: ${product.name}`);

      // Create product in Supabase
      const { variants, ...productData } = product;

      const createdProduct = await supabasePrisma.product.create({
        data: {
          ...productData,
          id: product.id, // Keep the same ID
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      });

      // Migrate variants
      if (variants && variants.length > 0) {
        for (const variant of variants) {
          await supabasePrisma.productVariant.create({
            data: {
              ...variant,
              id: variant.id, // Keep the same ID
              productId: product.id,
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
    console.log(`  - Variants: ${products.reduce((sum, p) => sum + (p.variants?.length || 0), 0)}`);
    console.log('');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sqlitePrisma.$disconnect();
    await supabasePrisma.$disconnect();
  }
}

migrate();
