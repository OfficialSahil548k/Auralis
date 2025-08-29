const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./reviews.js');

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: {
      type: String,
      set: (v) =>
        v ||
        "https://images.unsplash.com/photo-1754620731794-f16ab70963ec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    filename: String,
  },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review",
        },
    ]
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const listing = mongoose.model("Listing", listingSchema);
module.exports = listing;
