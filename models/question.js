var mongoose = require("mongoose");

var QuestionSchema = new mongoose.Schema({
    questionText: String, 
    helpText: String,
    pillar: String, 
    multiplier: String,
    hasOptions: Boolean, 
    options:[
        {
        optionText: String,
        weight: Number
        }
    ]
});

module.exports = mongoose.model("Question", QuestionSchema);
