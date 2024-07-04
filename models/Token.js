const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model.Token || mongoose.model('Token', TokenSchema);
