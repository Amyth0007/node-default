//jshint esversion:6

const express = require("express");
const bodyPar = require("body-parser");
const date = require(__dirname + '/date.js');
const mongoose =require('mongoose')
const app = express();

const port = 3000;
// let items = ['buy food' , 'cook food' , 'eat food'];
let it= '';
app.use(bodyPar.urlencoded({extended:true}));

app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/todolistdb');

const itemsSchema = {
    name:  String
}

const Item = mongoose.model('Item' , itemsSchema)

const item1 = new Item({
    name: 'welcome'
})
const item2 = new Item({
    name: 'hit checkbox to delete'
})
const item3 = new Item({
    name: 'hit + to add new item'
})

const defaultitems = [item1,item2, item3]



app.set('view engine' , 'ejs');

app.get('/' , function(req,res){
   let amit = date();
    Item.find({} , function(err, founditems){
    if(founditems.length===0){
        Item.insertMany(defaultitems , function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log('db updated succesfully');
            }
        })
        res.redirect('/')
    }
        console.log(founditems);
        res.render('list' , {kindofday: amit , newitems: founditems})
    })


});


app.post('/' , function(req, res){
   const Newit = req.body.newItem;
   const item = new Item({
       name : Newit
   })
     item.save();
     res.redirect('/')

    // res.send(it)
})
app.post('/delete' , function(req, res){
   const checkbox = req.body.checkbox;
   Item.findByIdAndRemove(checkbox , function(err){
       if(err){console.log(err);}
       else{
           console.log("deleted");
       }
   })
    

})


app.listen(port , function(){
    console.log(`server is running on ${port} via nodemon is working`);
})