const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    token: String
}, { timestamps: true })

const resetToken = mongoose.model('Reset Token', tokenSchema);

module.exports = resetToken;