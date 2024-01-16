const mongoose = require("mongoose");
const config = require("../config.json")


const connection = mongoose
  .connect(config.mongo_uri)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB", err);
  });

module.exports = connection