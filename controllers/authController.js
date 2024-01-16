const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const SocialUser = require("../models/socialUser");
const Profile = require("../models/profileModel");
const sendEmail = require("../utils/sendEmail");
const config = require("../config.json")

const successCallback = (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
    });
  }
};

const failureCallback = (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
};

const logoutCallback = (req, res) => {
  req.logout();
  res.redirect(config.frontend_url);
};

const googleAuthCallback = (req, res) => {
  const { provider, id, displayName, emails } = req.user;

  SocialUser.findOne({ socialId: id }).then((existingUser) => {
    if (existingUser) {
      res.redirect(config.frontend_url);
    } else {
      const newUser = new SocialUser({
        provider,
        socialId: id,
        name: displayName,
        email: emails[0].value,
      });
      newUser.save().then(() => {
        res.redirect(config.frontend_url);
      });
    }
  });
};
const githubAuthCallback = (req, res) => {
  const { provider, id, displayName } = req.user;
  const {email} = req.user. _json
  console.log(req.user);

  SocialUser.findOne({ socialId: id }).then((existingUser) => {
    if (existingUser) {
      res.redirect(config.frontend_url);
    } else {
      const newUser = new SocialUser({
        provider,
        socialId: id,
        name: displayName,
        email,
      });
      newUser.save().then(() => {
        res.redirect(config.frontend_url);
      });
    }
  });
};
const facebookAuthCallback = (req, res) => {
  // const { provider, id, displayName, emails } = req.user;

  // SocialUser.findOne({ socialId: id }).then((existingUser) => {
  //   if (existingUser) {
  //     res.redirect(config.frontend_url);
  //   } else {
  //     const newUser = new SocialUser({
  //       provider,
  //       socialId: id,
  //       name: displayName,
  //       email: emails[0].value,
  //     });
  //     newUser.save().then(() => {
  //       res.redirect(config.frontend_url);
  //     });
  //   }
  // });
  res.json(req.user)
};

const login = async (req, res) => {
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

    const token = jwt.sign({ userId: user._id }, config.jwt_secret, {
      expiresIn: config.token_expiry,
    });

    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    return res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};
const activateUser = async (req, res) => {
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
};
const register = async (req, res) => {
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
        config.salt
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
    const verifyLink = `${config.url}/activate-user/` + userWithoutPassword._id;
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
};

module.exports = {
  successCallback,
  failureCallback,
  logoutCallback,
  googleAuthCallback,
  githubAuthCallback,
  facebookAuthCallback,
  login,
  activateUser,
  register,
};
