const express = require("express");
const router = express.Router({ mergeParams: true }); // this is to merge the parents params into this router.
// const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const {validateReview} = require('../middlewares.js')
const listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

// create Review Route
router.post(
  "/",
  validateReview,
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    let List = await listing.findById(id);
    let newReview = new Review(req.body.review);
    List.reviews.push(newReview);
    await newReview.save();
    await List.save();
    req.flash("success", "Review Successfully added");
    res.redirect(`/listing/${id}`);
  })
);

// Delete Review
router.delete(
  "/:reviewId",
  WrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log("Successfully deleted review");
    req.flash("success", "Review deleted");
    res.redirect(`/listing/${id}`);
  })
);

module.exports = router;
