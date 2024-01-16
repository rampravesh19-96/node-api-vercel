const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const config = require("../config.json")

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized1" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized2" });
    }

    const decoded = jwt.verify(token, config.jwt_secret);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized3" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = verifyToken;
