var mang    = require("mongoose");
var attendanceSch = new mang.Schema({
    present :{
        type: Array,
        default: []
    },
    absent :{
        type: Array,
        default: []
    },
    stud_id : String
});
var attendance = mang.model("attendance",attendanceSch);
module.exports = attendance;