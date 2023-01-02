const express = require("express");
const User = require("../models/userModel");
const Otp = require("../models/otpModel");
const router = new express.Router();
const nodemailer = require("nodemailer");
const bcryptjs = require("bcryptjs");

router.post("/otp-send", async (req, res) => {
  let data = await User.findOne({
    email: req.body.email,
  });
  const responseType = {};
  if (data) {
    let otpcode = Math.floor(Math.random() * 10000 + 1);
    let otpData = new Otp({
      email: req.body.email,
      code: otpcode,
      expireIn: new Date().getTime() + 300 * 1000,
    });
    let otpResponse = await otpData.save();

    responseType.statusText = "Success";
    responseType.message = "Please check Your Email";

    // mail sending to emailId
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tsukiak2@gmail.com",
        pass: "tfvkvcpsdhyefikb",
      },
    });

    const mailOption = {
      from: "tsukiak2@gmail.com",
      to: req.body.email,
      subject: "ThriftIt OTP CODE for Password Change",
      html: `Your OTP CODE is ${otpcode}`,
    };

    transporter.sendMail(mailOption, (error, response) => {
      if (error) {
        res.status(400).json({
          msg: error,
        });
      } else {
        res.status(200).json(responseType);
      }
    });

    transporter.close();
  } else {
    responseType.statusText = "Failed";
    responseType.message = "Email is not registerd";
  }
  res.status(200).json(responseType);
});

router.put("/reset-password", async (req, res) => {
  let data = await Otp.findOne({
    $and: [{ email: req.body.email }, { code: req.body.otpcode }],
  });
  const response = {};
  if (data) {
    let currentTime = new Date().getTime();
    let diff = data.expireIn - currentTime;
    if (diff < 0) {
      response.message = "OTP Code Expire";
      response.success = "Failed";
    } else {
      let user = await User.findOne({
        email: req.body.email,
      });
      bcryptjs.hash(req.body.password, 10, (e, hashed_pw) => {
        user.password = hashed_pw;
        user.save();
      });
      response.message = "Password Changed Successfully";
      response.success = "Success";
    }
  } else {
    response.message = "Wrong OTP Code";
    response.success = "Error";
  }
  res.status(200).json(response);
});

module.exports = router;
