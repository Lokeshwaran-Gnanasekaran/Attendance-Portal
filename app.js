var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require("mongoose");
var keys=require("./config/key");
var flash=require("connect-flash");

var passportSetup=require("./config/passport_setup.js");
var cookieSession=require("cookie-session");
var passport=require('passport');
var staff=require("./model/staffmodel");
//var admin=require("./model/adminmodel");
var mark=require("./model/markmodel");
var user=require("./model/usermodel");
var attendance=require("./model/attendancemodel");
app.set("view engine",'ejs');

app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[keys.session.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());
var mon=mongoose.connect("mongodb://localhost/Student");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(flash());
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
var dAttendance={
    "present":[],
    "absent":[]
}
var fAttendance={
    "present":[],
    "absent":[]
}
var dMark={
    "tamil":{"score":null,"icon":"fas fa-gopuram"},
    "english":{"score":null,"icon":"fab fa-amilia"},
    "maths":{"score":null,"icon":"fas fa-calculator"},
    "science":{"score":null,"icon":"fas fa-atom"},
    "social":{"score":null,"icon":"fas fa-archway"}
}

if(mon){
    console.log("database connect");
}
else{
    console.log("not connected");
}
app.listen(3000,function(){
    console.log("Attendance portal");
});
app.get("/",function(req,res){
    res.render("landing");
});
app.get('/auth/login',function(req,res){
    res.render('login');
});
app.get("/auth/google",passport.authenticate("google",{
    scope : ['profile']
}));
app.get("/auth/logout",function(req,res){
    req.logout();
    res.redirect("/");
});
app.get('/auth/google/redirect',passport.authenticate('google'),function(req,res){
    res.render('profile');
});
app.get("/auth/profile-info",function(req,res){
    res.render("student/info");
})
app.get("/auth/profile-attendance",function(req,res){
    attendance.findOne({stud_id:req.user.googleId},function(err,fAttendance){
        if(fAttendance){
            res.render("student/attendance",{attendance:fAttendance});
        }
        else{
            res.render("student/attendance",{attendance:dAttendance});
        }
        
    })
})

app.get("/auth/profile-attendance1",function(req,res){
    attendance.findOne({stud_id:req.user.googleId},function(err,fAttendance){
        if(fAttendance){
            res.render("student/attendance1",{attendance:fAttendance});
        }
        else{
            res.render("student/attendance1",{attendance:dAttendance});
        }
        
    })
})    

app.get("/auth/profile-mark",function(req,res){
    mark.findOne({stud_id:req.user.googleId},function(err,fMark){
        if(fMark){
            console.log( typeof fMark);
            var Mark = fMark.toObject();
            res.render("student/mark",{mark:Mark});
        }
        else{
            console.log( typeof dMark);
            res.render("student/mark",{mark:dMark});
        }  
    })
})
app.get("/auth/profile-report",reportcalc,function(req,res){
    res.render("student/report");
})
app.get("/auth/profile-info-admin",function(req,res){
    res.render("admininfo");
});
app.get("/auth/profile-staff-admin",function(req,res){
    res.render("admincreate");
});
app.post("/auth/profile-staff-admin",function(req,res){
    var username=req.body.usrnm;
    var designation=req.body.degree;
    var profession=req.body.profession;
    var subject=req.body.Subject;
    var email=req.body.email;
    var googleId=req.body.id;
    var newstaff=new staff({
        "username":username, "googleId":googleId,"profession":profession,"Subject":subject,"mailid":email,"designation":designation
    });
    newstaff.save(function(err,newstaff){
        if(err){
            console.log(err);

        }
        else{
            req.flash("success","Succesfully Registered");
            res.render("admincreate");

        }
    })
    
})

app.get("/auth/profile-info-staff",function(req,res){
    res.render("staff/info",{staff:staff});
})
app.get("/auth/profile-attendance-update",function(req,res){
    res.render("staff/attendance");
})
app.get("/auth/profile-mark-update",function(req,res){
    res.render("staff/mark");
})
app.post("/auth/profile-mark-update1",function(req,res){
    mark.findOne({stud_id:req.body.stud_id},function(err,fMark){
        res.locals.stud_id=req.body.stud_id;
        if(fMark){
            console.log(fMark);
            console.log("lll");
            res.render("staff/mark1",{mark:fMark});
        }
        else{
            console.log("elsepart");
            res.render("staff/mark1",{mark:dMark});
        }  
    })
})
app.post("/auth/:id/profile-mark-update",function(req,res){
    mark.findOne({stud_id:req.params.id},async function(err,fMark){
        var obj={
            "stud_id":req.params.id,
            "tamil":{"score":req.body.tamil},
            "english":{"score":req.body.english},
            "maths":{"score":req.body.maths},
            "science":{"score":req.body.science},
            "social":{"score":req.body.social}
        }
        if(fMark){
            await mark.findByIdAndUpdate(fMark._id,obj,function(err1,uMark){
                res.redirect("/auth/profile-mark-update");
                console.log("mark update");
                console.log(uMark);
                
            })
        }
        else{
            await mark.create(obj,function(err1,cMark){
                res.redirect("/auth/profile-mark-update");
                console.log("mark create");
                console.log(cMark);
                
            })
        }
    })
})
app.post("/auth/profile-attendance-update",async function(req,res){
    await attendance.findOne({stud_id:req.body.stud_id},function(err,fAttendance){
        if(fAttendance){
            if(fAttendance.present.includes(req.body.date) || fAttendance.absent.includes(req.body.date)){
                console.log("sss it inc");
                fAttendance.present = fAttendance.present.filter(item => item !== req.body.date);
                fAttendance.absent = fAttendance.absent.filter(item => item !== req.body.date);
            }
            if(req.body.action === "present"){
                fAttendance.present.push(req.body.date);
                fAttendance.save();
            }
            else if(req.body.action === "absent"){
                fAttendance.absent.push(req.body.date);
                fAttendance.save();
            }
        }
        else{
            console.log(req.body.stud_id);
            attendance.create({
                stud_id: req.body.stud_id
             },function(err1,cAttendance){
                if(req.body.action === "present"){
                    console.log("cAtt :   " + cAttendance);
                    cAttendance.present.push(req.body.date);
                    cAttendance.save();
                }
                else if(req.body.action === "absent"){
                    cAttendance.absent.push(req.body.date);
                    cAttendance.save();
                }
            })
        }
    })
    res.redirect("back");
});
function reportcalc(req,res,next){
    attendance.findOne({stud_id:req.user.googleId},function(err,fAttendance){
        if(fAttendance){
            res.locals.pAttendance=(fAttendance.present.length/(fAttendance.present.length + fAttendance.absent.length))* 100;
            mark.findOne({stud_id:req.user.googleId},function(err1,fMark){
                if(fMark && fMark.tamil.score && fMark.english.score && fMark.maths.score && fMark.science.score && fMark.social.score){
                    var pMark=((fMark.tamil.score + fMark.english.score + fMark.maths.score + fMark.science.score + fMark.social.score)/5);
                    res.locals.pMark=pMark;
                    if(pMark >= 90){
                        res.locals.grade = "O";
                    }
                    else if(pMark >= 80){
                        res.locals.grade = "A";
                    }
                    else if(pMark >= 70){
                        res.locals.grade = "B";
                    }
                    else if(pMark >= 60){
                        res.locals.grade = "C";
                    }
                    else{
                        res.locals.grade = "D";
                    }
                    next();
                }
                else{
                    res.locals.pMark = null;
                    next();
                }
            })
        }
        else{
            res.locals.pAttendance=null;
            next();
        }
    })
}