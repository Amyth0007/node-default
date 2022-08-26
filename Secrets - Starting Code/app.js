//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();
const md5 = require('md5');
// const encrypt = require('mongoose-encryption');

app.use(express.static("public"));
app.set('view engine' , 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost:27017/SuserDB');

    const userSchema = new mongoose.Schema( {
        email: String,
        password: String
    });
const userSecret = new mongoose.Schema( {
    
    secret: String
});
// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] } )




const User = new mongoose.model("User" , userSchema);
const secret = new mongoose.model("secret" , userSecret);

app.get('/', function(req, res){
    res.render('home');
})
app.get('/logout', function(req, res){
    res.render('home');
})
app.get('/login', function(req, res){
    res.render('login');
})
app.get('/register', function(req, res){
    res.render('register');
})
app.get('/submit', function(req, res){
    res.render('submit');
})
app.post('/register', function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    })
    newUser.save(function(err){
        if(!err){
            res.render('secrets')
        }else{
            console.log(err);
        }
    });
})
app.post('/submit', function(req, res){
    const newsecret = new secret({
        secret: req.body.secret
        // password: md5(req.body.password)
    })
    newsecret.save(function(err){
        if(!err){
            res.render('secrets')
        }else{
            console.log(err);
        }
    });
})

app.post('/login' , function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);
   User.findOne({email: username} , function(err, founduser){
    if(founduser){
        if(password===founduser.password){
            res.render('secrets');
        }
    }

   })

})




app.listen(5000 , function(){
  console.log("app listening on port " + 5000);
})