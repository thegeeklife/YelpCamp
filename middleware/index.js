
var middlewareObj = {};
var Campground = require("../models/campground")
var Comment= require("../models/comment")

middlewareObj.checkCommentOwnership = function(req,res,next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.id,function(err,foundComment){
                if(err){
                    res.redirect("back")
                }else{
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    }else{
                        res.redirect("back")
                    }
                    
                }
            })
        }else{
            res.redirect("back")
        }
    
    
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                res.redirect("back")
            }else{
                    //does user own camp?
                        //foundCampground.author.id is mongoose obj and req.user._id is a string
                        //use mongoose method ".equals" to compare
                if(foundCampground.author.id.equals(req.user._id)){
                        //res.render("campgrounds/edit",{campground:foundCampground})
                    next();
                }else{
                    res.redirect("back")
                }
                    
            }
        })
    }else{
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")  
}

module.exports  = middlewareObj