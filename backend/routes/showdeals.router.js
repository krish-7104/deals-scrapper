const express = require("express");
const router = express.Router();
const fs = require("fs")

const getDealsHandler = async (req, res) => {
    try {
        const { company } = req.query
        const amazonData = JSON.parse(fs.readFileSync("./amazon.json"))
        const flipkartData = JSON.parse(fs.readFileSync("./flipkart.json"))
        const myntraData = JSON.parse(fs.readFileSync("./myntra.json"))
        const dealsData = [...amazonData, ...flipkartData, ...myntraData];
        dealsData.sort((a, b) => b.discount - a.discount);
        if (company) {
            const filteredData = dealsData.filter((a) => a.link.includes(company))
            return res.status(200).json({
                count: filteredData.length,
                data: filteredData
            });
        }
        return res.status(200).json({
            count: dealsData.length,
            data: dealsData
        });
    } catch (error) {
        console.error("Error fetching deals:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

router.get("/deals", getDealsHandler);

module.exports = router;
