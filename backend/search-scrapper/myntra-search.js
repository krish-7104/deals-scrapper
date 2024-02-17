const puppeteer = require('puppeteer-extra');
const { findMatch } = require("../utils/search-match.js")
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const MyntraSearchProduct = async (req, res) => {
    try {
        const search_query = req.query.q;
        if (!search_query) {
            return res.status(400).json({ error: 'No search query provided' });
        }
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const searchQuery = search_query.replaceAll(" ", "-")
        await page.goto(`https://www.myntra.com/${searchQuery}`, { waitUntil: 'domcontentloaded' });
        const products = await page.evaluate(() => {
            const data = [];
            const titles = [];
            document.querySelectorAll('.product-base').forEach(product => {
                if (product) {
                    const title = product.querySelector('.product-product')?.innerText.trim();
                    const discount_price = product.querySelector('.product-discountedPrice')?.innerText.replace("Rs. ", "").replace(/[^\d.]/g, '');
                    const original_price = product.querySelector('.product-strike')?.innerText.replace("Rs. ", "").replace(/[^\d.]/g, '');
                    const discount = product.querySelector('.product-discountPercentage')?.innerText.replace("Rs. ", "").replace(/[^\d.]/g, '');
                    const link = 'https://www.myntra.com' + product.querySelector('a')?.getAttribute('href');
                    const image = product.querySelector('img')?.getAttribute('src');
                    data.push({
                        title, discount_price: parseInt(discount_price), original_price: parseInt(original_price), discount: parseInt(discount), link, image
                    });
                    titles.push(title)
                }
            });
            return { data, titles };
        });

        await browser.close();
        if (products.data.length > 0) {
            const product_index = findMatch(search_query, products.titles);
            if (product_index !== null) {
                return res.json({
                    best: products.data[product_index],
                    data: products.data
                });
            }
        }
        return res.status(404).json({ error: 'No matching product found' });
    } catch (error) {
        console.log("Get Myntra Search Product Error: \n", error)
    }
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

module.exports = MyntraSearchProduct