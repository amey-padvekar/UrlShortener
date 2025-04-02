// db/connection.js
const mongoose = require('mongoose');
const config = require('../config/config');  // Import the config module

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Stop the server if DB connection fails
  }
};

module.exports = connectDB;
