const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const config = require("../config.json")
const User = require("../models/userModel");

const updateProfile = async (req, res) => {
  const { userId, mobile, address } = req.body;
  if (!userId && !mobile && !address) {
    return res.status(400).json({ error: "No data provided for updating the profile" });
  }
  try {
    let profile = await User.findOne({_id: userId });
    if (!profile) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update profile fields if provided
    if (mobile) profile.mobile = mobile;
    if (address) profile.address = address;

    // Handle profile picture upload using Cloudinary
    console.log(req.file);
    if (req.file) {
      // Assuming you have a field named `profilePicture` in your User model
      profile.profilePicture = req.file.path; // Use the Cloudinary URL
    }

    // Save the updated profile
    const updatedProfile = await profile.save();

    res.status(200).json({
      message: "Profile data saved successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error saving profile data:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getProfile = async (req, res) => {
  const userId = req.body.userId;

  try {
    const profile = await User.findOne({ _id:userId });

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
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const hashedToken = (await bcrypt.hash(email, 10)).replace(/[/%]/g, ""); // Removing forward slashes and percentage signs from the hashed token
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token expiry in 1 hour
    await user.save();

    const resetLink = `${config.url}/reset-password/${hashedToken}`;
    const emailSent = await sendEmail(email, "Reset Password", resetLink);
    console.log("Reset password email", emailSent);
    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

const resetPassword = async (req, res) => {
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
};

module.exports = {
  updateProfile,
  getProfile,
  forgotPassword,
  resetPassword,
};
