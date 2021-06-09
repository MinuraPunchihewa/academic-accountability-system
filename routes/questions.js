var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Auth       = require("../models/auth"),
    Question   = require("../models/question"),
    middleware = require("../middleware");

//Index Route
router.get("/", middleware.isLoggedIn, function(req, res){
    Question.find({}, function(err, questions){
        if(err){
            console.log("ERROR!");
        }
        else{
            res.render("questions/index.ejs", {questions: questions});
        }
    });
});

//New Route
router.get("/new", middleware.isAdministrator, function(req, res){
    res.render("questions/new.ejs"); 
});

//Create Route
router.post("/", middleware.isAdministrator, function(req, res){
    var questionText    = req.body.questionText,
        helpText        = req.body.helpText,
        pillar          = req.body.pillar,
        hasOptions      = req.body.hasOptions,
        optionTexts     = req.body.optionTexts,
        weights         = req.body.weights,
        multiplier,
        options         = [];
        if(req.body.multiplier == "No. of"){
            multiplier  = req.body.multiplier + " " + req.body.noOfMultiplier;
        }
        else{
            multiplier  = req.body.multiplier;
        }
        if(hasOptions == "true"){
            var numOptions = req.body.numOptions;
            for(var i = 0; i < numOptions; i++){
                options.push({optionText: optionTexts[i], weight: weights[i]});
            }
        }
        else{
            if(multiplier == "Yes/No"){
                options = [{optionText: "Yes", weight: weights[0]}, {optionText: "No", weight: weights[1]}];
                hasOptions = true;
            }
            else{
                options = [{optionText: "Only Option", weight: req.body.weight}];
            }
        }
        var question = {questionText: questionText, helpText: helpText, pillar: pillar, hasOptions: hasOptions ,multiplier: multiplier, options: options};
        Question.create(question, function(err, newQuestion){
            if(err){
                console.log(err);
                req.flash("error", err.message);
                res.redirect("questions/new");
            }
            else{
                req.flash("success", "Question created successfully");
                res.redirect("/questions");
            }
        });
});

//Edit Route
router.get("/:id/edit", middleware.isAdministrator, function(req, res){
    Question.findById(req.params.id, function(err, foundQuestion){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            res.render("questions/edit.ejs", {question: foundQuestion});
        }
    });
});

//Update Route
router.put("/:id", middleware.isAdministrator, function(req, res){
    var questionText    = req.body.questionText,
        helpText        = req.body.helpText,
        pillar          = req.body.pillar,
        multiplier      = req.body.multiplier,
        optionTexts     = req.body.optionTexts,
        weights         = req.body.weights,
        numOptions      = weights.length;

        if(numOptions > 1){
            hasOptions = true;
            console.log("if");
            for(var i = 0; i < numOptions; i++){
                options.push({optionText: optionTexts[i], weight: weights[i]});
            }            
        }
        else{
            hasOptions = false;
            options = [{optionText: "Only Option", weight: weights[0]}];
        }

    var question = {questionText: questionText, helpText: helpText, pillar: pillar, hasOptions: hasOptions ,multiplier: multiplier, options: options};
    Question.findByIdAndUpdate(req.params.id, question, function(err, updatedQuestion){
        if(err){
            req.flash("error", err.message);
        }
        else{
            req.flash("success", "Question updated successfully");
            res.redirect("/questions");
        }
    })
});

router.delete("/:id",middleware.isAdministrator, function(req, res){
    Question.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/questions");
       } else {
           res.redirect("/questions");
       }
    });
 });

module.exports = router;
