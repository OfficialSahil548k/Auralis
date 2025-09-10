const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require('../middlewares.js');
const ListingController = require('../controllers/listing.js');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router
    .route('/')
    .get(WrapAsync(ListingController.index))
    // .post(
    //     isLoggedIn,
    //     validateListing,
    //     WrapAsync(ListingController.createNew)
    // );
    .post( upload.single('listing[image][url]'),(req,res)=>{
        res.send(req.file);
    });

    //new page
router.get("/new", isLoggedIn,ListingController.renderNewForm);

router
    .route('/:id')
    .get(WrapAsync(ListingController.renderShowPage)) // show route
    .put(isLoggedIn,isOwner,validateListing,WrapAsync(ListingController.updateInfo)) // update route
    .delete(isLoggedIn,isOwner,WrapAsync(ListingController.destroyLocation)); // delete route


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,WrapAsync(ListingController.renderEditForm));

module.exports = router;
