const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
}

module.exports.SaveUser = async (req, res) => {
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
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.LoginCheck = async (req, res) => {
    req.flash("succes", "Welcome Back to Auralis!");
    let redirectUrl = res.locals.redirectUrl || '/listing';
    res.redirect(redirectUrl);
}

module.exports.LogoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "you are Successfully Logged Out!");
        res.redirect('/listing');
    })
}