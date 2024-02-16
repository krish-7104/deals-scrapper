const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');
const fs = require("fs");

puppeteer.use(StealthPlugin())

const getAmazonDealsScrapper = async () => {
    console.log("\Myntra Deals Scrap Started")
    let allData = [];
    try {
        for (let i = 0; i < 5; i++) {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(`https://www.myntra.com/deals?p=${i}`);
            await page.waitForSelector("img");
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

module.exports = getAmazonDealsScrapper
