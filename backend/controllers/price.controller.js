const priceUser = require('../models/price.model.js');
const { priceMail } = require('../utils/price-mail');
const cron = require('node-cron');
const amazonPriceScrape = require('../price-scrapper/amazon-price');
const flipkartPriceScraper = require('../price-scrapper/flipkart-price');

// cron.schedule('0 9 * * *', async () => {
//   console.log('Running price comparison task at 9 a.m.');
//   await comparePricesDaily();
// });

exports.priceToCompare = async (req, res) => {
  const { price, productUrl, email } = req.body;
  try {
    await saveUserData(price, productUrl, email);
    return res.status(200).json({ message: 'Price Tracker Activated' });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).send('Error saving user data.');
  }
};

exports.userTracker = async (req, res) => {
  const userEmail = req.params.email;
  try {
    const userTrackers = await priceUser.find({ email: userEmail }).sort({ createdAt: -1 });
    return res.status(200).json({ message: 'Price Trackers Found', userTrackers });
  } catch (error) {
    console.error('Error retrieving product trackers:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteTracker = async (req, res) => {
  const id = req.params.id;
  try {
    await priceUser.findOneAndDelete(id)
    return res.status(200).json({ message: 'Price Trackers Deleted' });
  } catch (error) {
    console.error('Error deleting tracker:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function saveUserData(price, productUrl, email) {
  try {
    await priceUser.create({ price, productUrl, email });
  } catch (error) {
    console.error('Error saving user data to database:', error);
    throw error;
  }
}

async function comparePricesDaily() {
  try {
    const allUserData = await priceUser.find();

    for (const userData of allUserData) {
      const { price, productUrl, email } = userData;

      if (productUrl.includes('amazon')) {
        const amazonPrice = await amazonPriceScrape(productUrl);
        if (amazonPrice < price) {
          await priceMail(email, productUrl);
        }
      } else if (productUrl.includes('flipkart')) {
        const flipkartPrice = await flipkartPriceScraper(productUrl);
        if (flipkartPrice < price) {
          await priceMail(email, productUrl);
        }
      }
    }
  } catch (error) {
    console.error('Error comparing prices:', error);
  }
}

