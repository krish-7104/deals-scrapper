const express = require("express")
const getSearchProductHandler = require("../search-scrapper/flipkart-search")
const router = express.Router()

router.get("/search", getSearchProductHandler)

module.exports = router