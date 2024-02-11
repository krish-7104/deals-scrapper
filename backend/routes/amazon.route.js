const express = require("express")
const router = express.Router()
const { getDealsData, particularDealProducts } = require("../scrapper/amazon-scrapper.js")
const client = require("../redis/client.js")
// comment this ^ to remove redis

const url = "https://www.amazon.in/deals"

router.get("/deals", async (req, res) => {
    try {
        client.get("deals:amazon", async (err, cachedData) => {
            if (err) throw err;
            if (cachedData) {
                res.status(200).json(JSON.parse(cachedData))
            } else {
                const dealsData = await getDealsData(url);
                client.setex("deals:amazon", 3600, JSON.stringify(dealsData))
                res.status(200).json(dealsData)
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: `Internal Sever Error` })
    }
})

// Without Redis Code 

// router.get("/deals", async (req, res) => {
//     try {
//         const dealsData = await getDealsData(url);
//         res.status(200).json(dealsData)
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ error: `Internal Sever Error` })
//     }
// })

router.get(`/deals/:id`, async (req, res) => {
    try {
        const { id } = req.params
        client.get(`${id}:amazon`, async (err, cachedData) => {
            if (err) throw err;
            if (cachedData) {
                res.status(200).json(JSON.parse(cachedData))
            } else {
                const particularData = await particularDealProducts(id)
                client.setex(`${id}:amazon`, 3600, JSON.stringify(particularData))
                res.status(200).json(particularData)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: `Internal Sever Error` })
    }
})


module.exports = router