//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

////////////////////////////////Request Targeting all article////////////////////////
app.route('/articles')
.get(function(req, res){
  Article.find(function(err, founditem){
   
    console.log(founditem);
        res.send(founditem);
    
  })})
  .post(function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);
  
    const newD = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newD.save(function(err){
      if(err){
        console.log(err);
      }else{
        console.log("data is posted succesfully");
      }
    });
  })
  .delete(function(req, res){
    Article.deleteMany(function(err){
      if(!err){
        console.log(res.send("Successfully deleted all the data"));
      }
    })
  } );


app.get('/', function(req, res){
   res.send("hello world")
});
// app.get('/articles', function(req, res){
//    Article.find(function(err, founditem){
    
//      console.log(founditem);
//          res.send(founditem);
     
//    })

  
// });

// app.post('/articles', function(req, res){
//   console.log(req.body.title);
//   console.log(req.body.content);

//   const newD = new Article({
//     title: req.body.title,
//     content: req.body.content
//   })
//   newD.save(function(err){
//     if(err){
//       console.log(err);
//     }else{
//       console.log("data is posted succesfully");
//     }
//   });
// })

// app.delete('/articles' , function(req, res){
//   Article.deleteMany(function(err){
//     if(!err){
//       console.log(res.send("Successfully deleted all the data"));
//     }
//   })
// } 
// )
////////////////////////////////Request Targeting a Specific article////////////////////////

app.route('/articles/:articlesTitle')

.get(function(req, res){
  Article.findOne({title: req.params.articlesTitle}, function(err, foundA){
    if(!err){
      console.log(foundA);
      res.send(foundA)
    }else{
      console.log(err);
    }
  });

})

.put(function(req, res){
  Article.updateOne(
    {title: req.params.articlesTitle},
    {title: req.body.title , content: req.body.content},
    // {overwrite: true},
    function(err){
      if(!err){
        res.send("updated succesfully")
      }
      else{
        console.log(err);
      }
    }

  )
})
// just adding a comment

.patch( function(req, res){
  Article.updateOne(
    {title: req.params.articlesTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("succesfully updated one")
      }else{
        console.log(err);
      }
    }
  )
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articlesTitle},
    function(err){
      if(!err){
        res.send("deleted succesfully")
      }else{
        console.log(err);
      }
    }
     
    )
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});