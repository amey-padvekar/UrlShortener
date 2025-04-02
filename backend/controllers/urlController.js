const shortid = require('shortid');
const qrcode = require('qrcode'); // Import the qrcode library
const User = require('../models/user');
const config = require('../config/config');
// Generate short URL and QR Code
const generateShortURL = async (req, res) => {
  const { originalURL } = req.body;  // Get the original URL from the request body
    console.log('Generating short URL');
  // Validate the URL format (optional)
  const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(:\d+)?(\/[^\s]*)?$/;
  if (!urlRegex.test(originalURL)) {
    return res.status(400).json({ message: 'Invalid URL format' }); 
  }

  try {
    // Generate a unique short URL using shortid (you can replace this with your own method)
    const shortURL = shortid.generate(); // Generates a random unique string

    // Find the user who is generating the short URL
    const userId = req.user.id; // Get user ID from the JWT token (from the middleware)

    // Find the user and add the new URL with short URL
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    

    // Generate QR code for the short URL
    const qrCodeDataURL = await qrcode.toDataURL(`http://localhost:${config.port}/api/url/${shortURL}`);
    // Add the short URL to the user's list of URLs
    user.urls.push({ originalURL, shortURL,qrCode: qrCodeDataURL});
    await user.save();
    // Return the short URL and QR code data URL in the response
    res.status(200).json({
      message: 'Short URL and QR code generated successfully',
      shortURL: `http://localhost:${config.port}/api/url/${shortURL}`,  // Customize the base domain
      qrCode: qrCodeDataURL  // This is the QR code image in Data URL format
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Redirect to original URL
const redirectToOriginalURL = async (req, res) => {
    //console.log(req);
  const { shortURL } = req.params;  // Extract the short URL from the request params

  try {
    // Find the short URL in the database (in any user's list of URLs)
    const user = await User.findOne({ 'urls.shortURL': shortURL });

    if (!user) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Find the URL object that corresponds to the short URL
    const urlObj = user.urls.find(url => url.shortURL === shortURL);

    // Redirect to the original URL
    if (urlObj) {
      return res.redirect(urlObj.originalURL);
    } else {
      return res.status(404).json({ message: 'Original URL not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { generateShortURL , redirectToOriginalURL};
