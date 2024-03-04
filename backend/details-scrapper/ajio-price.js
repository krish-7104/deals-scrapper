const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');

puppeteer.use(StealthPlugin())

const product = { name: "", discount_price: "", original_price: "", discount: "", image: "", details: "", reviews: "", ratings: "" };

const AjioPriceScrapper = async (req, res) => {
    try {
        const { url } = req.body
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const htmlContent = await page.content();
        const $ = cheerio.load(htmlContent);
        product.name = `${$(".prod-name").text().trim()} - (${$(".brand-name").text().trim()})`;
        product.details = $(".prod-list").text().trim();
        product.reviews = $("._1p6Xx").text().trim();
        product.ratings = $("._30rFV").text().trim();
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
        res.json(product)
    } catch (error) {
        console.log("Ajio Price Scrapper Error: ", error)
        res.send("Ajio Details Scrapper Error")
    }
}
module.exports = AjioPriceScrapper

//review:_1p6Xx
//rating:_30rFV
//details:prod-list
