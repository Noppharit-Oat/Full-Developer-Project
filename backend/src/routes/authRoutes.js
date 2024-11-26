// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.get('/verify', authenticateToken, authController.verify);
router.get('/user', authenticateToken, authController.getUser);
router.post('/refresh', authController.refresh);

module.exports = router;