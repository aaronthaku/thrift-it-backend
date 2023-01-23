const express = require("express");
const router = new express.Router();
const Review = require("../models/reviewModel");
const auth = require("../middleware/auth");

router.post("/add_review", auth.userGuard, (req, res) => {
  const data = new Review({
    productId: req.body.productId,
    // rating: req.body.rating,
    review: req.body.review,
    userId: req.userInfo._id,
  });
  data
    .save()
    .then(() => {
      res.status(201).json({
        success: true,
        msg: "Review added successfully!",
      });
    })
    .catch((e) => {
      res.json({
        success: false,
        msg: e,
      });
    });
});

router.get("/get/book_reviews/:id", (req, res) => {
  Review.find({ productId: req.params.id })
    .populate("userId")
    .then((reviews) => {
      res.status(200).json({
        success: true,
        reviews: reviews,
      });
    })
    .catch((e) => {
      res.status(404).json({
        success: false,
        msg: "No reviews found",
      });
    });
});

module.exports = router;
