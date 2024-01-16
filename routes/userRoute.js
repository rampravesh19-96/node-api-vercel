const express = require("express");
const router = express.Router();
const {upload} = require("../middleware/multer")
const {
  updateProfile,
  getProfile,
  forgotPassword, 
  resetPassword,
} = require("../controllers/userController");
const varifyToken = require("../middleware/verifyToken");

router.patch("/profile", varifyToken,upload.single('profilePicture'), updateProfile);
router.get("/profile", varifyToken, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
