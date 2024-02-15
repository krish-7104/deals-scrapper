const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require("fs");

const url = "https://www.ajio.com/s/offer-deals-03022021?query=%3Adiscount-desc&curated=true&curatedid=offer-deals-03022021&gridColumns=5&segmentIds=";

const getAjioDealsScrapper = async (scrollIterations) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    async function scrollToLastElement(page) {
        previousHeight = await page.evaluate("document.body.scrollHeight");
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
        await page.waitForFunction(
            `document.body.scrollHeight > ${previousHeight}`
        );
    }

    for (let i = 0; i < scrollIterations; i++) {
        await scrollToLastElement(page);
    }

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const deals = $(".item.rilrtl-products-list__item.item").toArray();

    const processedUrls = new Set();

    const allData = await Promise.all(deals.map(async (element) => {
        const product = $(element);
        const link = "https://www.ajio.com" + product.find(".rilrtl-products-list__link.desktop").first().attr("href");
        if (processedUrls.has(link)) {
            return null;
        } else {
            processedUrls.add(link);
            return {
                title: product.find(".nameCls").first().text(),
                discount_price: parseInt(product.find(".price").first().text().replace(/[^\d.]/g, '')),
                original_price: parseInt(product.find(".orginal-price").first().text().replace(/[^\d.]/g, '')),
                link: link,
                image: product.find(".imgHolder img").attr("src"),
                discount: parseInt(product.find(".discount").first().text().trim().replace(/[^\d.]/g, '')),
            };
        }
    }));

    const filteredData = allData.filter(item => item !== null);

    fs.writeFileSync("./scrap-data/ajio.json", JSON.stringify(filteredData, null, 2));
    await browser.close();
};

getAjioDealsScrapper(4);

module.exports = getAjioDealsScrapper;


// rilrtl-lazy-img  