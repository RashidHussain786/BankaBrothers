const fs = require('fs');
const path = require('path');
const prisma = require('./config/prisma'); // Adjust path if needed

async function main() {
  try {
    console.log('Starting data seeding...');

    // --- Clean up existing data ---
    console.log('Cleaning up existing data...');
    await prisma.orderItem.deleteMany(); // Delete order items first due to foreign key constraints
    await prisma.order.deleteMany();
    await prisma.customer.deleteMany(); // Delete customers before users if there were relations
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    console.log('Existing data cleaned.');
    // --- End clean up ---

    // 1. Seed Users
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

    for (const userData of usersData) {
      await prisma.user.upsert({
        where: { username: userData.username },
        update: {
          passwordHash: userData.password_hash,
          role: userData.role,
        },
        create: {
          // id: userData.id, // REMOVED: Prisma auto-increments this
          username: userData.username,
          passwordHash: userData.password_hash,
          role: userData.role,
        },
      });
      console.log(`Upserted user: ${userData.username}`);
    }

    // 2. Seed Products
    const productsFilePath = path.join(__dirname, 'data', 'products.json');
    const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

    for (const productData of productsData) {
      // Ensure price is a valid number
      const price = parseFloat(productData.price);
      if (isNaN(price)) {
        console.warn(`Skipping product ${productData.name}: Invalid price '${productData.price}'.`);
        continue; // Skip this product if price is invalid
      }

      // Parse itemsPerPack and stockQuantity, handling potential non-numeric values
      const itemsPerPack = productData.itemsPerPack ? parseInt(productData.itemsPerPack) : null;
      const stockQuantity = productData.stockQuantity ? parseInt(productData.stockQuantity) : null;

      await prisma.product.upsert({
        where: { name: productData.name }, // Assuming product name is unique for upsert
        update: {
          company: productData.company,
          category: productData.category,
          brand: productData.brand,
          unitSize: productData.unitSize,
          itemsPerPack: isNaN(itemsPerPack) ? null : itemsPerPack,
          image: productData.image,
          price: price,
          stockQuantity: isNaN(stockQuantity) ? null : stockQuantity,
        },
        create: {
          name: productData.name,
          company: productData.company,
          category: productData.category,
          brand: productData.brand,
          unitSize: productData.unitSize,
          itemsPerPack: isNaN(itemsPerPack) ? null : itemsPerPack,
          image: productData.image,
          price: price,
          stockQuantity: isNaN(stockQuantity) ? null : stockQuantity,
        },
      });
      console.log(`Upserted product: ${productData.name}`);
    }

    // 3. Seed Orders
    const ordersFilePath = path.join(__dirname, 'data', 'orders.json');
    const ordersData = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));

    for (const orderData of ordersData) {
      // Ensure the user exists before creating the order
      const existingUser = await prisma.user.findUnique({
        where: { id: orderData.userId },
      });

      if (!existingUser) {
        console.warn(`Skipping order ${orderData.orderId}: User with ID ${orderData.userId} not found.`);
        continue;
      }

      // --- Create or Upsert Customer ---
      const customerInfo = orderData.customerInfo || {}; // Handle cases where customerInfo might be missing
      const customerMobile = customerInfo.mobile || 'unknown_mobile_' + orderData.orderId; // Ensure mobile is always set for unique constraint

      const customer = await prisma.customer.upsert({
        where: { mobile: customerMobile },
        update: {
          name: customerInfo.name,
          address: customerInfo.address,
          shopName: customerInfo.shopName,
        },
        create: {
          name: customerInfo.name || 'Unknown Customer',
          mobile: customerMobile,
          address: customerInfo.address,
          shopName: customerInfo.shopName,
        },
      });
      console.log(`Upserted customer: ${customer.name} (ID: ${customer.id})`);
      // --- End Create or Upsert Customer ---

      // --- Create Order ---
      const createdOrder = await prisma.order.create({
        data: {
          // orderId: orderData.orderId, // REMOVED: Prisma auto-increments this
          userId: orderData.userId,
          customerId: customer.id, // Link to the created/upserted customer
          createdAt: new Date(orderData.timestamp),
          status: orderData.status,
        },
      });
      console.log(`Created order: ${createdOrder.orderId} for user ${orderData.userId}`);
      // --- End Create Order ---

      // --- Create OrderItems ---
      for (const item of orderData.items) {
        // Find the product to get its current price (or use price from JSON if preferred for historical accuracy)
        const product = await prisma.product.findUnique({
          where: { id: item.id },
        });

        if (!product) {
          console.warn(`Skipping order item for product ID ${item.productId}: Product not found.`);
          continue;
        }

        await prisma.orderItem.create({
          data: {
            orderId: createdOrder.orderId,
            productId: product.id,
            quantity: item.quantity,
            priceAtOrder: item.price || product.price, // Use price from JSON if available, else current product price
          },
        });
        console.log(`  - Added item: Product ${product.name} (Qty: ${item.quantity}) to Order ${createdOrder.orderId}`);
      }
      // --- End Create OrderItems ---
    }

    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error during data seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();