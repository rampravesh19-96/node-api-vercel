const express = require("express");
const bodyParser = require("body-parser");
const {getIPAddress} = require("./utils/common");
require("dotenv").config();
require("./config/db");
const routes = require("./routes/routes");
const app = express();
app.use(bodyParser.json());
app.use(routes);


app.get("/",(req,res)=>{
  res.send("Welcome to node api.")
})

app.listen(process.env.PORT, () => {
  const ipAddress = getIPAddress();
  console.log(`Server is running on http://${ipAddress}:${process.env.PORT}`);
});
module.exports = app
