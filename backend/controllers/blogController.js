const { validationResult, body } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { Blog, DeletedBlogSlug } = require('../models/Blog');

// Configure Cloudinary (matching applicationController.js)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dummy',
  api_key: process.env.CLOUDINARY_API_KEY || 'dummy',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'dummy',
});

/**
 * Convert any string into a clean, lowercase, SEO-friendly URL slug.
 */
function slugifyTitle(input = '') {
  const cleaned = String(input)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .replace(/[\s_]+/g, '-') // spaces/underscores to hyphens
    .replace(/-+/g, '-') // collapse duplicate hyphens
    .replace(/(^-|-$)+/g, ''); // trim leading/trailing hyphens

  return cleaned || 'blog-post';
}

/**
 * Ensure a slug is unique across the Blog collection.
 * Appends -2, -3, etc. automatically if a conflict exists.
 */
async function generateUniqueSlug(rawInput, excludeId = null) {
  const baseSlug = slugifyTitle(rawInput);
  let candidate = baseSlug;
  let counter = 2;

  while (true) {
    const query = { slug: candidate };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await Blog.findOne(query).select('_id').lean();
    if (!existing) {
      return candidate;
    }
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

/**
 * Sanitize blog content and text inputs to prevent XSS attacks
 * while preserving safe formatting and markdown.
 */
function sanitizeContent(input = '') {
  if (typeof input !== 'string') return '';
  return input
    // Remove <script>, <iframe>, <object>, <embed>, <applet>, <meta>, <link>
    .replace(/<\s*(script|iframe|object|embed|applet|meta|link)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|iframe|object|embed|applet|meta|link)[^>]*\/?>/gi, '')
    // Remove inline event handlers like onclick=..., onerror=...
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    // Neutralize javascript: and vbscript: URIs
    .replace(/(href|src|action)\s*=\s*(['"]?)\s*(?:javascript|vbscript|data:text\/html):/gi, '$1=$2#');
}

function sanitizePlainText(input = '') {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Estimate reading time from article content.
 */
function calculateReadTime(content = '') {
  const words = String(content).trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Format a Date into a readable string like "July 24, 2026"
 */
function formatDisplayDate(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (Number.isNaN(d.getTime())) {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Determine whether a blog document is currently live/published for the public.
 */
function isBlogPubliclyVisible(blog) {
  if (!blog) return false;
  if (blog.status === 'Published') return true;
  if (blog.status === 'Scheduled') {
    const pubDate = blog.publishDate ? new Date(blog.publishDate) : new Date();
    return pubDate <= new Date();
  }
  return false;
}

/**
 * MongoDB filter matching publicly published blogs (Published or Scheduled in the past).
 */
function getPublicPublishedFilter(extra = {}) {
  const now = new Date();
  return {
    $or: [
      { status: 'Published' },
      { status: { $exists: false } },
      { status: 'Scheduled', publishDate: { $lte: now } },
    ],
    ...extra,
  };
}

/**
 * Initial default blogs to seed into MongoDB if the collection is empty,
 * preserving all existing articles from BlogService.ts.
 */
const INITIAL_BLOGS = [
  {
    title: 'NMC Guidelines for Indian Students Studying MBBS Abroad: 2026 Edition',
    slug: 'nmc-guidelines-2026',
    excerpt:
      'A comprehensive breakdown of the latest NMC Foreign Medical Graduate Licensure regulations, internship guidelines, and the NExT exam structure.',
    content: `Study MBBS abroad requires strict adherence to NMC regulations. In this article, we break down the latest requirements for Indian medical students:

## 1. Course Duration and Structure
Under the current NMC regulations (FMGL Regulations), any Indian student studying MBBS abroad must complete:
- A medical course of at least 54 months (4.5 years) duration.
- English as the sole medium of instruction.
- A mandatory clinical internship of 12 months in the same foreign country.

Bangladesh medical colleges perfectly satisfy this with their 5-year MBBS syllabus and compulsory 1-year clinical rotation in high-inflow hospitals.

## 2. Subject Requirements
The curriculum must cover all core clinical and non-clinical subjects, including:
- Anatomy, Physiology, Biochemistry
- Pharmacology, Pathology, Microbiology, Forensic Medicine
- Community Medicine, General Medicine, Pediatrics, Surgery, Orthopedics, OBGY, Anesthesiology, Dermatology, Psychiatry, Ophthalmology, and ENT.

## 3. License to Practice
Upon graduation, students must be registered with the host country's medical licensing authority (BMDC in Bangladesh) to be eligible to sit for exams in India. Bangladesh provides full license status for foreign students after their local internship, matching this rule.`,
    coverImage:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=450',
    imageAlt: 'NMC Guidelines for Indian Students Studying MBBS Abroad in 2026',
    tag: 'NMC Guidelines',
    tags: ['NMC Guidelines', 'FMGL Regulations', 'MBBS in Bangladesh', 'NExT Exam'],
    author: 'Dr. A. K. Sharma',
    readTime: '6 min read',
    date: 'July 24, 2026',
    publishDate: new Date('2026-07-24T10:00:00.000Z'),
    seoTitle: 'NMC Guidelines for Indian Students Studying MBBS Abroad: 2026 Edition',
    seoDescription:
      'A comprehensive breakdown of the latest NMC Foreign Medical Graduate Licensure regulations, internship guidelines, and the NExT exam structure.',
    focusKeyword: 'NMC Guidelines MBBS Abroad',
    status: 'Published',
    showInListing: true,
    allowIndexing: true,
  },
  {
    title: 'Why Bangladesh Has the Highest FMGE Passing Rate for Indian Aspirants',
    slug: 'fmge-passing-rates',
    excerpt:
      'Discover the academic advantages, identical medical textbooks, and clinical exam similarities that give Bangladesh graduates an edge.',
    content: `Every year, the National Board of Examinations (NBE) releases statistics for the Foreign Medical Graduate Examination (FMGE). Bangladesh consistently outperforms other destinations like Russia, China, and the Philippines:

## 1. Identical Syllabus and Textbooks
Indian and Bangladeshi medical colleges share the same British-origin medical roots. 
- Students in Bangladesh read the exact same books as in India (e.g., BD Chaurasia for Anatomy, Guyton for Physiology, Bailey & Love for Surgery).
- The syllabus structure is virtually identical, meaning students do not have to 're-learn' concepts when preparing for the FMGE or NExT.

## 2. Similar Disease Profiles & Demographics
Clinical learning depends heavily on patient interaction.
- Diseases, tropical infections, and clinical presentations in Bangladesh are identical to India.
- Patient behaviors and socio-economic factors are highly similar.
- Unlike in non-English speaking countries, language barriers are negligible as Bengali is widely understood and spoken (particularly by students from West Bengal, Bihar, and North-Eastern states), and clinical staff speak fluent English.`,
    coverImage:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800&h=450',
    imageAlt: 'Medical graduates celebrating high FMGE passing rate from Bangladesh',
    tag: 'FMGE Preparation',
    tags: ['FMGE', 'MCI Screening Test', 'MBBS in Bangladesh', 'Medical Syllabus'],
    author: 'Prof. S. Chowdhury',
    readTime: '4 min read',
    date: 'July 18, 2026',
    publishDate: new Date('2026-07-18T10:00:00.000Z'),
    seoTitle: 'Why Bangladesh Has the Highest FMGE Passing Rate for Indian Aspirants',
    seoDescription:
      'Discover the academic advantages, identical medical textbooks, and clinical exam similarities that give Bangladesh graduates an edge.',
    focusKeyword: 'FMGE Passing Rate Bangladesh',
    status: 'Published',
    showInListing: true,
    allowIndexing: true,
  },
  {
    title: "A Student's Guide to Living and Studying in Dhaka: Expenses & Culture",
    slug: 'student-dhaka-guide',
    excerpt:
      'From hostel food and safety to monthly pocket money requirements—get a genuine look at life inside Bangladesh medical campuses.',
    content: `Relocating to a new country can be daunting. Here is a realistic overview of what life looks like for Indian students studying MBBS in Dhaka and other major cities:

## 1. Food and Cultural Familiarity
One of the biggest advantages of Bangladesh is food.
- Indian cuisine (rice, dal, roti, chicken, fish, vegetables) is the staple.
- Many hostels have dedicated Indian messes with Indian cooks catering to veg and non-veg preferences.
- Cultural celebrations like Durga Puja, Eid, Diwali, and Holi are celebrated on campus with enthusiasm.

## 2. Cost of Living
Dhaka is highly affordable for Indian students:
- Hostel accommodation is usually included in the college fee package.
- Food expenses typically range between ₹3,000 to ₹5,000 INR per month.
- Monthly personal pocket money of ₹4,000 to ₹6,000 INR is more than sufficient for transport, laundry, and books.

## 3. Safety and Campus Security
- Medical colleges in Bangladesh have walled, secure campus boundaries.
- Hostels have 24/7 security guards and warden supervision.
- Female student safety is heavily guarded, with separate, secure hostels for girls.`,
    coverImage:
      'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800&h=450',
    imageAlt: 'Indian medical students living and studying in Dhaka Bangladesh campus',
    tag: 'Student Life',
    tags: ['Student Life', 'Dhaka', 'Hostel & Mess', 'Cost of Living'],
    author: 'Rahul Verma (Final Year MBBS)',
    readTime: '5 min read',
    date: 'July 12, 2026',
    publishDate: new Date('2026-07-12T10:00:00.000Z'),
    seoTitle: "A Student's Guide to Living and Studying in Dhaka: Expenses & Culture",
    seoDescription:
      'From hostel food and safety to monthly pocket money requirements—get a genuine look at life inside Bangladesh medical campuses.',
    focusKeyword: 'Living and Studying in Dhaka MBBS',
    status: 'Published',
    showInListing: true,
    allowIndexing: true,
  },
];

let isSeeding = false;
async function seedDefaultBlogsIfNeeded() {
  if (isSeeding) return;
  try {
    const count = await Blog.countDocuments();
    const deletedCount = await DeletedBlogSlug.countDocuments();
    if (count === 0 && deletedCount === 0) {
      isSeeding = true;
      for (const item of INITIAL_BLOGS) {
        await Blog.updateOne(
          { slug: item.slug },
          { $setOnInsert: item },
          { upsert: true }
        );
      }
    }
  } catch (err) {
    console.error('Error seeding initial blogs:', err);
  } finally {
    isSeeding = false;
  }
}

/**
 * Validation rules for creating/updating a blog.
 */
const blogValidationRules = [
  body('title').trim().notEmpty().withMessage('Blog title is required'),
  body('excerpt').trim().notEmpty().withMessage('Short description / excerpt is required'),
  body('content').trim().notEmpty().withMessage('Blog content is required'),
  body('author').trim().notEmpty().withMessage('Author name is required'),
];

/**
 * GET /api/blogs
 * Public endpoint returning published blogs that have showInListing !== false.
 */
exports.getPublicBlogs = async (req, res) => {
  try {
    await seedDefaultBlogsIfNeeded();

    const { search, tag, page, limit } = req.query;
    const filter = getPublicPublishedFilter({ showInListing: { $ne: false } });

    if (tag && tag !== 'All') {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [{ tag }, { tags: tag }],
      });
    }

    if (search && String(search).trim()) {
      const regex = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { title: regex },
          { excerpt: regex },
          { content: regex },
          { tag: regex },
          { tags: regex },
          { author: regex },
        ],
      });
    }

    const query = Blog.find(filter).sort({ publishDate: -1, createdAt: -1 });

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 9));
      const total = await Blog.countDocuments(filter);
      const blogs = await query.skip((pageNum - 1) * limitNum).limit(limitNum);
      return res.json({
        blogs,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      });
    }

    const blogs = await query;
    return res.json(blogs);
  } catch (err) {
    console.error('Error fetching public blogs:', err);
    return res.status(500).json({ message: 'Server error fetching blogs' });
  }
};

