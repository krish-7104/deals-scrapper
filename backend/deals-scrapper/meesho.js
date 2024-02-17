const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio');
const fs = require("fs");

puppeteer.use(StealthPlugin())

const url = "https://www.meesho.com/";

const getMeeshoDealsScrapper = async () => {
    console.log("\nMeesho Deals Scrap Started")
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    async function autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 50;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight || totalHeight >= 10000) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 300);
            });
        });
    }

    await autoScroll(page);

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const deals = $(".sc-dkrFOg.ProductList__GridCol-sc-8lnc8o-0.cokuZA.eCJiSA").toArray();

    const processedUrls = new Set();
    console.log(deals.length)
    const allData = await Promise.all(deals.map(async (element) => {
        const product = $(element);
        const link = "https://www.meesho.com" + product.find("a").first().attr("href");
        if (processedUrls.has(link)) {
            return null;
        } else {
            processedUrls.add(link);
            return {
                title: product.find(".sc-eDvSVe.gQDOBc.NewProductCardstyled__StyledDesktopProductTitle-sc-6y2tys-5.ejhQZU.NewProductCardstyled__StyledDesktopProductTitle-sc-6y2tys-5.ejhQZU").first().text(),
                discount_price: parseInt(product.find(".sc-eDvSVe.dwCrSh").first().text().replace(/[^\d.]/g, '')),
                original_price: parseInt(product.find(".sc-eDvSVe.drXXNP.sc-jSUZER.eSuFsQ.sc-jSUZER.eSuFsQ").first().text().replace(/[^\d.]/g, '')),
                link: link,
                image: product.find("img").attr("src"),
                discount: parseInt(product.find(".sc-eDvSVe.cBaVUX.NewProductCardstyled__StyledDesktopSubtitle-sc-6y2tys-6.jBXJyw.NewProductCardstyled__StyledDesktopSubtitle-sc-6y2tys-6.jBXJyw").first().text().trim().replace(/[^\d.]/g, '')),
            };
        }
    }));

    const filteredData = allData.filter(item => item !== null);

    fs.writeFileSync("meesho.json", JSON.stringify(filteredData, null, 2));
    fs.appendFileSync("log.txt", `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Meesho Deals Scrapper Run\n`);
    console.log("Meesho Deals Scrap Ended")
    await browser.close();
};


module.exports = getMeeshoDealsScrapper;

