const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

router.get("/login/sucess", (req, res) => {
  if (req.user) {
    console.log(req.user);
    User.findOne({ googleId: req.user.id }).then((currentUser) => {
      if (currentUser) {
        //already have this account
        console.log("user is: ", currentUser);
        const token = jwt.sign({ userId: currentUser._id }, "rentnreaduser");
        console.log(token);
        res.status(200).json({
          token: token,
          userType: currentUser.userType,
          username: currentUser.username,
        });
      } else {
        //if not create user in our database
        new User({
          googleId: req.user.id,
          username: req.user._json.given_name,
          name: req.user._json.name,
          email: req.user._json.email,
          userType: "user",
          // profile_pic: profile._json.img.url,
        })
          .save()
          .then((newUser) => {
            console.log("Created new User : ", newUser);
            const token = jwt.sign({ userId: newUser._id }, "rentnreaduser");
            console.log(token);
            res.status(200).json({
              token: token,
              userType: newUser.userType,
              username: newUser.username,
            });
          });
      }
    });
    // res.status(200).json({
    //   error: false,
    //   message: "Successfully Logged In",
    //   user: req.user,
    // });
  } else {
    res.status(403).json({
      error: true,
      message: "Not Authorized",
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in Faliure",
  });
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    faliureRedirect: "/login/failed",
  })
);

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("http://localhost:3000");
});

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  res.render("profile", { user: req.user });
});

module.exports = router;
