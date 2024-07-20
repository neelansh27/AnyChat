require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const cors = require('cors');
const createServer = require('http').createServer;
const Server = require('socket.io').Server;
const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}))
const httpServer = createServer(app);
const io = new Server(httpServer,{
  cors:  'http://localhost:5173'
});

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

app.use('/static',express.static(path.join(__dirname,'static')))
app.use('/',require('./router/router.js'))

// Socket IO 
io.on("connection",(socket) => {
  console.log("Working IO");
  socket.on('msg',({msg})=>{
    console.log(msg)
    socket.emit('response',{
      message: 'recieved message',
    })
  })
  socket.on('disconnect',()=>{
    console.log('A user disconnected!!');
  })
})
io.listen(process.env.IOPORT || 3333);
app.listen(process.env.PORT || 3000,()=>{
  console.log(`App running on http://localhost:${process.env.PORT || 3000}`)
})



