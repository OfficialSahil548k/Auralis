const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const passport = require('passport');
const { SaveRedirectUrl } = require("../middlewares.js");
const UserController = require("../controllers/users.js");


// Signup page
router.get('/signup', UserController.renderSignupForm);

// Save into dataBase
router.post('/signup', WrapAsync(UserController.SaveUser));

// Login page
router.get('/login', UserController.renderLoginForm);

// Login Check
router.post('/login', SaveRedirectUrl,
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