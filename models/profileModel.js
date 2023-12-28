const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mobile: String,
  address: String,
  profilePicture: String,
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
