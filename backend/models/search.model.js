const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  searches: {
    type: [String],
    default: []
  }
}, { timestamps: true });

const searchUser = mongoose.model('user search', searchSchema);

module.exports = searchUser;
