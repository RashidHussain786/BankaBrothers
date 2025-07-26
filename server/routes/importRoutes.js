const express = require('express');
const router = express.Router();
const multer = require('multer');
const importController = require('../controllers/importController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

// POST /api/admin/products/import
router.post('/products/import', authenticate, authorize('admin'), upload.single('file'), importController.importProducts);

module.exports = router;
