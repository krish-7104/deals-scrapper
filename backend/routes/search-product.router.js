const express = require('express');
const router = express.Router();
const AmazonSearchProduct = require('../search-scrapper/amazon-search.js');
const MyntraSearchProduct = require('../search-scrapper/myntra-search.js');
const AjioSearchProduct = require('../search-scrapper/ajio-search.js');
const FlipkartSearchProduct = require('../search-scrapper/flipkart-search.js');

router.route('/amazon').get(AmazonSearchProduct);
router.route('/flipkart').get(FlipkartSearchProduct);
router.route('/myntra').get(MyntraSearchProduct);
router.route('/ajio').get(AjioSearchProduct);


module.exports = router;
