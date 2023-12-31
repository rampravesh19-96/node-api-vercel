const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const sendEmail = require("../utils/sendEmail");
const getConfig = require("../utils/getConfig");

module.exports = {
  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;

    try {
      let newUser;
      let newProfile;

      try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(
          password,
          parseInt(process.env.SALT)
        );

        newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        newProfile = new Profile({ userId: newUser._id });
        await newProfile.save();
      } catch (error) {
        if (newUser) {
          await User.deleteOne({ _id: newUser._id });
        }
        return res.status(500).json({ error: "Server Error" });
      }

      const userWithoutPassword = { ...newUser.toObject() };
      delete userWithoutPassword.password;
      const config = await getConfig();
      const verifyLink =
        `${config.url}/activate-user/` + userWithoutPassword._id;
      const emailSent = await sendEmail(
        email,
        "Account verification",
        verifyLink
      );
      console.log("Email sent:", emailSent);
      return res.status(201).json({
        message: "Successfully Registered",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Registration Error:", error);
      return res.status(500).json({ error: "Server Error" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      if (!user.active) {
        return res.status(400).json({ error: "Please activate your account" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRY,
      });

      const userWithoutPassword = { ...user.toObject() };
      delete userWithoutPassword.password;

      return res.status(200).json({
        message: "Login successful",
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({ error: "Server Error" });
    }
  },
  saveProfile: async (req, res) => {
    const userId = req.body.userId; // Assuming req.user contains authenticated user info
    const { mobile, address, profilePicture } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    if (!mobile && !address && !profilePicture) {
      return res
        .status(400)
        .json({ error: "No data provided for updating the profile" });
    }

    try {
      let profile = await Profile.findOne({ userId });
      if (!profile) {
        return res.status(404).json({ error: "User not found" });
      }
      if (mobile) profile.mobile = mobile;
      if (address) profile.address = address;
      if (profilePicture) profile.profilePicture = profilePicture;

      const updatedProfile = await profile.save();
      res.status(200).json({
        message: "Profile data saved successfully",
        profile: updatedProfile,
      });
    } catch (error) {
      console.error("Error saving profile data:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },
  getProfile: async (req, res) => {
    const userId = req.body.userId;

    try {
      const profile = await Profile.findOne({ userId });

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res
        .status(200)
        .json({ message: "Profile data retrieved successfully", profile });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },
  activateUser: async (req, res) => {
    const userId = req.params.userId;

    try {
      const user = await User.findById(userId);

      if (!user) return res.status(404).json({ error: "User not found" });

      user.active = 1;
      await user.save();

      return res.status(200).json({ message: "User activated successfully" });
    } catch (error) {
      console.error("Error activating user:", error);
      return res.status(500).json({ error: "Server Error" });
    }
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const hashedToken = (await bcrypt.hash(email, 10)).replace(/[/%]/g, ''); // Removing forward slashes and percentage signs from the hashed token
      user.resetToken = hashedToken;
      user.resetTokenExpiry = Date.now() + 3600000; // Token expiry in 1 hour
      await user.save();
  
      const config = await getConfig();
      const resetLink = `${config.url}/reset-password/${hashedToken}`;
      const emailSent = await sendEmail(email, "Reset Password", resetLink);
      console.log("Reset password email", emailSent);
      res.status(200).json({ message: "Password reset link sent successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server error" });
    }
  },
  
  resetPassword: async (req, res) => {
    const { token } = req.params;
    console.log(token);
    const { newPassword } = req.body;
    try {
      const user = await User.findOne({
        resetToken: token,
        // resetTokenExpiry: { $gt: Date.now() }, // Check if token is not expired
      });   
      console.log(user);
      if (!user) {
        return res.status(400).send("Invalid or expired token");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;

      await user.save();

      res.status(200).send("Password reset successful");
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  },
};
