const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const priceSchema = new Schema({
    price: String,
    email: String,
    productUrl: String
}, { timestamps: true })

const priceUser = mongoose.model('priceUser', priceSchema);

module.exports = priceUser;