/**
 * GET /api/blogs/admin/all
 * Admin endpoint returning all blogs (including Drafts, Scheduled, hidden).
 */
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    await seedDefaultBlogsIfNeeded();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.json(blogs);
  } catch (err) {
    console.error('Error fetching admin blogs:', err);
    return res.status(500).json({ message: 'Server error fetching admin blogs' });
  }
};

/**
 * GET /api/blogs/check-slug?slug=...&excludeId=...
 * Validate and preview slug uniqueness before publishing.
 */
exports.checkSlugAvailability = async (req, res) => {
  try {
    const rawSlug = req.query.slug || req.query.title || '';
    const excludeId = req.query.excludeId || null;
    const normalizedSlug = slugifyTitle(rawSlug);

    const query = { slug: normalizedSlug };
    if (excludeId && excludeId.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = { $ne: excludeId };
    }

    const existing = await Blog.findOne(query).select('_id title slug').lean();
    const available = !existing;
    const suggestedSlug = available
      ? normalizedSlug
      : await generateUniqueSlug(normalizedSlug, excludeId && excludeId.match(/^[0-9a-fA-F]{24}$/) ? excludeId : null);

    return res.json({
      slug: normalizedSlug,
      available,
      suggestedSlug,
    });
  } catch (err) {
    console.error('Error checking slug availability:', err);
    return res.status(500).json({ message: 'Failed to check slug availability' });
  }
};

