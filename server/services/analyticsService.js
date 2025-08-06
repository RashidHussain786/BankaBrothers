const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSalesOverview = async (startDate, endDate) => {
  let queryDate = {};
  if (startDate && endDate) {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    queryDate = {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };
  } else {
    // Default to last 30 days if no date range is provided
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    queryDate = {
      createdAt: {
        gte: thirtyDaysAgo,
        lte: new Date(),
      },
    };
  }

  const orders = await prisma.order.findMany({
    where: queryDate,
    include: {
      orderItems: {
        select: {
          quantity: true,
          priceAtOrder: true,
        },
      },
    },
  });

  const dailySales = {};

  orders.forEach(order => {
    const orderDate = order.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
    if (!dailySales[orderDate]) {
      dailySales[orderDate] = {
        totalRevenue: 0,
        totalOrders: 0,
      };
    }
    dailySales[orderDate].totalOrders += 1;
    order.orderItems.forEach(item => {
      dailySales[orderDate].totalRevenue += item.quantity * item.priceAtOrder;
    });
  });

  // Convert to array for consistent frontend processing
  const salesData = Object.keys(dailySales).map(date => ({
    date,
    totalRevenue: parseFloat(dailySales[date].totalRevenue.toFixed(2)),
    totalOrders: dailySales[date].totalOrders,
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  return salesData;
};

exports.getTopSellingProducts = async (limit, startDate, endDate) => {
  let queryDate = {};
  if (startDate && endDate) {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    queryDate = {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };
  }

  const topProducts = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: {
      order: queryDate,
    },
    _sum: {
      quantity: true,
      priceAtOrder: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: parseInt(limit),
  });

  const productIds = topProducts.map(p => p.productId);
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      id: true,
      name: true,
      company: true,
      category: true,
    },
  });

  const productMap = new Map(products.map(p => [p.id, p]));

  const result = topProducts.map(p => ({
    productId: p.productId,
    productName: productMap.get(p.productId)?.name || 'Unknown Product',
    company: productMap.get(p.productId)?.company || 'N/A',
    category: productMap.get(p.productId)?.category || 'N/A',
    totalQuantitySold: p._sum.quantity || 0,
    totalRevenue: parseFloat((p._sum.priceAtOrder || 0).toFixed(2)),
  }));

  return result;
};

exports.getUserPerformance = async (limit, startDate, endDate) => {
  let queryDate = {};
  if (startDate && endDate) {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    queryDate = {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };
  }

  const orders = await prisma.order.findMany({
    where: queryDate,
    include: {
      orderItems: {
        select: {
          quantity: true,
          priceAtOrder: true,
        },
      },
    },
  });

  const userPerformanceMap = {};

  orders.forEach(order => {
    const userId = order.userId;
    if (!userPerformanceMap[userId]) {
      userPerformanceMap[userId] = {
        totalOrders: 0,
        totalProductsSold: 0,
        totalOrderValue: 0,
        uniqueCustomers: new Set(),
      };
    }
    userPerformanceMap[userId].totalOrders += 1;
    userPerformanceMap[userId].uniqueCustomers.add(order.customerId);

    let currentOrderTotal = 0;
    order.orderItems.forEach(item => {
      userPerformanceMap[userId].totalProductsSold += item.quantity;
      currentOrderTotal += item.quantity * item.priceAtOrder;
    });
    userPerformanceMap[userId].totalOrderValue += currentOrderTotal;
  });

  const userIds = Object.keys(userPerformanceMap).map(Number);
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      id: true,
      username: true,
    },
  });

  const userMap = new Map(users.map(u => [u.id, u]));

  const result = Object.keys(userPerformanceMap).map(userId => {
    const data = userPerformanceMap[userId];
    const averageOrderValue = data.totalOrders > 0 ? data.totalOrderValue / data.totalOrders : 0;
    return {
      userId: parseInt(userId),
      username: userMap.get(parseInt(userId))?.username || 'Unknown User',
      totalOrders: data.totalOrders,
      totalProductsSold: data.totalProductsSold,
      uniqueCustomersServed: data.uniqueCustomers.size,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
    };
  }).sort((a, b) => b.totalOrders - a.totalOrders).slice(0, parseInt(limit));

  return result;
};

