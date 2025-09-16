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
    url : String,
    filename : String
  },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review",
        },
    ],
    owner : {
      type : Schema.Types.ObjectId,
      ref : "User",
    }
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
        console.log("Reviews deleted");
    }
});

const listing = mongoose.model("Listing", listingSchema);
module.exports = listing;
