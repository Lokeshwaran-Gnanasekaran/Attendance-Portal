var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var userSchema=new Schema({
    username:String,
    googleId:String,
    thumbnail:String,
    profession:{
        type:String,
        default:'student'
    }
});
var User=mongoose.model("user",userSchema);
module.exports=User;