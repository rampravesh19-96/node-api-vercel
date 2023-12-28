const express = require('express')
require("dotenv").config();
// require("./config/db")

const app = express()


app.get("/",(req,res)=>{
  res.send("hello")
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT} `)
})
// module.exports = app