const axios = require("axios")
const cheerio = require('cheerio');

const product = { name: "", discount_price: "", original_price: "", discount: "", image: "", ratings: "", reviews: "", details: "" };

//url = "https://www.amazon.in/Fire-Boltt-Bluetooth-Calling-Assistance-Resolution/dp/B0BF54LXW6?ref_=Oct_DLandingS_D_0d008782_1&th=1";

const amazonPriceScrape = async (req, res) => {
    try {
        const { url } = req.body;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const item = $("div#dp-container");
        product.name = $(item).find("h1 span#productTitle").text().trim();
        product.discount = parseInt($(item)
            .find("span.a-size-large.a-color-price.savingPriceOverride.aok-align-center.reinventPriceSavingsPercentageMargin.savingsPercentage")
            .first()
            .text().replace(/[^\d.]/g, ''))
        product.discount_price = parseInt($(item)
            .find(".a-price-whole")
            .first()
            .text().replace(".", "").replace(/[^\d.]/g, ''))
        product.original_price = parseInt($(item)
            .find(".a-size-small.aok-offscreen")
            .first()
            .text().trim().replace("M.R.P.: ").replace(/[^\d.]/g, ''))
        product.image = $(item)
            .find("img#landingImage")
            .attr("src")
        product.ratings = parseInt($(item).find("#acrCustomerReviewText")
            .first()
            .text()
            .trim().replace(/[^\d.]/g, ''))
        product.reviews = parseFloat($(item).find(".reviewCountTextLinkedHistogram.noUnderline > span")
            .first()
            .text().split("    ")[1].replace(/[^\d.]/g, ''))
        product.details = $(item).find(".a-unordered-list.a-vertical.a-spacing-small").text().trim()
        res.json(product)
    } catch (error) {
        console.log("Amazon Price Scrapper Error: ", error)
        return null
    }
}
//amazonPriceScrape();
module.exports = amazonPriceScrape;