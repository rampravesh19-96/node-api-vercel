const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const config = require("../config.json");

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary_name,
  api_key: config.cloudinary_key,
  api_secret: config.cloudinary_secret,
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "", // Optional, specify the folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    // You can add more configuration options as needed
  },
});

const upload = multer({ storage: storage });
const deleteCloudinaryImg = async (imagePath) => {
  try {
    if (imagePath) {
      // Use Cloudinary API to delete the image
      await cloudinary.uploader.destroy(imagePath);
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

module.exports = { upload, deleteCloudinaryImg };
