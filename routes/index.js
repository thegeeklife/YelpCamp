var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user")

router.get("/",function(req,res){
    res.render("landing")
})
//show regsiter form
router.get("/register",function(req,res){
    res.render("register");
})
//handle signup logic
router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
   //provided by mongoose
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds")
        })
    })
})

//SHOW login form
router.get("/login",function(req,res){
    res.render("login")
})

//handle login logic
router.post("/login", passport.authenticate("local", 
            {successRedirect: "/campgrounds",
            failureRedirect: "/login"}),
        function(req,res){
    
})

//add logout route
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds");
})

//whenever new comment needs to be posted, if logged in, let him do it
//else take him to login
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = router;