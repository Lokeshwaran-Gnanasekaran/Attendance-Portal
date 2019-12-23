var mang    = require("mongoose");
var staffSch = new mang.Schema({
    username :String,
    googleId:String,
    mailid:String,
    subject:String,
    designation:String,
    profession : {
        type : String,
        default : "staff"
    }
});
var staff = mang.model("staff",staffSch);
module.exports = staff;