var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"), 
    Member        = require("./models/member"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
//requring routes
var memberRoutes = require("./routes/members"),
    indexRoutes = require("./routes/index"),
    adminRoutes = require("./routes/admin"); 
    
//Connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/g242", {
    useMongoClient: true,
});

//Tell express to use body-parser

app.use(bodyParser.urlencoded({extended:true}));

// Sets ejs as file extension
app.set("view engine", "ejs");

// CSS
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Seed the database
// seedDB(); 

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
//   Flash Message 
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/admin", adminRoutes);
app.use("/members", memberRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Church Directory");
});