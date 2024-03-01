const { trusted } = require('mongoose');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


const AmazonCoupon = async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            //args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

        await page.setViewport({ width: 1366, height: 768 });

        await page.goto("https://www.amazon.in/amazon-coupons/b?ie=UTF8&node=10465704031", { waitUntil: 'networkidle2' });

        await page.reload({ waitUntil: 'networkidle2' });

        const coupons = await page.evaluate(() => {
            const data = []
            document.querySelectorAll('.a-carousel-card').forEach(product => {
                const title = product.querySelector('.a-size-medium.a-color-success.a-text-bold')?.innerText.trim();
                const description = product.querySelector('.a-size-base.a-color-link')?.innerText.trim();
                const link = 'https://www.amazon.in' + product.querySelector('.a-link-normal.landing-page-link')?.getAttribute('href');
                const image = product.querySelector('.a-dynamic-image.coupon-image')?.getAttribute('src');
                data.push({ title, description, image, link });
            });
            return data;
        });
        res.json({ coupons });
        await browser.close();


    } catch (error) {
        console.log("Amazon Coupon Scrapper Error: ", error)
        res.status(404).json({ error: 'Amazon Coupon Scrapper Error' });
    }
}


module.exports = AmazonCoupon;