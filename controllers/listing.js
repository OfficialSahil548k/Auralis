const listing = require('../models/listing.js');
const ExpressError = require("../utils/ExpressError.js");
const mongoose = require("mongoose");

module.exports.index = async (req, res, next) => {
    let allListing = await listing.find({});
    res.render("listings/index.ejs", { allListing });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.renderShowPage = async (req, res, next) => {
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
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!list) {
        req.flash("error", "location You Requested not found");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs", { list });
}

module.exports.createNew = async (req, res, next) => {
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully addeed a new location");
    res.redirect(`/listing`);
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
        req.flash("error", "location You Requested not found");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { list });
}

module.exports.updateInfo = async (req, res) => {
    const { id } = req.params;
    if (!req.body || !req.body.listing) {
        throw new ExpressError(400, "Send Valid data of location");
    }
    await listing.findOneAndUpdate({ _id: id }, req.body.listing);
    req.flash("success", "Successfully edited the location");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyLocation = async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete({ _id: id });
    console.log("Successfully deleted");
    req.flash("success", "Location Deleted");
    res.redirect("/listing");
}