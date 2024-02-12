const puppeteer = require('puppeteer');
const { findMatch } = require("../utils/search-match.js")

const getSearchProductHandler = async (req, res) => {
    try {
        const search_query = req.query.q;
        if (!search_query) {
            return res.status(400).json({ error: 'No search query provided' });
        }
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(`https://www.amazon.in/s?k=${search_query}`, { waitUntil: 'domcontentloaded' });

        const products = await page.evaluate(() => {
            const data = [];
            const titles = [];

            document.querySelectorAll('.puis-card-container').forEach(product => {
                if (product) {
                    const title = product.querySelector('.a-size-medium')?.innerText.trim();
                    const discount_price = parseInt(product.querySelector('.a-price-whole')?.innerText.trim().replace(/[^\d.]/g, ''));
                    const original_price = parseInt(product.querySelector('.a-price.a-text-price')?.firstChild?.innerText.trim().replace(/[^\d.]/g, ''));
                    const link = 'https://www.amazon.in' + product.querySelector('.a-link-normal')?.getAttribute('href');
                    const image = product.querySelector('.s-image')?.getAttribute('src');
                    const discount = Math.round(((original_price - discount_price) / original_price) * 100);
                    if (title && discount_price && original_price && discount && link && image) {
                        data.push({ title, discount_price: parseInt(discount_price), original_price: parseInt(original_price), discount: parseInt(discount), link, image });
                        titles.push(title);
                    }
                }
            });

            return { data, titles };
        });

        await browser.close();
        if (products.data.length > 0) {
            const product_index = findMatch(search_query, products.titles);
            if (product_index !== null) {
                return res.json(products.data[product_index]);
            }
        }
        return res.status(404).json({ error: 'No matching product found' });
    } catch (error) {
        console.log("Get Amazon Search Product Error: \n", error)
    }
}

module.exports = getSearchProductHandler