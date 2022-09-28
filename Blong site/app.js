//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static('public'))
// mongoose.connect('mongodb+srv://amit:amit123@cluster0.mdmlped.mongodb.net/blogpostdb');
mongoose.connect('mongodb://localhost:27017/blog1');

const userSchema = {
  
  name: String,
  username: String,
  email: String,
  password: String,
  cpassword: String
  
  
  
  
  
  
}
const User = mongoose.model('User', userSchema);
const blogschema = {
 
  posttitle: String,
  postdesc: String,
  user:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}]

}

const Blog = mongoose.model('Blog', blogschema);

let blogs = [];


app.get('/', function (req, res) {
  //  let amit = date();
  res.render('login', { contact: contactContent })


  // Blog.find({}, function (err, foundblogs) {
  //   res.render('home', { home: homeStartingContent, newposts: foundblogs })

  // })
});
app.get('/about', function (req, res) {
  //  let amit = date();
  res.render('about', { about: aboutContent })
});
app.get('/login', function (req, res) {
  //  let amit = date();
  res.render('login', { contact: contactContent })
});
app.get('/contact', function (req, res) {
  //  let amit = date();
  res.render('contact', { contact: contactContent })
});
app.get('/compose', function (req, res) {
  //  let amit = date();
  res.render('compose', { contact: contactContent })
});
app.get('/post/:postname', function (req, res) {
  //  let amit = date();
  const reqtitle = _.lowerCase(req.params.postname);
  posts.forEach(element => {
    const storedtitle = _.lowerCase(element.title);

    if (reqtitle === storedtitle) {
      res.render('post', { reqpost: posts, reqtitle1: reqtitle })
    }

  });
});

app.post('/', function (req, res) {

  const s = req.body.search;
  const reqstitle = _.lowerCase(s);
  Blog.find({ posttitle: reqstitle }, function (err, foundblogs) {

    if (err) {
      console.log(err);
    }
    else {

      console.log(foundblogs);
      console.log(reqstitle);
      res.render('spost', { reqspost: foundblogs, reqstitle1: reqstitle })

    }

  })

})


app.post('/contact', function (req, res) {
  const n = req.body.name;
  const un = req.body.username;
  const e = req.body.email;
  // const pass = req.body.password;
  // const cpass = req.body.cpassword;
  const newUser = new User({
    name: n,
    username: un,

    email: e,
    // password: md5(req.body.password)
    password: req.body.password,
    cpassword: req.body.cpassword
  })

  newUser.save(function (err) {
    if (!err) {
      // res.redirect('home')
      Blog.find({}, function (err, foundblogs) {
        res.render('home', { home: homeStartingContent, newposts: foundblogs })
        // res.redirect('/')
      })
      
    } else {
      console.log(err);
    }
  });
  
  
})


app.post('/login' , function(req, res){
  
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({username: username} , function(err, founduser){
    if(founduser){
      if(password===founduser.password){
        // res.render('');
        Blog.find({}, function (err, foundblogs) {
          res.render('home', { home: homeStartingContent, newposts: foundblogs })
          // res.redirect('/')
        })

      }
    }

   })
    
  })



  app.post('/compose', function (req, res) {
    // const post = {
    const title = req.body.posttitle;
    const content = req.body.postbody;
    // const uid = req.User._id;
    // }
    const Newb = new Blog({

      posttitle: title,
      postdesc: content,
      // user : uid
      

    })
    Newb.user.push(User._id)
    Newb.save();
    console.log(Newb);
    // posts.push(post)
    // console.log(posts);
    // res.render('home' , {home: homeStartingContent});
    // res.redirect('/')

    Blog.find({}, function (err, foundblogs) {
      res.render('home', { home: homeStartingContent, newposts: foundblogs })
      // res.redirect('/')
    })



  });





  // if(process)





  app.listen(PORT, function () {
    console.log("Server started on port 3000");
  });
