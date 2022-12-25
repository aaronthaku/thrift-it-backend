const bcryptjs = require("bcryptjs");
const express = require("express");
const app = express();
const router = new express.Router();
const jwt = require("jsonwebtoken");
const uploadFile = require("../file/uploadFile");
//Model Imports
const User = require("../models/userModel");
const auth = require("../middleware/auth");

// For Registering Process of User
router.post("/user/register", (req, res) => {
  const username = req.body.username;
  User.findOne({ username: username })
    .then((user_data) => {
      if (user_data != null) {
        res
          .status(200)
          .json({ msg: "Username Already Exists", success: "exists" });
        return;
      }
      const username = req.body.username;
      const email = req.body.email;
      const contact_no = req.body.contact_no;
      const password = req.body.password;

      bcryptjs.hash(password, 10, (e, hashed_pw) => {
        const data = new User({
          username: username,
          email: email,
          contact_no: contact_no,
          password: hashed_pw,
          userType: "user",
        });
        data
          .save()
          .then(() => {
            res
              .status(201)
              .json({ msg: "User Registered Successfully", success: true });
          })
          .catch((e) => {
            res
              .status(401)
              .json({ msg: "Something Went Wrong, Please Try Again!! " });
          });
      });
    })
    .catch();
});

// For Login Process of User
router.post("/user/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username })
    .then((user_data) => {
      if (user_data == null) {
        res.status(404).json({ msg: "Invalid Credentials!!!" });
        return;
      }
      bcryptjs.compare(password, user_data.password, (e, result) => {
        if (result == false) {
          res.status(401).json({ msg: "Invalid Credentials!!!" });
          return;
        }
        //It creates token for the logged in user...
        //The token stores the logged in user`s ID...
        const token = jwt.sign({ userId: user_data._id }, "rentnreaduser");
        res.status(201).json({ token: token, userType: user_data.userType });
      });
    })
    .catch();
});

router.get("/user/get", auth.userGuard, (req, res) => {
  res.status(201).json({
    success: true,
    data: {
      first_name: req.userInfo.first_name,
      last_name: req.userInfo.last_name,
      address: req.userInfo.address,
      contact_no: req.userInfo.contact_no,
      gender: req.userInfo.gender,
      username: req.userInfo.username,
      email: req.userInfo.email,
      profile_pic: req.userInfo.profile_pic,
      userType: req.userInfo.userType,
    },
  });
});

router.get("/user/getadmin", auth.adminGuard, (req, res) => {
  res.status(201).json({
    success: true,
    data: {
      first_name: req.adminInfo.first_name,
      last_name: req.adminInfo.last_name,
      address: req.adminInfo.address,
      contact_no: req.adminInfo.contact_no,
      gender: req.adminInfo.gender,
      username: req.adminInfo.username,
      email: req.adminInfo.email,
      profile_pic: req.adminInfo.profile_pic,
      userType: req.adminInfo.userType,
    },
  });
});

module.exports = router;
