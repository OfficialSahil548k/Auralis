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
router.get(
  "/new",
  WrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  })
);

//show route
router.get(
  "/:id",
  WrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { list });
  })
);

// create route
router.get("/reviewproper", async (req, res, next) => {
  res.send("reviewrouter is working ");
});
router.post(
  "/",
  validateListing,
  WrapAsync(async (req, res, next) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listing`);
  })
);

//edit route
router.get(
  "/:id/edit",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
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
    res.redirect("/listing");
  })
);

module.exports = router;
