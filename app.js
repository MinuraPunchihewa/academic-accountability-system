var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    Auth            = require("./models/auth"),
    bb = require('express-busboy');
    bb.extend(app, {
        upload: true,
        path: './public/uploads'
    });
    
//REQUIRING ROUTES
var indexRoutes     = require("./routes/index"),
    academicRoutes  = require("./routes/academics"),
    formRoutes      = require("./routes/forms"),
    questionRoutes  = require("./routes/questions");

mongoose.connect("mongodb://localhost/academic_accountability_system", {useNewUrlParser: true});

app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "academic accountability system",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Auth.authenticate()));
passport.serializeUser(Auth.serializeUser());
passport.deserializeUser(Auth.deserializeUser());

app.use(async function(req, res, next){
    var notifications = [];
    res.locals.currentUser = req.user;
    if(req.user){
        try{
            let user = await Auth.findById(req.user._id).populate('notifications', null, {isRead: false}).exec();
            res.locals.notifications = user.notifications;
        }
        catch(err){
            console.log(err.message);
        }
    }
    res.locals.formDue      = false;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/academics", academicRoutes);
app.use("/academics/:id/forms", formRoutes);
app.use("/questions", questionRoutes);

app.listen(3000, function(){
    console.log("SERVER STARTED!"); 
});
