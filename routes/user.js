const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const passport = require('passport');
const { SaveRedirectUrl } = require("../middlewares.js");
const UserController = require("../controllers/users.js");

router
    .route('/signup')
    .get(UserController.renderSignupForm) // signup page
    .post(WrapAsync(UserController.SaveUser)); // save data

router
    .route('/login')
    .get(UserController.renderLoginForm)
    .post(SaveRedirectUrl,
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true,
            successFlash: true,
        }),
        UserController.LoginCheck
    );

// Logout
router.get('/logout', UserController.LogoutUser);

module.exports = router;