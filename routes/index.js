var express             = require("express"),
    router              = express.Router({mergeParams: true}),
    passport            = require("passport");
    User                = require("../models/user"),
    Auth                = require("../models/auth"),
    Form                = require("../models/form"),
    UserNotification    = require("../models/notification"),
    middleware          = require("../middleware");

//Root Route
router.get("/", function(req, res){
    res.render("landing.ejs");
});

//
router.get("/register", middleware.isAdministrator, function(req, res){
    res.render("register.ejs");
});

//
router.post("/register", middleware.isAdministrator, function(req, res){
    var newAuth = new Auth({username: req.body.username, role: req.body.role});
    Auth.register(newAuth, req.body.password, function(err, auth){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        else{
            req.flash("success", "Account Registered Successfully");
            res.redirect("/academics/new");
        }
        // passport.authenticate("local")(req, res, function(){
        //     if(req.user.role == "Administrator")
        //         res.redirect("/academics");
        //     else
        //         res.redirect("academics/new");
        // });
    });
});

//
router.get("/login", function(req, res){
    res.render("login.ejs");
});

//
// router.post("/login", passport.authenticate("local", {
//     successRedirect: "/", 
//     failureRedirect: "/login"
// }) ,function(req, res){

// });

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        req.flash('error', 'Something went wrong.');
        return res.redirect('/login');
      }
      if (!user) {
        req.flash('error', 'Incorrect credentials.');
        return res.redirect('/login');
      }
      req.logIn(user, function (err) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('/login');
        }
        req.flash('success', 'Welcome, ' + user.username);
        if(user.role == "Administrator")
            return res.redirect('/academics');
        else
            return res.redirect('/academics/' + user.user.id);
      });
    })(req, res, next);
  });

//Logout Route
router.get("/logout", function(req, res){
    req.flash("success", "Logged Out Successfully");
    req.logout();
    res.redirect("/login");
});

//Handle Notifications
router.get("/notifications/:id", function(req, res){
    UserNotification.findById(req.params.id, function(err, foundNotification){
        if(err){
            console.log(err);
        }
        else{
            if(foundNotification.type == "Approval"){
                Auth.findById(req.user._id, function(err, foundAuth){
                    if(err){
                        console.log(err);
                    }
                    else{
                        foundAuth.notifications.forEach(function(notification){
                            UserNotification.findById(notification, function(err, notificationFound){
                                if(notificationFound.type == "Approval"){
                                    notificationFound.isRead = true;
                                    notificationFound.save();
                                }
                            })
                        })
                    }
                })
                res.redirect("/academics/" + req.user.user.id + "/forms");
            }
            if(foundNotification.type == "Form"){
                Auth.findById(req.user._id, function(err, foundAuth){
                    if(err){
                        console.log(err);
                    }
                    else{
                        var index           = 0,
                            indexPlusOne    = 1;
                        console.log(foundNotification._id);
                        console.log("----------------------");
                        foundAuth.notifications.forEach(function(notification){
                            console.log(notification);
                            if(notification.equals(foundNotification._id)){
                                console.log("Hello World");
                                console.log(index);
                                console.log(indexPlusOne);
                                if(foundAuth.notifications.length == indexPlusOne){
                                    console.log("Hello!!!")
                                    foundAuth.notifications.pop();
                                    foundAuth.save();
                                }
                                else{
                                    foundAuth.notifications.splice(index, indexPlusOne);
                                    foundAuth.save();
                                }
                            }
                            index++;
                            indexPlusOne++;
                        })
                        //delete notification if it is not included in any of the user arrays 
                    }
                })
                res.redirect("/academics/" + req.user.user.id + "/forms/new");
            }
        }
    })
})

//Activate Form Route
router.get("/activate", middleware.isAdministrator, function(req, res){
    res.render("forms/activate.ejs");
})

//Create Active Form and Notification
router.post("/activate", middleware.isAdministrator, function(req, res){
    var text            = "The form for year " + req.body.academicYear + " semester " + req.body.semester + " is due",
        type            = "Form";

    var notification    = {text: text, type: type};
    UserNotification.create(notification, function(err, newNotification){
        if(err){
            console.log(err);
        }
        else{
            Auth.find({}, function(err, foundAuths){
                if(err){
                    console.log(err);
                }
                else{
                    foundAuths.forEach(function(auth){
                        if(auth.role != "Administrator"){
                            auth.notifications.push(newNotification);
                            auth.save();
                        }
                    })
                }
            })
        }
    res.redirect("/academics");
    })
})

//Analytics
router.get("/analytics", function(req, res){
    User.find({}).populate('forms').exec(function(err, foundAcademics){
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
                    if(req.query.from)
                        var fromVal   = req.query.from;
                    if(req.query.to)
                        var toVal     = req.query.to;
                    if(req.query.for)
                        var forVal    = req.query.for;
                    if(req.query.departmentAnalytics)
                        var departmentAnalytics = req.query.departmentAnalytics;

                    if(req.user.role !== 'undefined' && req.user.role == "Head of Department"){
                        res.render("department_analytics.ejs", {academics: foundAcademics, forms:foundForms, fromVal: fromVal, toVal: toVal, forVal: forVal});
                    } 
                    if(req.user.role !== 'undefined' && req.user.role == "Dean"){
                        if(req.query.departmentAnalytics){
                            res.render("department_analytics.ejs", {academics: foundAcademics, forms:foundForms, fromVal: fromVal, toVal: toVal, forVal: forVal, departmentAnalytics: departmentAnalytics});
                        } else{
                            res.render("faculty_analytics.ejs", {academics: foundAcademics, forms:foundForms, fromVal: fromVal, toVal: toVal, forVal: forVal});
                        }
                    }
                }
            })
        }
    });
})

//Edit Role
router.get("/role", middleware.isAdministrator, function(req, res){
    Auth.find({}, function(err, foundAuths){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            res.render("edit_role.ejs", {auths: foundAuths});
        }
    });
});

//Update Role
router.post("/role", middleware.isAdministrator, function(req, res){
    var username        = req.body.username;
        role            = req.body.role;

    Auth.updateOne({'username': username}, {$set:{'role': role}}, function(err, updatedAuth){
        if(err){
            req.flash("error", err.message);
        }
        else{
            req.flash("success", "Updated Account Successfully");
            res.redirect("back");
        }
    })
});

module.exports = router;