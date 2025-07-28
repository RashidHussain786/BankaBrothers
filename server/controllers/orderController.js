const orderService = require('../services/orderService');

exports.createOrder = (req, res) => {
  const { userId, cartItems, customerInfo } = req.body;

  if (!userId || !cartItems || cartItems.length === 0 || !customerInfo) {
    return res.status(400).json({ message: 'User ID, cart items, and customer info are required' });
  }

  try {
    const newOrder = orderService.createOrder(userId, cartItems, customerInfo);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`Received updateOrderStatus request for order ID: ${id} with status: ${status}`);

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const updatedOrder = orderService.updateOrderStatus(id, status);
    res.json(updatedOrder);
  } catch (error) {
    console.error(`Error updating order status for order ${id}:`, error);
    if (error.message === 'Order not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllOrders = (req, res) => {
  try {
    const orders = orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error getting all orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};