const express = require("express");
const router = express.Router();
const {
  register,
  login,
  saveProfile,
  getProfile,
  activateUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { validateRegistration } = require("../utils/validation");
const loginLimiter = require("../middleware/loginLimiter");
const varifyToken = require("../middleware/verifyToken");

router.post("/register", validateRegistration, register);
router.post("/login", login);
router.post("/profile", varifyToken, saveProfile);
router.get("/profile", varifyToken, getProfile);
router.get("/activate-user/:userId", activateUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
