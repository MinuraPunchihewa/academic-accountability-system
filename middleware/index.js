var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
}

middlewareObj.isAdministrator = function(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role == "Administrator")
            next();
        else{
            req.flash("error", "No Permission Allowed");
            res.redirect("back");
        }
    }
    else{
        req.flash("error", "Please Login First");
        res.redirect("back");
    }
}

middlewareObj.isHodDean = function(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role == "Head of Department" || req.user.role == "Dean")
            next();
        else{
            req.flash("error", "No Permission Allowed");
            res.redirect("back");
        }
    }
    else{
        req.flash("error", "Please Login First");
        res.redirect("back");
    }
}

module.exports = middlewareObj;

