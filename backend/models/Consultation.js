const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  passingYear: { type: String, required: true },
  neetScore: { type: Number, required: true },
  neetYear: { type: String, default: 'N/A' },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consultation', ConsultationSchema);
