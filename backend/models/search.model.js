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
});

const searchUser = mongoose.model('searchUser', searchSchema);

module.exports = searchUser;
