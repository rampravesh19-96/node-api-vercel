const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const { getIPAddress } = require("./utils/common");
const passport = require("passport");
require("./utils/passport");
require("./config/db");
const config = require("./config.json");
const cors = require("cors");
const {
  authRoute,
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
app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use("/api", paymentRoute)
app.use(bodyParser.json());
app.use(
  "/api",
  authRoute,
  userRoute,
  productRoute,
  cartRoute,
  orderRoute,
  reviewRoute,
  commentRoute,
  chatRoute
);

app.get("/", (req, res) => {
  res.send("Welcome to node api.");
});

app.listen(config.port, () => {
  const ipAddress = getIPAddress();
  console.log(`Server is running on http://${ipAddress}:${config.port}`);
});
module.exports = app;
