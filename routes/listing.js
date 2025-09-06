const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const WrapAsync = require("../utils/WrapAsync.js");
const { listingSchema } = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const mongoose = require("mongoose");
const { isLoggedIn } = require('../middlewares.js')

const validateListing = (req, res, next) => {
  const data = req.body.listing;
  let { error } = listingSchema.validate(data);
  // console.log(error)
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

// Index route
router.get(
  "/",
  WrapAsync(async (req, res, next) => {
    let allListing = await listing.find({});
    res.render("listings/index.ejs", { allListing });
  })
);

//new page
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  WrapAsync(async (req, res, next) => {
    let { id } = req.params;

    // checks if the id is in the right format (mongodb objectId format) .
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressError(400, "Id is not valid."));
    }

    // checks if the id exists in the listing collection.
    const doc = await listing.findById(id);
    if (!doc) {
      return next(
        new ExpressError(404, "Location not found or has been deleted.")
      );
    }
    const list = await listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!list) {
      req.flash("error", "location You Requested not found");
      res.redirect("/listing");
    }
    console.log(list);
    res.render("listings/show.ejs", { list });
  })
);

// create route

router.post(
  "/",
  validateListing,
  WrapAsync(async (req, res, next) => {
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully addeed a new location");
    res.redirect(`/listing`);
  })
);

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
      req.flash("error", "location You Requested not found");
      res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { list });
  })
);

// update Route
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  WrapAsync(async (req, res) => {
    const { id } = req.params;

    if (!req.body || !req.body.listing) {
      throw new ExpressError(400, "Send Valid data of location");
    }
    await listing.findOneAndUpdate({ _id: id }, req.body.listing);
    req.flash("success", "Successfully edited the location");
    res.redirect(`/listing/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete({ _id: id });
    console.log("Successfully deleted");
    req.flash("success", "Location Deleted");
    res.redirect("/listing");
  })
);

module.exports = router;
