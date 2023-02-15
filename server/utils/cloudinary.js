const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloud_name: process.env.NEXT_CLOUD_NAME,
  api_key: process.env.NEXT_CLOUD_API_KEY,
  api_secret: process.env.NEXT_CLOUD_API_SECRET,
});

module.exports = cloudinary.v2;
