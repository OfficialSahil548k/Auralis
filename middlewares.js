const listing = require('./models/listing');
const Review = require('./models/reviews.js');
const { listingSchema, reviewSchema } = require("./Schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in before adding a location!");
    return res.redirect('/login');
  }
  next();
}


module.exports.SaveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let list = await listing.findById(id);
  if (!list.owner._id.equals(req.user._id)) {
    req.flash("error", "You are not the Owner of this Location posted");
    return res.redirect(`/listing/${id}`);
  }
  next();
}

module.exports.validateListing = (req, res, next) => {
  const data = req.body.listing;
  let { error } = listingSchema.validate(data);
  // console.log(error)
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const data = req.body.listing;
  console.log("listing", data);
  let { error } = reviewSchema.validate(data);
  // console.log(error)
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.CurrUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listing/${id}`);
  }
  next();
}