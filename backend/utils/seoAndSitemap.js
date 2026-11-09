const { Blog, DeletedBlogSlug } = require('../models/Blog');
const {
  isBlogPubliclyVisible,
  getPublicPublishedFilter,
  seedDefaultBlogsIfNeeded,
} = require('../controllers/blogController');

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function resolveSiteOrigin(req) {
  if (process.env.SITE_URL && process.env.SITE_URL.trim()) {
    return process.env.SITE_URL.trim().replace(/\/+$/, '');
  }
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:5001';
  return `${proto}://${host}`;
}

function resolveAbsoluteImageUrl(imgUrl, siteOrigin) {
  if (!imgUrl) return '';
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
    return imgUrl;
  }
  if (imgUrl.startsWith('data:')) {
    return `${siteOrigin}/favicon-192x192.png`;
  }
  return `${siteOrigin}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
}

/**
 * Generate valid Schema.org BlogPosting JSON-LD using actual database values.
 */
function buildBlogJsonLd(blog, siteOrigin) {
  const pageUrl = `${siteOrigin}/blogs/${blog.slug}`;
  const canonicalUrl =
    blog.canonicalUrl && blog.canonicalUrl.trim() ? blog.canonicalUrl.trim() : pageUrl;
  const imageUrl = resolveAbsoluteImageUrl(blog.ogImage || blog.coverImage, siteOrigin);

  const publishedDate = blog.publishDate || blog.createdAt;
  const modifiedDate = blog.updatedAt || publishedDate;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.seoTitle || blog.title,
    description: blog.seoDescription || blog.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  if (imageUrl) {
    jsonLd.image = [imageUrl];
  }

  if (blog.author) {
    jsonLd.author = {
      '@type': 'Person',
      name: blog.author,
    };
  }

  jsonLd.publisher = {
    '@type': 'Organization',
    name: 'Aspiring Life — MBBS in Bangladesh',
    logo: {
      '@type': 'ImageObject',
      url: `${siteOrigin}/favicon-192x192.png`,
    },
  };

  if (publishedDate) {
    const pubIso = new Date(publishedDate);
    if (!Number.isNaN(pubIso.getTime())) {
      jsonLd.datePublished = pubIso.toISOString();
    }
  }

  if (modifiedDate) {
    const modIso = new Date(modifiedDate);
    if (!Number.isNaN(modIso.getTime())) {
      jsonLd.dateModified = modIso.toISOString();
    }
  }

  if (blog.tag) {
    jsonLd.articleSection = blog.tag;
  }

  const keywords = [
    ...(blog.focusKeyword ? [blog.focusKeyword] : []),
    ...(Array.isArray(blog.tags) ? blog.tags : []),
  ].filter(Boolean);

  if (keywords.length > 0) {
    jsonLd.keywords = Array.from(new Set(keywords)).join(', ');
  }

  return jsonLd;
}

/**
 * Build complete HTML <head> metadata tags for a blog page.
 */
function buildBlogHeadTags(blog, siteOrigin) {
  const pageUrl = `${siteOrigin}/blogs/${blog.slug}`;
  const canonicalUrl =
    blog.canonicalUrl && blog.canonicalUrl.trim() ? blog.canonicalUrl.trim() : pageUrl;
  const metaTitle = `${blog.seoTitle || blog.title} | MBBS in Bangladesh`;
  const metaDescription = blog.seoDescription || blog.excerpt || '';
  const ogImageUrl = resolveAbsoluteImageUrl(blog.ogImage || blog.coverImage, siteOrigin);
  const imageAlt = blog.imageAlt || blog.title || '';
  const robotsDirective =
    blog.allowIndexing !== false ? 'index, follow, max-image-preview:large' : 'noindex, nofollow';

  const pubIso =
    blog.publishDate && !Number.isNaN(new Date(blog.publishDate).getTime())
      ? new Date(blog.publishDate).toISOString()
      : '';
  const modIso =
    blog.updatedAt && !Number.isNaN(new Date(blog.updatedAt).getTime())
      ? new Date(blog.updatedAt).toISOString()
      : pubIso;

  const jsonLdString = JSON.stringify(buildBlogJsonLd(blog, siteOrigin)).replace(/</g, '\\u003c');

  const tags = [
    `<title>${escapeHtml(metaTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(metaDescription)}" />`,
    `<meta name="robots" content="${escapeHtml(robotsDirective)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${escapeHtml(blog.seoTitle || blog.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(metaDescription)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:site_name" content="MBBS in Bangladesh" />`,
    ...(ogImageUrl
      ? [
          `<meta property="og:image" content="${escapeHtml(ogImageUrl)}" />`,
          `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`,
        ]
      : []),
    ...(pubIso ? [`<meta property="article:published_time" content="${escapeHtml(pubIso)}" />`] : []),
    ...(modIso ? [`<meta property="article:modified_time" content="${escapeHtml(modIso)}" />`] : []),
    ...(blog.author
      ? [`<meta property="article:author" content="${escapeHtml(blog.author)}" />`]
      : []),
    ...(blog.tag ? [`<meta property="article:section" content="${escapeHtml(blog.tag)}" />`] : []),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(blog.seoTitle || blog.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(metaDescription)}" />`,
    ...(ogImageUrl
      ? [
          `<meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" />`,
          `<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />`,
        ]
      : []),
    `<script id="blog-jsonld" type="application/ld+json">${jsonLdString}</script>`,
  ];

  return tags.join('\n    ');
}

