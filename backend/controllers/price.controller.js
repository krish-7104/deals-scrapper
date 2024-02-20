const priceUser = require('../models/price.model.js');
const { priceMail } = require('../utils/price-mail');
const cron = require('node-cron');
const amazonPriceScrape = require('../price-scrapper/amazon-price');
const flipkartPriceScraper = require('../price-scrapper/flipkart-price');

cron.schedule('0 9 * * *', async () => {
  console.log('Running price comparison task at 9 a.m.');
  await comparePricesDaily();
});

exports.priceToCompare = async (req, res) => {
  const { userPrice, productUrl, userEmail } = req.body;
  try {
    await saveUserData(userPrice, productUrl, userEmail);
    res.send('Price comparison initiated. You will receive an email notification if the price is lower than the user-entered price.');
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).send('Error saving user data.');
  }
};

async function saveUserData(userPrice, productUrl, userEmail) {
  try {
    await priceUser.create({ price: userPrice, productUrl, email: userEmail });
  } catch (error) {
    console.error('Error saving user data to database:', error);
    throw error;
  }
}

async function comparePricesDaily() {
  try {
    const allUserData = await priceUser.find();

    for (const userData of allUserData) {
      const { price: userPrice, productUrl, email: userEmail } = userData;

      if (productUrl.includes('amazon')) {
        const amazonPrice = await amazonPriceScrape(productUrl);
        if (amazonPrice < userPrice) {
          await priceMail(userEmail, productUrl);
        }
      } else if (productUrl.includes('flipkart')) {
        const flipkartPrice = await flipkartPriceScraper(productUrl);
        if (flipkartPrice < userPrice) {
          await priceMail(userEmail, productUrl);
        }
      }
    }
  } catch (error) {
    console.error('Error comparing prices:', error);
  }
}

