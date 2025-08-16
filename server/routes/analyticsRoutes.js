const express = require('express');
const { getSalesOverview, getTopSellingProducts, getUserPerformance, getCustomerInsights } = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/sales-overview', authenticate, authorize(['admin']), getSalesOverview);
router.get('/top-selling-products', authenticate, authorize(['admin']), getTopSellingProducts);
router.get('/user-performance', authenticate, authorize(['admin']), getUserPerformance);
router.get('/customer-insights', authenticate, authorize(['admin']), getCustomerInsights);

module.exports = router;
