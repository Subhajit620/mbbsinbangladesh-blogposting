const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');

const router = express.Router();
const path = require('path');
const upload = multer({ dest: path.join(__dirname, '..', '..', 'uploads/') }); // temporary storage before Cloudinary upload

// Validation chain for application creation
const applicationValidation = [
  body('collegeId').notEmpty().withMessage('College ID is required'),
  body('fullName').trim().notEmpty().withMessage('Full name required'),
  body('dateOfBirth').notEmpty().withMessage('Valid DOB required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('mobile')
    .notEmpty()
    .withMessage('Mobile number required'),
  body('whatsapp')
    .optional({ nullable: true }),
  // class10 and class12 subjects are arrays; each subject must have name, fullMarks, obtainedMarks
  body('class10.subjects').isArray({ min: 1 }).withMessage('Class X subjects required'),
  body('class10.subjects.*.fullMarks')
    .custom(value => !isNaN(Number(value)) && Number(value) >= 0)
    .withMessage('Full marks must be non‑negative'),
  body('class10.subjects.*.obtainedMarks')
    .custom(value => !isNaN(Number(value)) && Number(value) >= 0)
    .custom((value, { req, path }) => {
      const match = path.match(/\[(\d+)\]/);
      const index = match ? parseInt(match[1], 10) : 0;
      const full = req.body.class10.subjects[index]?.fullMarks;
      if (full !== undefined && Number(value) > Number(full)) {
        throw new Error('Obtained marks cannot exceed full marks');
      }
      return true;
    })
    .withMessage('Invalid obtained marks'),
  body('class12.subjects').isArray({ min: 1 }).withMessage('Class XII subjects required'),
  body('class12.subjects.*.fullMarks')
    .custom(value => !isNaN(Number(value)) && Number(value) >= 0)
    .withMessage('Full marks must be non‑negative'),
  body('class12.subjects.*.obtainedMarks')
    .custom(value => !isNaN(Number(value)) && Number(value) >= 0)
    .custom((value, { req, path }) => {
      const match = path.match(/\[(\d+)\]/);
      const index = match ? parseInt(match[1], 10) : 0;
      const full = req.body.class12.subjects[index]?.fullMarks;
      if (full !== undefined && Number(value) > Number(full)) {
        throw new Error('Obtained marks cannot exceed full marks');
      }
      return true;
    })
    .withMessage('Invalid obtained marks'),
];

// POST create application (files uploaded via multipart/form-data)
router.post(
  '/',
  upload.fields([
    { name: 'userPhoto', maxCount: 1 },
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'authorizedSignature', maxCount: 1 },
    { name: 'candidateSignature', maxCount: 1 },
  ]),
  // Middleware to parse and sanitize stringified JSON fields from multipart form data
  (req, res, next) => {
    try {
      if (typeof req.body.academic === 'string') {
        try {
          const parsedAcademic = JSON.parse(req.body.academic);
          req.body.class10 = {
            subjects: parsedAcademic.class10Subjects || []
          };
          req.body.class12 = {
            subjects: parsedAcademic.class12Subjects || []
          };
        } catch (e) {
          console.warn('Failed to parse academic field:', e.message);
        }
      }

      if (typeof req.body.class10 === 'string') {
        req.body.class10 = JSON.parse(req.body.class10);
      }
      if (typeof req.body.class12 === 'string') {
        req.body.class12 = JSON.parse(req.body.class12);
      }
      if (typeof req.body.neet === 'string') {
        req.body.neet = JSON.parse(req.body.neet);
      }

      // Map Apply Wizard NEET fields if present
      if (req.body.neet) {
        if (req.body.neet.neetYear !== undefined) {
          req.body.neet.year = req.body.neet.neetYear;
        }
        if (req.body.neet.neetScore !== undefined) {
          req.body.neet.score = req.body.neet.neetScore;
        }
      }

      // Sanitize Class 10 subjects (filter out empty rows, convert strings to numbers)
      if (req.body.class10 && Array.isArray(req.body.class10.subjects)) {
        req.body.class10.subjects = req.body.class10.subjects
          .filter(s => s && ((s.name && s.name.trim() !== '') || Number(s.fullMarks) > 0))
          .map((s, idx) => ({
            name: (s.name && s.name.trim()) || `Subject ${idx + 1}`,
            fullMarks: isNaN(Number(s.fullMarks)) ? 0 : Number(s.fullMarks),
            obtainedMarks: isNaN(Number(s.obtainedMarks)) ? 0 : Number(s.obtainedMarks)
          }));
      }

      // Sanitize Class 12 subjects (convert strings to numbers, restore read-only names)
      const class12Names = ['Physics', 'Chemistry', 'Biology'];
      if (req.body.class12 && Array.isArray(req.body.class12.subjects)) {
        req.body.class12.subjects = req.body.class12.subjects.map((s, idx) => ({
          name: s.name || class12Names[idx] || `Subject ${idx + 1}`,
          fullMarks: isNaN(Number(s.fullMarks)) ? 0 : Number(s.fullMarks),
          obtainedMarks: isNaN(Number(s.obtainedMarks)) ? 0 : Number(s.obtainedMarks)
        }));
      }

      // Sanitize NEET details
      if (req.body.neet) {
        req.body.neet.year = isNaN(Number(req.body.neet.year)) ? 0 : Number(req.body.neet.year);
        req.body.neet.score = isNaN(Number(req.body.neet.score)) ? 0 : Number(req.body.neet.score);
      }
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON data in academic or neet fields' });
    }
    next();
  },
  applicationValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation failed:', JSON.stringify(errors.array(), null, 2));
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createApplication
);

// GET all applications (admin – protect with JWT in production)
router.get('/', getApplications);

// GET single application
router.get('/:id', getApplication);

// PUT update status
router.put('/:id', [body('status').isIn(['Pending', 'Approved', 'Rejected'])], updateApplication);

// DELETE application
router.delete('/:id', deleteApplication);

module.exports = router;
