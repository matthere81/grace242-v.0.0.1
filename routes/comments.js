var express = require("express");
var router  = express.Router({mergeParams: true});
var Member = require("../models/member");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find member by id
    console.log(req.params.id);
    Member.findById(req.params.id, function(err, member){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {member: member});
        }
    })
});

//Comments Create
router.post("/", middleware.isLoggedIn,function(req, res){
   //lookup member using ID
   Member.findById(req.params.id, function(err, member){
       if(err){
           console.log(err);
           res.redirect("/members");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save the comment
               comment.save();
               member.comments.push(comment);
               member.save();
               res.redirect('/members/' + member._id);
           }
        });
       }
   });
});


// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {member_id: req.params.id, comment: foundComment});
        }
    });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/members/" + req.params.id );
        }
    }); 
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/members/" + req.params.id);
        }
    });
});

module.exports = router;