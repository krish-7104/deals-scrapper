const express = require("express");
const router = express.Router();
const fs = require("fs");

const ITEMS_PER_PAGE = 102;

const getDealsHandler = async (req, res) => {
    try {
        const { company, search, page } = req.query;
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
            dealsData = dealsData.filter(deal => deal.link.includes(company.toLowerCase()));
            return res.status(200).json({
                data: dealsData, count: dealsData.length,
            });
        }
        if (search) {
            dealsData = dealsData.filter(deal => deal.title.includes(search));
            return res.status(200).json({
                data: dealsData, count: dealsData.length,
            });
        }

        const totalItems = dealsData.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const currentPage = parseInt(page) || 1;
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedDealsData = dealsData.slice(startIndex, endIndex);

        return res.status(200).json({
            count: paginatedDealsData.length,
            totalItems,
            totalPages,
            currentPage,
            perPage: ITEMS_PER_PAGE,
            data: paginatedDealsData
        });
    } catch (error) {
        console.error("Error fetching deals:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

router.get("/deals", getDealsHandler);

module.exports = router;
