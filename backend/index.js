const express = require("express")
const cors = require("cors")
const amazonRoutes = require("./routes/amazon.route.js")
const flipkartRoutes = require("./routes/flipkart.route.js")
const meeshoRoutes = require("./routes/meesho.route.js")
const ajioRoutes = require("./routes/ajio.route.js")
const myntraRoutes = require("./routes/myntra.route.js")

const app = express()
app.use(express.json())
app.use(cors({
    origin: "*"
}))

app.use("/amazon", amazonRoutes)
app.use("/flipkart", flipkartRoutes)
app.use("/meesho", meeshoRoutes)
app.use("/ajio", ajioRoutes)
app.use("/myntra", myntraRoutes)

app.listen(4000, () => {
    console.log("Server is listening")
})

