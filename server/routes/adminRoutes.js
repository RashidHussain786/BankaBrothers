const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Admin routes (protected by authentication and authorization middleware)
router.post('/users', authMiddleware.authenticate, authMiddleware.authorize(['admin']), adminController.createUser);
router.get('/users', authMiddleware.authenticate, authMiddleware.authorize(['admin']), adminController.getAllUsers);
router.delete('/users/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), adminController.deleteUser);
router.put('/users/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), adminController.updateUser);

module.exports = router;