exports.getCustomerInsights = async (limit = 5, startDate, endDate) => {
  let queryDate = {};
  if (startDate && endDate) {
    queryDate = {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    };
  }

  const orders = await prisma.order.findMany({
    where: queryDate,
    include: {
      orderItems: {
        select: {
          quantity: true,
          priceAtOrder: true,
        },
      },
    },
  });

  const customerPerformanceMap = {};

  orders.forEach(order => {
    const customerId = order.customerId;
    if (!customerPerformanceMap[customerId]) {
      customerPerformanceMap[customerId] = {
        totalOrders: 0,
        totalRevenue: 0,
      };
    }
    customerPerformanceMap[customerId].totalOrders += 1;
    order.orderItems.forEach(item => {
      customerPerformanceMap[customerId].totalRevenue += item.quantity * item.priceAtOrder;
    });
  });

  const customerIds = Object.keys(customerPerformanceMap).map(Number);
  const customers = await prisma.customer.findMany({
    where: {
      id: {
        in: customerIds,
      },
    },
    select: {
      id: true,
      name: true,
      mobile: true,
      shopName: true,
    },
  });

  const customerMap = new Map(customers.map(c => [c.id, c]));

  const result = Object.keys(customerPerformanceMap)
    .map(customerId => ({
      customerId: parseInt(customerId),
      customerName: customerMap.get(parseInt(customerId))?.name || 'Unknown Customer',
      mobile: customerMap.get(parseInt(customerId))?.mobile || 'N/A',
      shopName: customerMap.get(parseInt(customerId))?.shopName || 'N/A',
      totalOrders: customerPerformanceMap[customerId].totalOrders,
      totalRevenue: parseFloat(customerPerformanceMap[customerId].totalRevenue.toFixed(2)),
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit);

  return result;
};


exports.getCustomerInsights = async (limit = 5, startDate, endDate) => {
  let queryDate = {};
  if (startDate && endDate) {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    queryDate = {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };
  }

  const orders = await prisma.order.findMany({
    where: queryDate,
    include: {
      orderItems: {
        select: {
          quantity: true,
          priceAtOrder: true,
        },
      },
    },
  });

  const customerPerformanceMap = {};

  orders.forEach(order => {
    const customerId = order.customerId;
    if (!customerPerformanceMap[customerId]) {
      customerPerformanceMap[customerId] = {
        totalOrders: 0,
        totalRevenue: 0,
      };
    }
    customerPerformanceMap[customerId].totalOrders += 1;
    order.orderItems.forEach(item => {
      customerPerformanceMap[customerId].totalRevenue += item.quantity * item.priceAtOrder;
    });
  });

  const customerIds = Object.keys(customerPerformanceMap).map(Number);
  const customers = await prisma.customer.findMany({
    where: {
      id: {
        in: customerIds,
      },
    },
    select: {
      id: true,
      name: true,
      mobile: true,
      shopName: true,
    },
  });

  const customerMap = new Map(customers.map(c => [c.id, c]));

  const result = Object.keys(customerPerformanceMap)
    .map(customerId => ({
      customerId: parseInt(customerId),
      customerName: customerMap.get(parseInt(customerId))?.name || 'Unknown Customer',
      mobile: customerMap.get(parseInt(customerId))?.mobile || 'N/A',
      shopName: customerMap.get(parseInt(customerId))?.shopName || 'N/A',
      totalOrders: customerPerformanceMap[customerId].totalOrders,
      totalRevenue: parseFloat(customerPerformanceMap[customerId].totalRevenue.toFixed(2)),
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue) // Sort by total revenue descending
    .slice(0, limit); // Take top N customers

  return result;
};
