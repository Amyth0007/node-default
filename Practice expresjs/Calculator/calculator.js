const express = require("express");
const app = express();
const bodyPar = require("body-parser");
app.use(bodyPar.urlencoded({extended:true}));
const port = 3000;
app.get('/' , function(req, res){
    res.sendFile(__dirname+ "/index.html")
})
app.get('/about' , function(req, res){
    res.send("hello , we are creating calculator")
})
app.get('/bmicalculate' , function(req, res){
    res.sendFile(__dirname+ "/Bmical.html")
})
app.post('/' , function(req, res){
    var n1 = Number(req.body.num1);
    var n2 = Number(req.body.num2);
    var char = (req.body.sign);
    var result;
    char ==='*' ? result = n1*n2 : null  
    char ==='+' ? result = n1+n2 : null  
    char ==='-' ? result = n1-n2 : null  
    char ==='/' ? result = n1/n2 : null  
    res.send("the output is: " + result);
});
app.post('/bmicalculate' , function(req, res){
    let weight = Number(req.body.w)
    let height = Number(req.body.h)
    let bmiresult = weight/(height*height);
    res.send("the calculted bmi according to your Height and wieght is as followes : " + bmiresult);
});
app.listen(port , function(){
    console.log(`server is running on ${port} via nodemon is working`);
})