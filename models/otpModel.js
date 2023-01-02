const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//User Model Collection Create
const Otp = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    code: {
      type: String,
    },
    expireIn: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Otp", Otp);
