const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');

puppeteer.use(StealthPlugin())


const AjioCoupon = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const htmlContent = await page.content();
        const $ = cheerio.load(htmlContent);
        const coupons = await page.evaluate(() => {
            document.querySelectorAll('.a-carousel-card').forEach(product => {
                const title = product.querySelector('.a-size-medium a-color-success a-text-bold')?.innerText.trim();
                const description = parseInt(product.querySelector('.a-price-whole')?.innerText.trim().replace(/[^\d.]/g, ''));
                const text = product.querySelector('.a-link-normal')?.getAttribute('href');
                data.push({ title, description, image, link });
            });
            return data;
        });
        res.json({ coupons })
    } catch (error) {
        console.log("Amazon Coupon Scrapper Error: ", error)
        return res.status(404).json({ error: 'Amazon Coupon Scrapper Error' });
    }
}


module.exports = AjioCoupon