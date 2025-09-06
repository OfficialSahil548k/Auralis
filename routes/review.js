const express = require("express");
const router = express.Router({ mergeParams: true }); // this is to merge the parents params into this router.
const WrapAsync = require("../utils/WrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middlewares.js')
const ReviewController = require('../controllers/reviews.js');

// create Review Route
router.post("/",isLoggedIn,validateReview,WrapAsync(ReviewController.createReview));

// Delete Review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,WrapAsync(ReviewController.destroyReview));

module.exports = router;
