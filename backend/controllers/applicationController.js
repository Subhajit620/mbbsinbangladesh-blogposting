// Controller for Application CRUD operations
const Application = require('../models/Application');
const College = require('../models/College');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Configure Cloudinary (expects env vars CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to calculate academic fields (client also does it, but server validates)
function calculateAcademic(classData) {
  if (!classData || !Array.isArray(classData.subjects)) {
    return { totalFullMarks: 0, totalObtainedMarks: 0, percentage: 0, gpa: 0 };
  }
  const totalFullMarks = classData.subjects.reduce((sum, s) => sum + (Number(s.fullMarks) || 0), 0);
  const totalObtainedMarks = classData.subjects.reduce((sum, s) => sum + (Number(s.obtainedMarks) || 0), 0);
  const percentage = totalFullMarks ? (totalObtainedMarks / totalFullMarks) * 100 : 0;
  const gpa = totalFullMarks ? (totalObtainedMarks / totalFullMarks) * 10 : 0; // simple 10‑scale GPA
  return { totalFullMarks, totalObtainedMarks, percentage, gpa };
}

// @desc   Create new application
// @route  POST /api/applications
// @access Public (or protected via JWT in prod)
exports.createApplication = async (req, res) => {
  // Validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      collegeId,
      fullName,
      dateOfBirth,
      gender,
      email,
      mobile,
      whatsapp,
      address,
      city,
      country,
      class10,
      class12,
      neet,
    } = req.body;

    // Upload images if any (userPhoto, passportPhoto, authorizedSignature, candidateSignature)
    const uploadImage = async (fileObj) => {
      const file = fileObj?.[0];
      if (!file || !file.path) return undefined;

      const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
                            process.env.CLOUDINARY_CLOUD_NAME !== 'dummy' &&
                            process.env.CLOUDINARY_API_KEY &&
                            process.env.CLOUDINARY_API_KEY !== 'dummy';

      if (!hasCloudinary) {
        console.log(`Cloudinary is not configured. Saving local reference for ${file.originalname}`);
        return `/uploads/${file.filename}`;
      }

      try {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'applications' });
        return result.secure_url;
      } catch (uploadError) {
        console.warn(`Cloudinary upload failed: ${uploadError.message}. Gracefully falling back to local reference.`);
        return `/uploads/${file.filename}`;
      }
    };

    const userPhoto = await uploadImage(req.files?.userPhoto);
    const passportPhoto = await uploadImage(req.files?.passportPhoto);
    const authorizedSignature = await uploadImage(req.files?.authorizedSignature);
    const candidateSignature = await uploadImage(req.files?.candidateSignature);

    // Compute academic aggregates
    const class10Agg = calculateAcademic(class10);
    const class12Agg = calculateAcademic(class12);

    const overall = {
      class10Percentage: class10Agg.percentage,
      class12Percentage: class12Agg.percentage,
      class10GPA: class10Agg.gpa,
      class12GPA: class12Agg.gpa,
      combinedGPA: (class10Agg.gpa + class12Agg.gpa) / 2,
      overallPercentage: (class10Agg.percentage + class12Agg.percentage) / 2,
      academicScore: (class10Agg.gpa + class12Agg.gpa) / 2 * 10, // arbitrary score
    };

    // Fetch college details to embed name & course
    const college = await College.findById(collegeId);
    if (!college) return res.status(404).json({ message: 'College not found' });

    const application = new Application({
      collegeId,
      collegeName: college.collegeName,
      courseName: college.courseName,
      fullName,
      dateOfBirth,
      gender,
      email,
      mobile,
      whatsapp,
      address,
      city,
      country,
      class10: { ...class10, ...class10Agg },
      class12: { ...class12, ...class12Agg },
      overall,
      neet,
      userPhoto,
      passportPhoto,
      authorizedSignature,
      candidateSignature,
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    console.error('Error in createApplication:', err);
    res.status(500).json({
      message: 'Server error during application creation',
      error: err.message,
      stack: err.stack
    });
  }
};

