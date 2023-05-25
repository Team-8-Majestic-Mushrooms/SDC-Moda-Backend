const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sdc');

const photosSchema = mongoose.schema({
  url: String,
});

const reviewSchema = mongoose.schema({
  review_id: { type: Number, unique: true },
  product_id: Number,
  rating: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  summary: String,
  body: String,
  recommend: { type: Boolean, default: false },
  reported: { type: Boolean, default: false },
  reviewer_name: String,
  reviewer_email: String,
  response: String,
  helpfulness: { type: Number, default: 0 },
  photos: [photosSchema],
  chars_fit: Number,
  chars_length: Number,
  chars_comfort: Number,
  chars_quality: Number,
  chars_size: Number,
  chars_width: Number,
});
