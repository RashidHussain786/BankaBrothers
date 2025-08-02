const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Seed Users
  const usersPath = path.join(__dirname, 'data', 'users.json');
  const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

  for (const userData of usersData) {
    await prisma.user.create({
      data: {
        username: userData.username,
        passwordHash: userData.password_hash,
        role: userData.role,
      },
    });
  }

  console.log('Seeded users.');

  // Seed Products and Variants
  const productsPath = path.join(__dirname, 'data', 'products.json');
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

  for (const productData of productsData) {
    await prisma.product.create({
      data: {
        name: productData.name,
        company: productData.company,
        category: productData.category,
        brand: productData.brand,
        variants: {
          create: {
            unitSize: productData.unitSize,
            price: productData.price,
            stockQuantity: productData.stockQuantity,
          },
        },
      },
    });
  }

  console.log('Seeded products and variants.');

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