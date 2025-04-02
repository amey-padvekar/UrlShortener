// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/connection');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const config = require('./config/config');  // Import the config module
const cors = require('cors');
// Initialize Express
const app = express();
app.use(cors());

// Use JSON middleware
app.use(express.json());

// MongoDB connection
connectDB(config.mongoDbUrl);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes); 
// Start server
const PORT = config.port;  // Use the port from config.js
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
