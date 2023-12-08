const express = require("express");

const router = express.Router();

const passport = require("passport");

const User = require("../models/user")


const  GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECERT,
    callbackURL: "http://localhost:3000/google/callback"
  },
 async function(accessToken, refreshToken, profile, done) {
   
    const newUser={
        googleID:profile.id,
        displayName:profile.displayName,
        firstName:profile.name.givenName,
        LastName:profile.name.familyName,
        photos:profile.photos[0].value
    }


    try{

    let user =  await User.findOne({googleID : profile.id})

    if(user){
        done(null,user)
    }
    else{
        user = await User.create(newUser)
        done(null,user);
    }

    }catch(error){
        console.log(error)
    }
  }
));

router.get('/auth/google',
  passport.authenticate('google', { scope: ['email','profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login-failure',
    successRedirect:"/dashboard" }),
  
  );
  

router.get("/login-failure",(req,res)=>{
    res.send("Something went wrong");
});

// Session destroy
router.get('/logout',(req,res)=>{
    req.session.destroy((error) =>{
        if(error){
            console.log(error);
            res.send("Error Logging Out");
        }
        else{
            res.redirect("/");
        }
    } )
})

// User Object to format that can be stored(user.id)
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  

// user.id to user boject (Reterival)
passport.deserializeUser((id, done) => {
    User.findById(id).exec()
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
 
module.exports = router;
