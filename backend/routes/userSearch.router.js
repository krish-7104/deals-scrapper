const express = require('express');
const router = express.Router();
const searchController=require('../controllers/search.controller');

router.route("/getUserSearch/:userId").get(searchController.getUserSearch);
router.route("/storeUserSearch").post(searchController.storeUserSearch);

module.exports = router;
