const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');

puppeteer.use(StealthPlugin())

const product = { name: "", discount_price: "", original_price: "", discount: "", image: "" };

const AjioPriceScrapper = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const htmlContent = await page.content();
        const $ = cheerio.load(htmlContent);
        product.name = `(${$(".prod-name").text().trim()})`;
        product.discount = parseInt($
            (".prod-discnt")
            .text().replace(/[^\d.]/g, ''))
        product.discount_price = parseInt($
            (".prod-sp")
            .text().replace(/[^\d.]/g, ''))
        product.original_price = parseInt($
            (".prod-cp")
            .text().trim().replace(/[^\d.]/g, ''))
        product.image = $(".img-alignment")
            .attr("src")
        return product
    } catch (error) {
        console.log("Ajio Price Scrapper Error: ", error)
        return null
    }
}



module.exports = AjioPriceScrapper