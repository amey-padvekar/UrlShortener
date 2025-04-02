const dotenv = require('dotenv');

dotenv.config();

const config = {
    port: process.env.PORT || 3000, // Default port
    mongoDbUrl: process.env.MONGODB_URL, // Replace with your MongoDB Atlas connection string
    secret: process.env.SECRET, // Replace with your secret key for JWT authentication
};

module.exports = config;