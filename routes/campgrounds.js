//connect to express using express router
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
const campground = require("../models/campground");
var middleware = require("../middleware")
// var Comment = require("../models/comment")

//INDEX - show all campgrounds
router.get("/campgrounds",function(req,res){
    //get campgrounds.db
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser:req.user})
        }
    })
      //res.render("campgrounds", {campgrounds:campgrounds})   
})

//NEW - show form to create new campgrounds
router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new.ejs")

})

//CREATE - add new campground to database
router.post("/campgrounds", middleware.isLoggedIn, function(req,res){
    //get data from & add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    var newCampground = {name: name, image:image, description:desc, author:author}
   // campgrounds.push(newCampground)

   //create a new campground and save to database
    Campground.create(newCampground, function(err,newlyCreated){
        if(err){
            console.log("there's an error")
            console.log(err)
        }else{
            console.log("redirecting to campgrounds")
            res.redirect("/campgrounds")
        }
    })

   // res.redirect("/campgrounds")
   // res.send("You hit the post route")
})

//if this function is declared before NEW, 
//it will consider new as :id.
//order of declaration is important
//SHOW Route
router.get("/campgrounds/:id", function(req,res){
    //capture object ID
    //var id = req.params.id replace by mongo function
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        }else{
          //  console.log(foundCampground);
            res.render("campgrounds/show", {campgrounds: foundCampground})
        }
    })
    
})

//edit, update, delete, id's of the author should match if they want to delete

//Edit camp route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    //is user logged in?
        //yes, does he own campground?
            //yes==run code
        //no, redirect
    //if not, redirect
    Campground.findById(req.params.id, function(err,foundCampground){
        res.render("/campgrounds/edit",{campground: foundCampground});
        })

})

//update camp route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
    //find and update the correct campground
    //mongoose has nice way to find and update things
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,udatedCampground){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
    //redirect to show page
})

//destroy campground route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
        res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds");
       }
    })
})

//middleware



module.exports = router;