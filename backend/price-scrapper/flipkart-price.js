const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');

puppeteer.use(StealthPlugin())

const product = { name: "", discount_price: "", original_price: "", discount: "", image: "" };

const flipkartPriceScrapper = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const htmlContent = await page.content();
        const $ = cheerio.load(htmlContent);
        const item = $("._1YokD2._2GoDe3");
        product.name = $(item).find(".B_NuCI").text().trim();
        product.discount = parseInt($(item)
            .find("._3Ay6Sb._31Dcoz")
            .text().replace(/[^\d.]/g, ''))
        product.discount_price = parseInt($(item)
            .find("._30jeq3._16Jk6d")
            .text().replace(/[^\d.]/g, ''))
        product.original_price = parseInt($(item)
            .find("._3I9_wc._2p6lqe")
            .text().trim().replace(/[^\d.]/g, ''))
        product.image = $(item)
            .find("._396cs4._2amPTt._3qGmMb")
            .attr("src")
        return product
    } catch (error) {
        console.log("Flipkart Price Scrapper Error: ", error)
        return null
    }
}

module.exports = flipkartPriceScrapper