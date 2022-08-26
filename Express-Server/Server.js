const express = require('express');
const app = express();
  const port = 5000;

  app.get('/amit' , function(req , res){
      res.send("<h1>Hello, Amit</h1>")
  })
  app.get('/' , function(req , res){
      res.send("<h1>Hello, Home</h1>")
  })
  app.get('/about' , function(req , res){
      res.send("<h1>This is amit i like to watch anime</h1>")
  })
app.listen(port , function(){
    console.log(`example app listning on ${port} `);
})