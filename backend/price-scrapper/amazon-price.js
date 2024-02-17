const axios = require("axios")
const cheerio = require('cheerio');

const product = { name: "", discount_price: "", real_price: "", discount: "", image: "" };

const amazonPriceScrape = async (url) => {
    try {
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
        product.real_price = parseInt($(item)
            .find(".a-size-small.aok-offscreen")
            .first()
            .text().trim().replace("M.R.P.: ").replace(/[^\d.]/g, ''))
        product.image = $(item)
            .find("img#landingImage")
            .attr("src")
        return product
        
    } catch (error) {
        console.log("Amazon Price Scrapper Error: \n", error)
        return null
    }
}

module.exports = amazonPriceScrape;