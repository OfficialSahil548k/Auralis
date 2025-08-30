const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Port = 8800;
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const ListingRoutes = require('./routes/listing.js');
const ReviewRoutes = require('./routes/review.js');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', engine);
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

// Home Page
app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

// Listing Routes
app.use('/listing', ListingRoutes);

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
