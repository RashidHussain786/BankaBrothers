exports.saveOrder = (order) => {
  // In a real application, this would save the order to a database
  console.log('Saving Order to (simulated) Database:', JSON.stringify(order, null, 2));
  return { message: 'Order received successfully!', orderId: Math.floor(10000 + Math.random() * 90000).toString() };
};