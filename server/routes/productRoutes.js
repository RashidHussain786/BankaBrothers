const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/companies', productController.getCompanies);
router.get('/categories', productController.getCategories);
router.get('/brands', productController.getBrands);
router.get('/sizes', productController.getSizes);
router.get('/stock-status', productController.getProductsByStockStatus);
router.get('/:id', productController.getProductById);
router.get('/', productController.getAllProducts);
router.post('/', productController.addProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;