const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema({
  collegeName: { type: String, required: true },
  courseName: { type: String, required: true },
  image: { type: String },
  logo: { type: String },
  description: { type: String },
  duration: { type: String },
  fees: { type: Number },
  eligibility: { type: String },
  city: { type: String },
  country: { type: String },
  createdAt: { type: Date, default: Date.now },
  // Applications will be stored in a separate collection, reference via collegeId
});

module.exports = mongoose.model('College', CollegeSchema);
