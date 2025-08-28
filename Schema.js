const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("", null), // optional like in Mongoose
  location: Joi.string().required(),
  country: Joi.string().required(),
  price: Joi.number().min(0).required(),

  // match image object structure
  image: Joi.object({
    url: Joi.string().uri().allow("", null), // can be empty
    filename: Joi.string().allow("", null),
  }).optional(),
}).required();
