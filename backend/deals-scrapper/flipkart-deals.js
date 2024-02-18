const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const fs = require("fs");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { logStart, logEnd } = require("../utils/logger.js")

puppeteer.use(StealthPlugin())

const getFlipkartDealsScrapper = async () => {
    logStart("Flipkart Deals Scrapper")

    try {
        const categories = JSON.parse(fs.readFileSync("flipkart-category.json"));

        let allData = [];
        for (let i = 0; i < categories.length; i++) {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(categories[i]?.deal_link);
            const htmlContent = await page.content();
            const $ = cheerio.load(htmlContent);
            const products = $(".s1Q9rs");
            const processedUrls = new Set();
            const productsData = await Promise.all(products.map(async (index, element) => {
                const product = $(element).closest('._1AtVbE.col-12-12');
                const link = `https://www.flipkart.com${product.find(".s1Q9rs").attr("href")}`;
                const image = product.find("._396cs4").attr("src");
                const title = product.find(".s1Q9rs").text().trim();
                const discountPrice = parseInt(product.find("._30jeq3").first().text().replace(/\D+/g, '')) || null;
                const originalPrice = parseInt(product.find("._3I9_wc").first().text().trim().replace(/\D+/g, '')) || null;
                const discount = parseInt(product.find("._3Ay6Sb").first().text().trim().replace(/\D+/g, '')) || null;
                if (link && image && title && discountPrice && originalPrice && discount) {
                    if (processedUrls.has(link)) {
                        return null;
                    } else {
                        processedUrls.add(link);
                        return {
                            link,
                            image,
                            title,
                            discount_price: discountPrice,
                            original_price: originalPrice,
                            discount
                        };
                    }
                }
                return null;
            }));
            allData = allData.concat(productsData.filter(item => item !== null));
            await browser.close();
        }
        fs.writeFileSync("flipkart.json", JSON.stringify(allData, null, 2));
        logEnd("Flipkart Deals Scrapper")
    } catch (error) {
        console.error('Error scraping data:', error);
    }
};


module.exports = getFlipkartDealsScrapper;
