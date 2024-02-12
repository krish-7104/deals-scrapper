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
    const allData = await Promise.all(deals.map(async (index, element) => {
        const product = $(element);
        return {
            title: product.find(".product-product").text().trim() + " (" + product.find(".product-brand").text().trim() + ")",
            image: product.find("source").attr("srcset").replace("\n    ", "").split(" ")[0],
            original_price: parseInt(product.find(".product-price span:nth-child(1)")?.text().replace("Rs. ", "").replace(/[^\d.]/g, '')),
            discount_price: parseInt(product.find(".product-price span:nth-child(2)")?.first().text().replace("Rs. ", "").replace(/[^\d.]/g, '')),
            discount: parseInt(product.find(".product-price span:nth-child(2)")?.last()?.text().replace(/[^\d.]/g, '')),
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
