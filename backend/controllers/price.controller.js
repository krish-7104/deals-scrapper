const User = require('../models/user.model.js');
const {priceMail} =require('../utils/price-mail');
const cron = require('node-cron');
const {amazonPriceScrape}=require('../price-scrapper/amazon-price');
const {flipkartPriceScraper}=require('../price-scrapper/flipkart-price');

// Schedule price comparison task to run daily at 9 a.m.
cron.schedule('0 9 * * *', async () => {
  console.log('Running price comparison task at 9 a.m.');
  await comparePricesDaily();
});

// Route to receive user-entered price and trigger price comparison
exports.priceToCompare=( async (req, res) => {
    const { userPrice, productUrl, userEmail } = req.body; // User-entered price, product URL, and user email
    await compareAndNotify(userPrice, productUrl, userEmail);
    res.send('Price comparison initiated. You will receive an email notification if the price is lower than the user-entered price.');
});

// Function to compare prices daily
async function comparePricesDaily() {
    try {
      const userData = await fetchUserData(); // This function fetches user-entered price, product URL, and user email from your database
  
      // Extract user-entered price, product URL, and user email from userData
      const { userPrice, productUrl, userEmail } = userData;
  
      // Call compareAndNotify function with fetched values
      await compareAndNotify(userPrice, productUrl, userEmail);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
}

// Function to fetch user data from the database
async function fetchUserData(userId) {
    try {
      const userData = await User.findById(userId); 
  
      // Extract relevant information from userData
      const userPrice = userData.price;
      const productUrl = userData.productUrl;
      const userEmail = userData.email;
  
      // Return an object containing the fetched user data
      return { userPrice, productUrl, userEmail };
    } catch (error) {
      // Handle any errors that occur during data retrieval
      console.error('Error fetching user data:', error);
      throw error; 
    }
}
  
async function compareAndNotify(userPrice, productUrl, userEmail) {
    try {
      const amazonPrice = await amazonPriceScrape(productUrl);
      const flipkartPrice = await flipkartPriceScraper(productUrl);
      if (amazonPrice < userPrice || flipkartPrice < userPrice) {
        await priceMail(userEmail, productUrl);
      }
    } catch (error) {
      console.error('Error in price comparison:', error);
    }
}

 