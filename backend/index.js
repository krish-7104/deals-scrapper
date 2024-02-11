const express = require("express")

const amazonRoutes = require("./routes/amazon.route.js")
const meeshoRoutes = require("./routes/meesho.route.js")
const ajioRoutes = require("./routes/ajio.route.js")

const app = express()
app.use(express.json())

app.use("/amazon", amazonRoutes)
app.use("/meesho", meeshoRoutes)
app.use("/ajio", ajioRoutes)

app.listen(4000, () => {
    console.log("Server is listening")
})

