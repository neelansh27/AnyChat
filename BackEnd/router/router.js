const express = require('express');
const uuid4 = require('uuid4');
const router = express.Router();

router.get('/',(req,res)=>{
  res.render('index.ejs')
})

router.get('/talk',(req,res)=>{
  res.send('talk');
})
module.exports = router
