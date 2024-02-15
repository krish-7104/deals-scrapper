const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require("fs");

const getAjioDealsScrapper = async (url, scrollTimes) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    async function scrollToLastElement(page, times) {
        for (let i = 0; i < times; i++) {
            await page.evaluate(async () => {
                await new Promise((resolve, reject) => {
                    let lastHeight = document.body.scrollHeight;
                    window.scrollBy(0, lastHeight);
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                });
            });
        }
    }

    await scrollToLastElement(page, scrollTimes);

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const deals = $(".item.rilrtl-products-list__item.item").toArray();

    const processedUrls = new Set();

    const allData = await Promise.all(deals.map(async (element) => {
        const product = $(element);
        const link = "https://www.ajio.com" + product.find(".rilrtl-products-list__link.desktop").first().attr("href");
        await page.waitForSelector(".imgHolder > img", { visible: true });
        if (processedUrls.has(link)) {
            return null
        } else {
            processedUrls.add(link);
            return {
                title: product.find(".nameCls").first().text(),
                discount_price: parseInt(product.find(".price").first().text().replace(/[^\d.]/g, '')),
                original_price: parseInt(product.find(".orginal-price").first().text().replace(/[^\d.]/g, '')),
                link: link,
                image: product.find(".imgHolder > img").attr("src"),
                discount: parseInt(product.find(".discount").first().text().trim().replace(/[^\d.]/g, '')),
            };
        }
    }));

    const filteredData = allData.filter(item => item !== null);

    fs.writeFileSync("ajio.json", JSON.stringify(filteredData, null, 2));
    await browser.close();
};

module.exports = getAjioDealsScrapper

