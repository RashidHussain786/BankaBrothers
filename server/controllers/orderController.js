const orderService = require('../services/orderService');

exports.createOrder = async (req, res) => {
  const { userId, cartItems, customerId } = req.body;

  if (!userId || !cartItems || cartItems.length === 0 || !customerId) {
    return res.status(400).json({ message: 'User ID, cart items, and customer ID are required' });
  }

  try {
    const newOrder = await orderService.createOrder(userId, cartItems, customerId); // Await
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`Received updateOrderStatus request for order ID: ${id} with status: ${status}`);

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const updatedOrder = await orderService.updateOrderStatus(id, status); // Await
    res.json(updatedOrder);
  } catch (error) {
    console.error(`Error updating order status for order ${id}:`, error);
    if (error.message === 'Order not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { orders, totalCount } = await orderService.getAllOrders(page, limit); // Await
    res.json({ orders, totalCount });
  } catch (error) {
    console.error('Error getting all orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
