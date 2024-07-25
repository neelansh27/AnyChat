require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const cors = require('cors');
const uuid4 = require('uuid4');
const createServer = require('http').createServer;
const Server = require('socket.io').Server;
const User = require('./schema/User')

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}))
const httpServer = createServer(app);
const io = new Server(httpServer,{
  cors:  process.env.URL || 'http://localhost:5173'
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

  // Creating a user in database whenever a connection is made
  socket.on("initialize",({name})=>{
    new User({
      name:name,
      socketId: socket.id,
      room: uuid4(),
    }).save()
  })

  socket.on('msg',async ({message})=>{
    const currUser = await User.findOne({socketId:socket.id});
    if (!currUser){
      console.log('reciever not found')
    } else {
      socket.to(currUser.room).emit('recieve-msg',{
        name: currUser.name,
        message: message,
      })
    }
  })

  socket.on('join',async ()=>{
    const [currUser,pair] = await Promise.all([
      User.findOne({socketId:socket.id}),
      User.findOne({waiting: true}).sort({createdAt: -1})
    ])

    if (pair===null){ 
      // Creating a room for current user if no pair is available
      socket.join(currUser.room);
      currUser.waiting=true;
      currUser.waitTime= new Date();
    } else { 
      // Join room if a user is found
      socket.join(pair.room);
      currUser.room=pair.room;
      pair.waiting=false;
      socket.to(pair.room).emit('user-joined',{message:`${currUser.name} has joined`});
      socket.emit('user-joined',{message:`${pair.name} has joined`});
      pair.save()
    }
    await currUser.save()
  })

  socket.on('disconnect',async ()=>{
    // Removing user from database on disconnection
    const deletedUser = await User.findOneAndDelete({socketId: socket.id});
    console.log(deletedUser);
    socket.to(deletedUser.room).emit('user-left',{
      message: `${deletedUser.name} disconnected...`
    })
    console.log('someone disconnected!!');
  })
})

io.listen(process.env.PORT || 3333,()=>{
  console.log("we are connected");
});
// app.listen(process.env.PORT || 3000,()=>{
//   console.log(`App running on ${process.env.PORT || 3000}`)
// })



