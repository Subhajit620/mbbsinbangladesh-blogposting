const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');

// POST submit consultation
router.post('/', async (req, res) => {
  try {
    const { fullName, phone, email, passingYear, neetScore, neetYear, location } = req.body;

    if (!fullName || !phone || !email || !passingYear || !neetScore || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const consultation = new Consultation({
      fullName,
      phone,
      email,
      passingYear,
      neetScore: Number(neetScore),
      neetYear: neetYear || 'N/A',
      location
    });

    await consultation.save();
    res.status(201).json({ message: 'Consultation request submitted successfully', data: consultation });
  } catch (err) {
    console.error('Error submitting consultation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all consultations
router.get('/', async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(consultations);
  } catch (err) {
    console.error('Error fetching consultations:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE single consultation (admin)
router.delete('/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation request not found' });
    }
    res.json({ message: 'Consultation request deleted successfully' });
  } catch (err) {
    console.error('Error deleting consultation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
