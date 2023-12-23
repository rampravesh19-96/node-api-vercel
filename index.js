const express = require('express')

const app = express()
const PORT = 4000

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ramps:12345@cluster0.4rtasgf.mongodb.net/test')
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error.message);
});



app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})
app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳') 
})

app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
})
app.get('/check', (req, res) => {
  res.status(200).json({id : 1, email:"abc@gmail.com",name : "sachin"})
})


// Export the Express API
module.exports = app