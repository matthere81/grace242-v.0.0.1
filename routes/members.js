var express = require("express");
var router = express.Router();
var Member = require("../models/member");
var middleware = require("../middleware");
// var regex

//======== INDEX - show all members
router.get("/", middleware.isLoggedIn, function(req, res){
    var noMatch = null;
    if(req.query.search) {
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
       Member.find({name: regex}, function(err, allMembers){
         if(err){
             console.log(err); 
        } else {
             if(allMembers.length < 1) {
                    noMatch = "No matches, please try again.";
                } 
                res.render("members/index", {members: allMembers, noMatch: noMatch});
            } 
        });
    } else {
    //Get all members from db
    Member.find({}, function(err, allMembers){
         if(err){
             console.log(err); 
         } else {
            res.render("members/index", {members:allMembers, noMatch: noMatch});          
         }
    });
    }  
});

//======== CREATE - add new member to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to member array
  var name = req.body.name;
  var firstName = req.body.firstName;
  var partnerName = req.body.partnerName;
  var numOfChildren = req.body.numOfChildren;
  var email = req.body.email;
  var tel = req.body.tel;
  var aboutUs = req.body.aboutUs;
  var image = req.body.image;
  
//   var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
var newMember = {
    name: name,
    firstName: firstName, 
    partnerName: partnerName, 
    numOfChildren: numOfChildren,
    email: email,
    tel: tel,
    aboutUs: aboutUs,
    image: image,
// image: image, description: desc, cost: cost,
author:author,
    
}
    //create a new member and save to DB
    Member.create(newMember, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
        //redirect back to members page
        res.redirect("/members"); 
        }
    });
    
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("members/new");
});

//SHOW - shows details of members
router.get("/:id", function(req, res){
    //find member with id
    Member.findById(req.params.id).populate("comments").exec(function(err, foundMember){
        if(err){
            console.log(err);
        } else {
             console.log(foundMember);
                //render show template
                res.render("members/show", {member: foundMember});      
        }
    });
});

// Edit Member Route
router.get("/:id/edit", middleware.checkMemberOwnership, function(req, res){
    Member.findById(req.params.id, function(err, foundMember){
        res.render("members/edit", {member: foundMember});
    });
});

// Update Member Route
router.put("/:id", middleware.checkMemberOwnership, function(req, res){
    //find and update the correct update
    Member.findByIdAndUpdate(req.params.id, req.body.member, function (err, updatedMember){
        if(err){
            res.redirect("/members");
        } else {
            res.redirect("/members/" + req.params.id);
        }
    });
    //redirect to the show page
});

// Destroy Route
router.delete("/:id", middleware.isAdmin, middleware.checkMemberOwnership, function(req, res){
    Member.findByIdAndRemove(req.params.id, function(err, Member){
        if(err){
            res.redirect("/members");
        } else {
            res.redirect("/members");
        }
    });
});

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;