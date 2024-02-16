const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const fs = require("fs");
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())

const getFlipkartCategoryScrapper = async () => {
    const browser = await puppeteer.launch({ headless: true });
    console.log("\nFlipkart Category Scrap Started")
    const page = await browser.newPage();
    let allData = [];
    await page.goto('https://www.flipkart.com/', { waitUntil: 'networkidle2' });
    const processedUrls = new Set();
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const categories = $(".css-1dbjc4n");
    const currentPageData = await Promise.all(categories.map(async (index, element) => {
        const product = $(element);
        const link = "https://www.flipkart.com" + product.find("._3n8fnaug._3n8fnars._3n8fnak6._3n8fna4y._3n8fnack._1i2djtb9._1i2djtf").first().attr("href")
        if (processedUrls.has(link)) {
            return null;
        } else {
            processedUrls.add(link);
            const title = product.find("._58bkzq62._3n8fnaug._3n8fnamv._3n8fnaf9._3n8fna1._3n8fna7n._58bkzq2._1i2djtb9._1i2djt0").first().text().trim();
            const discount = product.find("._58bkzq62._3n8fnaug._3n8fnamv._3n8fnaf9._3n8fna1._3n8fna7n._58bkzqd._1i2djtb9._1i2djt0._1i2djt4i._1i2djt90._1i2djt70").first().text().trim();
            if (!title || !link || !discount) {
                return null;
            }
            return {
                title,
                discount,
                deal_link: link
            };
        }
    }));
    allData = currentPageData.filter((data) => data !== null)
    fs.writeFileSync("flipkart-category.json", JSON.stringify(allData, null, 2));
    fs.appendFileSync("log.txt", `Flipkart Category Scrapper Run at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`);
    console.log("Amazon Category Scrap Ended")
    browser.close();
    return allData;
};


module.exports = getFlipkartCategoryScrapper;
