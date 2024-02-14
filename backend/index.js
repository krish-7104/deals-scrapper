const express = require("express")
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// const amazonRoutes = require("./routes/amazon.route.js")
// const meeshoRoutes = require("./routes/meesho.route.js")
// const ajioRoutes = require("./routes/ajio.route.js")
const userRouter=require('./routes/user.route');

const app = express()
app.use(express.json())

// app.use("/amazon", amazonRoutes)
// app.use("/meesho", meeshoRoutes)
// app.use("/ajio", ajioRoutes)

app.use("/api/v1/user",userRouter);

mongoose.connect(process.env.CONN_STR, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });

app.listen(4000, (err) => {
    console.log(err);
    console.log("Server is listening")
})

