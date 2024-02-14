const express = require("express")
const router = express.Router()
const { getDealsData, particularDealProducts } = require("../deals-scrapper/amazon-scrapper.js")
const client = require("../redis/client.js")
const getSearchProductHandler = require("../search-scrapper/amazon-search.js")
const url = "https://www.amazon.in/deals"
const { REDIS_CACHE_TIME } = require("../utils/constants.js")

router.get("/deals-category", async (req, res) => {
    try {
        client.get("deals:amazon", async (err, cachedData) => {
            if (err) throw err;
            if (cachedData) {
                res.status(200).json(JSON.parse(cachedData))
            } else {
                const dealsData = await getDealsData(url);
                client.setex("deals:amazon", REDIS_CACHE_TIME, JSON.stringify(dealsData))
                res.status(200).json(dealsData)
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: `Internal Sever Error` })
    }
})

router.post(`/deals`, async (req, res) => {
    try {
        const { url } = req.body
        const redisVariable = url.replace("https://www.amazon.in/", "")?.replace("?showVariations=true", "").split("&")[0]
        client.get(`${redisVariable}:amazon`, async (err, cachedData) => {
            if (err) throw err;
            if (cachedData) {
                res.status(200).json(JSON.parse(cachedData))
            } else {
                const particularData = await particularDealProducts(url)
                client.setex(`${redisVariable}:amazon`, REDIS_CACHE_TIME, JSON.stringify(particularData))
                res.status(200).json(particularData)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: `Internal Sever Error` })
    }
})

router.get("/search", getSearchProductHandler)


module.exports = router