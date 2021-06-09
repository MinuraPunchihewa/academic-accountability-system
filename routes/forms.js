    var express             = require("express"),
    router              = express.Router({mergeParams: true}),
    User                = require("../models/user"),
    Question            = require("../models/question"),
    Form                = require("../models/form"),
    UserNotification    = require("../models/notification"),
    middleware          = require("../middleware");

//Index Route
router.get("/", middleware.isHodDean, function(req, res){
    User.find({}).populate('forms').exec(function(err, foundAcademics){
        if(err){
            console.log("ERROR!");
        }
        else{
            res.render("forms/index.ejs", {academics: foundAcademics});
        }
    });
});

//
router.get("/new", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundAcademic){
        if(err){
            console.log("ERROR!");   
        }
        else{
            Question.find({}, function(err, questions){
                if(err){
                    console.log("ERROR!");
                }
                else{
                    res.render("forms/new.ejs", {questions: questions, academic: foundAcademic});
                }
            });
        }
    });
});

//
router.post("/", function(req, res){
    //lookup academic using ID 
    User.findById(req.params.id, function(err, foundAcademic){
        if(err){
            console.log("ERROR!");
        }
        else{
            Question.find({}, function(err, questions){
                if(err){
                    console.log(err);
                }
                else{
                    var academicYear            = req.body.academicYear,
                        semester                = req.body.semester,
                        answers                 = [],
                        answerTextArr           = req.body.answerTextArr,
                        optionAnswerTextArr     = req.body.optionAnswerTextArr,
                        answerTextCount         = 0,
                        optionAnswerTextCount   = 0,
                        answerTexts             = [],
                        multiplierValue         = 0,
                        questionScore           = 0,
                        teachingScore           = 0, 
                        rdScore                 = 0, 
                        undScore                = 0;

                    questions.forEach(function(question){
                        var questionId = question._id;
                        answerTexts             = [];
                        questionScore           = 0;

                        if(question.options.length == 1){
                            var answerArr           = answerTextArr[answerTextCount].split('\r');
                            answerArr.forEach(function(answer){
                                answerTexts.push(answer.replace(/\n|\r/g, ""));
                            })
                            if(question.multiplier == "Total Credits"){
                                answerTexts.forEach(function(answer){
                                    var creditValue = answer.substring(answer.length - 1, answer.length);
                                    multiplierValue = multiplierValue + parseInt(creditValue, 10);                                });
                            }
                            if(question.multiplier.substring(0, 6) == "No. of"){
                                multiplierValue     = answerTexts.length;
                            }
                            questionScore           = multiplierValue * question.options[0].weight;
                            answerTextCount++;
                        }
                        else{
                            if(question.multiplier == "Yes/No"){
                                answerTexts.push(optionAnswerTextArr[optionAnswerTextCount]);
                                if(answerTexts[0] == "Yes"){
                                    questionScore = question.options[0].weight;
                                }
                                else{
                                    questionScore = question.options[1].weight;
                                }
                                optionAnswerTextCount++;
                            }
                            else{
                                question.options.forEach(function(option){
                                    var answerArr       = [];
                                    answerArr           = optionAnswerTextArr[optionAnswerTextCount].split('\r');
                                    answerArr.forEach(function(answer){
                                        answerTexts.push(answer.replace(/\n|\r/g, ""));
                                    });
                                    if(question.multiplier.substring(0, 6) == "No. of"){
                                        questionScore   = questionScore + (option.weight * answerArr.length);
                                        optionAnswerTextCount++;
                                    }
                                    if(question.multiplier == "Total Credits"){
                                        answerArr.forEach(function(answer){
                                            var creditValue = answer.substring(answer.length - 1, answer.length);
                                            multiplierValue = multiplierValue + parseInt(creditValue, 10);
                                            questionScore   = questionScore + (multiplierValue * option.weight);
                                        });
                                    }
                                });
                            }
                        }
                        if(question.pillar == "Teaching"){
                            teachingScore   = teachingScore + questionScore;
                        }
                        if(question.pillar == "Research and Development"){
                            rdScore         = rdScore + questionScore;      
                        }
                        if(question.pillar == "University and National Development"){
                            undScore        = undScore + questionScore;
                        }
                        answers.push({questionId: questionId, answerTexts: answerTexts, questionScore: questionScore});
                    });
                    if(req.user.role == "Dean"){
                        var form = {isApproved: true, academicYear: academicYear, semester:semester, answers: answers, teachingScore: teachingScore, rdScore: rdScore, undScore: undScore};
                    } else{
                        var form = {academicYear: academicYear, semester:semester, answers: answers, teachingScore: teachingScore, rdScore: rdScore, undScore: undScore};
                    }
                    Form.create(form, function(err, newForm){
                        if(err){
                            console.log(err);
                        }
                        else{
                            foundAcademic.forms.push(newForm._id);
                            foundAcademic.save();
                            var text                 = req.user.username + " has made a submission";
                            var approvalNotification = {text: text, type: "Approval", formId: newForm._id};
                            UserNotification.create(approvalNotification, function(err, newNotification){
                                var department = req.user.user.department;
                                var faculty    = req.user.user.faculty;
                                if(req.user.role == "Head of Department"){
                                    Auth.find({"user.faculty": faculty, role: "Dean"}, function(err, foundDean){
                                        if(err){
                                            console.log(err);
                                        }
                                        else{
                                            foundDean[0].notifications.push(newNotification._id);
                                            foundDean[0].save();
                                        }
                                        
                                    })
                                }
                                if(req.user.role == "Lecturer"){
                                    Auth.find({"user.department": department, role: "Head of Department"}, function(err, foundHod){
                                        if(err){
                                            console.log(err);
                                        }
                                        else{
                                            console.log(foundHod);
                                            foundHod[0].notifications.push(newNotification._id);
                                            foundHod[0].save();
                                        }
                                        
                                    })
                                }
                            });
                            req.flash("success", "Form submitted succesfully");
                            res.redirect("/academics/" + foundAcademic._id); 
                        }
                    });   
                }
            });
        }
    });
});

router.get("/:formId", middleware.isLoggedIn, function(req, res){
    Form.findById(req.params.formId, function(err, foundForm){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            User.findById(req.params.id, function(err, foundAcademic){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                }
                else{
                    Question.find({}, function(err, foundQuestions){
                        if(err){
                            req.flash("error", err.message);
                            res.redirect("back");
                        }
                        else{
                            res.render("forms/show.ejs", {form: foundForm, academic: foundAcademic, questions: foundQuestions});
                        }
                    })
                }
            });
        }
    });
});

router.put("/:formId", middleware.isLoggedIn, function(req, res){
    var submitButton = req.body.submitButton;
    console.log(submitButton);
    if(submitButton == "APPROVE"){
        Form.findByIdAndUpdate(req.params.formId, {isApproved: true}, function(err, updatedForm){
            if(err){
                req.flash("error", err.message);
                res.redirect("/academics/" + req.params.id + "/forms");
            }
            else{
                req.flash("success", "Approved submission successfully");
                res.redirect("/academics/" + req.params.id + "/forms");            
            }
        })
    }
    if(submitButton == "REJECT"){
        Form.findByIdAndRemove(rew.params.formId, function(err){
            if(err){
                console.log(err);
            }
            else{
                req.flash("success", "Rejected submission successfully");
                res.redirect("/academics/" + req.params.id + "/forms");
            }
        })
    }
})

module.exports = router;