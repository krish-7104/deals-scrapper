const axios = require("axios");
const cheerio = require("cheerio");

const product = { name: "", discount_price: "", real_price: "", discount: "", image: "" };

const amazonPriceScrape = async (url) => {
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
}

const url = "https://www.amazon.in/dp/B0CGDQ9SN7/ref=QAHzEditorial_en_IN_1?pf_rd_r=X5D0G9WEKC481THKQPE8&pf_rd_p=75972c4a-6112-4d68-810f-a15dfa3c4338&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_s=merchandised-search-6&pf_rd_t=&pf_rd_i=1389401031";


amazonPriceScrape(url)
