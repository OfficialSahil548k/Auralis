const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Port = 8800;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const ListingRoutes = require('./routes/listing.js');
const ReviewRoutes = require('./routes/review.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');


// Home Page
app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

// -----------------------------------------session and flash-----------------------------
const SessionOptions = {
  secret : "mySupersecretCode",
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires : Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    HttpOnly : true
  }
};


app.use(session(SessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// -----------------------------------------parsing-----------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));


const MongoURL = "mongodb://127.0.0.1:27017/Auralis";
async function main() {
  await mongoose.connect(MongoURL);
}

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });


// Listing Routes
app.use("/listing", ListingRoutes);

// Reviews Routes
app.use("/listing/:id/reviews", ReviewRoutes);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(Port, () => {
  console.log(`app is running on http://localhost:${Port}/`);
});
