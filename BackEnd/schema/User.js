const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {type: String, required:true},
  socketId: {type: String, default: null, required: true},
  room: {type: String, default: null},
  waiting: {type: Boolean, default: false},
  waitTime: {type: Date, default: Date.now, required: true}
})

const User = mongoose.model('User',UserSchema);
module.exports = User;


