const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const fs = require("fs");
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { logStart, logEnd } = require("../utils/logger.js")

puppeteer.use(StealthPlugin())

const getFlipkartCategoryScrapper = async () => {
    const browser = await puppeteer.launch({ headless: true });
    logStart("Flipkart Category Scrapper")
    const page = await browser.newPage();
    let allData = [];
    await page.goto('https://www.flipkart.com/', { waitUntil: 'networkidle2' });
    const processedUrls = new Set();
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const categories = $("._25HC_u");
    const currentPageData = await Promise.all(categories.map(async (index, element) => {
        const product = $(element);
        const link = "https://www.flipkart.com" + product.find("a").first().attr("href")
        if (processedUrls.has(link)) {
            return null;
        } else {
            return {
                deal_link: link
            };
        }
    }));
    allData = currentPageData.filter((data) => data !== null)
    fs.writeFileSync("flipkart-category.json", JSON.stringify(allData, null, 2));
    logEnd("Flipkart Category Scrapper")
    browser.close();
    return allData;
};


module.exports = getFlipkartCategoryScrapper;