// @desc   Get all applications (admin)
exports.getApplications = async (req, res) => {
  try {
    const apps = await Application.find().sort({ submittedAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Get single application by ID
exports.getApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const generateStatusPDFBuffer = (studentName, collegeName, status) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      // --- PDF Header Branding ---
      // Dark slate title block
      doc.rect(0, 0, 595.28, 90).fill('#1C2733');
      
      // Title
      doc.fillColor('#FFFFFF')
         .font('Helvetica-Bold')
         .fontSize(20)
         .text('ASPIRING LIFE ADMISSIONS', 40, 25);
      
      doc.fillColor('#A9772E')
         .font('Helvetica')
         .fontSize(10)
         .text('Official Admission Portfolio & Academic Registry', 40, 50);

      // --- Body Section ---
      doc.fillColor('#1C2733')
         .font('Helvetica-Bold')
         .fontSize(16)
         .text('OFFICIAL RECORD REGISTER STATUS RECEIPT', 40, 120);

      // Draw thin separator line
      doc.moveTo(40, 140)
         .lineTo(555.28, 140)
         .strokeColor('#D2CD5C')
         .lineWidth(1)
         .stroke();

      // Meta grid
      doc.fillColor('#555555')
         .font('Helvetica')
         .fontSize(10)
         .text('Date Generated:', 40, 160)
         .text('Registry ID:', 40, 180)
         .text('Candidate Name:', 40, 200)
         .text('Target College:', 40, 220)
         .text('Application Status:', 40, 240);

      const registryId = `AL-APP-${Math.floor(100000 + Math.random() * 900000)}`;
      const formattedDate = new Date().toLocaleDateString();

      doc.fillColor('#1C2733')
         .font('Helvetica-Bold')
         .text(formattedDate, 160, 160)
         .text(registryId, 160, 180)
         .text(studentName, 160, 200)
         .text(collegeName, 160, 220);

      // Status pill coloring
      if (status === 'Approved') {
        doc.fillColor('#059669').text(status.toUpperCase(), 160, 240);
      } else if (status === 'Rejected') {
        doc.fillColor('#DC2626').text(status.toUpperCase(), 160, 240);
      } else {
        doc.fillColor('#D97706').text(status.toUpperCase(), 160, 240);
      }

      // Detailed Info based on status
      doc.fillColor('#1C2733')
         .font('Helvetica-Bold')
         .fontSize(12)
         .text('Decision Details & Action Plan', 40, 280);

      doc.moveTo(40, 295)
         .lineTo(555.28, 295)
         .strokeColor('#E2DECF')
         .lineWidth(0.5)
         .stroke();

      doc.font('Helvetica')
         .fontSize(10)
         .fillColor('#444444');

      if (status === 'Approved') {
        doc.text(
          `Dear ${studentName},\n\n` +
          `Congratulations! Your eligibility dossier has been vetted by Aspiring Life Admissions and approved for matching enrollment in "${collegeName}".\n\n` +
          `Next Steps required:\n` +
          `1. Secure booking allocations with initial security deposits.\n` +
          `2. Submit physical certified mark sheets for verification.\n` +
          `3. Initiate Student Visa application file assembly.\n\n` +
          `For active liaison details, reach out to our helpdesk at info@mbbsbangladesh.app.`,
          40, 310, { width: 515.28, align: 'left', lineGap: 4 }
        );
      } else if (status === 'Rejected') {
        doc.text(
          `Dear ${studentName},\n\n` +
          `We regret to inform you that your application for "${collegeName}" did not meet verification approvals.\n\n` +
          `Standard eligibility reasons include:\n` +
          `- Academic score thresholds (NEET/GPA criteria mismatch).\n` +
          `- Discrepancies in submitted transcript files.\n` +
          `- Limited matching seats in requested colleges.\n\n` +
          `If you believe this is an error, please get in touch with our helpdesk at info@mbbsbangladesh.app to schedule a counsellor appeal session.`,
          40, 310, { width: 515.28, align: 'left', lineGap: 4 }
        );
      } else {
        doc.text(
          `Dear ${studentName},\n\n` +
          `Your application for "${collegeName}" is currently under review by our registry officers.\n\n` +
          `No further action is required at this stage. We will contact you if additional academic documents or NEET scorecards are required for complete evaluation.\n\n` +
          `For updates, email info@mbbsbangladesh.app.`,
          40, 310, { width: 515.28, align: 'left', lineGap: 4 }
        );
      }

      // Footer
      doc.fillColor('#888888')
         .fontSize(8)
         .text('This is an automatically generated system document. Valid without physical signature.', 40, 750, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

const sendStatusEmail = async (studentEmail, studentName, collegeName, status) => {
  const emailUser = process.env.EMAIL_USER || 'aspiringlifedrive@gmail.com';
  const emailPass = process.env.EMAIL_PASS;

  console.log(`[Email System] Preparing to send status change email to ${studentName} (${studentEmail}). Status: ${status}`);

  let pdfBuffer;
  try {
    pdfBuffer = await generateStatusPDFBuffer(studentName, collegeName, status);
    
    // Save a copy locally inside the backend folder for developer validation
    const localPdfPath = path.join(__dirname, '..', `temp_receipt_${status}.pdf`);
    fs.writeFileSync(localPdfPath, pdfBuffer);
    console.log(`[Email System] Local status receipt PDF saved to: ${localPdfPath}`);
  } catch (pdfErr) {
    console.error('[Email System] Failed to generate status receipt PDF:', pdfErr);
  }

  if (!emailPass) {
    console.warn(`[Email System] Warning: EMAIL_PASS is not defined in backend/.env file. Skipping actual email delivery. Print email content:`);
    console.log(`-----------------------------------------------------------------`);
    console.log(`From: ${emailUser}`);
    console.log(`To: ${studentEmail}`);
    console.log(`Subject: MBBS Bangladesh Application Status - ${status}`);
    console.log(`Body:`);
    console.log(`Dear ${studentName},`);
    console.log(`Your MBBS admission application for "${collegeName}" has been updated.`);
    console.log(`New Status: ${status.toUpperCase()}`);
    console.log(`Attachment: MBBS_Admission_Status_${status}.pdf (locally cached at backend/temp_receipt_${status}.pdf)`);
    console.log(`-----------------------------------------------------------------`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  let subject = '';
  let html = '';

  if (status === 'Approved') {
    subject = `🎉 Application Approved - MBBS Admission Portfolio`;
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2decf; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #1c2733; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">MBBS Bangladesh Admission</h1>
        </div>
        <div style="padding: 20px; color: #3c4856;">
          <h2 style="color: #059669;">Congratulations, ${studentName}!</h2>
          <p>We are pleased to inform you that your application for admission to <strong>${collegeName}</strong> has been <strong>APPROVED</strong>!</p>
          <p>Our academic admissions panel has verified your eligibility criteria and school grade ledger documents.</p>
          <p>Attached to this email, you will find your official **Admission Approval PDF Receipt**.</p>
          <p>Please log in to your portal dashboard or contact our counsellors to proceed with your booking deposits and visa documentation process.</p>
          <hr style="border: 0; border-top: 1px solid #e2decf; margin: 20px 0;" />
          <p style="font-size: 12px; color: #a9772e;">This is an official automated notification from Aspiring Life Admissions Drive.</p>
        </div>
      </div>
    `;
  } else if (status === 'Rejected') {
    subject = `Update on your MBBS Admission Application`;
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2decf; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #1c2733; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">MBBS Bangladesh Admission</h1>
        </div>
        <div style="padding: 20px; color: #3c4856;">
          <h2>Hello ${studentName},</h2>
          <p>We regret to inform you that your application for admission to <strong>${collegeName}</strong> has been <strong>REJECTED</strong>.</p>
          <p>This decision is typically based on NEET qualification benchmarks, academic GPAs, or documentation validation discrepancies.</p>
          <p>Please find the official **Rejection Status PDF Receipt** attached for your records and review.</p>
          <p>If you believe there has been an error, please get in touch with our team for re-evaluation options.</p>
          <hr style="border: 0; border-top: 1px solid #e2decf; margin: 20px 0;" />
          <p style="font-size: 12px; color: #a9772e;">This is an official automated notification from Aspiring Life Admissions Drive.</p>
        </div>
      </div>
    `;
  } else {
    subject = `Application Status Update - MBBS Bangladesh`;
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2decf; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #1c2733; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">MBBS Bangladesh Admission</h1>
        </div>
        <div style="padding: 20px; color: #3c4856;">
          <h2>Hello ${studentName},</h2>
          <p>Your application status for <strong>${collegeName}</strong> has been set to <strong>${status}</strong>.</p>
          <p>Please find the official **Status Update PDF Receipt** attached to this email.</p>
          <p>Please check your email inbox and portal for further update requests from our verification experts.</p>
          <hr style="border: 0; border-top: 1px solid #e2decf; margin: 20px 0;" />
          <p style="font-size: 12px; color: #a9772e;">This is an official automated notification from Aspiring Life Admissions Drive.</p>
        </div>
      </div>
    `;
  }

  const mailOptions = {
    from: `"Aspiring Life Admissions" <${emailUser}>`,
    to: studentEmail,
    subject: subject,
    html: html,
    attachments: pdfBuffer ? [
      {
        filename: `MBBS_Admission_Status_${status}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ] : []
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email System] Status update email with PDF attachment sent successfully to ${studentEmail}`);
  } catch (err) {
    console.error(`[Email System] Failed to send email to ${studentEmail}:`, err);
  }
};

// @desc   Update application status (admin)
exports.updateApplication = async (req, res) => {
  const { status } = req.body; // Expected: Pending | Approved | Rejected
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });

    // Trigger email asynchronously
    sendStatusEmail(app.email, app.fullName, app.collegeName, status);

    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Delete application (admin)
exports.deleteApplication = async (req, res) => {
  try {
    const app = await Application.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
