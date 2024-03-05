const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');

puppeteer.use(StealthPlugin())

const product = { name: "", discount_price: "", original_price: "", discount: "", image: "", details: "", reviews: "", ratings: "" };

const myntraPriceScrapper = async (req, res) => {
    try {
        const { url } = req.body
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const htmlContent = await page.content();
        const $ = cheerio.load(htmlContent);
        product.name = $(".pdp-name").text().trim() + `(${$(".pdp-title").text().trim()})`;
        product.details = $(".pdp-product-description-content").text().trim();
        product.reviews = $(".index-overallRating").text().trim().split("|")[0]
        product.ratings = $(".index-ratingsCount").text().trim().split("|")[0]
        product.discount = parseInt($
            (".pdp-discount")
            .text().replace(/[^\d.]/g, ''))
        product.discount_price = parseInt($
            (".pdp-price")
            .text().replace(/[^\d.]/g, ''))
        product.original_price = parseInt($
            (".pdp-mrp s")
            .text().trim().replace(/[^\d.]/g, ''))
        const backgroundImageStyle = $(".image-grid-image").attr("style");
        product.image = backgroundImageStyle ? backgroundImageStyle.match(/url\("(.+)"\)/)[1] : "";
        res.json(product)
    } catch (error) {
        console.log("Myntra Details Scrapper Error: ", error)
        res.send("Myntra Details Scrapper Error")
    }
}

module.exports = myntraPriceScrapper

