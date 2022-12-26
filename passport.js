const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("./models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/thirdpartyRouter/google/callback",
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
      //   const user = {
      //     username: profile.displayName,
      //     avatar: profile.photos[0],
      //   };
      //   user.save;

      // User.findOne({ googleId: profile.id }).then((currentUser) => {
      //   if (currentUser) {
      //     //already have this account
      //     console.log("user is: ", currentUser);
      //     const token = jwt.sign({ userId: currentUser._id }, "rentnreaduser");
      //     res.status(201).json({ token: token, userType: user_data.userType });
      //     done(null, currentUser);
      //   } else {
      //     //if not create user in our database
      //     new User({
      //       googleId: profile.id,
      //       username: profile.displayName,
      //       name: profile.displayName,
      //       // profile_pic: profile._json.img.url,
      //     })
      //       .save()
      //       .then((newUser) => {
      //         console.Consolelog("Created new User : ", newUser);
      //         const token = jwt.sign({ userId: newUser._id }, "rentnreaduser");
      //         res
      //           .status(201)
      //           .json({ token: token, userType: user_data.userType });
      //         done(null, newUser);
      //       });
      //   }
      // });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
