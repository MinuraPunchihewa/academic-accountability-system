var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    bb = require('express-busboy');
    bb.extend(app, {
        upload: true,
        path: './public/uploads'
    });
    User            = require("./models/user");

mongoose.connect("mongodb://localhost/academic_accountability_system", {useNewUrlParser: true});

app.use(express.static("public"));
app.use(methodOverride("_method"));

//PASSPORT CONFIGURATION



//ROUTES
//Home Route
app.get("/", function(req, res){
    res.redirect("/academics");
});

//Index Route
app.get("/academics", function(req, res){
    User.find({}, function(err, academics){
        if(err){
            console.log("ERROR!");
        }
        else{
            res.render("index.ejs", {academics: academics});
        }
    });
});

//New Route
app.get("/academics/new", function(req, res){
    res.render("new.ejs"); 
});

//Create Route
app.post("/academics", function(req, res){
    console.log("Hello");
    console.log(req.files.profilePicture.file.slice(6));
    var profilePicture = req.files.profilePicture.file.slice(6),
        prefix = req.body.prefix,
        firstName = req.body.firstName,
        secondName = req.body.secondName,
        emailAddress = req.body.emailAddress,
        telephoneNumber = req.body.telephoneNumber,
        jobTitle = req.body.jobTitle,
        faculty = req.body.faculty,
        department =     req.body.department;
        var academic = {profilePicture: profilePicture, prefix:prefix ,firstName: firstName, secondName: secondName, emailAddress:emailAddress, telephoneNumber: telephoneNumber, jobTitle:jobTitle, faculty, faculty, department: department}
     User.create(academic, function(err, newAcademic){
        if(err){
            res.render("new.ejs");
        }
        else{
            res.redirect("/academics");
        }
    });
});

//Show Route
app.get("/academics/:id", function(req, res){
    User.findById(req.params.id, function(err, foundAcademic){
        if(err){
            res.redirect("/academics");
        }
        else{
            res.render("show.ejs", {academic: foundAcademic});
        }
    });
});

app.listen(3000, function(){
    console.log("SERVER STARTED!"); 
});
