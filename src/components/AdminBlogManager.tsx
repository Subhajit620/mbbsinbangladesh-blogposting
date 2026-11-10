import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Image,
  ExternalLink,
  Search,
  Bold,
  Italic,
  List,
  Link2,
  Globe,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
} from 'lucide-react';
import { BlogService, BlogPost, generateSlug } from './BlogService';
import toast from 'react-hot-toast';

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=450';

const CATEGORIES = [
  'NMC Guidelines',
  'FMGE Preparation',
  'Student Life',
  'Admission Process',
  'News & Events',
];

const QUICK_INTERNAL_LINKS = [
  { label: 'All Medical Colleges', url: '/colleges' },
  { label: 'Apply Now Page', url: '/apply' },
  { label: 'Our Services', url: '/services' },
  { label: 'About Us', url: '/about' },
  { label: 'All Blogs', url: '/blogs' },
  { label: 'Bangladesh Medical College', url: '/college/bangladesh-medical-college' },
  { label: 'Dhaka National Medical College', url: '/college/dhaka-national-medical-college' },
  { label: 'Enam Medical College & Hospital', url: '/college/enam-medical-college-hospital' },
  { label: 'Holy Family Red Crescent Medical College', url: '/college/holy-family-red-crescent-medical-college' },
  { label: 'Popular Medical College', url: '/college/popular-medical-college' },
  { label: 'Anwer Khan Modern Medical College', url: '/college/anwer-khan-modern-medical-college' },
  { label: 'Ad-din Akij Medical College', url: '/college/ad-din-akij-medical-college' },
  { label: 'Ad-din Sakina Womens Medical College', url: '/college/ad-din-sakina-womens-medical-college' },
  { label: 'BGC Trust Medical College', url: '/college/bgc-trust-medical-college' },
  { label: 'Jahurul Islam Medical College', url: '/college/jahurul-islam-medical-college' },
  { label: 'Jalalabad Ragib-Rabeya Medical College', url: '/college/jalalabad-ragib-rabeya-medical-college' },
  { label: 'MH Samorita Medical College', url: '/college/mh-samorita-medical-college' },
  { label: 'Mainamoti Medical College', url: '/college/mainamoti-medical-college' },
  { label: 'Monno Medical College', url: '/college/monno-medical-college' },
  { label: 'North Bengal Medical College', url: '/college/north-bengal-medical-college' },
  { label: 'Parkview Medical College', url: '/college/parkview-medical-college' },
  { label: 'Prime Medical College', url: '/college/prime-medical-college' },
  { label: 'Rangpur Community Medical College', url: '/college/rangpur-community-medical-college-hospital' },
  { label: 'Shah Mokhdum Medical College', url: '/college/shah-mokhdum-medical-college' },
  { label: 'Shahabuddin Medical College', url: '/college/shahabuddin-medical-college' },
  { label: 'Shaheed Monsur Ali Medical College', url: '/college/shaheed-monsur-ali-medical-college' },
  { label: 'Shaheed Ziaur Rahman Medical College', url: '/college/shaheed-ziaur-rahman-medical-college' },
  { label: 'Southern Medical College & Hospital', url: '/college/southern-medical-college-hospital' },
  { label: 'TMSS Medical College', url: '/college/tmss-medical-college' },
  { label: 'Tairunnessa Memorial Medical College', url: '/college/tairunnessa-medical-college-hospital' },
  { label: 'ZH Sikder Womens Medical College', url: '/college/zh-sikder-womens-medical-college' },
];

interface ContentSection {
  id: string;
  heading: string;
  body: string;
}

const createEmptySection = (): ContentSection => ({
  id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  heading: '',
  body: '',
});

/**
 * Converts stored markdown blog content into structured { heading, body } sections
 * so existing blogs open cleanly inside the section-by-section editor.
 */
function parseContentIntoSections(rawContent: string): ContentSection[] {
  const normalized = (rawContent || '').replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return [createEmptySection()];
  }

  const lines = normalized.split('\n');
  const sections: ContentSection[] = [];
  let currentHeading = '';
  let currentBodyLines: string[] = [];

  const flushSection = () => {
    const bodyText = currentBodyLines.join('\n').trim();
    if (currentHeading || bodyText) {
      sections.push({
        id: `sec-${sections.length}-${Math.random().toString(36).slice(2, 7)}`,
        heading: currentHeading,
        body: bodyText,
      });
    }
  };

  for (const line of lines) {
    const headingMatch = line.match(/^#{2,3}\s+(.+)$/);
    if (headingMatch) {
      flushSection();
      currentHeading = headingMatch[1].trim();
      currentBodyLines = [];
    } else {
      currentBodyLines.push(line);
    }
  }

  flushSection();

  return sections.length > 0 ? sections : [createEmptySection()];
}

