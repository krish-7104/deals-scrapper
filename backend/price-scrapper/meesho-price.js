const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');
const fs = require("fs")
puppeteer.use(StealthPlugin())

const product = { name: "", discount_price: "", original_price: "", discount: "", image: "" };

const MeeshoPriceScrapper = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const htmlContent = await page.content();
        const $ = cheerio.load(htmlContent);
        const mainElement = $("sc-jfvxQR.Pagestyled__ContainerStyled-sc-ynkej6-0.dkJBbq.eQYgmX")
        product.name = mainElement.find("span").first().text().trim();
        product.discount = parseInt($
            (".sc-eDvSVe.dOqdSt")
            .text())
        product.discount_price = parseInt($
            (".sc-dkrFOg.dAtHep")
            .text())
        product.original_price = parseInt($
            (".sc-dkrFOg.hOnBDg.sc-hLBbgP.eBdysi.ShippingInfo__ParagraphBody2StrikeThroughStyled-sc-frp12n-3.dMCitE.sc-hLBbgP.eBdysi.ShippingInfo__ParagraphBody2StrikeThroughStyled-sc-frp12n-3.dMCitE")
            .text().trim().replace(/[^\d.]/g, ''))
        product.image = $("img").first().attr("src")
        console.log(product)
        return product
    } catch (error) {
        console.log("Meesho Price Scrapper Error: ", error)
        return null
    }
}


MeeshoPriceScrapper("https://www.meesho.com/womens-applique-crepe-anarkali-dresses-frocktopkurtitop/p/2jqeuy")

module.exports = MeeshoPriceScrapper