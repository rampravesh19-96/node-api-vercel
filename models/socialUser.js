const mongoose = require('mongoose');

const socialUserSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
  },
  socialId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  // You can include other fields based on the information provided by the social login provider
  // For example, 'avatar', 'accessToken', 'refreshToken', etc.
}, { timestamps: true });

const SocialUser = mongoose.model('SocialUser', socialUserSchema);

module.exports = SocialUser;
