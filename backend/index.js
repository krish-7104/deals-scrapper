const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const cron = require('node-cron');

const { connectToMongo } = require("./database/db-connect.js")
dotenv.config()

const userRouter = require("./routes/user.route.js");
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
const comparePricesDaily = require("./controllers/price.controller.js")
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
app.use("/api/v1/scrapper", dealScrapperRouter)
app.use("/api/v1/show", showDealsRouter)
app.use("/api/v1/search", searchProductRouter)
app.use("/api/v1/userSearch", userSearchRouter)

app.get('/convert', async (req, res) => {
    try {
        await convertDataToCSV();
        res.download("output.csv");
    } catch (error) {
        console.error('Error serving CSV file:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.use("", logRouter)
// get all logs: http://localhost:4000/log


cron.schedule('50 10 * * *', async () => {
    console.log('Running price comparison task at 9 a.m.');
    await comparePricesDaily();
});


const cronHour = 9
const cronMinute = 16

cron.schedule(`${cronMinute} ${cronHour} * * *`, () => {
    getAmazonCategoryScrapper()
});

cron.schedule(`27 ${cronHour} * * *`, () => {
    getAmazonDealsScrapper()
});

cron.schedule(`29 ${cronHour} * * *`, () => {
    getFlipkartCategoryScrapper()
});

cron.schedule(`30 ${cronHour} * * *`, () => {
    getFlipkartDealsScrapper()
});

cron.schedule(`34 ${cronHour} * * *`, () => {
    getMyntraDealsScrapper()
});

cron.schedule(`38 ${cronHour} * * *`, () => {
    getAjioDealsScrapper()
});

cron.schedule(`40 ${cronHour} * * *`, () => {
    getMeeshoDealsScrapper()
});

cron.schedule(`+35 ${cronHour} * * *`, () => {
    convertDataToCSV()
});


app.listen(4000, () => {
    console.log("Server is listening on port 4000")
})

