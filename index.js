const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const {getIPAddress} = require("./utils/common");
require("dotenv").config();
// require("./config/db");
// const routes = require("./routes/routes");
mongoose.connect('mongodb+srv://ramps:12345@cluster0.4rtasgf.mongodb.net/custom')
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error.message);
});
const app = express();
// app.use(bodyParser.json());
// app.use(routes);
app.get("/",(req,res)=>{
  res.send("hello2")
})
app.listen(process.env.PORT, () => {
  const ipAddress = getIPAddress();
  console.log(`Server is running on http://${ipAddress}:${process.env.PORT}`);
});
module.exports = app
