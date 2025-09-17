const Listing = require('../models/listing.js');
const ExpressError = require("../utils/ExpressError.js");
const mongoose = require("mongoose");

module.exports.index = async (req, res, next) => {
    let allListing = await Listing.find({});
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
    const doc = await Listing.findById(id);
    if (!doc) {
        return next(
            new ExpressError(404, "Location not found or has been deleted.")
        );
    }
    const list = await Listing.findById(id)
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
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "Successfully addeed a new location");
    res.redirect(`/listing`);
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
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
    let listing = await Listing.findOneAndUpdate({ _id: id }, req.body.listing);
    if (req.file) {
        const { path: url, filename } = req.file;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Successfully edited the location");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyLocation = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete({ _id: id });
    console.log("Successfully deleted");
    req.flash("success", "Location Deleted");
    res.redirect("/listing");
}