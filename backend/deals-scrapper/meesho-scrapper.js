const puppeteer = require("puppeteer-extra");
const cheerio = require('cheerio');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const getDealsData = async (url) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const deals = $(".sc-dkrFOg.ProductList__GridCol-sc-8lnc8o-0.cokuZA.eCJiSA")
    const allData = await Promise.all(deals.map(async (index, element) => {
        const product = $(element);
        return {
            title: product.find(".sc-eDvSVe.gQDOBc.NewProductCardstyled__StyledDesktopProductTitle-sc-6y2tys-5.ejhQZU.NewProductCardstyled__StyledDesktopProductTitle-sc-6y2tys-5.ejhQZU").text().trim(),
            image: product.find("img").attr("src"),
            discount: parseInt(product.find(".sc-eDvSVe.cBaVUX.NewProductCardstyled__StyledDesktopSubtitle-sc-6y2tys-6.jBXJyw.NewProductCardstyled__StyledDesktopSubtitle-sc-6y2tys-6.jBXJyw").text().replace(/[^\d.]/g, '')),
            link: "https://www.meesho.com/" + product.find("a").attr("href"),
            discount_price: parseInt(product.find(".sc-eDvSVe.dwCrSh").first().text().replace(/[^\d.]/g, '')),
            original_price: parseInt(product.find(".sc-eDvSVe.drXXNP.sc-jSUZER.eSuFsQ.sc-jSUZER.eSuFsQ").first().text().replace(/[^\d.]/g, '')),
        };
    }));
    await browser.close();
    return {
        count: allData.length,
        data: allData
    };
};


module.exports = {
    getDealsData
};
