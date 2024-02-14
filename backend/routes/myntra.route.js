const express = require("express")
const router = express.Router()
const { getDealsData } = require("../deals-scrapper/myntra-scrapper.js")
const client = require("../redis/client.js")
const { REDIS_CACHE_TIME } = require("../utils/constants.js")

const url = "https://www.myntra.com/deal-of-the-day?sort=discount"

router.get("/deals", async (req, res) => {
    try {
        client.get("deals:myntra", async (err, cachedData) => {
            if (err) throw err;
            if (cachedData) {
                res.status(200).json(JSON.parse(cachedData))
            } else {
                const dealsData = await getDealsData(url);
                client.setex("deals:myntra", REDIS_CACHE_TIME, JSON.stringify(dealsData))
                res.status(200).json(dealsData)
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: `Internal Sever Error` })
    }
})


module.exports = router