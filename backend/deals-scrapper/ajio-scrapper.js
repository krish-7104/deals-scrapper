const puppeteer = require("puppeteer-extra");
const cheerio = require('cheerio');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const getAllCouponOffers = async (url) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const deals = $(".card-container")
    const allData = await Promise.all(deals.map(async (index, element) => {
        const product = $(element);
        return {
            title: product.find(".card-container__header > span").text(),
            description: product.find(".card-container__body__subtitle").text(),
            coupon: product.find(".card-container__body__action__text").text(),
        };
    }));
    await browser.close();
    return {
        count: allData.length,
        data: allData
    };
};

const getAllDeals = async (url) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const deals = $(".item.rilrtl-products-list__item.item")
    const allData = await Promise.all(deals.map(async (index, element) => {
        const product = $(element);
        return {
            title: product.find(".nameCls").first().text(),
            discount_price: parseInt(product.find(".price  ").first().text().replace(/[^\d.]/g, '')),
            original_price: parseInt(product.find(".orginal-price").first().text().replace(/[^\d.]/g, '')),
            link: "https://www.ajio.com" + product.find(".rilrtl-products-list__link.desktop").first().attr("href"),
            image: product.find(".rilrtl-lazy-img.rilrtl-lazy-img-loaded").first().attr("src"),
            discount: parseInt(product.find(".discount").first().text().trim().replace(/[^\d.]/g, '')),
        };
    }));
    await browser.close();
    return {
        count: allData.length,
        data: allData
    };
}


module.exports = {
    getAllCouponOffers, getAllDeals
};

