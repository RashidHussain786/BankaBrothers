const fs = require('fs');
const path = require('path');
const userService = require('./userService');

const ordersFilePath = path.join(__dirname, '..', 'data', 'orders.json');

const loadOrders = () => {
  try {
    const data = fs.readFileSync(ordersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading orders.json:', err);
    return [];
  }
};

const saveOrders = (orders) => {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing orders.json:', err);
  }
};

exports.createOrder = (userId, cartItems, customerInfo) => {
  const orders = loadOrders();
  const newOrderId = orders.length > 0 ? Math.max(...orders.map(o => o.orderId)) + 1 : 1;
  const newOrder = {
    orderId: newOrderId,
    userId,
    items: cartItems,
    customerInfo,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };

  orders.push(newOrder);
  saveOrders(orders);

  // Update user's order history
  userService.addOrderIdToUser(userId, newOrderId);

  return newOrder;
};

exports.getAllOrders = () => {
  return loadOrders();
};

exports.updateOrderStatus = (orderId, status) => {
  const orders = loadOrders();
  const orderIndex = orders.findIndex(o => o.orderId === parseInt(orderId));

  if (orderIndex === -1) {
    throw new Error('Order not found');
  }

  orders[orderIndex].status = status;
  saveOrders(orders);

  return orders[orderIndex];
};