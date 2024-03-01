const express=require('express');
const router=express.Router();

const AjioCoupon=require("../coupon-scrapper/ajio-coupon");
const AmazonCoupon=require("../coupon-scrapper/amazon-coupon");

router.route("/ajioCoupon").get(AjioCoupon);
router.route("/amazonCoupon").get(AmazonCoupon);

module.exports=router;
