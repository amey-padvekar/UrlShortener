const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const config = require('../config/config');  // Import config to get the secret
require('dotenv').config();

// Register User
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10); // Generate salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Create new user with hashed password
    const user = await User.create({
      username,
      email,
      password: hashedPassword, // Store the hashed password
      urls: [], // Initialize with an empty array for URLs
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not registered' });
    }

    // Compare the hashed password in the database with the plaintext password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT with secret from config.js
    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add URL for a user
const addURL = async (req, res) => {
  const { userId } = req.user;
 
  console.log(userId);
  const { originalURL, shortURL } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add new URL to the user's `urls` array
    user.urls.push({ originalURL, shortURL });
    await user.save();

    res.status(200).json({
      message: 'URL added successfully',
      urls: user.urls,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all URLs for a user

const getURLs = async (req, res) => {
  console.log(req.user.id)
  const userId  = req.user.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ urls: user.urls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, addURL, getURLs};
