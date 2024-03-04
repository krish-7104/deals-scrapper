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
            const products = $('._1AtVbE.col-12-12');
            const processedUrls = new Set();

            products.each((index, element) => {
                const product = $(element);
                const childrens = product.find('._13oc-S > *');
                if (childrens.length === 1) {
                    const title = product.find('._4rR01T').text().trim();
                    const discount_price = parseInt(product.find('._30jeq3._1_WHN1').text().trim().replace(/[^\d.]/g, ''));
                    const original_price = parseInt(product.find('._3I9_wc._27UcVY').text().trim().replace(/[^\d.]/g, ''));
                    const discount = parseInt(product.find('._3Ay6Sb').text().trim().replace(/[^\d.]/g, ''));
                    const link = 'https://www.flipkart.com' + product.find('._1fQZEK').attr('href');
                    const image = product.find('._396cs4').attr('src');
                    //const reviews = parseFloat(product.find('._3LWZlK').text().slice(0, 4))

                    if (title && discount_price && original_price && discount && link && image) {
                        if (processedUrls.has(link)) {
                            return;
                        } else {
                            processedUrls.add(link);
                            allData.push({ title, discount_price, original_price, discount, link, image});
                        }
                    }
                } else if (childrens.length === 4) {
                    childrens.each((childIndex, childElement) => {
                        const child = $(childElement);
                        const title = child.find('.IRpwTa').text().trim();
                        const discount_price = parseInt(child.find('._30jeq3').text().trim().replace(/[^\d.]/g, ''));
                        const original_price = parseInt(child.find('._3I9_wc').text().trim().replace(/[^\d.]/g, ''));
                        const discount = parseInt(child.find('._3Ay6Sb').text().trim().replace(/[^\d.]/g, ''));
                        const link = 'https://www.flipkart.com' + child.find('._2UzuFa').attr('href');
                        const image = child.find('._2r_T1I').attr('src');
                        //const reviews = parseFloat(product.find('._3LWZlK').text().slice(0, 4))

                        if (title && discount_price && original_price && discount && link && image) {
                            if (processedUrls.has(link)) {
                                return;
                            } else {
                                processedUrls.add(link);
                                allData.push({ title, discount_price, original_price, discount, link, image });
                            }
                        }
                    });
                }
            });
            await browser.close();
        }
        fs.writeFileSync("flipkart.json", JSON.stringify(allData, null, 2));
        logEnd("Flipkart Deals Scrapper")
    } catch (error) {
        console.error('Error scraping data:', error);
    }
};


module.exports = getFlipkartDealsScrapper;
