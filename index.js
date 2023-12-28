const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./config/db");
const routes = require("./routes/routes");
const app = express();
app.use(bodyParser.json());
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
module.exports = app
