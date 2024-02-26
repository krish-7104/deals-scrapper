const express = require('express');
const router = express.Router();
const WishlistItem=require('../controllers/wishlist.controller');

router.route('/getWishlistItem/:userId').get(WishlistItem.getWishlistItem);
router.route('/addWishlistItem').post(WishlistItem.addWishlistItem);
router.route('/deleteWishlistItem/:id').delete(WishlistItem.deleteWishlistItem);


module.exports=router;
