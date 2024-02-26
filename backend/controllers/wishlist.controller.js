const WishlistItem = require('../models/wishlist.model.js');

exports.getWishlistItem= (async (req, res) => {
    const { userId } = req.params;
    try {
        const wishlist = await WishlistItem.find({ userId });
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


exports.addWishlistItem=(async (req, res) => {
    const wishlistItemData = req.body;
    try {
        const wishlistItem = await WishlistItem.create(wishlistItemData);
        res.status(201).json(wishlistItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

exports.deleteWishlistItem= (async (req, res) => {
    const id  = req.params.id;
    try {
        await WishlistItem.findByIdAndDelete(id);
        res.status(204).json({message:"Delete successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
});


