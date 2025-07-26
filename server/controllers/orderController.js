const orderService = require('../services/orderService');

exports.createOrder = (req, res) => {
  const order = req.body;
  const result = orderService.saveOrder(order);
  res.status(200).json(result);
};