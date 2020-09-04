const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"

        },
        username: String
    },
    comments: [ //embed id or reference to comments
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})

module.exports = mongoose.model("Campground", campgroundSchema)

//campground.create(object, callback function(){})
// Campground.create(
//     {
//     name:'Granite Hill', 
//     image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350",
//     description: "This is a huge granite hill, a public bathroom, it's super clean and nice and you will probably have a lot of fun here!"
//     }, function(err,campground){
//         if(err){
//             console.log("ERROR!")
//             console.log(err);
//         }else{
//             console.log("Newly created campground");
//             console.log(campground);
//         }
//     })
