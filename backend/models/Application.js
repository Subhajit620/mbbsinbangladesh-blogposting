const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  collegeName: { type: String, required: true },
  courseName: { type: String, required: true },

  // Personal Information
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  whatsapp: { type: String },
  address: { type: String },
  city: { type: String, default: 'Dhaka' },
  country: { type: String, default: 'Bangladesh' },

  // Academic Information - Class X
  class10: {
    subjects: [{
      name: { type: String },
      fullMarks: { type: Number },
      obtainedMarks: { type: Number }
    }],
    totalFullMarks: { type: Number },
    totalObtainedMarks: { type: Number },
    percentage: { type: Number },
    gpa: { type: Number }
  },

  // Academic Information - Class XII
  class12: {
    subjects: [{
      name: { type: String },
      fullMarks: { type: Number },
      obtainedMarks: { type: Number }
    }],
    totalFullMarks: { type: Number },
    totalObtainedMarks: { type: Number },
    percentage: { type: Number },
    gpa: { type: Number }
  },

  // Overall Academic Result (computed)
  overall: {
    class10Percentage: { type: Number },
    class12Percentage: { type: Number },
    class10GPA: { type: Number },
    class12GPA: { type: Number },
    combinedGPA: { type: Number },
    overallPercentage: { type: Number },
    academicScore: { type: Number }
  },

  // NEET Information
  neet: {
    year: { type: Number },
    score: { type: Number }
  },

  // Document URLs (stored in Cloudinary)
  userPhoto: { type: String },
  passportPhoto: { type: String },
  authorizedSignature: { type: String },
  candidateSignature: { type: String },

  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
