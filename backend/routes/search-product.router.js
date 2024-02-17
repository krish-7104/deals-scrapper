const express = require('express');
const router = express.Router();
const AmazonSearchProduct = require('../search-scrapper/amazon-search.js');
const flipkartPriceScrapper = require('../price-scrapper/flipkart-price.js');
const MyntraSearchProduct = require('../search-scrapper/myntra-search.js');

router.route('/amazon').get(AmazonSearchProduct);
router.route('/flipkart').get(flipkartPriceScrapper);
router.route('/myntra').get(MyntraSearchProduct);


module.exports = router;
