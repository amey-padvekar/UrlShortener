// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config'); // Import the secret from the config file

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  // Check if the Authorization header is present
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token using JWT and the secret key
    const decoded = jwt.verify(token, config.secret);
    
    // Attach the decoded user information (id) to the request object
    req.user = decoded;
    console.log(req.user)  // decoded.id will be available in req.user
    next(); // Call next() to proceed with the route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
