//jshint esversion:6
require("dotenv").config();
const express = require("express");
const app  = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose  = require("mongoose");
const encrypt = require("mongoose-encryption");




//set up express ejs and bodyParser to our code


app.use(express.static("public"));
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));




//connect our mongodb with creating userDB database

mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser:true,useUnifiedTopology: true});


//creating schema and model of mongoose database
const userSchema = new mongoose.Schema( {
  email:String,
  password:String

});


//encrytion our passowrd by this
var secret = process.env.SECRET;
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});


const User = mongoose.model("User",userSchema);



app.get("/login",function(req,res){
  res.render("login");
});


app.get("/home",function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){
  res.render("register");
});





app.post("/register",function(req,res){


  const newUser = new User({
    email:req.body.username,
    password:req.body.password
        });

  newUser.save(function(){
        res.render("secrets");
      });
  });


app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err,foundresult){
    if(err){
      console.log(err);
    }
    else if(foundresult.password === password){
      res.render("secrets");
    }
  });
});





app.listen("3000",function(){
  console.log("server is started on 3000");
})
