const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const cron = require('node-cron');

const { connectToMongo } = require("./database/db-connect.js")
dotenv.config()

const userRouter = require("./routes/user.route.js");
const getAjioDealsScrapper = require("./deals-scrapper/ajio.js");
const getAmazonCategoryScrapper = require("./deals-scrapper/amazon-category.js");
const getAmazonDealsScrapper = require("./deals-scrapper/amazon-deals.js");
const getMyntraDealsScrapper = require("./deals-scrapper/myntra.js");

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


cron.schedule('0 7 * * *', () => { //7:00 am
    getAmazonCategoryScrapper()
});

cron.schedule('20 38 11 * * *', () => { //7:05 am
    getAmazonDealsScrapper()
});

cron.schedule('10 7 * * *', () => { //7:10 am
    getMyntraDealsScrapper()
});

cron.schedule('15 7 * * *', () => { //7:15 am
    getAjioDealsScrapper()
});


app.listen(4000, () => {
    console.log("Server is listening")
})

