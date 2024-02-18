const express = require("express");
const router = express.Router();
const fs = require("fs");

const getDealsHandler = async (req, res) => {
    try {
        const { company, search } = req.query;
        const amazonData = JSON.parse(fs.readFileSync("./amazon.json"));
        const flipkartData = JSON.parse(fs.readFileSync("./flipkart.json"));
        const myntraData = JSON.parse(fs.readFileSync("./myntra.json"));
        const ajioData = JSON.parse(fs.readFileSync("./ajio.json"));
        const meeshoData = JSON.parse(fs.readFileSync("./meesho.json"));
        let dealsData = [...amazonData, ...flipkartData, ...myntraData, ...ajioData, ...meeshoData];
        const uniqueDealsSet = new Set();
        dealsData.forEach(deal => uniqueDealsSet.add(deal.link));
        dealsData = Array.from(uniqueDealsSet).map(link => dealsData.find(deal => deal.link === link));

        dealsData.sort((a, b) => b.discount - a.discount);

        if (company) {
            dealsData = dealsData.filter(deal => deal.link.includes(company));
        }
        if (search) {
            dealsData = dealsData.filter(deal => deal.title.includes(search));
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
