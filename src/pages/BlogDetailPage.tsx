import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Calendar,
  Clock,
  BookOpen,
  Share2,
  ArrowUpRight,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import { BlogService, BlogPost } from '../components/BlogService';

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=450';

function upsertMetaTag(attrKey: 'name' | 'property', attrVal: string, content: string) {
  let el = document.head.querySelector(`meta[${attrKey}="${attrVal}"]`) as HTMLMetaElement | null;
  if (!content) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrKey, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(href: string) {
  const allCanonicals = document.head.querySelectorAll('link[rel="canonical"]');
  allCanonicals.forEach((node, idx) => {
    if (idx > 0) node.remove();
  });

  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertJsonLdScript(
  id: string,
  data: Record<string, any> | Record<string, any>[] | null
) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!data) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function resolveFullImageUrl(imgUrl?: string): string {
  if (!imgUrl) return DEFAULT_FALLBACK_IMAGE;
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('data:')) {
    return imgUrl;
  }
  const base = import.meta.env.VITE_API_URL || window.location.origin;
  return `${base.replace(/\/+$/, '')}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
}

/**
 * Safely render inline formatting (bold, italic, links) while preventing XSS.
 */
function renderInlineTokens(text: string): React.ReactNode[] {
  const cleanText = text.replace(/<\s*\/?\s*(script|iframe|object|embed|style)[^>]*>/gi, '');
  const pattern =
    /(\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)|\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(cleanText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleanText.slice(lastIndex, match.index));
    }
    if (match[2] && match[3]) {
      const label = match[2];
      const href = match[3];
      const isInternal = href.startsWith('/');
      parts.push(
        isInternal ? (
          <Link
            key={`link-${match.index}`}
            to={href}
            className="text-teal-700 underline underline-offset-4 hover:text-teal-900"
          >
            {label}
          </Link>
        ) : (
          <a
            key={`link-${match.index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 underline underline-offset-4 hover:text-teal-900 inline-flex items-center gap-0.5"
          >
            {label} <ExternalLink className="w-3 h-3 inline" />
          </a>
        )
      );
    } else if (match[4]) {
      parts.push(
        <strong key={`bolditalic-${match.index}`} className="font-semibold italic text-stone-900">
          {match[4]}
        </strong>
      );
    } else if (match[5]) {
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold text-stone-900">
          {match[5]}
        </strong>
      );
    } else if (match[6]) {
      parts.push(
        <em key={`italic-${match.index}`} className="italic text-stone-800">
          {match[6]}
        </em>
      );
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < cleanText.length) {
    parts.push(cleanText.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [cleanText];
}

interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugifyHeading(text: string, index: number): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return `section-${index + 1}${base ? `-${base}` : ''}`;
}

/**
 * Parse article body content into natural editorial HTML elements and extract section titles.
 */
