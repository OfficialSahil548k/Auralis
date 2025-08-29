const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Port = 8800;
const listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const WrapAsync = require('./utils/WrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const Joi = require('joi');
const { listingSchema, reviewSchema } = require('./Schema.js');
const Review = require('./models/reviews.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, '/public')));

const MongoURL = 'mongodb://127.0.0.1:27017/Auralis';
async function main() {
    await mongoose.connect(MongoURL);
}

const validateListing = (req,res,next) =>{
    const data = req.body.listing;
    let {error} = listingSchema.validate(data);
    // console.log(error)
    
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
       return  next(new ExpressError(400,errMsg));
    }
    next() ;
}

const validateReview = (req,res,next) =>{
    const data = req.body.listing;
    let {error} = reviewSchema.validate(data);
    // console.log(error)
    
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
       return  next(new ExpressError(400,errMsg));
    }
    next() ;
}

main()
    .then(() => {
        console.log("Connected to db");
    }).catch((err) => {
        console.log(err);
    });

// Home Page
app.get('/', (req, res) => {
    res.render('listings/home.ejs');
});

// Index route
app.get('/listing', WrapAsync(async (req, res, next) => {
    let allListing = await listing.find({});
    res.render('listings/index.ejs', { allListing })
})
);


//new page
app.get('/listing/new', WrapAsync(async (req, res) => {
    res.render('listings/new.ejs');
}));

//show route
app.get('/listing/:id', WrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await listing.findById(id).populate("reviews");
    res.render('listings/show.ejs', { list });
}));

// new Route
app.post('/listing',validateListing, WrapAsync(async (req, res, next) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listing`);
}));


//edit page
app.get('/listing/:id/edit', WrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    res.render('listings/edit.ejs', { list });
}));

// edit Route
app.put('/listing/:id',validateListing,WrapAsync(async (req, res) => {
    const { id } = req.params;
    
    if (!req.body || !req.body.listing) {
        throw new ExpressError(400, "Send Valid data of location");
    }
    await listing.findOneAndUpdate({ _id: id }, req.body.listing);
    res.redirect(`/listing/${id}`);
}));


//Delete Route
app.delete('/listing/:id', WrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.deleteOne({ _id: id });
    console.log("Successfully deleted");
    res.redirect('/listing');
}));

//Review Route
app.post('/listing/:id/reviews' ,validateReview, WrapAsync(async (req,res)=>{
      const {id} = req.params;
      let List = await listing.findById(id);
      let newReview = new Review(req.body.review)
      List.reviews.push(newReview);
      await newReview.save();
      await List.save();
      res.redirect(`/listing/${id}`);
}));

// Delete Review
app.delete('/listing/:id/reviews/:reviewId', WrapAsync(async (req,res,next)=>{
    const {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log("Successfully deleted review");
    res.redirect(`/listing/${id}`);
}));
   
app.use((req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render('listings/error.ejs', {message});
    // res.status(statusCode).send(message);
});


app.listen(Port, () => {
    console.log(`app is running on http://localhost:${Port}/`);
});
