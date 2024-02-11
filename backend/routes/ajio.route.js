const express = require("express")
const router = express.Router()
const { getAllCouponOffers, getAllDeals } = require("../scrapper/ajio-scrapper.js")
const client = require("../redis/client.js")
const couponOfferLink = "https://www.ajio.com/offers"
const dealsLink = "https://www.ajio.com/s/offer-deals-03022021?query=%3Adiscount-desc&curated=true&curatedid=offer-deals-03022021&gridColumns=3"

router.get("/coupons", async (req, res) => {
    try {
        client.get("coupons:ajio", async (err, cachedData) => {
            if (err) throw err;
            if (cachedData) {
                res.status(200).json(JSON.parse(cachedData))
            } else {
                const dealsData = await getAllCouponOffers(couponOfferLink);
                client.setex("coupons:ajio", 3600, JSON.stringify(dealsData))
                res.status(200).json(dealsData)
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: `Internal Sever Error` })
    }
})

router.get("/deals", async (req, res) => {
    try {
        client.get("deals:ajio", async (err, cachedData) => {
            if (err) throw err;
            if (cachedData) {
                res.status(200).json(JSON.parse(cachedData))
            } else {
                const dealsData = await getAllDeals(dealsLink);
                client.setex("deals:ajio", 3600, JSON.stringify(dealsData))
                res.status(200).json(dealsData)
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: `Internal Sever Error` })
    }
})


module.exports = router