const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync.js");
const passport = require('passport');
const { SaveRedirectUrl } = require("../middlewares.js");


// Signup page
router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});

// Save into dataBase
router.post('/signup', WrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", "User was registered successfully!");
            res.redirect('/listing');
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('/signup');
    }
}));

// Login page
router.get('/login', (req, res) => {
    res.render('users/login.ejs');
})

// Login Check
router.post('/login',
    SaveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true,
    }),
    async (req, res) => {
        req.flash("succes", "Welcome Back to Auralis!");
        let redirectUrl = res.locals.redirectUrl || '/listing';
        res.redirect(redirectUrl);
    });

// Logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "you are Successfully Logged Out!");
        res.redirect('/listing');
    })
})

module.exports = router;