const mongoose = require("mongoose");

//Product Model Collection Create
const Product = new mongoose.Schema({
  product_pic: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  rich_desc: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: [
    {
      type: String,
      required: true,
    },
  ],

  product_price: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    default: "Pending",
  },
  productOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  is_available: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Product", Product);
