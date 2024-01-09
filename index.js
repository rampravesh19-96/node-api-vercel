const express = require("express");
const bodyParser = require("body-parser");
const { getIPAddress } = require("./utils/common");
require("dotenv").config();
require("./config/db");
const cors = require("cors");
const {
  userRoute,
  productRoute,
  cartRoute,
  orderRoute,
  paymentRoute,
  reviewRoute,
  commentRoute,
  chatRoute,
} = require("./routes");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(
  "/api",
  userRoute,
  productRoute,
  cartRoute,
  orderRoute,
  paymentRoute,
  reviewRoute,
  commentRoute,
  chatRoute
);

app.get("/", (req, res) => {
  res.send("Welcome to node api.");
});

app.listen(process.env.PORT, () => {
  const ipAddress = getIPAddress();
  console.log(`Server is running on http://${ipAddress}:${process.env.PORT}`);
});
module.exports = app;
