require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const createServer = require('http').createServer;
const app = express();
const Server = require('socket.io').Server;
const httpServer = createServer(app);
const io = new Server(httpServer);
app.set('view-engine','ejs')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended:true }))

mongoose.connect(process.env.DB_URI)
  .then(()=>console.log("Connected to Database"))
  .catch((err)=>console.log(err.message))

app.use(cookieSession({
  name: 'session',
  keys: [process.env.SECRET],
  maxAge: 24*60*60*1000
}))

app.use('/static',express.static(path.join(__dirname,'staticuser')))
app.use('/',require('./router/router.js'))

// Socket IO 
io.on("connection",(socket) => {
  console.log("Working IO");
})

app.listen(process.env.PORT || 3000,()=>{
  console.log(`App running on http://localhost:${process.env.PORT || 3000}`)
})



