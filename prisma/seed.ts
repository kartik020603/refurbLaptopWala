import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(process.cwd(), 'src/data/products.json');
  
  if (!fs.existsSync(filePath)) {
    console.log('No products.json found, skipping seed.');
    return;
  }

  const data = fs.readFileSync(filePath, 'utf8');
  const products = JSON.parse(data);

  console.log(`Found ${products.length} products to seed...`);

  for (const product of products) {
    // Check if it exists
    const existing = await prisma.product.findUnique({
      where: { id: product.id }
    });

    if (!existing) {
      await prisma.product.create({
        data: {
          id: product.id,
          brand: product.brand,
          model: product.model,
          processor: product.processor,
          ram: product.ram,
          storage: product.storage,
          condition: product.condition,
          price: product.price || product.basePrice,
          basePrice: product.basePrice || product.price,
          originalPrice: product.originalPrice,
          description: product.description,
          image: product.image,
          images: product.images || [],
          tags: product.tags || [],
          specs: product.specs || {},
          tests: product.tests || {},
          stock: product.stock ?? true
        }
      });
      console.log(`Created product: ${product.brand} ${product.model}`);
    } else {
      console.log(`Product ${product.id} already exists, skipping.`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
