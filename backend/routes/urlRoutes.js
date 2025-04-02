// routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const authMiddleware = require('../middleware/authMiddleware');  // Import the authMiddleware

// Route to generate short URL and QR code
router.post('/generate-short-url', authMiddleware, urlController.generateShortURL);
router.get('/:shortURL', urlController.redirectToOriginalURL)
module.exports = router;
