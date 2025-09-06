const listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    let List = await listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    List.reviews.push(newReview);
    await newReview.save();
    await List.save();
    req.flash("success", "Review Successfully added");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log("Successfully deleted review");
    req.flash("success", "Review deleted");
    res.redirect(`/listing/${id}`);
}