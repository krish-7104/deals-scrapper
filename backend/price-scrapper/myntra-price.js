const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');

puppeteer.use(StealthPlugin())

const product = { name: "", discount_price: "", original_price: "", discount: "", image: "" };

const myntraPriceScrapper = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const htmlContent = await page.content();
        const $ = cheerio.load(htmlContent);
        product.name = $(".pdp-name").text().trim() + `(${$(".pdp-title").text().trim()})`;
        product.discount = parseInt($
            (".pdp-discount")
            .text().replace(/[^\d.]/g, ''))
        product.discount_price = parseInt($
            (".pdp-price")
            .text().replace(/[^\d.]/g, ''))
        product.original_price = parseInt($
            (".pdp-mrp s")
            .text().trim().replace(/[^\d.]/g, ''))
        return product
    } catch (error) {
        console.log("Myntra Price Scrapper Error: \n", error)
        return null
    }
}

module.exports = myntraPriceScrapper