const prisma = require('../config/prisma'); // Import the Prisma client

exports.createOrder = async (userId, cartItems, customerId) => {
  // 2. Create Order
  const newOrder = await prisma.order.create({
    data: {
      userId: parseInt(userId), // Ensure userId is an integer
      customerId: customerId, // Link to the customer
      status: 'pending',
      // createdAt will default to now() as per schema
    },
  });

  // 3. Create OrderItems
  for (const item of cartItems) {
    // Ensure product exists and get its price if not provided in cart item
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      console.warn(`Product with ID ${item.productId} not found. Skipping order item.`);
      continue; // Skip this item if product doesn't exist
    }

    await prisma.orderItem.create({
      data: {
        orderId: newOrder.orderId,
        productId: product.id,
        quantity: item.quantity,
        priceAtOrder: parseFloat(item.priceAtOrder || product.price), // Use price from cart, else current product price
        itemsPerPack: item.itemsPerPack || null,
        specialInstructions: item.specialInstructions || null,
      },
    });
  }

  return newOrder;
};

exports.getAllOrders = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const orders = await prisma.order.findMany({
    skip: offset,
    take: limit,
    include: {
      user: true,
      customer: true, // Include customer details
      orderItems: { // Include order items and their product details
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' }, // Order by creation date, newest first
  });

  const totalCount = await prisma.order.count();

  // Ensure priceAtOrder is a number in the response
  const formattedOrders = orders.map(order => ({
    ...order,
    orderItems: order.orderItems.map(item => ({
      ...item,
      priceAtOrder: parseFloat(item.priceAtOrder),
    })),
  }));

  return { orders: formattedOrders, totalCount };
};

exports.updateOrderStatus = async (orderId, status) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { orderId: parseInt(orderId) },
      data: { status },
    });
    return updatedOrder;
  } catch (error) {
    if (error.code === 'P2025') { // Prisma error code for record not found
      throw new Error('Order not found');
    }
    throw error;
  }
};

// New function for monthly filtering, as discussed
exports.getOrdersByMonth = async (year, month) => {
  const startDate = new Date(year, month - 1, 1); // month is 1-indexed
  const endDate = new Date(year, month, 0); // Last day of the month

  return prisma.order.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      user: true,
      customer: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
};