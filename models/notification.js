var mongoose = require("mongoose");

var NotificationSchema = new mongoose.Schema({
    text: String,
    type: String, 
    isRead: {type: Boolean, default: false}
});

module.exports = mongoose.model("Notification", NotificationSchema);
