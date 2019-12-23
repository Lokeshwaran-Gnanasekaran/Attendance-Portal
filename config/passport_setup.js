var passport=require("passport");
var googlestrategy=require("passport-google-oauth20");
var keys=require('./key');
var User=require("../model/usermodel");

passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(null,user);
    });
});
passport.use(new googlestrategy({
    callbackURL:'/auth/google/redirect',
    clientID:keys.google.clientID,
    clientSecret:keys.google.clientSecret
},function(accessToken,refreshToken,profile,done){
    console.log("callback gets fired");
    console.log(profile);
    console.log(profile.id);
    console.log(profile.displayName);
    console.log(profile._json.picture);
    User.findOne({googleId:profile.id},function(err,currentUser){
        if(currentUser){
            console.log("current user"+currentUser);
        done(null,currentUser);

        }
        else{
            var newUser=new User({
                username:profile.displayName,
                googleId:profile.id,
                thumbnail:profile._json.picture
            });
            console.log(newUser);
            newUser.save(function(err,newUser){
                if(err)
                console.log(err);
                else{
                    console.log(newUser);
                    done(null,newUser);
                }
            });

        }
        
    })
   
}
));