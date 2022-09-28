//jshint esversion:6
require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const path = require('path')
const multer = require('multer')
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose')
 const app = express();
 const findOrCreate = require('mongoose-findorcreate');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const md5 = require('md5');
// const encrypt = require('mongoose-encryption');

app.use(express.static("public"));
app.set('view engine' , 'ejs');
var creteed;

app.use(bodyParser.urlencoded({extended: true}));


//storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null,   Date.now() + file.originalname)
    }
  })
   
  var upload = multer({ storage: storage });
//   var multipleupload = upload.fields([{name:'file'}]);


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/SuserDB' ,{useNewUrlParser: true});
// mongoose.set("useCreateIndex"  , true); 

    const userSchema = new mongoose.Schema( {
        username: String,
        password: String,
        googleId: String
    });
const userSecret = new mongoose.Schema( {
    
    secret: String, 
    createdby:String,
    img:  String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] } )




const User = new mongoose.model("User" , userSchema);

// passport.use(User.createStrategy());
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
  


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    creteed = profile.displayName
    User.findOrCreate({username:profile.displayName, googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

const secret = new mongoose.model("secret" , userSecret);


app.get('/auth/google',
passport.authenticate('google', {scope:["profile"]})
)

app.get('/auth/google/secrets',
passport.authenticate('google', {failureRedirect: '/login'}),
function(req, res){
    res.redirect('/secrets')
}
)

app.get('/', function(req, res){
    res.render('home');
})
app.get('/logout', function(req, res){
    res.render('home');
})
app.get('/login', function(req, res){
    res.render('login');
})
app.get('/secrets', function(req, res){
    if(req.isAuthenticated()){

        res.render('secrets');
        console.log('done');
    }else{
        res.redirect('/login')
        console.log('not done');
    }
})
app.get('/register', function(req, res){
    res.render('register');
})
app.get('/submit', function(req, res){
    res.render('submit');
})

app.post('/register', function(req, res){
    
  User.register({username: req.body.username} , req.body.password , function(err , user){

   creteed = req.body.username;
    if(err){
        console.log(err);
        res.redirect('/register');
    }else{
        passport.authenticate("local")(req, res , function(){
            
            res.redirect('/secrets')
        })
    }
  })

})
app.post('/submit', upload.single('image') ,function(req, res){
    const newsecret = new secret({
        secret: req.body.secret,
        createdby: creteed,
        img: req.file.filename
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

    const user = new User({
        username : req.body.username,
        password: req.body.password
    })
   
  req.login(user, function(err){
    if(err){
        console.log(err);
    }else{
        passport.authenticate("local")(req, res , function(err){
            res.redirect('/secrets')
        });
    }
  })

})
// app.post('/login' , function(req, res){
//     const username = req.body.username;
//     const password = md5(req.body.password);
//    User.findOne({email: username} , function(err, founduser){
//     if(founduser){
//         if(password===founduser.password){
//             res.render('secrets');
//         }
//     }

//    })

// })




app.listen(5000 , function(){
  console.log("app listening on port " + 5000);
})