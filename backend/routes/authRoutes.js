// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');  // Import the authMiddleware

// Public routes
router.post('/register', authController.registerUser);  // Register user (no auth needed)
router.post('/login', authController.loginUser);        // Login user (no auth needed)

// Protected routes
router.get('/get-urls', authMiddleware, authController.getURLs);
module.exports = router;