/**
 * GET /api/blogs/slug/:slug
 * Fetch a single blog by slug.
 * - If slug is in another blog's previousSlugs, returns redirect instructions (301).
 * - If blog is unpublished/draft (and not admin preview), returns 404.
 * - If slug was deleted, returns 410.
 */
exports.getBlogBySlug = async (req, res) => {
  try {
    await seedDefaultBlogsIfNeeded();
    const requestedSlug = String(req.params.slug || '').toLowerCase().trim();
    const isAdminPreview =
      req.query.preview === 'true' &&
      (req.headers['x-admin-token'] === 'aspiring_life_auth_token' ||
        req.headers.authorization === 'Bearer aspiring_life_auth_token');

    // 1. Direct match on current slug
    let blog = await Blog.findOne({ slug: requestedSlug });

    // Fallback: also allow lookup by MongoDB ObjectId if passed
    if (!blog && requestedSlug.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(requestedSlug);
    }

    if (blog) {
      if (!isBlogPubliclyVisible(blog) && !isAdminPreview) {
        return res.status(404).json({
          message: 'Blog post not found or is currently unpublished.',
          code: 'UNPUBLISHED',
        });
      }

      // Fetch up to 3 related published blogs
      const relatedFilter = getPublicPublishedFilter({
        _id: { $ne: blog._id },
        showInListing: { $ne: false },
      });

      const allPublishedOthers = await Blog.find(relatedFilter)
        .sort({ publishDate: -1, createdAt: -1 })
        .limit(12);

      const blogTagsSet = new Set([blog.tag, ...(blog.tags || [])].map((t) => String(t).toLowerCase()));
      const scoredRelated = allPublishedOthers
        .map((item) => {
          let score = 0;
          if (item.tag === blog.tag) score += 3;
          (item.tags || []).forEach((t) => {
            if (blogTagsSet.has(String(t).toLowerCase())) score += 1;
          });
          return { item, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((entry) => entry.item);

      return res.json({
        redirect: false,
        blog,
        relatedBlogs: scoredRelated,
      });
    }

    // 2. Check if requestedSlug is in previousSlugs (301 Redirect)
    const redirectedBlog = await Blog.findOne({ previousSlugs: requestedSlug });
    if (redirectedBlog && (isBlogPubliclyVisible(redirectedBlog) || isAdminPreview)) {
      return res.json({
        redirect: true,
        statusCode: 301,
        oldSlug: requestedSlug,
        newSlug: redirectedBlog.slug,
        redirectUrl: `/blogs/${redirectedBlog.slug}`,
        blog: redirectedBlog,
      });
    }

    // 3. Check if slug was deleted (410 Gone)
    const deletedRecord = await DeletedBlogSlug.findOne({ slug: requestedSlug }).lean();
    if (deletedRecord) {
      return res.status(410).json({
        message: 'This blog article has been permanently removed.',
        code: 'DELETED',
      });
    }

    // 4. Not found (404)
    return res.status(404).json({
      message: 'The requested blog article could not be found.',
      code: 'NOT_FOUND',
    });
  } catch (err) {
    console.error('Error fetching blog by slug:', err);
    return res.status(500).json({ message: 'Server error fetching blog post' });
  }
};

/**
 * Normalize tags array from either an array or comma-separated string.
 */
function parseTagsInput(tagsInput, primaryTag) {
  let list = [];
  if (Array.isArray(tagsInput)) {
    list = tagsInput.map((t) => sanitizePlainText(String(t))).filter(Boolean);
  } else if (typeof tagsInput === 'string' && tagsInput.trim()) {
    list = tagsInput
      .split(',')
      .map((t) => sanitizePlainText(t))
      .filter(Boolean);
  }
  if (primaryTag && !list.includes(primaryTag)) {
    list.unshift(primaryTag);
  }
  return Array.from(new Set(list));
}

/**
 * POST /api/blogs
 * Create a new blog post with automatic unique slug generation.
 */
exports.createBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const title = sanitizePlainText(req.body.title);
    const excerpt = sanitizePlainText(req.body.excerpt);
    const content = sanitizeContent(req.body.content);
    const author = sanitizePlainText(req.body.author);
    const tag = sanitizePlainText(req.body.tag || req.body.category || 'NMC Guidelines');
    const tags = parseTagsInput(req.body.tags, tag);

    // Generate a unique SEO-friendly slug from manual slug input or title
    const rawSlugSource = req.body.slug && String(req.body.slug).trim() ? req.body.slug : title;
    const uniqueSlug = await generateUniqueSlug(rawSlugSource);

    // Clean up any stale references to this slug in DeletedBlogSlug or previousSlugs
    await DeletedBlogSlug.deleteOne({ slug: uniqueSlug });
    await Blog.updateMany({ previousSlugs: uniqueSlug }, { $pull: { previousSlugs: uniqueSlug } });

    const publishDate = req.body.publishDate ? new Date(req.body.publishDate) : new Date();
    const validPublishDate = Number.isNaN(publishDate.getTime()) ? new Date() : publishDate;
    const dateStr = req.body.date || formatDisplayDate(validPublishDate);
    const readTime =
      req.body.readTime && String(req.body.readTime).trim()
        ? sanitizePlainText(req.body.readTime)
        : calculateReadTime(content);

    const coverImage =
      req.body.coverImage && String(req.body.coverImage).trim()
        ? String(req.body.coverImage).trim()
        : 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=450';

    const imageAlt = sanitizePlainText(req.body.imageAlt || title);
    const seoTitle = sanitizePlainText(req.body.seoTitle || title);
    const seoDescription = sanitizePlainText(req.body.seoDescription || excerpt);
    const focusKeyword = sanitizePlainText(req.body.focusKeyword || '');
    const canonicalUrl = sanitizePlainText(req.body.canonicalUrl || '');
    const ogImage = req.body.ogImage && String(req.body.ogImage).trim() ? String(req.body.ogImage).trim() : coverImage;

    const status = ['Draft', 'Published', 'Scheduled'].includes(req.body.status)
      ? req.body.status
      : 'Published';
    const showInListing = req.body.showInListing !== undefined ? Boolean(req.body.showInListing) : true;
    const allowIndexing = req.body.allowIndexing !== undefined ? Boolean(req.body.allowIndexing) : true;

    const blog = new Blog({
      title,
      slug: uniqueSlug,
      previousSlugs: [],
      excerpt,
      content,
      coverImage,
      imageAlt,
      author,
      tag,
      tags,
      readTime,
      date: dateStr,
      seoTitle,
      seoDescription,
      focusKeyword,
      canonicalUrl,
      ogImage,
      status,
      publishDate: validPublishDate,
      showInListing,
      allowIndexing,
    });

    await blog.save();
    return res.status(201).json(blog);
  } catch (err) {
    console.error('Error creating blog:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A blog with this slug already exists.' });
    }
    return res.status(500).json({ message: 'Server error creating blog post' });
  }
};

