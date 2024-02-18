const puppeteer = require('puppeteer');
const { findMatch } = require("../utils/search-match.js")

const FlipkartSearchProduct = async (req, res) => {
    try {
        const search_query = req.query.q;
        if (!search_query) {
            return res.status(400).json({ error: 'No search query provided' });
        }
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(`https://www.flipkart.com/search?q=${search_query}`, { waitUntil: 'domcontentloaded' });

        const products = await page.evaluate(() => {
            const data = [];
            const titles = [];

            document.querySelectorAll('._1AtVbE.col-12-12').forEach(product => {
                if (product) {
                    const title = product.querySelector('._4rR01T')?.innerText.trim();
                    const discount_price = parseInt(product.querySelector('._30jeq3._1_WHN1')?.innerText.trim().replace(/[^\d.]/g, ''));
                    const original_price = parseInt(product.querySelector('._3I9_wc._27UcVY')?.innerText.trim().replace(/[^\d.]/g, ''));
                    const discount = parseInt(product.querySelector('._3Ay6Sb')?.innerText.trim().replace(/[^\d.]/g, ''));
                    const link = 'https://www.flipkart.com' + product.querySelector('._1fQZEK')?.getAttribute('href');
                    const image = product.querySelector('._396cs4')?.getAttribute('src');

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
                return res.json({
                    best: products.data[product_index],
                    data: products.data
                });
            }
        }
        return res.status(404).json({ error: 'No matching product found' });
    } catch (error) {
        console.log("Get Flipkart Search Product Error: ", error)
    }
}

module.exports = FlipkartSearchProduct