function buildNotFoundHeadTags(siteOrigin, requestedSlug) {
  const tags = [
    `<title>Article Not Found | MBBS in Bangladesh</title>`,
    `<meta name="description" content="The requested blog article could not be found or is unavailable." />`,
    `<meta name="robots" content="noindex, nofollow" />`,
  ];
  return tags.join('\n    ');
}

/**
 * Inject generated SEO tags into index.html without duplicating <title>.
 */
function injectSeoIntoHtml(htmlTemplate, headTagsString) {
  const withoutTitle = htmlTemplate.replace(/<title>[\s\S]*?<\/title>/i, '');
  return withoutTitle.replace('</head>', `    ${headTagsString}\n  </head>`);
}

/**
 * Resolve how a request to /blogs/:slug should be handled at the HTTP level:
 * - { action: 'redirect', statusCode: 301, location: '/blogs/new-slug' }
 * - { action: 'render', statusCode: 200, headTags }
 * - { action: 'not_found', statusCode: 404 | 410, headTags }
 */
async function resolveBlogPageRequest(slugParam, req) {
  await seedDefaultBlogsIfNeeded();
  const siteOrigin = resolveSiteOrigin(req);
  const requestedSlug = String(slugParam || '').toLowerCase().trim();

  let blog = await Blog.findOne({ slug: requestedSlug });
  if (blog) {
    if (!isBlogPubliclyVisible(blog)) {
      return {
        action: 'not_found',
        statusCode: 404,
        headTags: buildNotFoundHeadTags(siteOrigin, requestedSlug),
      };
    }
    return {
      action: 'render',
      statusCode: 200,
      blog,
      headTags: buildBlogHeadTags(blog, siteOrigin),
    };
  }

  // Check if requestedSlug is in any blog's previousSlugs -> permanent 301 redirect
  const redirectedBlog = await Blog.findOne({ previousSlugs: requestedSlug });
  if (redirectedBlog && isBlogPubliclyVisible(redirectedBlog)) {
    return {
      action: 'redirect',
      statusCode: 301,
      location: `/blogs/${redirectedBlog.slug}`,
    };
  }

  // Check if deleted
  const deleted = await DeletedBlogSlug.findOne({ slug: requestedSlug }).lean();
  if (deleted) {
    return {
      action: 'not_found',
      statusCode: 410,
      headTags: buildNotFoundHeadTags(siteOrigin, requestedSlug),
    };
  }

  return {
    action: 'not_found',
    statusCode: 404,
    headTags: buildNotFoundHeadTags(siteOrigin, requestedSlug),
  };
}

const STATIC_SITE_PATHS = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.8', changefreq: 'monthly' },
  { path: '/colleges', priority: '0.9', changefreq: 'weekly' },
  { path: '/blogs', priority: '0.9', changefreq: 'daily' },
  { path: '/college/ad-din-akij-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/anwer-khan-modern-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/shaheed-ziaur-rahman-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/dhaka-national-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/jalalabad-ragib-rabeya-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/mh-samorita-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/monno-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/parkview-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/prime-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/shah-mokhdum-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/popular-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/rangpur-community-medical-college-hospital', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/holy-family-red-crescent-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/tairunnessa-medical-college-hospital', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/enam-medical-college-hospital', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/jahurul-islam-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/zh-sikder-womens-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/tmss-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/bgc-trust-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/ad-din-sakina-womens-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/mainamoti-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/southern-medical-college-hospital', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/bangladesh-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/shahabuddin-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/north-bengal-medical-college', priority: '0.7', changefreq: 'monthly' },
  { path: '/college/shaheed-monsur-ali-medical-college', priority: '0.7', changefreq: 'monthly' },
];

/**
 * Generate a complete, valid XML Sitemap containing static pages and all
 * published & indexable blog URLs (excluding Draft, unpublished Scheduled, noindex, and deleted blogs).
 */
async function generateSitemapXml(req) {
  await seedDefaultBlogsIfNeeded();
  const siteOrigin = resolveSiteOrigin(req);

  const indexableFilter = getPublicPublishedFilter({
    allowIndexing: { $ne: false },
  });

  const indexableBlogs = await Blog.find(indexableFilter)
    .select('slug updatedAt publishDate createdAt')
    .sort({ publishDate: -1, createdAt: -1 })
    .lean();

  const seenUrls = new Set();
  const urlEntries = [];

  for (const item of STATIC_SITE_PATHS) {
    const loc = `${siteOrigin}${item.path}`;
    if (!seenUrls.has(loc)) {
      seenUrls.add(loc);
      urlEntries.push(
        `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <changefreq>${item.changefreq}</changefreq>\n    <priority>${item.priority}</priority>\n  </url>`
      );
    }
  }

  for (const blog of indexableBlogs) {
    if (!blog.slug) continue;
    const loc = `${siteOrigin}/blogs/${blog.slug}`;
    if (seenUrls.has(loc)) continue;
    seenUrls.add(loc);

    const lastModDate = blog.updatedAt || blog.publishDate || blog.createdAt;
    const lastModIso =
      lastModDate && !Number.isNaN(new Date(lastModDate).getTime())
        ? new Date(lastModDate).toISOString()
        : new Date().toISOString();

    urlEntries.push(
      `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${escapeXml(lastModIso)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries.join(
    '\n'
  )}\n</urlset>`;
}

module.exports = {
  buildBlogJsonLd,
  buildBlogHeadTags,
  injectSeoIntoHtml,
  resolveBlogPageRequest,
  generateSitemapXml,
  resolveSiteOrigin,
};
