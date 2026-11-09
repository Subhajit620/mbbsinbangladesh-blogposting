const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getPublicBlogs,
  getAllBlogsAdmin,
  checkSlugAvailability,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
  blogValidationRules,
} = require('../controllers/blogController');

const router = express.Router();

// Configure multer storage with extension preservation for local fallback
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.webp';
    const safeExt = ['.webp', '.jpg', '.jpeg', '.png', '.gif'].includes(ext.toLowerCase())
      ? ext.toLowerCase()
      : '.webp';
    cb(null, `blog-${Date.now()}-${Math.round(Math.random() * 1e6)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * Admin authorization middleware.
 * Validates the admin token set by AdminLoginPage ('aspiring_life_auth_token').
 */
function requireAdminAuth(req, res, next) {
  const expectedToken = process.env.ADMIN_AUTH_TOKEN || 'aspiring_life_auth_token';
  const headerToken =
    req.headers['x-admin-token'] ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (headerToken !== expectedToken) {
    return res.status(401).json({
      message: 'Unauthorized: Valid admin authorization token is required for blog management.',
    });
  }
  return next();
}

// Public endpoints
router.get('/', getPublicBlogs);
router.get('/check-slug', checkSlugAvailability);
router.get('/slug/:slug', getBlogBySlug);

// Admin endpoints (protected)
router.get('/admin/all', requireAdminAuth, getAllBlogsAdmin);
router.post('/upload-image', requireAdminAuth, upload.single('image'), uploadBlogImage);
router.post('/', requireAdminAuth, blogValidationRules, createBlog);
router.put('/:id', requireAdminAuth, updateBlog);
router.delete('/:id', requireAdminAuth, deleteBlog);

module.exports = router;
