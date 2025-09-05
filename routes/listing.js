const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const WrapAsync = require("../utils/WrapAsync.js");
const { listingSchema } = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");

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
router.get("/new", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in before adding a location!");
    return res.redirect('/login');
  }
  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  WrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await listing.findById(id).populate("reviews");
    if (!list) {
      req.flash("error", "location You Requested not found");
      res.redirect("/listing");
    }
    res.render("listings/show.ejs", { list });
  })
);

// create route
router.post(
  "/",
  validateListing,
  WrapAsync(async (req, res, next) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Successfully addeed a new location");
    res.redirect(`/listing`);
  })
);

//edit route
router.get(
  "/:id/edit",
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
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete({ _id: id });
    console.log("Successfully deleted");
    req.flash("success", "Location Deleted");
    res.redirect("/listing");
  })
);

module.exports = router;
