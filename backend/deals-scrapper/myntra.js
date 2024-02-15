const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require("fs");

const getDealsData = async (url) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const deals = $(".product-base").toArray();
    const allData = await Promise.all(deals.map(async (element) => {
        const product = $(element);
        return {
            title: product.find(".product-product").text().trim() + " (" + product.find(".product-brand").text().trim() + ")",
            image: product.find("img-responsive").attr("src"),
            original_price: parseInt(product.find(".product-strike").text().replace("Rs. ", "").replace(/[^\d.]/g, '')),
            discount_price: parseInt(product.find(".product-discountedPrice").first().text().replace("Rs. ", "").replace(/[^\d.]/g, '')),
            discount: parseInt(product.find(".product-discountPercentage").last().text().replace(/[^\d.]/g, '')),
            link: "https://www.myntra.com/" + product.find("a").first().attr("href")
        };
    }));
    await browser.close();
    return allData;
};

const getMyntraDealsScrapper = async () => {
    try {
        let totalPages = 10;
        let allData = [];
        let promises = [];

        for (let i = 1; i <= totalPages; i++) {
            promises.push(getDealsData(`https://www.myntra.com/deals?p=${i}`));
        }

        const dealsDataArrays = await Promise.all(promises);

        dealsDataArrays.forEach(dealsData => {
            allData.push(...dealsData);
        });

        fs.writeFileSync("myntra.json", JSON.stringify(allData, null, 2));
        return allData;
    } catch (error) {
        console.error("Error while scraping deals:", error);
        throw error;
    }
};

module.exports = getMyntraDealsScrapper