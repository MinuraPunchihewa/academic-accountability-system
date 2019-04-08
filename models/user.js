var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    profilePicture: String,
    prefix: String,
    firstName: String, 
    secondName: String,
    emailAddress: String,
    telephoneNumber: String,
    jobTitle: String, 
    department: String,
    faculty: String, 
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("User", userSchema);