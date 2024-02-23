const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');
const fs = require("fs");
const { logStart, logEnd } = require('../utils/logger');
puppeteer.use(StealthPlugin())

const url = "https://www.ajio.com/s/offer-deals-03022021?query=%3Adiscount-desc&curated=true&curatedid=offer-deals-03022021&gridColumns=5&segmentIds=";

const getAjioDealsScrapper = async () => {
    logStart("AJIO Deals Scrapper")
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    async function autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight || totalHeight >= 20000) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }

    await autoScroll(page);

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const deals = $(".item.rilrtl-products-list__item.item").toArray();

    const processedUrls = new Set();

    const allData = await Promise.all(deals.map(async (element) => {
        const product = $(element);
        const link = "https://www.ajio.com" + product.find(".rilrtl-products-list__link.desktop").first().attr("href");
        const title = product.find(".nameCls").first().text()
        const discount_price = parseInt(product.find(".price").first().text().replace(/[^\d.]/g, ''))
        const original_price = parseInt(product.find(".orginal-price").first().text().replace(/[^\d.]/g, ''))
        const image = product.find(".imgHolder img").attr("src")
        const discount = parseInt(product.find(".discount").first().text().trim().replace(/[^\d.]/g, ''))
        const reviews = parseFloat(product.find("._1N0OO").first().text())
        if (image) {
            if (processedUrls.has(link)) {
                return null;
            } else {
                processedUrls.add(link);
                return {
                    link,
                    image,
                    title,
                    discount_price,
                    original_price,
                    discount, reviews
                };
            }
        }
        return null;

    }));
    const filteredData = allData.filter(item => item !== null);
    fs.writeFileSync("ajio.json", JSON.stringify(filteredData, null, 2));
    logEnd("AJIO Deals Scrapper")
    await browser.close();
};


module.exports = getAjioDealsScrapper;

