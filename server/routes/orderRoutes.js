const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.authenticate, orderController.createOrder);
router.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), orderController.updateOrderStatus);
router.get('/', authMiddleware.authenticate, authMiddleware.authorize(['admin']), orderController.getAllOrders);

module.exports = router;