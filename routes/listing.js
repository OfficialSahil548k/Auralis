const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require('../middlewares.js');
const ListingController = require('../controllers/listing.js');

// Index route
router.get("/",WrapAsync(ListingController.index));

//new page
router.get("/new", isLoggedIn,ListingController.renderNewForm);

//show route
router.get("/:id",WrapAsync(ListingController.renderShowPage));

// create route
router.post("/",validateListing,WrapAsync(ListingController.createNew));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,WrapAsync(ListingController.renderEditForm));

// update Route
router.put("/:id",isLoggedIn,isOwner,validateListing,WrapAsync(ListingController.updateInfo));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,WrapAsync(ListingController.destroyLocation));

module.exports = router;
