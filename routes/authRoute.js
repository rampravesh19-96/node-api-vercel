const express = require("express");
const router = express.Router();
const {
  successCallback,
  failureCallback,
  logoutCallback,
  googleAuthCallback,
  githubAuthCallback,
  facebookAuthCallback,
  login,
  activateUser,
  register,
} = require("../controllers/authController");
const { validateRegistration } = require("../utils/validation");

const passport = require("passport");


router.get("/login/success", successCallback);

router.get("/login/failed", failureCallback);

router.get("/logout", logoutCallback);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google"), googleAuthCallback);

router.get("/github", passport.authenticate("github", { scope: ["profile", "email"] }));
router.get("/github/callback", passport.authenticate("github"), githubAuthCallback);

router.get("/facebook", passport.authenticate("facebook", { scope: ["profile", "email"] }));
router.get("/facebook/callback", passport.authenticate("facebook"), facebookAuthCallback);

router.post("/login", login);
router.get("/activate-user/:userId", activateUser);

router.post("/register", validateRegistration, register);


module.exports = router;
