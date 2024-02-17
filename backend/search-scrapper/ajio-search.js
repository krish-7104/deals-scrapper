const puppeteer = require('puppeteer-extra');
const { findMatch } = require("../utils/search-match.js")
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const AjioSearchProduct = async (req, res) => {
    try {
        const search_query = req.query.q;
        if (!search_query) {
            return res.status(400).json({ error: 'No search query provided' });
        }
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(`https://www.ajio.com/search/?text=${search_query}`, { waitUntil: 'networkidle2' });
        async function autoScroll(page) {
            await page.evaluate(async () => {
                await new Promise((resolve, reject) => {
                    var totalHeight = 0;
                    var distance = 60;
                    var timer = setInterval(() => {
                        var scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
                        if (totalHeight >= scrollHeight || totalHeight >= 2000) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100);
                });
            });
        }

        await autoScroll(page);

        const products = await page.evaluate(() => {
            const data = [];
            const titles = [];
            document.querySelectorAll('.item.rilrtl-products-list__item.item').forEach(product => {
                if (product) {
                    const title = product.querySelector('.nameCls')?.innerText.trim() + " (" + product.querySelector('.brand')?.innerText.trim() + ")";
                    const discount_price = product.querySelector('.price')?.innerText.replace(/[^\d.]/g, '');
                    const original_price = product.querySelector('.orginal-price')?.innerText.replace(/[^\d.]/g, '');
                    const discount = product.querySelector('.discount')?.innerText.replace(/[^\d.]/g, '');
                    const link = 'https://www.ajio.com' + product.querySelector('a')?.getAttribute('href');
                    const image = product.querySelector('.rilrtl-lazy-img.rilrtl-lazy-img-loaded')?.getAttribute('src');
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
        console.log("Get Ajio Search Product Error: \n", error)
    }
}


module.exports = AjioSearchProduct