/**
 * Combines structured { heading, body } sections back into clean markdown
 * for the database and `/blogs/:slug` renderer.
 */
function serializeSectionsToContent(sections: ContentSection[]): string {
  return sections
    .map((sec) => {
      const h = sec.heading.trim();
      const b = sec.body.trim();
      if (h && b) return `## ${h}\n\n${b}`;
      if (h) return `## ${h}`;
      return b;
    })
    .filter(Boolean)
    .join('\n\n');
}

export default function AdminBlogManager() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // Main Blog Fields
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('NMC Guidelines');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [excerpt, setExcerpt] = useState('');

  // Dynamic Content Sections (Title + Description blocks)
  const [sections, setSections] = useState<ContentSection[]>([createEmptySection()]);
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  // Link Insertion Mini-Modal State (Internal / External Link Builder)
  const [linkDialog, setLinkDialog] = useState<{
    open: boolean;
    sectionId: string;
    type: 'internal' | 'external';
    anchorText: string;
    url: string;
    selectionStart: number;
    selectionEnd: number;
  } | null>(null);

  // Rank Math SEO Fields
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [focusKeyword, setFocusKeyword] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [allowIndexing, setAllowIndexing] = useState(true);
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');

  const siteOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://mbbsinbangladesh.com';

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const all = await BlogService.fetchAdminAll();
      setBlogs(all);
    } catch (err) {
      console.error('Error loading blogs:', err);
      toast.error('Could not load blogs.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-sync slug when creating a new blog unless manually edited
  useEffect(() => {
    if (!editingBlog && !slugManuallyEdited) {
      setSlug(generateSlug(title));
    }
  }, [title, editingBlog, slugManuallyEdited]);

  const filteredBlogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.tag.toLowerCase().includes(q) ||
        (b.focusKeyword && b.focusKeyword.toLowerCase().includes(q))
    );
  }, [blogs, searchQuery]);

  const combinedContent = useMemo(
    () => serializeSectionsToContent(sections),
    [sections]
  );

  // Detect internal & external links in content for Rank Math SEO checklist
  const linkStats = useMemo(() => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let internalCount = 0;
    let externalCount = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(combinedContent)) !== null) {
      const url = m[2].trim();
      if (url.startsWith('/') || url.includes(siteOrigin)) {
        internalCount++;
      } else if (url.startsWith('http://') || url.startsWith('https://')) {
        externalCount++;
      }
    }
    return { internalCount, externalCount };
  }, [combinedContent, siteOrigin]);

  // Rank Math Live SEO Checklist & Score (0-100)
  const seoChecks = useMemo(() => {
    const kw = focusKeyword.trim().toLowerCase();
    const effectiveSeoTitle = (seoTitle.trim() || title.trim()).toLowerCase();
    const effectiveMetaDesc = (seoDescription.trim() || excerpt.trim()).toLowerCase();
    const effectiveSlug = (slug.trim() || generateSlug(title)).toLowerCase();
    const bodyLower = combinedContent.toLowerCase();
    const altLower = (imageAlt.trim() || title.trim()).toLowerCase();

    const checks = [
      {
        label: 'Focus Keyword set',
        passed: kw.length >= 2,
        hint: kw ? `"${focusKeyword.trim()}"` : 'Add a target keyword (e.g. MBBS in Bangladesh)',
      },
      {
        label: 'Focus Keyword in SEO Title',
        passed: kw.length >= 2 && effectiveSeoTitle.includes(kw),
        hint: 'Include your Focus Keyword in the SEO Title',
      },
      {
        label: 'Focus Keyword in Meta Description',
        passed: kw.length >= 2 && effectiveMetaDesc.includes(kw),
        hint: 'Mention your Focus Keyword in the Meta Description',
      },
      {
        label: 'Focus Keyword in URL Slug',
        passed:
          kw.length >= 2 &&
          effectiveSlug.includes(generateSlug(focusKeyword)),
        hint: 'Keep the URL slug keyword-focused',
      },
      {
        label: 'Focus Keyword in Blog Content',
        passed: kw.length >= 2 && bodyLower.includes(kw),
        hint: 'Use the Focus Keyword naturally inside your section paragraphs',
      },
      {
        label: 'Image ALT Text added',
        passed: altLower.length >= 3,
        hint: 'Describe the cover photo for Google Images SEO',
      },
      {
        label: `Internal Links (${linkStats.internalCount} added)`,
        passed: linkStats.internalCount > 0,
        hint: 'Use the "Internal Link" button to link to colleges or pages',
      },
      {
        label: `External Links (${linkStats.externalCount} added)`,
        passed: linkStats.externalCount > 0,
        hint: 'Use the "External Link" button to cite official sources (e.g. NMC, WHO)',
      },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);
    return { checks, score };
  }, [
    focusKeyword,
    seoTitle,
    title,
    seoDescription,
    excerpt,
    slug,
    combinedContent,
    imageAlt,
    linkStats,
  ]);

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setTitle('');
    setTag('NMC Guidelines');
    setAuthor('Admin Counselor');
    setCoverImage('');
    setImageAlt('');
    setExcerpt('');
    setSections([createEmptySection()]);
    setSlug('');
    setSlugManuallyEdited(false);
    setFocusKeyword('');
    setSeoTitle('');
    setSeoDescription('');
    setCanonicalUrl('');
    setAllowIndexing(true);
    setStatus('Published');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setTitle(blog.title || '');
    setTag(blog.tag || 'NMC Guidelines');
    setAuthor(blog.author || '');
    setCoverImage(blog.coverImage || '');
    setImageAlt(blog.imageAlt || blog.title || '');
    setExcerpt(blog.excerpt || '');
    setSections(parseContentIntoSections(blog.content || ''));
    setSlug(blog.slug || generateSlug(blog.title || ''));
    setSlugManuallyEdited(true);
    setFocusKeyword(blog.focusKeyword || '');
    setSeoTitle(blog.seoTitle || blog.title || '');
    setSeoDescription(blog.seoDescription || blog.excerpt || '');
    setCanonicalUrl(blog.canonicalUrl || '');
    setAllowIndexing(blog.allowIndexing !== false);
    setStatus(blog.status === 'Draft' ? 'Draft' : 'Published');
    setIsModalOpen(true);
  };

  const updateSection = (id: string, field: 'heading' | 'body', value: string) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, [field]: value } : sec))
    );
  };

  const handleAddSection = () => {
    const newSec = createEmptySection();
    setSections((prev) => [...prev, newSec]);
  };

  const handleRemoveSection = (id: string) => {
    setSections((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((sec) => sec.id !== id);
    });
  };

  const applyInlineFormat = (
    sectionId: string,
    wrapper: string,
    placeholder: string
  ) => {
    const textarea = textareaRefs.current[sectionId];
    const targetSection = sections.find((s) => s.id === sectionId);
    if (!textarea || !targetSection) return;

    const currentBody = targetSection.body;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentBody.slice(start, end);
    const len = wrapper.length;

    if (
      start >= len &&
      currentBody.slice(start - len, start) === wrapper &&
      currentBody.slice(end, end + len) === wrapper
    ) {
      const updated =
        currentBody.slice(0, start - len) +
        selectedText +
        currentBody.slice(end + len);
      updateSection(sectionId, 'body', updated);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start - len, end - len);
      });
      return;
    }

    const textToWrap = selectedText || placeholder;
    const updated =
      currentBody.slice(0, start) +
      wrapper +
      textToWrap +
      wrapper +
      currentBody.slice(end);
    updateSection(sectionId, 'body', updated);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + len, start + len + textToWrap.length);
    });
  };

  const applyBulletList = (sectionId: string) => {
    const textarea = textareaRefs.current[sectionId];
    const targetSection = sections.find((s) => s.id === sectionId);
    if (!textarea || !targetSection) return;

    const currentBody = targetSection.body;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentBody.slice(start, end) || 'List item';
    const needsNewline = start > 0 && currentBody[start - 1] !== '\n' ? '\n' : '';
    const prefix = '- ';
    const insertion = `${needsNewline}${prefix}${selectedText}`;

    const updated =
      currentBody.slice(0, start) + insertion + currentBody.slice(end);
    updateSection(sectionId, 'body', updated);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorStart = start + needsNewline.length + prefix.length;
      textarea.setSelectionRange(cursorStart, cursorStart + selectedText.length);
    });
  };

  // Open Internal or External Link Dialog for a specific section
  const openLinkBuilder = (sectionId: string, type: 'internal' | 'external') => {
    const textarea = textareaRefs.current[sectionId];
    const targetSection = sections.find((s) => s.id === sectionId);
    if (!targetSection) return;

    const start = textarea ? textarea.selectionStart : targetSection.body.length;
    const end = textarea ? textarea.selectionEnd : targetSection.body.length;
    const selectedText = targetSection.body.slice(start, end).trim();

    setLinkDialog({
      open: true,
      sectionId,
      type,
      anchorText:
        selectedText ||
        (type === 'internal' ? 'Explore Medical Colleges' : 'Official NMC Website'),
      url: type === 'internal' ? '/colleges' : 'https://www.nmc.org.in',
      selectionStart: start,
      selectionEnd: end,
    });
  };

  const handleConfirmInsertLink = () => {
    if (!linkDialog) return;
    const { sectionId, type, anchorText, url, selectionStart, selectionEnd } =
      linkDialog;
    const targetSection = sections.find((s) => s.id === sectionId);
    if (!targetSection) {
      setLinkDialog(null);
      return;
    }

    const cleanAnchor = anchorText.trim() || 'Click here';
    let cleanUrl = url.trim();
    if (!cleanUrl) {
      toast.error('Please enter a link URL.');
      return;
    }

    if (type === 'internal') {
      // Convert full same-site URL to relative path `/...` so React Router treats it as internal
      if (cleanUrl.startsWith(siteOrigin)) {
        cleanUrl = cleanUrl.slice(siteOrigin.length) || '/';
      }
      if (!cleanUrl.startsWith('/') && !cleanUrl.startsWith('http')) {
        cleanUrl = `/${cleanUrl}`;
      }
    } else {
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = `https://${cleanUrl}`;
      }
    }

    const markdownLink = `[${cleanAnchor}](${cleanUrl})`;
    const currentBody = targetSection.body;
    const updated =
      currentBody.slice(0, selectionStart) +
      markdownLink +
      currentBody.slice(selectionEnd);

    updateSection(sectionId, 'body', updated);
    setLinkDialog(null);

    requestAnimationFrame(() => {
      const textarea = textareaRefs.current[sectionId];
      if (textarea) {
        textarea.focus();
        const newPos = selectionStart + markdownLink.length;
        textarea.setSelectionRange(newPos, newPos);
      }
    });
  };

  const handleSectionKeyDown = (
    sectionId: string,
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        applyInlineFormat(sectionId, '**', 'bold text');
      } else if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        applyInlineFormat(sectionId, '*', 'italic text');
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/webp', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      toast.error('Please select a JPG, PNG, or WebP image.');
      e.target.value = '';
      return;
    }

    setUploadingImage(true);
    try {
      const url = await BlogService.uploadImage(file);
      setCoverImage(url);
      toast.success('Photo uploaded!');
    } catch {
      const reader = new FileReader();
      reader.onload = () => setCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !excerpt.trim() ||
      !combinedContent.trim() ||
      !author.trim()
    ) {
      toast.error(
        'Please fill in the blog title, summary, author, and at least one content section.'
      );
      return;
    }

    const words = combinedContent.trim().split(/\s+/).filter(Boolean).length;
    const autoReadTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
    const finalCover = coverImage.trim() || DEFAULT_COVER;
    const finalSlug = generateSlug(slug.trim() || title.trim());
    const finalSeoTitle = seoTitle.trim() || title.trim();
    const finalSeoDesc = seoDescription.trim() || excerpt.trim();
    const finalAlt = imageAlt.trim() || title.trim();
    const finalCanonical = canonicalUrl.trim();

    const payload: Partial<BlogPost> = {
      title: title.trim(),
      slug: finalSlug,
      tag,
      tags: Array.from(
        new Set([tag, ...(focusKeyword.trim() ? [focusKeyword.trim()] : [])])
      ),
      author: author.trim(),
      coverImage: finalCover,
      imageAlt: finalAlt,
      excerpt: excerpt.trim(),
      content: combinedContent,
      readTime: autoReadTime,
      status,
      showInListing: status === 'Published',
      allowIndexing,
      focusKeyword: focusKeyword.trim(),
      seoTitle: finalSeoTitle,
      seoDescription: finalSeoDesc,
      canonicalUrl: finalCanonical,
      ogImage: finalCover,
    };

    setSaving(true);
    try {
      if (editingBlog) {
        await BlogService.updateById(editingBlog._id || editingBlog.id, payload);
        toast.success('Blog & SEO settings updated!');
      } else {
        await BlogService.create(payload);
        toast.success('Blog published with full SEO!');
      }
      setIsModalOpen(false);
      await loadBlogs();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to save blog.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blog: BlogPost) => {
    if (!window.confirm(`Delete "${blog.title}"?`)) return;
    try {
      await BlogService.deleteById(blog._id || blog.id);
      toast.success('Blog deleted.');
      await loadBlogs();
    } catch {
      toast.error('Failed to delete blog.');
    }
  };

  const resolveThumbUrl = (url?: string) => {
    if (!url) return DEFAULT_COVER;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `${import.meta.env.VITE_API_URL || ''}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const previewSlug = generateSlug(slug.trim() || title.trim() || 'your-blog-url');
  const previewTitle = seoTitle.trim() || title.trim() || 'Blog Title Preview';
  const previewDesc =
    seoDescription.trim() ||
    excerpt.trim() ||
    'Your meta description will appear here in Google Search results.';

  // Existing blog pages for internal linking dropdown
  const internalLinkOptions = useMemo(() => {
    const blogLinks = blogs
      .filter((b) => !editingBlog || b.slug !== editingBlog.slug)
      .slice(0, 15)
      .map((b) => ({
        label: `Blog: ${b.title}`,
        url: `/blogs/${b.slug}`,
      }));
    return [...QUICK_INTERNAL_LINKS, ...blogLinks];
  }, [blogs, editingBlog]);

  return (
    <div className="bg-white text-stone-800 rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Manage Blogs ({blogs.length})</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Create &amp; manage articles with Rank Math SEO controls, Focus Keywords, Internal/External links, and XML Sitemap sync.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs or keywords..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-teal-600"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Blog
          </button>
        </div>
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-stone-400">Loading blogs...</div>
      ) : filteredBlogs.length === 0 ? (
        <div className="py-12 text-center bg-stone-50 rounded-xl border border-stone-200/70">
          <p className="text-sm font-semibold text-stone-700">No blog posts found</p>
          <p className="text-xs text-stone-500 mt-1">Click &ldquo;Add Blog&rdquo; to publish a new post.</p>
        </div>
      ) : (
        <div className="divide-y divide-stone-200/80">
          {filteredBlogs.map((blog) => {
            const id = blog._id || blog.id;
            return (
              <div
                key={id}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <img
                    src={resolveThumbUrl(blog.coverImage)}
                    alt={blog.imageAlt || blog.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== DEFAULT_COVER) target.src = DEFAULT_COVER;
                    }}
                    className="w-16 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-900 truncate">{blog.title}</h3>
                      {blog.status === 'Draft' && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Draft
                        </span>
                      )}
                      {blog.allowIndexing === false && (
                        <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 text-[10px] font-bold">
                          Noindex
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mt-0.5">
                      <span className="text-teal-700 font-medium">{blog.tag}</span>
                      {blog.focusKeyword && (
                        <>
                          <span>·</span>
                          <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 text-[11px] font-medium">
                            KW: {blog.focusKeyword}
                          </span>
                        </>
                      )}
                      <span>·</span>
                      <span>{blog.date}</span>
                      <span>·</span>
                      <Link
                        to={`/blogs/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-600 hover:text-teal-700 underline inline-flex items-center gap-0.5"
                      >
                        /blogs/{blog.slug} <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleOpenEdit(blog)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-teal-700" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-red-50 text-stone-600 hover:text-red-600 text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Blog Create / Edit Modal with Section Builder + Rank Math SEO Controls */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-4xl overflow-hidden shadow-xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-stone-900">
                  {editingBlog ? 'Edit Blog Post & SEO' : 'Create New Blog Post'}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    seoChecks.score >= 75
                      ? 'bg-emerald-100 text-emerald-800'
                      : seoChecks.score >= 50
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  SEO Score: {seoChecks.score} / 100
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-6 text-stone-800">
              {/* PART 1: BASIC BLOG DETAILS */}
              <div className="space-y-4">
                {/* 1. Main Blog Title */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Main Blog Title (H1)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter main blog title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-teal-600"
                  />
                </div>

                {/* 2. Category & Author */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Category
                    </label>
                    <select
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-teal-600"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. A. K. Sharma"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                {/* 3. Cover Image + Image ALT Text */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Cover Photo
                    </label>
                    <div className="flex items-center gap-2.5">
                      {coverImage && (
                        <img
                          src={resolveThumbUrl(coverImage)}
                          alt="Preview"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== DEFAULT_COVER) target.src = DEFAULT_COVER;
                          }}
                          className="w-14 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                      )}
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 cursor-pointer transition-colors shrink-0">
                        <Image className="w-3.5 h-3.5 text-teal-700" />
                        {uploadingImage ? 'Uploading...' : 'Upload'}
                        <input
                          type="file"
                          accept="image/webp,image/jpeg,image/png,.webp,.jpg,.jpeg,.png"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Or paste image URL..."
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-teal-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Image ALT Text (SEO)
                    </label>
                    <input
                      type="text"
                      placeholder="Describe the image (include Focus Keyword)..."
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                {/* 4. Short Summary */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Short Summary (Excerpt)
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="1–2 sentences describing the blog..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* PART 2: CONTENT SECTIONS WITH INTERNAL & EXTERNAL LINK BUTTONS */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-900">
                      Blog Content Sections ({sections.length})
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Use <strong>Bold</strong>, <strong>Italic</strong>, <strong>Internal Link</strong>, or <strong>External Link</strong> inside any section description.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold">
                    <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                      Internal Links: {linkStats.internalCount}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                      External Links: {linkStats.externalCount}
                    </span>
                  </div>
                </div>

                {/* Clickable List of Section Titles (Quick Jump in Editor) */}
                {sections.some((s) => s.heading.trim()) && (
                  <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200/70 space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                      Section Titles (Click to jump)
                    </div>
                    <ol className="space-y-1">
                      {sections.map((s, idx) => {
                        const label = s.heading.trim() || `Section ${idx + 1} (Untitled)`;
                        return (
                          <li key={`jump-${s.id}`}>
                            <button
                              type="button"
                              onClick={() => {
                                const el = document.getElementById(`editor-${s.id}`);
                                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                textareaRefs.current[s.id]?.focus();
                              }}
                              className="text-left text-xs font-medium text-stone-700 hover:text-teal-700 hover:underline inline-flex items-baseline gap-1.5 cursor-pointer"
                            >
                              <span className="font-semibold text-teal-700">
                                {idx + 1}.
                              </span>
                              <span>{label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}

                {sections.map((section, idx) => (
                  <div
                    id={`editor-${section.id}`}
                    key={section.id}
                    className="p-3.5 bg-stone-50/80 border border-stone-200 rounded-xl space-y-2.5 scroll-mt-4"
                  >
                    {/* Section Toolbar: Bold, Italic, Bullet, Internal Link, External Link */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-md">
                        Section {idx + 1}
                      </span>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <div className="inline-flex flex-wrap items-center gap-1 bg-white border border-stone-200 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              applyInlineFormat(section.id, '**', 'bold text')
                            }
                            title="Bold selected text (Ctrl+B)"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-teal-700 transition-colors cursor-pointer"
                          >
                            <Bold className="w-3.5 h-3.5" />
                            <span>Bold</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              applyInlineFormat(section.id, '*', 'italic text')
                            }
                            title="Italic selected text (Ctrl+I)"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium italic text-stone-700 hover:bg-stone-100 hover:text-teal-700 transition-colors cursor-pointer"
                          >
                            <Italic className="w-3.5 h-3.5" />
                            <span>Italic</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => applyBulletList(section.id)}
                            title="Add bullet point"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-stone-600 hover:bg-stone-100 hover:text-teal-700 transition-colors cursor-pointer"
                          >
                            <List className="w-3.5 h-3.5" />
                            <span>Bullet</span>
                          </button>

                          <span className="w-px h-4 bg-stone-200 mx-0.5" />

                          {/* Internal Link Button */}
                          <button
                            type="button"
                            onClick={() => openLinkBuilder(section.id, 'internal')}
                            title="Insert Internal Link to another page or blog"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-teal-800 bg-teal-50/70 hover:bg-teal-100 transition-colors cursor-pointer"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                            <span>+ Internal Link</span>
                          </button>

                          {/* External Link Button */}
                          <button
                            type="button"
                            onClick={() => openLinkBuilder(section.id, 'external')}
                            title="Insert External Link (e.g. https://www.nmc.org.in)"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-blue-800 bg-blue-50/70 hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>+ External Link</span>
                          </button>
                        </div>

                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(section.id)}
                            title="Remove this section"
                            className="px-2 py-1 rounded-lg border border-stone-200 bg-white hover:bg-red-50 text-stone-500 hover:text-red-600 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline Link Insertion Box (appears inside the active section when + Internal Link or + External Link is clicked) */}
                    {linkDialog && linkDialog.open && linkDialog.sectionId === section.id && (
                      <div className="p-3 rounded-xl bg-white border-2 border-teal-600/40 shadow-xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 inline-flex items-center gap-1.5">
                            {linkDialog.type === 'internal' ? (
                              <>
                                <Link2 className="w-3.5 h-3.5 text-teal-700" />
                                Insert Internal Link (Same Website)
                              </>
                            ) : (
                              <>
                                <Globe className="w-3.5 h-3.5 text-blue-700" />
                                Insert External Link (Another Website)
                              </>
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => setLinkDialog(null)}
                            className="text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>

                        {linkDialog.type === 'internal' && (
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                              Quick Select Existing Page / Blog (or type path below)
                            </label>
                            <select
                              value=""
                              onChange={(e) => {
                                const chosen = internalLinkOptions.find(
                                  (opt) => opt.url === e.target.value
                                );
                                if (chosen) {
                                  setLinkDialog({
                                    ...linkDialog,
                                    url: chosen.url,
                                    anchorText:
                                      linkDialog.anchorText === 'Explore Medical Colleges'
                                        ? chosen.label.replace(/^Blog:\s*/, '')
                                        : linkDialog.anchorText,
                                  });
                                }
                              }}
                              className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800"
                            >
                              <option value="">-- Choose a page or blog to link --</option>
                              {internalLinkOptions.map((opt) => (
                                <option key={opt.url} value={opt.url}>
                                  {opt.label} ({opt.url})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                              Clickable Text (Anchor Text)
                            </label>
                            <input
                              type="text"
                              value={linkDialog.anchorText}
                              onChange={(e) =>
                                setLinkDialog({ ...linkDialog, anchorText: e.target.value })
                              }
                              placeholder="e.g. Check NMC Guidelines"
                              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                              {linkDialog.type === 'internal'
                                ? 'Internal URL Path (starts with /)'
                                : 'External URL (starts with https://)'}
                            </label>
                            <input
                              type="text"
                              value={linkDialog.url}
                              onChange={(e) =>
                                setLinkDialog({ ...linkDialog, url: e.target.value })
                              }
                              placeholder={
                                linkDialog.type === 'internal'
                                  ? '/colleges or /blogs/...'
                                  : 'https://www.nmc.org.in'
                              }
                              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleConfirmInsertLink}
                            className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold cursor-pointer"
                          >
                            Insert Link into Section {idx + 1}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Section Heading Input */}
                    <div>
                      <input
                        type="text"
                        placeholder={`Section ${idx + 1} Heading (H2, e.g. Eligibility Criteria)`}
                        value={section.heading}
                        onChange={(e) =>
                          updateSection(section.id, 'heading', e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm font-semibold text-stone-900 placeholder:font-normal placeholder-stone-400 focus:outline-none focus:border-teal-600"
                      />
                    </div>

                    {/* Section Description Textarea */}
                    <div>
                      <textarea
                        ref={(el) => {
                          textareaRefs.current[section.id] = el;
                        }}
                        rows={4}
                        placeholder={`Write Section ${idx + 1} description here...`}
                        value={section.body}
                        onChange={(e) =>
                          updateSection(section.id, 'body', e.target.value)
                        }
                        onKeyDown={(e) => handleSectionKeyDown(section.id, e)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 leading-relaxed placeholder-stone-400 focus:outline-none focus:border-teal-600 whitespace-pre-wrap"
                      />
                    </div>
                  </div>
                ))}

                {/* + Add Another Title & Description Button */}
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-teal-600/40 bg-teal-50/40 hover:bg-teal-50 text-teal-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-teal-700" />
                  Add Another Title &amp; Description
                </button>
              </div>

              {/* PART 3: RANK MATH SEO SETTINGS & GOOGLE PREVIEW */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-700" />
                    <h4 className="text-sm font-bold text-stone-900">
                      Rank Math SEO Controls &amp; Google SERP Preview
                    </h4>
                  </div>
                  <span className="text-[11px] text-stone-500">
                    Leave blank to auto-fill from Blog Title &amp; Summary
                  </span>
                </div>

                {/* Focus Keyword & Custom URL Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-teal-900 mb-1">
                      1. Focus Keyword (Target SEO Keyword)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MBBS in Bangladesh"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-teal-600/50 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-teal-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      2. Custom URL Slug
                    </label>
                    <div className="flex items-center bg-white border border-stone-300 rounded-xl overflow-hidden focus-within:border-teal-600">
                      <span className="px-2.5 py-2 bg-stone-100 text-[11px] text-stone-500 border-r border-stone-200 shrink-0">
                        /blogs/
                      </span>
                      <input
                        type="text"
                        placeholder="custom-url-slug"
                        value={slug}
                        onChange={(e) => {
                          setSlugManuallyEdited(true);
                          setSlug(generateSlug(e.target.value));
                        }}
                        className="w-full px-2.5 py-2 text-xs text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom SEO Title & Meta Description */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-stone-700">
                        3. Custom SEO Title
                      </label>
                      <span
                        className={`text-[11px] ${
                          previewTitle.length > 60 ? 'text-amber-600 font-semibold' : 'text-stone-400'
                        }`}
                      >
                        {previewTitle.length} / 60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder={title || 'Defaults to main blog title...'}
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      4. Canonical URL
                    </label>
                    <input
                      type="text"
                      placeholder={`${siteOrigin}/blogs/${previewSlug}`}
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">
                      5. Meta Description
                    </label>
                    <span
                      className={`text-[11px] ${
                        previewDesc.length > 160 ? 'text-amber-600 font-semibold' : 'text-stone-400'
                      }`}
                    >
                      {previewDesc.length} / 160 chars
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    placeholder={excerpt || 'Defaults to short summary...'}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                {/* Indexing (Index / Noindex) & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      6. Robots Meta (Index / Noindex Option)
                    </label>
                    <select
                      value={allowIndexing ? 'index' : 'noindex'}
                      onChange={(e) => setAllowIndexing(e.target.value === 'index')}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:border-teal-600"
                    >
                      <option value="index">
                        Index, Follow (Include in Google &amp; XML Sitemap)
                      </option>
                      <option value="noindex">
                        Noindex, Nofollow (Hide from Google &amp; Sitemap)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      7. Publishing Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value === 'Draft' ? 'Draft' : 'Published')
                      }
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:border-teal-600"
                    >
                      <option value="Published">Published (Live on Website)</option>
                      <option value="Draft">Draft (Save Privately)</option>
                    </select>
                  </div>
                </div>

                {/* Live Google Search Result Preview */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-teal-700" />
                      Google Search Preview (SERP)
                    </span>
                    <span className="text-[11px] text-teal-700 font-medium">
                      JSON-LD BlogPosting Schema: Active
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 truncate">
                    {siteOrigin} › blogs › {previewSlug}
                  </div>
                  <div className="text-base font-semibold text-[#1a0dab] hover:underline truncate">
                    {previewTitle} | MBBS in Bangladesh
                  </div>
                  <div className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                    {previewDesc}
                  </div>
                </div>

                {/* Rank Math SEO Checklist */}
                <div className="p-3.5 rounded-xl bg-white border border-stone-200">
                  <div className="text-xs font-bold text-stone-800 mb-2.5">
                    Rank Math SEO Checklist ({seoChecks.score}% Complete)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {seoChecks.checks.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start gap-2 text-xs"
                      >
                        {item.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div
                            className={`font-semibold ${
                              item.passed ? 'text-stone-800' : 'text-stone-600'
                            }`}
                          >
                            {item.label}
                          </div>
                          <div className="text-[11px] text-stone-400">{item.hint}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingBlog ? 'Save Changes' : 'Publish Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
