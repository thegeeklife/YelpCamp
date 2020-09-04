var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")
var Comment = require("../models/comment");
const comment = require("../models/comment");
var middleware = require("../middleware")


router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground})
        }
    })
    
})

//POST Route for comments
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
    //lookup campground using id
    Campground.findById(req.params.id,function(err,campgrounds){
        if(err){
            console.log(err)
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campgrounds.comments.push(comment);
                    campgrounds.save();
                    var rout = '/campgrounds/' + campgrounds._id
                    console.log(rout);
                    res.redirect(rout);
                }
            })
        }
    })
    //create new comment
    //connect new comment to campground
    //redirect to campground show page
})

//edit route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back")
        }else{
            res.send("Edit for comment",{campground_id:req.params.id, comment: foundComment})
        }
    })
   
})

//update route
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/"+req.params.id,{campground_id:req.params.id, comment: foundComment})
        }
    })
})

//delete route
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})


module.exports = router;