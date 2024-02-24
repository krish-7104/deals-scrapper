const puppeteer = require('puppeteer-extra');
const { findMatch } = require("../utils/search-match.js");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const AmazonSearchProduct = async (req, res) => {
    try {
        const search_query = req.query.q;
        if (!search_query) {
            return res.status(400).json({ error: 'No search query provided' });
        }

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36');

        await page.setViewport({ width: 1366, height: 768 });

        await page.goto(`https://www.amazon.in/s?k=${search_query}`, { waitUntil: 'domcontentloaded' });

        // await autoScroll(page);

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
            // const product_index = findMatch(search_query, products.titles);
            // if (product_index !== null) {
            //     const bestMatch = products.data[product_index];
            //     const otherProducts = products.data.filter((_, index) => index !== product_index);
            //     return res.json({
            //         best: bestMatch,
            //         data: otherProducts
            //     });
            // }
            const otherProducts = products.data.splice(1)
            return res.json({
                best: products.data[0],
                data: otherProducts
            });
        }
        return res.status(404).json({ error: 'No matching product found' });
    } catch (error) {
        console.log("Get Amazon Search Product Error: ", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = AmazonSearchProduct;

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
