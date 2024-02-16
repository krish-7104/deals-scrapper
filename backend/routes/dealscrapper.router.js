const express = require('express');
const getAmazonCategoryScrapper = require('../deals-scrapper/amazon-category');
const getAmazonDealsScrapper = require('../deals-scrapper/amazon-deals');
const getFlipkartCategoryScrapper = require('../deals-scrapper/flipkart-category');
const getFlipkartDealsScrapper = require('../deals-scrapper/flipkart-deals');
const getMyntraDealsScrapper = require('../deals-scrapper/myntra');
const router = express.Router();

router.route('/amazon-category').get(getAmazonCategoryScrapper);
router.route('/amazon-deals').get(getAmazonDealsScrapper);

router.route('/flipkart-category').get(getFlipkartCategoryScrapper);
router.route('/flipkart-deals').get(getFlipkartDealsScrapper);

router.route('/myntra-deals').get(getMyntraDealsScrapper);


module.exports = router;
