const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require("fs");

const getFlipkartDealsScrapper = async () => {
    const categories = JSON.parse(fs.readFileSync("./scrap-data/flipkart-category.json"));

    let allData = [];
    try {
        for (let i = 0; i < 2; i++) {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(categories[i].deal_link);
            const htmlContent = await page.content();
            const $ = cheerio.load(htmlContent);
            const products = $(".s1Q9rs");
            const productsData = await Promise.all(products.map(async (index, element) => {
                const product = $(element).closest('._1AtVbE.col-12-12');
                return {
                    link: `https://www.flipkart.in${product.find("._2rpwqI").attr("href")}`,
                    image: product.find("._396cs4").attr("src"),
                    title: product.find(".s1Q9rs").text().trim(),
                    discount_price: parseInt(product.find("._30jeq3").first().text().replace(/\D+/g, '')) || null,
                    original_price: parseInt(product.find("._3I9_wc").first().text().trim().replace(/\D+/g, '')) || null,
                    discount: parseInt(product.find("._3Ay6Sb").first().text().trim().replace(/\D+/g, '')) || null,
                };
            }));
            allData = allData.concat(productsData);
            await browser.close();
        }
        fs.writeFileSync("flipkart.json", JSON.stringify(allData, null, 2));
    } catch (error) {
        console.error('Error scraping data:', error);
    }
};

getFlipkartDealsScrapper();

module.exports = getFlipkartDealsScrapper;
