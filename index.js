require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.set('view-engine','ejs')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended:true }))
app.use('/static',express.static(path.join(__dirname,'staticuser')))
app.use('/',require('./router/router.js'))

app.listen(process.env.PORT || 3000,()=>{
  console.log(`App running on http://localhost:${process.env.PORT || 3000}`)
})



