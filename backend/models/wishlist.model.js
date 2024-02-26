const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    userId: String,
    productUrl: String,
    image:String,
    title:String, 
    discount_price:String, 
    original_price:String, 
    discount:String, 
}, { timestamps: true })

const WishlistItem = mongoose.model('user wishlist', wishlistSchema);

module.exports = WishlistItem;