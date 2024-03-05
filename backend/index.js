const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const cron = require('node-cron');

const { connectToMongo } = require("./database/db-connect.js")
dotenv.config()

const userRouter = require("./routes/user.route.js");
const couponRouter = require("./routes/coupons.router.js");
const wishlistRouter = require('./routes/wishlist.router.js');
const userSearchRouter = require("./routes/userSearch.router.js");
const dealScrapperRouter = require("./routes/dealscrapper.router.js");
const showDealsRouter = require("./routes/showdeals.router.js");
const searchProductRouter = require("./routes/search-product.router.js")
const logRouter = require("./routes/logs.router.js")
const getAmazonCategoryScrapper = require("./deals-scrapper/amazon-category.js");
const getAmazonDealsScrapper = require("./deals-scrapper/amazon-deals.js");
const getMyntraDealsScrapper = require("./deals-scrapper/myntra.js");
const getFlipkartCategoryScrapper = require("./deals-scrapper/flipkart-category.js");
const getFlipkartDealsScrapper = require("./deals-scrapper/flipkart-deals.js");
const getAjioDealsScrapper = require("./deals-scrapper/ajio.js");
const getMeeshoDealsScrapper = require("./deals-scrapper/meesho.js");
const convertDataToCSV = require("./utils/json-to-csv.js");
const PriceController = require("./controllers/price.controller.js")
const productDetailsRouter = require("./routes/product-details");
const  axios  = require("axios");
const app = express()
connectToMongo()

app.use(express.json())
app.use(cors({
    origin: "*"
}))

if (process.env.NODE_ENV === 'DEVELOPMENT') {
    app.use(morgan(':method :url :status :response-time ms'));
}

app.get("/", (req, res) => {
    res.send("Hi I Am Live 🚀")
})

app.use("/api/v1/user", userRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/scrapper", dealScrapperRouter)
app.use("/api/v1/show", showDealsRouter)
app.use("/api/v1/search", searchProductRouter)
app.use("/api/v1/userSearch", userSearchRouter)
app.use("/api/v1/details", productDetailsRouter)

app.get('/convert', convertDataToCSV);

app.get('/autocomplete', async (req, res) => {
    const { q } = req.query;
    try {
      const response = await axios.get(`https://serpapi.com/search`, {
        params: {
          api_key: '915d6211d0947704d35555080bd897a861fd5ee9d8a67a76e3178d88ae2b6f1b',
          engine: 'google_autocomplete',
          q,
          gl: 'in',
          hl: 'en',
          client: 'chrome',
          output: 'json',
          source: 'nodejs,serpapi@2.0.0',
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.use("", logRouter)
// get all logs: http://localhost:4000/log


cron.schedule('34 18 * * *', async () => {
    console.log('Price Tracker Started');
    await PriceController.comparePricesDaily();
});


const cronHour = 11
const cronMinute = 46

cron.schedule(`${cronMinute} ${cronHour} * * *`, () => {
    getAmazonCategoryScrapper()
});

cron.schedule(`48 ${cronHour} * * *`, () => {
    getAmazonDealsScrapper()
});

cron.schedule(`52 ${cronHour} * * *`, () => {
    getFlipkartCategoryScrapper()
});

cron.schedule(`55 ${cronHour} * * *`, () => {
    getFlipkartDealsScrapper()
});

cron.schedule(`57 ${cronHour} * * *`, () => {
    getMyntraDealsScrapper()
});

cron.schedule(`2 12 * * *`, () => {
    getAjioDealsScrapper()
});

cron.schedule(`5 12 * * *`, () => {
    getMeeshoDealsScrapper()
});

cron.schedule(`7 12 * * *`, () => {
    convertDataToCSV()
});


app.listen(4000, () => {
    console.log("Server is listening on port 4000")
})

