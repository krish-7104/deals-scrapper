const express = require('express');
const router = express.Router();
const getAmazonSearchProductHandler = require('../search-scrapper/amazon-search.js');
const getFlipkartSearchProductHandler = require('../search-scrapper/flipkart-search.js');

router.route('/amazon').get(getAmazonSearchProductHandler);
router.route('/flipkart').get(getFlipkartSearchProductHandler);


module.exports = router;
