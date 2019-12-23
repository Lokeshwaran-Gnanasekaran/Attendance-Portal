var mang    = require("mongoose");
var adminSch = new mang.Schema({
    username :String,
    googleId :String,
    thumbnail:String,
    profession : {
        type : String,
        default : "admin"
    }
});
var admin = mang.model("admin",adminSch);
module.exports = admin;