function parseArticleBody(content: string): {
  elements: React.ReactNode[];
  headings: ArticleHeading[];
} {
  const safeContent = String(content || '')
    .replace(/<\s*(script|iframe|object|embed|applet)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|iframe|object|embed|applet)[^>]*\/?>/gi, '');

  const lines = safeContent.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  const headings: ArticleHeading[] = [];

  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let paragraphLines: string[] = [];

  const flushParagraph = (keyPrefix: string) => {
    if (paragraphLines.length > 0) {
      const text = paragraphLines.join(' ').trim();
      if (text) {
        elements.push(
          <p
            key={`p-${keyPrefix}`}
            className="text-stone-800 text-[17px] leading-[1.85] mb-6 font-normal"
          >
            {renderInlineTokens(text)}
          </p>
        );
      }
      paragraphLines = [];
    }
  };

  const flushList = (keyPrefix: string) => {
    if (listItems.length > 0 && listType) {
      if (listType === 'ul') {
        elements.push(
          <ul
            key={`ul-${keyPrefix}`}
            className="list-disc pl-6 space-y-2.5 mb-6 text-stone-800 text-[17px] leading-[1.75] marker:text-stone-400"
          >
            {listItems.map((item, idx) => (
              <li key={idx}>{renderInlineTokens(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol
            key={`ol-${keyPrefix}`}
            className="list-decimal pl-6 space-y-2.5 mb-6 text-stone-800 text-[17px] leading-[1.75] marker:text-stone-500"
          >
            {listItems.map((item, idx) => (
              <li key={idx}>{renderInlineTokens(item)}</li>
            ))}
          </ol>
        );
      }
      listItems = [];
      listType = null;
    }
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph(`${idx}`);
      flushList(`${idx}`);
      return;
    }

    if (line.startsWith('## ')) {
      flushParagraph(`${idx}`);
      flushList(`${idx}`);
      const headingText = line.replace(/^##\s+/, '').trim();
      const anchorId = slugifyHeading(headingText, headings.length);
      headings.push({ id: anchorId, text: headingText, level: 2 });
      elements.push(
        <h2
          id={anchorId}
          key={`h2-${idx}`}
          className="scroll-mt-28 text-xl sm:text-2xl font-extrabold text-stone-900 mt-11 mb-4 pl-3.5 border-l-4 border-teal-600 tracking-tight leading-snug"
        >
          {headingText}
        </h2>
      );
      return;
    }

    if (line.startsWith('### ')) {
      flushParagraph(`${idx}`);
      flushList(`${idx}`);
      const headingText = line.replace(/^###\s+/, '').trim();
      const anchorId = slugifyHeading(headingText, headings.length);
      headings.push({ id: anchorId, text: headingText, level: 3 });
      elements.push(
        <h3
          id={anchorId}
          key={`h3-${idx}`}
          className="scroll-mt-28 text-lg sm:text-xl font-bold text-stone-900 mt-8 mb-3 leading-snug"
        >
          {headingText}
        </h3>
      );
      return;
    }

    if (line.startsWith('> ')) {
      flushParagraph(`${idx}`);
      flushList(`${idx}`);
      const quoteText = line.replace(/^>\s+/, '').trim();
      elements.push(
        <blockquote
          key={`quote-${idx}`}
          className="border-l-4 border-teal-600 bg-teal-50/50 rounded-r-xl pl-5 pr-4 py-3.5 my-7 italic text-stone-800 text-[17px] leading-relaxed"
        >
          {renderInlineTokens(quoteText)}
        </blockquote>
      );
      return;
    }

    if (/^[-*•]\s+/.test(line)) {
      flushParagraph(`${idx}`);
      if (listType === 'ol') flushList(`${idx}`);
      listType = 'ul';
      listItems.push(line.replace(/^[-*•]\s+/, '').trim());
      return;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph(`${idx}`);
      if (listType === 'ul') flushList(`${idx}`);
      listType = 'ol';
      listItems.push(line.replace(/^\d+\.\s+/, '').trim());
      return;
    }

    flushList(`${idx}`);
    paragraphLines.push(line);
  });

  flushParagraph('end');
  flushList('end');

  return { elements, headings };
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isPreview = searchParams.get('preview') === 'true';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
      } else {
        setScrollProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    const loadBlog = async () => {
      setLoading(true);
      setErrorCode(null);
      try {
        const res = await BlogService.fetchBySlug(slug, isPreview);
        if (!isMounted) return;

        if (res.redirect && res.newSlug && res.newSlug !== slug) {
          navigate(`/blogs/${res.newSlug}`, { replace: true });
          return;
        }

        if (!res.blog) {
          setErrorCode(404);
          setBlog(null);
          return;
        }

        setBlog(res.blog);
        setRelatedBlogs(res.relatedBlogs || []);
      } catch (err: any) {
        if (!isMounted) return;
        const status = err?.response?.status || 404;
        setErrorCode(status === 410 ? 410 : 404);
        setBlog(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBlog();

    return () => {
      isMounted = false;
    };
  }, [slug, isPreview, navigate]);

  // Synchronize SEO metadata & BlogPosting JSON-LD structured data
  useEffect(() => {
    if (errorCode) {
      document.title =
        errorCode === 410
          ? 'Article Removed | MBBS in Bangladesh'
          : 'Article Not Found | MBBS in Bangladesh';
      upsertMetaTag(
        'name',
        'description',
        'The requested blog article could not be found or is no longer available.'
      );
      upsertMetaTag('name', 'robots', 'noindex, nofollow');
      upsertJsonLdScript('blog-jsonld', null);
      return;
    }

    if (!blog) return;

    const origin = window.location.origin;
    const pageUrl = `${origin}/blogs/${blog.slug}`;
    const rawCanonical = blog.canonicalUrl ? blog.canonicalUrl.trim() : '';
    const canonicalUrl =
      rawCanonical && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(rawCanonical)
        ? rawCanonical
        : pageUrl;
    const seoTitle = blog.seoTitle && blog.seoTitle.trim() ? blog.seoTitle.trim() : blog.title;
    const seoDescription =
      blog.seoDescription && blog.seoDescription.trim() ? blog.seoDescription.trim() : blog.excerpt;
    const ogImageUrl = resolveFullImageUrl(blog.ogImage || blog.coverImage);
    const imageAlt = blog.imageAlt && blog.imageAlt.trim() ? blog.imageAlt.trim() : blog.title;
    const robotsValue =
      blog.allowIndexing !== false ? 'index, follow, max-image-preview:large' : 'noindex, nofollow';

    document.title = `${seoTitle} | MBBS in Bangladesh`;

    upsertMetaTag('name', 'description', seoDescription);
    upsertMetaTag('name', 'robots', robotsValue);
    if (blog.author) {
      upsertMetaTag('name', 'author', blog.author);
    }
    const keywordsList = Array.from(
      new Set(
        [
          ...(blog.focusKeyword ? [blog.focusKeyword] : []),
          ...(blog.tag ? [blog.tag] : []),
          ...(Array.isArray(blog.tags) ? blog.tags : []),
        ].filter(Boolean)
      )
    );
    if (keywordsList.length > 0) {
      upsertMetaTag('name', 'keywords', keywordsList.join(', '));
    }
    upsertCanonicalLink(canonicalUrl);

    upsertMetaTag('property', 'og:type', 'article');
    upsertMetaTag('property', 'og:title', seoTitle);
    upsertMetaTag('property', 'og:description', seoDescription);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:site_name', 'MBBS in Bangladesh');
    upsertMetaTag('property', 'og:image', ogImageUrl);
    upsertMetaTag('property', 'og:image:alt', imageAlt);

    const publishedIso =
      blog.publishDate && !Number.isNaN(new Date(blog.publishDate).getTime())
        ? new Date(blog.publishDate).toISOString()
        : undefined;
    const modifiedIso =
      blog.updatedAt && !Number.isNaN(new Date(blog.updatedAt).getTime())
        ? new Date(blog.updatedAt).toISOString()
        : publishedIso;

    if (publishedIso) upsertMetaTag('property', 'article:published_time', publishedIso);
    if (modifiedIso) upsertMetaTag('property', 'article:modified_time', modifiedIso);
    if (blog.author) upsertMetaTag('property', 'article:author', blog.author);
    if (blog.tag) upsertMetaTag('property', 'article:section', blog.tag);

    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', seoTitle);
    upsertMetaTag('name', 'twitter:description', seoDescription);
    upsertMetaTag('name', 'twitter:image', ogImageUrl);
    upsertMetaTag('name', 'twitter:image:alt', imageAlt);

    const wordCount = String(blog.content || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    const blogPostingSchema: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: seoTitle,
      description: seoDescription,
      inLanguage: 'en-IN',
      wordCount,
      image: [
        {
          '@type': 'ImageObject',
          url: ogImageUrl,
          caption: imageAlt,
        },
      ],
      author: {
        '@type': 'Person',
        name: blog.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Aspiring Life — MBBS in Bangladesh',
        logo: {
          '@type': 'ImageObject',
          url: `${origin}/favicon-192x192.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
    };

    if (publishedIso) blogPostingSchema.datePublished = publishedIso;
    if (modifiedIso) blogPostingSchema.dateModified = modifiedIso;
    if (blog.tag) blogPostingSchema.articleSection = blog.tag;
    if (keywordsList.length > 0) {
      blogPostingSchema.keywords = keywordsList.join(', ');
    }

    const breadcrumbSchema: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${origin}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blogs',
          item: `${origin}/blogs`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: blog.title,
          item: canonicalUrl,
        },
      ],
    };

    upsertJsonLdScript('blog-jsonld', [blogPostingSchema, breadcrumbSchema]);

    return () => {
      upsertJsonLdScript('blog-jsonld', null);
    };
  }, [blog, errorCode]);

  const { elements: parsedElements, headings: articleHeadings } = useMemo(() => {
    if (!blog) return { elements: [], headings: [] as ArticleHeading[] };
    return parseArticleBody(blog.content);
  }, [blog]);

  const handleJumpToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-stone-800 pt-28 flex flex-col">
        <Navbar />
        <div className="max-w-3xl mx-auto w-full px-4 py-16 flex-1">
          <div className="animate-pulse space-y-5">
            <div className="h-4 bg-stone-200 rounded w-32" />
            <div className="h-9 bg-stone-200 rounded w-4/5" />
            <div className="h-5 bg-stone-200 rounded w-1/2" />
            <div className="aspect-[16/9] bg-stone-200 rounded-xl w-full mt-6" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (errorCode || !blog) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-stone-800 pt-28 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full bg-white border border-stone-200 rounded-2xl p-8 text-center">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              {errorCode === 410 ? '410 • Removed' : '404 • Not Found'}
            </p>
            <h1 className="text-2xl font-bold text-stone-900">
              {errorCode === 410 ? 'This article was removed' : 'Article not found'}
            </h1>
            <p className="text-stone-600 text-sm mt-2 leading-relaxed">
              {errorCode === 410
                ? 'This blog post has been deleted and is no longer available.'
                : 'We could not find the article you were looking for. It may have been moved or unpublished.'}
            </p>
            <div className="mt-6">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to all articles
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const allTags = Array.from(new Set([blog.tag, ...(blog.tags || [])].filter(Boolean)));

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 font-sans pt-28">
      {/* Smooth Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-stone-200/50 z-50">
        <div
          className="h-full bg-teal-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Toaster position="top-right" />
      <Navbar />

      {blog.status !== 'Published' && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-center text-xs font-medium">
          Preview Mode — This post is currently marked as <strong>{blog.status}</strong> and is not visible to the public.
        </div>
      )}

      {/* Editorial Hero Header Strip */}
      <div className="border-b border-stone-200/80 bg-gradient-to-b from-teal-50/50 via-[#FAF9F6] to-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-stone-500 mb-6 overflow-x-auto whitespace-nowrap"
          >
            <Link to="/" className="hover:text-teal-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <Link to="/blogs" className="hover:text-teal-700 transition-colors">
              Articles
            </Link>
            {blog.tag && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <Link
                  to={`/blogs?tag=${encodeURIComponent(blog.tag)}`}
                  className="text-teal-700 font-semibold hover:underline"
                >
                  {blog.tag}
                </Link>
              </>
            )}
          </nav>

          {/* Category + Date + Read Time Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {blog.tag && (
              <Link
                to={`/blogs?tag=${encodeURIComponent(blog.tag)}`}
                className="px-3.5 py-1 rounded-full bg-teal-700 text-white text-xs font-bold tracking-wide shadow-2xs hover:bg-teal-800 transition-colors"
              >
                {blog.tag}
              </Link>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
              <Calendar className="w-3.5 h-3.5 text-teal-700" />
              {blog.date}
            </span>
            {blog.readTime && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
                <Clock className="w-3.5 h-3.5 text-teal-700" />
                {blog.readTime}
              </span>
            )}
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-stone-900 tracking-tight leading-[1.18]">
            {blog.title}
          </h1>

          {/* Lead Excerpt */}
          <p className="mt-4 text-stone-600 text-base sm:text-lg leading-relaxed border-l-3 border-teal-600/60 pl-4">
            {blog.excerpt}
          </p>

          {/* Author & Share Bar */}
          <div className="mt-7 pt-5 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-teal-100 border border-teal-200 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0">
                {blog.author
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-bold text-stone-900">{blog.author}</div>
                <div className="text-xs text-stone-500">
                  Medical Admission Editorial Team
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-stone-200 bg-white hover:border-teal-600/50 hover:text-teal-800 text-xs font-semibold text-stone-700 shadow-2xs cursor-pointer transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Link Copied' : 'Copy Link'}
              </button>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `${blog.title} - ${shareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-teal-50 hover:bg-teal-100 border border-teal-200/80 text-xs font-semibold text-teal-800 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <article>
          {/* Featured Photograph */}
          <figure className="mb-10">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-stone-200 border border-stone-200/90 shadow-md">
              <img
                src={resolveFullImageUrl(blog.coverImage)}
                alt={blog.imageAlt || blog.title}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                    target.src = DEFAULT_FALLBACK_IMAGE;
                  }
                }}
                className="w-full h-full object-cover"
              />
            </div>
            {blog.imageAlt && blog.imageAlt !== blog.title && (
              <figcaption className="text-xs text-stone-500 mt-2.5 text-center italic">
                {blog.imageAlt}
              </figcaption>
            )}
          </figure>

          {/* Clickable Section Titles List (Table of Contents) */}
          {articleHeadings.length > 0 && (
            <nav
              aria-label="Table of contents"
              className="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-teal-50/70 via-white to-stone-50 border border-teal-200/80 shadow-xs"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800 mb-3.5">
                <BookOpen className="w-4 h-4 text-teal-700" />
                <span>Topics in this Article — Click to Jump</span>
              </div>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {articleHeadings.map((item, idx) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleJumpToSection(item.id)}
                      className="w-full text-left p-2.5 rounded-xl bg-white/90 hover:bg-teal-700 border border-stone-200/80 hover:border-teal-700 group flex items-center gap-2.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <span className="w-6 h-6 rounded-lg bg-teal-50 group-hover:bg-white/20 text-teal-800 group-hover:text-white text-xs font-bold flex items-center justify-center shrink-0 transition-colors">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-white line-clamp-1 transition-colors">
                        {item.text}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Article Body Card */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-xs">
            <div className="max-w-none">{parsedElements}</div>

            {/* Topic Tags */}
            {allTags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-stone-200/80 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-stone-400 mr-1">Topics:</span>
                {allTags.map((t) => (
                  <Link
                    key={t}
                    to={`/blogs?tag=${encodeURIComponent(t)}`}
                    className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-teal-50 hover:text-teal-800 text-stone-700 text-xs font-semibold transition-colors"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Counselor Callout Banner */}
          <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-800 to-teal-700 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full bg-white/15 text-teal-50 text-[11px] font-semibold mb-2">
                Free Admission Guidance
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Have questions about studying MBBS in Bangladesh?
              </h2>
              <p className="text-sm text-teal-100 mt-1 max-w-xl">
                Speak directly with our admission counselors regarding NMC rules, college fees, or eligibility criteria.
              </p>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-consult-us'))}
              className="px-6 py-3 bg-white hover:bg-stone-100 text-teal-900 text-xs font-bold rounded-full shrink-0 cursor-pointer shadow-xs transition-colors"
            >
              Ask a Counselor →
            </button>
          </div>
        </article>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <section aria-labelledby="more-articles-heading" className="mt-14 pt-10 border-t border-stone-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 id="more-articles-heading" className="text-xl font-extrabold text-stone-900">
                  More Articles to Read
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Explore more guides on medical education in Bangladesh
                </p>
              </div>
              <Link
                to="/blogs"
                className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800"
              >
                View all articles <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel.id || rel.slug}
                  to={`/blogs/${rel.slug}`}
                  className="bg-white border border-stone-200/90 hover:border-teal-600/40 rounded-2xl overflow-hidden flex flex-col shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                    <img
                      src={resolveFullImageUrl(rel.coverImage)}
                      alt={rel.imageAlt || rel.title}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                          target.src = DEFAULT_FALLBACK_IMAGE;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 text-teal-800 text-[10px] font-bold shadow-2xs">
                      {rel.tag}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-stone-900 group-hover:text-teal-700 line-clamp-2 leading-snug">
                      {rel.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mt-3 pt-2.5 border-t border-stone-100">
                      <span>{rel.date}</span>
                      <span className="font-semibold text-teal-700">Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
