const express = require("express")
const router = express.Router()
const { getDealsData } = require("../scrapper/meesho-scrapper.js")
const client = require("../redis/client.js")

const url = "https://www.meesho.com/?Sort[sort_by]=discount&Sort[sort_order]=desc"

router.get("/deals", async (req, res) => {
    try {
        client.get("deals:meesho", async (err, cachedData) => {
            if (err) throw err;
            if (cachedData) {
                res.status(200).json(JSON.parse(cachedData))
            } else {
                const dealsData = await getDealsData(url);
                client.setex("deals:meesho", 3600, JSON.stringify(dealsData))
                res.status(200).json(dealsData)
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: `Internal Sever Error` })
    }
})


module.exports = router