/**
 * PUT /api/blogs/:id
 * Update an existing blog post.
 * - Preserves existing slug when title changes unless admin explicitly changes slug.
 * - When slug changes, records old slug in previousSlugs for 301 redirect and prevents redirect loops.
 */
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    let blog = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id);
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: id.toLowerCase() });
    }
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (req.body.title !== undefined) {
      const cleanedTitle = sanitizePlainText(req.body.title);
      if (!cleanedTitle) {
        return res.status(400).json({ message: 'Blog title cannot be empty' });
      }
      blog.title = cleanedTitle;
    }

    if (req.body.excerpt !== undefined) {
      const cleanedExcerpt = sanitizePlainText(req.body.excerpt);
      if (!cleanedExcerpt) {
        return res.status(400).json({ message: 'Short description cannot be empty' });
      }
      blog.excerpt = cleanedExcerpt;
    }

    if (req.body.content !== undefined) {
      const cleanedContent = sanitizeContent(req.body.content);
      if (!cleanedContent.trim()) {
        return res.status(400).json({ message: 'Blog content cannot be empty' });
      }
      blog.content = cleanedContent;
    }

    if (req.body.author !== undefined) {
      blog.author = sanitizePlainText(req.body.author) || blog.author;
    }

    if (req.body.tag !== undefined || req.body.category !== undefined) {
      blog.tag = sanitizePlainText(req.body.tag || req.body.category) || blog.tag;
    }

    if (req.body.tags !== undefined) {
      blog.tags = parseTagsInput(req.body.tags, blog.tag);
    }

    if (req.body.readTime !== undefined) {
      blog.readTime = sanitizePlainText(req.body.readTime) || calculateReadTime(blog.content);
    }

    if (req.body.coverImage !== undefined && String(req.body.coverImage).trim()) {
      blog.coverImage = String(req.body.coverImage).trim();
    }

    if (req.body.imageAlt !== undefined) {
      blog.imageAlt = sanitizePlainText(req.body.imageAlt);
    }

    // SEO fields
    if (req.body.seoTitle !== undefined) {
      blog.seoTitle = sanitizePlainText(req.body.seoTitle);
    }
    if (req.body.seoDescription !== undefined) {
      blog.seoDescription = sanitizePlainText(req.body.seoDescription);
    }
    if (req.body.focusKeyword !== undefined) {
      blog.focusKeyword = sanitizePlainText(req.body.focusKeyword);
    }
    if (req.body.canonicalUrl !== undefined) {
      blog.canonicalUrl = sanitizePlainText(req.body.canonicalUrl);
    }
    if (req.body.ogImage !== undefined) {
      blog.ogImage = String(req.body.ogImage).trim();
    }

    // Publishing fields
    if (req.body.status !== undefined && ['Draft', 'Published', 'Scheduled'].includes(req.body.status)) {
      blog.status = req.body.status;
    }
    if (req.body.publishDate !== undefined && req.body.publishDate) {
      const parsedDate = new Date(req.body.publishDate);
      if (!Number.isNaN(parsedDate.getTime())) {
        blog.publishDate = parsedDate;
        blog.date = formatDisplayDate(parsedDate);
      }
    }
    if (req.body.showInListing !== undefined) {
      blog.showInListing = Boolean(req.body.showInListing);
    }
    if (req.body.allowIndexing !== undefined) {
      blog.allowIndexing = Boolean(req.body.allowIndexing);
    }

    // Handle explicit slug change
    if (req.body.slug !== undefined && String(req.body.slug).trim()) {
      const requestedNormalized = slugifyTitle(req.body.slug);
      if (requestedNormalized !== blog.slug) {
        const oldSlug = blog.slug;
        const uniqueNewSlug = await generateUniqueSlug(requestedNormalized, blog._id);

        // Preserve oldSlug in previousSlugs and remove uniqueNewSlug from previousSlugs to prevent redirect loops
        const updatedHistory = Array.from(new Set([...(blog.previousSlugs || []), oldSlug])).filter(
          (s) => s !== uniqueNewSlug
        );

        blog.slug = uniqueNewSlug;
        blog.previousSlugs = updatedHistory;

        // Ensure no other blog or deleted slug record claims uniqueNewSlug
        await Blog.updateMany(
          { _id: { $ne: blog._id }, previousSlugs: uniqueNewSlug },
          { $pull: { previousSlugs: uniqueNewSlug } }
        );
        await DeletedBlogSlug.deleteOne({ slug: uniqueNewSlug });
      }
    }

    await blog.save();
    return res.json(blog);
  } catch (err) {
    console.error('Error updating blog:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A blog with this slug already exists.' });
    }
    return res.status(500).json({ message: 'Server error updating blog post' });
  }
};

