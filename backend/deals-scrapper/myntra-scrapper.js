const puppeteer = require("puppeteer-extra");
const cheerio = require('cheerio');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const getDealsData = async (url) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const deals = $(".product-base")
    console.log(deals.length)
    const allData = await Promise.all(deals.map(async (index, element) => {
        const product = $(element);
        return {
            title: product.find(".product-product").text().trim() + " (" + product.find(".product-brand").text().trim() + ")",
            image: product.find("source").attr("srcset").replace("\n    ", "").split(" ")[0],
            discount: product.find(".product-discountPercentage").text(),
            discount_price: product.find(".product-discountedPrice").text(),
            original_price: product.find(".product-strike").text(),
            link: "https://www.myntra.com/" + product.find("a").first().attr("href")
        };
    }));
    await browser.close();
    return {
        count: allData.length,
        data: allData
    };
};


module.exports = {
    getDealsData
};
