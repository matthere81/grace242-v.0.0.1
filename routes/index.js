var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");


//======== Landing Page
router.get("/", function(req, res){
     res.render("landing");
}); 

// AUTHORIZATION ROUTES

// Show Register Form
router.get("/register", function(req, res){
    res.render("register");
});

// Handle Sign Up Logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode === "zzkAywuWTT") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
        console.log(err);
        return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to the directory!");
            res.redirect("/members");
        });
    });
});

// Show ADMIN Register Form
// router.get("/register/admin", function(req, res){
//     res.render("adminReg");
// });

// Show Login Form
router.get("/login", function(req, res){
    res.render("landing"); 
});

// Handle Login Logic
router.post("/login", passport.authenticate("local", 
    {
        successFlash: "Login Successful!",
        successRedirect: "/members",
        failureRedirect: "/login",
        failureFlash: "Try Again",
    }), function(req, res){
}); 

// forgot password
// router.get('/forgot', function(req, res) {
//   res.render('forgot');
// });

// router.post('/forgot', function(req, res, next) {
//   async.waterfall([
//     function(done) {
//       crypto.randomBytes(20, function(err, buf) {
//         var token = buf.toString('hex');
//         done(err, token);
//       });
//     },
//     function(token, done) {
//       User.findOne({ email: req.body.email }, function(err, user) {
//         if (!user) {
//           req.flash('error', 'No account with that email address exists.');
//           return res.redirect('/forgot');
//         }

//         user.resetPasswordToken = token;
//         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

//         user.save(function(err) {
//           done(err, token, user);
//         });
//       });
//     },
//     function(token, user, done) {
//       var smtpTransport = nodemailer.createTransport({
//         service: 'Gmail', 
//         auth: {
//           user: 'grace242directory@gmail.com',
//           pass: process.env.treemodernplants
//         }
//       });
//       var mailOptions = {
//         to: user.email,
//         from: 'grace242directory@gmail.com',
//         subject: 'Grace 242 Directory Password Reset',
//         text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//           'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//           'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//           'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//       };
//       smtpTransport.sendMail(mailOptions, function(err) {
//         console.log('mail sent');
//         req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
//         done(err, 'done');
//       });
//     }
//   ], function(err) {
//     if (err) return next(err);
//     res.redirect('/forgot');
//   });
// });

// router.get('/reset/:token', function(req, res) {
//   User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
//     if (!user) {
//       req.flash('error', 'Password reset token is invalid or has expired.');
//       return res.redirect('/forgot');
//     }
//     res.render('reset', {token: req.params.token});
//   });
// });

// router.post('/reset/:token', function(req, res) {
//   async.waterfall([
//     function(done) {
//       User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
//         if (!user) {
//           req.flash('error', 'Password reset token is invalid or has expired.');
//           return res.redirect('back');
//         }
//         if(req.body.password === req.body.confirm) {
//           user.setPassword(req.body.password, function(err) {
//             user.resetPasswordToken = undefined;
//             user.resetPasswordExpires = undefined;

//             user.save(function(err) {
//               req.logIn(user, function(err) {
//                 done(err, user);
//               });
//             });
//           })
//         } else {
//             req.flash("error", "Passwords do not match.");
//             return res.redirect('back');
//         }
//       });
//     },
//     function(user, done) {
//       var smtpTransport = nodemailer.createTransport({
//         service: 'Gmail', 
//         auth: {
//           user: 'grace242directory@gmail.com',
//           pass: process.env.treemodernplants
//         }
//       });
//       var mailOptions = {
//         to: user.email,
//         from: 'grace242directory@mail.com',
//         subject: 'Your password has been changed',
//         text: 'Hello,\n\n' +
//           'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
//       };
//       smtpTransport.sendMail(mailOptions, function(err) {
//         req.flash('success', 'Success! Your password has been changed.');
//         done(err);
//       });
//     }
//   ], function(err) {
//     res.redirect('/index');
//   });
// });


// Logout Logic Route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "You've been logged out.");
   res.redirect("/login");
});


// app.use(indexRoutes);

module.exports = router;