/**
 * DELETE /api/blogs/:id
 * Delete a blog post and record its slug as deleted (410 Gone) so it is removed from listing & sitemap.
 */
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    let blog = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findByIdAndDelete(id);
    }
    if (!blog) {
      blog = await Blog.findOneAndDelete({ slug: id.toLowerCase() });
    }
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const slugsToTombstone = [blog.slug, ...(blog.previousSlugs || [])].filter(Boolean);
    for (const s of slugsToTombstone) {
      await DeletedBlogSlug.updateOne(
        { slug: s },
        { $set: { slug: s, deletedAt: new Date() } },
        { upsert: true }
      );
    }

    return res.json({ message: 'Blog post deleted successfully', deletedSlug: blog.slug });
  } catch (err) {
    console.error('Error deleting blog:', err);
    return res.status(500).json({ message: 'Server error deleting blog post' });
  }
};

/**
 * POST /api/blogs/upload-image
 * Upload a blog cover/OG image using Cloudinary with local /uploads fallback.
 */
exports.uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const isDummy =
      !process.env.CLOUDINARY_API_KEY ||
      process.env.CLOUDINARY_API_KEY === 'dummy' ||
      process.env.CLOUDINARY_API_KEY === '123456789012345';

    if (!isDummy) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'mbbs_blogs',
        });
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.json({ url: result.secure_url });
      } catch (cloudErr) {
        console.warn('Cloudinary upload failed, using local fallback:', cloudErr.message);
      }
    }

    return res.json({ url: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error('Error uploading blog image:', err);
    return res.status(500).json({ message: 'Failed to upload image' });
  }
};

exports.blogValidationRules = blogValidationRules;
exports.slugifyTitle = slugifyTitle;
exports.generateUniqueSlug = generateUniqueSlug;
exports.isBlogPubliclyVisible = isBlogPubliclyVisible;
exports.getPublicPublishedFilter = getPublicPublishedFilter;
exports.seedDefaultBlogsIfNeeded = seedDefaultBlogsIfNeeded;
