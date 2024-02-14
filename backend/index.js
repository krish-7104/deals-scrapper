const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const { connectToMongo } = require("./database/db-connect.js")
dotenv.config()

const amazonRoutes = require("./routes/amazon.route.js")
const flipkartRoutes = require("./routes/flipkart.route.js")
const meeshoRoutes = require("./routes/meesho.route.js")
const ajioRoutes = require("./routes/ajio.route.js")
const myntraRoutes = require("./routes/myntra.route.js")
const userRouter = require("./routes/user.route.js")

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

app.use("/api/v1/amazon", amazonRoutes)
app.use("/api/v1/flipkart", flipkartRoutes)
app.use("/api/v1/meesho", meeshoRoutes)
app.use("/api/v1/ajio", ajioRoutes)
app.use("/api/v1/myntra", myntraRoutes)

app.listen(4000, () => {
    console.log("Server is listening")
})

