var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    User       = require("../models/user"),
    Auth       = require("../models/auth"),
    Form       = require("../models/form"),
    middleware = require("../middleware");

//Index Route
router.get("/", middleware.isLoggedIn, function(req, res){
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        User.find({$or: [{prefix: regex}, {firstName: regex}, {secondName: regex}, {jobTitle: regex} ,{department: regex}, {faculty: regex}] }, function(err, academics){
            if(err){
                console.log("ERROR!");
            }
            else{
                res.render("academics/index.ejs", {academics: academics});
            }
        });
    }
    else{
        User.find({}, function(err, academics){
            if(err){
                console.log("ERROR!");
            }
            else{
                res.render("academics/index.ejs", {academics: academics});
            }
        });
    }
});

//New Route
router.get("/new", middleware.isAdministrator, function(req, res){
    res.render("academics/new.ejs"); 
});

//Create Route
router.post("/", middleware.isAdministrator, function(req, res){
    var profilePicture = req.files.profilePicture.file.slice(6),
        prefix = req.body.prefix,
        firstName = req.body.firstName,
        secondName = req.body.secondName,
        emailAddress = req.body.emailAddress,
        telephoneNumber = req.body.telephoneNumber,
        jobTitle = req.body.jobTitle,
        faculty = req.body.faculty,
        department =     req.body.department;
    var academic = {profilePicture: profilePicture, prefix:prefix ,firstName: firstName, secondName: secondName, emailAddress:emailAddress, telephoneNumber: telephoneNumber, jobTitle:jobTitle, faculty: faculty, department: department}
    User.create(academic, function(err, newAcademic){
        if(err){
            req.flash("error", err.message);
            res.render("academics/new.ejs");
        }
        else{   
            Auth.find({}, function(err, user){
                if(err){
                    req.flash("error", err.message);
                }
                else{
                    user[user.length - 1].user.id = newAcademic._id;
                    user[user.length - 1].user.department = newAcademic.department;
                    user[user.length - 1].user.faculty = newAcademic.faculty;
                    user[user.length - 1].save(function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                    req.flash("success", "Created Account Successfully");
                    res.redirect("/academics/" + newAcademic._id); 
                }
            });
        }
    });
});

//Show Route
router.get("/:id", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id).populate('forms').exec(function(err, foundAcademic){
        if(err){
            req.flash("error", err.message);
            res.redirect("/academics");
        }
        else{
            Form.find({}, function(err, foundForms){
                if(err){
                    console.log(err);
                }
                else{
                    res.render("academics/show.ejs", {academic: foundAcademic, forms: foundForms});
                }   
            })
        }
    });
});

//Edit Route
router.get("/:id/edit", middleware.isAdministrator, function(req, res){
    User.findById(req.params.id, function(err, foundAcademic){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            res.render("academics/edit.ejs", {academic: foundAcademic});
        }
    });
});

//Update Route
router.put("/:id", middleware.isAdministrator, function(req, res){
    var prefix = req.body.prefix,
        firstName = req.body.firstName,
        secondName = req.body.secondName,
        emailAddress = req.body.emailAddress,
        telephoneNumber = req.body.telephoneNumber,
        jobTitle = req.body.jobTitle,
        faculty = req.body.faculty,
        department =     req.body.department;

    if(typeof req.files.profilePicture === "undefined"){
            var academic = {prefix:prefix ,firstName: firstName, secondName: secondName, emailAddress:emailAddress, telephoneNumber: telephoneNumber, jobTitle:jobTitle, faculty: faculty, department: department};
    }
    else{
        var profilePicture = req.files.profilePicture.file.slice(6);
        var academic = {profilePicture: profilePicture, prefix:prefix ,firstName: firstName, secondName: secondName, emailAddress:emailAddress, telephoneNumber: telephoneNumber, jobTitle:jobTitle, faculty: faculty, department: department};
    }
    User.findByIdAndUpdate(req.params.id, academic, function(err, updatedAcademic){
        if(err){
            req.flash("error", err.message);
        }
        else{
            req.flash("success", "Updated Account Successfully");
            res.redirect("/academics/" + req.params.id);
        }
    })
});

//Destroy Route
router.delete("/:id", middleware.isAdministrator, function(req, res){
    Auth.find({}, function(err, foundAuths){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundAuths);
            foundAuths.forEach(function(auth){
                if(auth.user.id == req.params.id){
                    Auth.findByIdAndRemove(auth._id, function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                }
            });
        }
    });
    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        else{
            req.flash("success", "Deleted Account Successfully");
            res.redirect("/academics"); 
        }
    })
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;