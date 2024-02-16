const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');
const fs = require("fs");
const { MYNTRA_SCRAPE_PAGE } = require('../utils/constants');

puppeteer.use(StealthPlugin())

const getAmazonDealsScrapper = async () => {
    console.log("\nMyntra Deals Scrap Started")
    let allData = [];
    try {
        for (let i = 1; i <= MYNTRA_SCRAPE_PAGE; i++) {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(`https://www.myntra.com/deals?p=${i}`);
            await page.waitForSelector("img");
            await autoScroll(page);
            const htmlContent = await page.content();
            const $ = cheerio.load(htmlContent);
            const products = $(".product-base")
            const productsData = await Promise.all(products.map(async (index, element) => {
                const product = $(element);
                return {
                    title: product.find(".product-product").text().trim() + " (" + product.find(".product-brand").text().trim() + ")",
                    image: product.find("img").attr("src"),
                    original_price: parseInt(product.find(".product-strike").text().replace("Rs. ", "").replace(/[^\d.]/g, '')),
                    discount_price: parseInt(product.find(".product-discountedPrice").first().text().replace("Rs. ", "").replace(/[^\d.]/g, '')),
                    discount: parseInt(product.find(".product-discountPercentage").last().text().replace(/[^\d.]/g, '')),
                    link: "https://www.myntra.com/" + product.find("a").first().attr("href")
                };
            }));
            allData.push(productsData)
            await browser.close();
        }

        const data = allData.reduce((acc, currentData) => {
            return acc.concat(currentData);
        }, []);
        fs.writeFileSync("myntra.json", JSON.stringify(data, null, 2));
        fs.appendFileSync("log.txt", `Myntra Deals Scrapper Run at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`);
        console.log("Myntra Deals Scrap Ended")
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

module.exports = getAmazonDealsScrapper
