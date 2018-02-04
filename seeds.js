var mongoose = require("mongoose");
var Member = require("./models/member");
var Comment   = require("./models/comment");

var data = [
]

function seedDB(){
   //Remove all members
   Member.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed members!");
         //add a few members
        data.forEach(function(seed){
            Member.create(seed, function(err, member){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a member");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                member.comments.push(comment);
                                member.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;