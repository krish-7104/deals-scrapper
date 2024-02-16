const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');
const fs = require("fs");
const { AMAZON_SCRAPE_PAGE } = require('../utils/constants');

puppeteer.use(StealthPlugin())


const getAmazonCategoryScrapper = async () => {
    console.log("\nAmazon Category Scrap Started")
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
                title: product.find(".DealContent-module__truncate_sWbxETx42ZPStTc9jwySW").text().trim(),
                image: product.find(".DealImage-module__imageObjectFit_1G4pEkUEzo9WEnA3Wl0XFv").attr("src"),
                discount: product.find(".BadgeAutomatedLabel-module__badgeAutomatedLabel_2Teem9LTaUlj6gBh5R45wd").first().text().trim(),
                deal_link: product.find(".a-link-normal.DealLink-module__dealLink_3v4tPYOP4qJj9bdiy0xAT.a-color-base.a-text-normal").attr("href")
            };
        }));

        allData = allData.concat(currentPageData);

        if (index != lastPageNumber - 1) {
            await page.click('.a-last a');
            await page.waitForNavigation()
        }
    }
    fs.writeFileSync("amazon-category.json", JSON.stringify(allData, null, 2));
    fs.appendFileSync("log.txt", `Amazon Category Scrapper Run at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`);
    console.log("Amazon Category Scrap Ended")
    browser.close();
    return results;
};


module.exports = getAmazonCategoryScrapper
