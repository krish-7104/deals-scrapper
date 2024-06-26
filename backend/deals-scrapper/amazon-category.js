const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');
const fs = require("fs");
const AMAZON_SCRAPE_PAGE = 20
const { logStart, logEnd } = require("../utils/logger.js")

puppeteer.use(StealthPlugin())

const getAmazonCategoryScrapper = async () => {
    logStart("Amazon Category Scrapper")
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let allData = [];

    await page.goto('https://www.amazon.in/deals', { waitUntil: 'networkidle2' });

    var results = [];
    var lastPageNumber = AMAZON_SCRAPE_PAGE;

    for (let index = 0; index < lastPageNumber; index++) {
        const htmlContent = await page.content();
        const $ = cheerio.load(htmlContent);
        const categories = $(".DealGridItem-module__dealItemDisplayGrid_e7RQVFWSOrwXBX4i24Tqg.DealGridItem-module__withBorders_2jNNLI6U1oDls7Ten3Dttl.DealGridItem-module__withoutActionButton_2OI8DAanWNRCagYDL2iIqN");
        const currentPageData = await Promise.all(categories.map(async (index, element) => {
            const product = $(element);
            return {
                deal_link: product.find(".a-link-normal.DealLink-module__dealLink_3v4tPYOP4qJj9bdiy0xAT.a-color-base.a-text-normal").attr("href")
            };
        }));

        allData = allData.concat(currentPageData);

        if (index != lastPageNumber - 1) {
            await page.click('.a-last');
            await page.waitForNavigation()
        }
    }
    fs.writeFileSync("amazon-category.json", JSON.stringify(allData, null, 2));
    browser.close();
    logEnd("Amazon Category Scrapper")
    return results;
};

module.exports = getAmazonCategoryScrapper
