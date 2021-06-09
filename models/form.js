var mongoose = require("mongoose");

var FormSchema = new mongoose.Schema({
    academicYear: String,
    semester: String,
    answers: [
        {
            questionId:{
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Question"
            },
            answerTexts: Array, 
            questionScore: Number
        }        
    ],
    teachingScore: Number, 
    rdScore: Number, 
    undScore: Number,
    isApproved: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Form", FormSchema);