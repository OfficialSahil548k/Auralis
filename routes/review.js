const express = require("express");
const router = express.Router();
const WrapAsync = require('../utils/WrapAsync.js');
const { reviewSchema } = require('../Schema.js');
const ExpressError = require('../utils/ExpressError.js');
const listing = require('../models/listing.js');
const Review = require('../models/reviews.js');

const validateReview = (req,res,next) =>{
    const data = req.body.listing;
    let {error} = reviewSchema.validate(data);
    // console.log(error)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
       return  next(new ExpressError(400,errMsg));
    }
    next() ;
}

//Review Route
router.post('/' ,validateReview, WrapAsync(async (req,res)=>{
      const {id} = req.params;
      let List = await listing.findById(id);
      let newReview = new Review(req.body.review)
      List.reviews.push(newReview);
      await newReview.save();
      await List.save();
      res.redirect(`/listing/${id}`);
}));

// Delete Review
router.delete('/:reviewId', WrapAsync(async (req,res,next)=>{
    const {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log("Successfully deleted review");
    res.redirect(`/listing/${id}`);
}));

module.exports = router;