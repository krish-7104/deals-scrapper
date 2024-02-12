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
    const deals = $(".DealGridItem-module__dealItemDisplayGrid_e7RQVFWSOrwXBX4i24Tqg.DealGridItem-module__withBorders_2jNNLI6U1oDls7Ten3Dttl.DealGridItem-module__withoutActionButton_2OI8DAanWNRCagYDL2iIqN")
    const allData = await Promise.all(deals.map(async (index, element) => {
        const product = $(element);
        return {
            title: product.find(".DealContent-module__truncate_sWbxETx42ZPStTc9jwySW").text().trim(),
            image: product.find(".DealImage-module__imageObjectFit_1G4pEkUEzo9WEnA3Wl0XFv").attr("src"),
            discount: product.find(".BadgeAutomatedLabel-module__badgeAutomatedLabel_2Teem9LTaUlj6gBh5R45wd").first().text().trim(),
            deal_link: product.find(".a-link-normal.DealLink-module__dealLink_3v4tPYOP4qJj9bdiy0xAT.a-color-base.a-text-normal").attr("href")
        };
    }));
    await browser.close();
    return {
        count: allData.length,
        data: allData
    };
};

const particularDealProducts = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const htmlContent = await page.content();
        const $ = cheerio.load(htmlContent);
        const products = $(".a-unordered-list.a-nostyle.a-horizontal.a-spacing-none li");
        const productsData = await Promise.all(products.map(async (index, element) => {
            const product = $(element);
            return {
                link: `https://www.amazon.in${product.find(".a-link-normal").attr("href")}`,
                image: product.find(".octopus-dlp-asin-image").attr("src"),
                title: product.find(".a-size-base.a-color-base.a-text-normal").text().trim(),
                discount_price: parseInt(product
                    .find(".a-price-whole")
                    .first()
                    .text().replace(".", "").replace(/[^\d.]/g, '')),
                original_price: parseInt(product
                    .find(".a-size-mini.a-color-tertiary.octopus-widget-strike-through-price.a-text-strike")
                    .first()
                    .text().trim().replace(/[^\d.]/g, '')),
                discount: parseInt(product.find(".a-size-medium.a-color-price.octopus-widget-saving-percentage").text().replace(/[^\d.]/g, '')),
            };
        }));
        await browser.close();
        return {
            count: productsData.length,
            data: productsData
        };
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getDealsData,
    particularDealProducts
};
