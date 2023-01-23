const express = require("express");
const router = new express.Router();

//Importing Model
const Wishlist = require("../Models/wishlistModel");
const auth = require("../middleware/auth");

//Route To Insert product To Wishlist By Customer
router.post("/wishlist/insert/", auth.userGuard, (req, res) => {
  Wishlist.findOne({
    $and: [
      { userId: req.userInfo._id },
      {
        productId: req.body.productId,
      },
    ],
  })
    .then((wishlist) => {
      console.log(wishlist);
      if (wishlist !== null) {
        res
          .status(201)
          .json({ msg: "Product Already Added To Cart", success: true });
      } else {
        const userId = req.userInfo._id;
        const productId = req.body.productId;

        const data = new Wishlist({
          userId: userId,
          productId: productId,
        });
        data
          .save()
          .then(() => {
            res.status(201).json({
              msg: "Product Added To Cart Successfully",
              success: true,
            });
          })
          .catch((e) => {
            res
              .status(400)
              .json({ msg: "Something Went Wrong, Please Try Again!!!" });
          });
      }
    })
    .catch((e) => {
      res
        .status(400)
        .json({ msg: "Something Went Wrong, Please Try Again!!!" });
    });
});

//Wishlist Get
router.get("/wishlist/get", auth.userGuard, (req, res) => {
  Wishlist.find({ userId: req.userInfo._id })
    .populate("productId")
    .then((wishlist) => {
      if (wishlist != null) {
        res.status(201).json({
          success: true,
          data: wishlist,
        });
      }
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

//Wishlist Delete
router.delete("/wishlist/delete/:id", auth.userGuard, (req, res) => {
  Wishlist.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(201).json({
        msg: "Product Deleted From Cart Successfully",
        success: true,
      });
    })
    .catch((e) => {
      res
        .status(400)
        .json({ msg: "Something Went Wrong, Please Try Again!!!" });
    });
});

module.exports = router;
