const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');

puppeteer.use(StealthPlugin())

const AjioCoupon = async (req,res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto("https://www.ajio.com/offers", { waitUntil: 'domcontentloaded' });
        const htmlContent = await page.content();
        const $ = cheerio.load(htmlContent);
        const coupons = await page.evaluate(() => {
            const data = [];
            document.querySelectorAll('.card-container').forEach(product => {
                const title = product.querySelector('.card-container__header')?.innerText.trim();
                const description = product.querySelector(".card-container__body__subtitle")?.innerText.trim();
                const text = product.querySelector('.card-container__body__action__text')?.innerText.trim();
                data.push({ title, description, text });
            });
            return data;
        });
        //console.log({ coupons }); 
        res.json({ coupons })
    } catch (error) {
        console.log("Ajio Coupon Scrapper Error: ", error)
        return res.status(404).json({ error: 'Ajio Coupon Scrapper Error' });
    }
}

module.exports = AjioCoupon;


