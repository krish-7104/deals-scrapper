const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const cron = require('node-cron');

const { connectToMongo } = require("./database/db-connect.js")
dotenv.config()

const userRouter = require("./routes/user.route.js");
const dealScrapperRouter = require("./routes/dealscrapper.router.js");
const showDealsRouter = require("./routes/showdeals.router.js");
const searchProductRouter = require("./routes/search-product.router.js")
const getAmazonCategoryScrapper = require("./deals-scrapper/amazon-category.js");
const getAmazonDealsScrapper = require("./deals-scrapper/amazon-deals.js");
const getMyntraDealsScrapper = require("./deals-scrapper/myntra.js");
const getFlipkartCategoryScrapper = require("./deals-scrapper/flipkart-category.js");
const getFlipkartDealsScrapper = require("./deals-scrapper/flipkart-deals.js");

const app = express()
connectToMongo()

app.use(express.json())
app.use(cors({
    origin: "*"
}))

if (process.env.NODE_ENV === 'DEVELOPMENT') {
    app.use(morgan(':method :url :status :response-time ms'));
}

app.use("/api/v1/user", userRouter);
app.use("/api/v1/scrapper", dealScrapperRouter)
app.use("/api/v1/show", showDealsRouter)
app.use("/api/v1/search", searchProductRouter)

cron.schedule('0 7 * * *', () => { //7:00 am
    getAmazonCategoryScrapper()
});

cron.schedule('3 7 * * *', () => { //7:03 am
    getAmazonDealsScrapper()
});

cron.schedule('6 7 * * *', () => { //7:06 am
    getFlipkartCategoryScrapper()
});

cron.schedule('9 7 * * *', () => { //7:09 am
    getFlipkartDealsScrapper()
});

cron.schedule('12 7 * * *', () => { //7:12 am
    getMyntraDealsScrapper()
});

app.listen(4000, () => {
    console.log("Server is listening")
})

