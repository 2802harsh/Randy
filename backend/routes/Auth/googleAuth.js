const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const User = require("../../models/userModel");

const router = express.Router();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/randy",
    proxy: true
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id}, function (err, user, created) {
      if(created===true){
        User.updateOne({ googleId: profile.id, },
          {username: profile.email, 
          profilePic: profile.picture,
          name: profile.displayName},
          (err) => {console.log(err)
        });
        user.username = profile.email;
      }
      return cb(err, user);
    });
  }
  
));

router.get("/",
  passport.authenticate('google', { scope: ["profile","email"] })
);

router.get("/randy",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    console.log(req.user);
    res.send("Google Authentication Done");
    
    // res.redirect(`http://localhost:3000/google/login/${req.user.username}`);
  }
);

  module.exports= router;