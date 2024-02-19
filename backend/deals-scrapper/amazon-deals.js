const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');
const fs = require("fs");
const { logStart, logEnd } = require("../utils/logger.js")

puppeteer.use(StealthPlugin())

const AMAZON_SCRAPE_PAGE = 20

const getAmazonDealsScrapper = async () => {
    const categories = JSON.parse(fs.readFileSync("amazon-category.json"));
    logStart("Amazon Deals Scrapper")
    let allData = [];
    try {
        for (let i = 0; i < AMAZON_SCRAPE_PAGE; i++) {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(categories[i].deal_link);
            const htmlContent = await page.content();
            const $ = cheerio.load(htmlContent);
            const products = $(".a-unordered-list.a-nostyle.a-horizontal.a-spacing-none li");
            const productsData = await Promise.all(products.map(async (index, element) => {
                const product = $(element);
                return {
                    link: `https://www.amazon.in${product.find(".a-link-normal").attr("href")}`,
                    image: product.find(".octopus-dlp-asin-image").attr("src"),
                    title: product.find(".a-size-base.a-color-base.a-text-normal").text().trim(),
                    discount_price: parseInt(product
                        .find(".a-price-whole")
                        .first()
                        .text().replace(".", "").replace(/[^\d.]/g, '')),
                    original_price: parseInt(product
                        .find(".a-size-mini.a-color-tertiary.octopus-widget-strike-through-price.a-text-strike")
                        .first()
                        .text().trim().replace(/[^\d.]/g, '')),
                    discount: parseInt(product.find(".a-size-medium.a-color-price.octopus-widget-saving-percentage").text().replace(/[^\d.]/g, '')),
                };
            }));
            allData.push(productsData)
            await browser.close();
        }

        const data = allData.reduce((acc, currentData) => {
            return acc.concat(currentData);
        }, []);
        fs.writeFileSync("amazon.json", JSON.stringify(data, null, 2));
        logEnd("Amazon Deals Scrapper")
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}

module.exports = getAmazonDealsScrapper
