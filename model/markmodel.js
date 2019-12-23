var mang    = require("mongoose");
var markSch = new mang.Schema({
    tamil : {
        score : {
            type : Number,
            default : null
        },
        icon : {
            type: String,
            default : "fas fa-gopuram"
        }
    },
    english : {
        score : {
            type : Number,
            default : null
        },
        icon : {
            type: String,
            default : "fab fa-amilia"
        }
    },
    maths : {
        score : {
            type : Number,
            default : null
        },
        icon : {
            type: String,
            default : "fas fa-calculator"
        }
    },
    science : {
        score : {
            type : Number,
            default : null
        },
        icon : {
            type: String,
            default : "fas fa-atom"
        }
    },
    social : {
        score : {
            type : Number,
            default : null
        },
        icon : {
            type: String,
            default : "fas fa-archway"
        }
    },
    stud_id : {
        type : String
    }
});
var mark = mang.model("mark",markSch);
module.exports = mark;