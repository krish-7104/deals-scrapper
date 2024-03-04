const express = require('express');
const myntraPriceScrapper = require('../details-scrapper/myntra-price');
const AjioPriceScrapper = require('../details-scrapper/ajio-price');
const amazonPriceScrape = require('../details-scrapper/amazon-price');
const flipkartPriceScrape = require('../details-scrapper/flipkart-price');
//const MeeshoPriceScrapper = require('../details-scrapper/meesho-price');

const router = express.Router();

router.route('/myntra').post(myntraPriceScrapper);
router.route('/ajio').post(AjioPriceScrapper);
router.route('/amazon').post(amazonPriceScrape);
router.route('/flipkart').post(flipkartPriceScrape);


module.exports = router;
