// server entry point
const path = require('path');
const fs = require('fs');

// Load env vars BEFORE requiring any route/controller — the Cloudinary client
// reads process.env at module load time, so this must come first.
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const collegeRoutes = require('./routes/colleges');
const applicationRoutes = require('./routes/applications');
const consultationRoutes = require('./routes/consultations');
const blogRoutes = require('./routes/blogs');
const {
  injectSeoIntoHtml,
  resolveBlogPageRequest,
  generateSitemapXml,
  resolveSiteOrigin,
} = require('./utils/seoAndSitemap');

const app = express();
app.set('trust proxy', 1);

// CORS: allow all by default, or restrict to a comma-separated CORS_ORIGIN list
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(
  cors(
    allowedOrigins.length
      ? { origin: allowedOrigins, credentials: true }
      : {}
  )
);

app.use(express.json({ limit: '10mb' }));

// Uploaded files (local fallback when Cloudinary is not configured)
const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
  console.error('FATAL: MONGODB_URI is not set. Create backend/.env (see .env.example).');
  process.exit(1);
}
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Health check (useful for hosting platforms)
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// API routes
app.use('/api/colleges', collegeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/blogs', blogRoutes);

// Internal helper endpoint for dev server SSR head injection & 301 redirect check
app.get('/api/seo/blog-head/:slug', async (req, res) => {
  try {
    const result = await resolveBlogPageRequest(req.params.slug, req);
    return res.json(result);
  } catch (err) {
    console.error('Error resolving blog head:', err);
    return res.status(500).json({ action: 'error' });
  }
});

// Dynamic XML Sitemap (accessible at both /sitemap.xml and /api/sitemap.xml)
const handleSitemap = async (req, res) => {
  try {
    const xml = await generateSitemapXml(req);
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=300');
    return res.status(200).send(xml);
  } catch (err) {
    console.error('Error generating sitemap.xml:', err);
    return res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
};
app.get('/sitemap.xml', handleSitemap);
app.get('/api/sitemap.xml', handleSitemap);

// Dynamic robots.txt pointing search engines to sitemap.xml
app.get('/robots.txt', (req, res) => {
  const origin = resolveSiteOrigin(req);
  const robotsTxt = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n');
  res.header('Content-Type', 'text/plain; charset=utf-8');
  return res.status(200).send(robotsTxt);
});

// Anything else under /api that wasn't matched is a real 404 (return JSON, not HTML)
app.use('/api', (req, res) => res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` }));

// Serve the built frontend (vite build output) and support client-side routing
const distDir = path.join(__dirname, '..', 'dist');
const rootIndexHtml = path.join(__dirname, '..', 'index.html');

// Dynamic SSR SEO Metadata, JSON-LD & 301 Redirect handler for /blogs/:slug
app.get('/blogs/:slug', async (req, res, next) => {
  try {
    const result = await resolveBlogPageRequest(req.params.slug, req);
    if (result.action === 'redirect') {
      return res.redirect(result.statusCode || 301, result.location);
    }

    const htmlPath = fs.existsSync(path.join(distDir, 'index.html'))
      ? path.join(distDir, 'index.html')
      : rootIndexHtml;

    if (fs.existsSync(htmlPath)) {
      const rawHtml = fs.readFileSync(htmlPath, 'utf-8');
      const finalHtml = result.headTags
        ? injectSeoIntoHtml(rawHtml, result.headTags, result.bodyFallbackHtml)
        : rawHtml;
      res.status(result.statusCode || 200).header('Content-Type', 'text/html; charset=utf-8').send(finalHtml);
      return;
    }
    return next();
  } catch (err) {
    console.error('Error serving /blogs/:slug HTML:', err);
    return next();
  }
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res) => res.sendFile(path.join(distDir, 'index.html')));
} else {
  console.warn('dist/ not found — run "npm run build" to serve the frontend from this server.');
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
