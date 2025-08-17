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
const { listingSchema } = require('./Schema.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, '/public')));

const MongoURL = 'mongodb://127.0.0.1:27017/Auralis';
async function main() {
    await mongoose.connect(MongoURL);
}

const validateListing = (re,res,next) =>{
    const data = req.body.listing;
    let {error} = listingSchema.validate(data);
    if (error) {
        let errMsg = error.details.map((el) =>{
            
        })
        throw new ExpressError(400, "Send Valid data of location");
    }
}

main()
    .then(() => {
        console.log("Connected to db");
    }).catch((err) => {
        console.log(err);
    });

app.get('/', (req, res) => {
    res.render('listings/home.ejs');
});

app.get('/listing', WrapAsync(async (req, res, next) => {
    let allListing = await listing.find({});
    res.render('listings/index.ejs', { allListing })
})
);

app.get('/listing/new', WrapAsync(async (req, res) => {
    res.render('listings/new.ejs');
}));

app.get('/listing/:id', WrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await listing.findById(id);
    res.render('listings/show.ejs', { list });
}));

app.post('/listing',validateListing, WrapAsync(async (req, res, next) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect('/listing');
}));

app.get('/listing/:id/edit', WrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    res.render('listings/edit.ejs', { list });
}));

app.put('/listing/:id',validateListing, WrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!req.body || !req.body.listing) {
        throw new ExpressError(400, "Send Valid data of location");
    }
    await listing.findOneAndUpdate({ _id: id }, req.body.listing);
    res.redirect(`/listing/${id}`);
}));

app.delete('/listing/:id', WrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.deleteOne({ _id: id });
    console.log("Successfully deleted");
    res.redirect('/listing');
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
