const express = require("express");
const router = express.Router();
const { register,login,saveProfile,getProfile } = require("../controllers/userController");
const { validateRegistration } = require("../utils/validation");
const loginLimiter = require("../middleware/loginLimiter")
const varifyToken = require("../middleware/verifyToken")

router.post("/register", validateRegistration, register);
router.post("/login",loginLimiter, login);
router.post("/profile",varifyToken, saveProfile);
router.get("/profile",varifyToken, getProfile);

module.exports = router;
