var express         = require('express'),
    bodyParser      = require("body-parser"),
    Campground      = require('./models/campground'),
    Comment         = require('./models/comment'),
    seedDB          = require('./seeds'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    User            = require("./models/user")
    commentRoutes   = require("./routes/comments"),
    methodOverride  = require("method-override")
 

//require the routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index")

const mongoose = require('mongoose');
var urlLocal = 'mongodb://localhost:27017/yelp_camp';
mongoose.connect(urlLocal, {
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var app = express()
const { render } = require('ejs');
//const seedDB = require('./seeds');

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname+"/public"))
app.use(methodOverride("_method"))

//seedDB(); //seed the database
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})
//Passport config
app.use(require("express-session")({
    secret: "Once again I win",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


app.listen(3000, process.env.IP, function(){
    console.log("YelpCamp Server is up and running!")
})