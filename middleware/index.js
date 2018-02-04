var Member = require("../models/member");
var Comment = require("../models/comment");
var User = require("../models/user");

// ALL MIDDLEWARE GOES HERE
var middlewareObj  = {};

middlewareObj.checkMemberOwnership = function(req, res, next) {
      //is user logged in?
        if(req.isAuthenticated()){
            Member.findById(req.params.id, function(err, foundMember){
      //does user own family?
          if(foundMember.author.id.equals(req.user._id) || currentUser && currentUser.isAdmin){
              next();
            } else {
               req.flash("error", "You don't have permission to do that!");
               console.log("BADD!!!");
               res.redirect("/members/" + req.params.id);
               }
            });
            } else {
                req.flash("error", "You need to be signed in to do that!");
                res.redirect("/login");
        }
},

middlewareObj.checkCommentOwnership = function(req, res, next) {
      //is user logged in?
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
          //does user own comment?
          if(foundComment.author.id.equals(req.user._id)){
              next();
          } else {
                res.redirect("back");
          }
      }
    }); 
            } else {
                res.redirect("back");
        }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first");
    res.redirect("/login");
}

middlewareObj.isAdmin = function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'You are not authorized');
      res.redirect('back');
    }
},

module.exports = middlewareObj;
