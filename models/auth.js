var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var AuthSchema = new mongoose.Schema({
    user: {
        id:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        },
    department: String, 
    faculty: String,
    },
    username: String,
    password: String,
    role: String,
    notifications:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Notification"
        }
    ]
});

AuthSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Auth", AuthSchema);
