const express = require("express");
const router = express.Router();

// const popular_df = require("../popular.pkl");
// const pt = require("../pt.pkl");
// const books = require("../books.pkl");
// const similarity_scores = require("../similarity_scores.pkl");

router.get("/", (req, res) => {
  res.send({
    name: popular_df["Product-Title"].values,
    author: popular_df["Product-Owner"].values,
    image: popular_df["Image-URL-M"].values,
    votes: popular_df["num_ratings"].values,
    ratings: popular_df["avg_rating"].values,
  });
});

module.exports = router;
