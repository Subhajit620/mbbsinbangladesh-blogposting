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
  const [excerpt, setExcerpt] = useState('');

  // Dynamic Content Sections (Title + Description blocks)
  const [sections, setSections] = useState<ContentSection[]>([createEmptySection()]);
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

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

  const filteredBlogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.tag.toLowerCase().includes(q)
    );
  }, [blogs, searchQuery]);

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setTitle('');
    setTag('NMC Guidelines');
    setAuthor('Admin Counselor');
    setCoverImage('');
    setExcerpt('');
    setSections([createEmptySection()]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setTitle(blog.title || '');
    setTag(blog.tag || 'NMC Guidelines');
    setAuthor(blog.author || '');
    setCoverImage(blog.coverImage || '');
    setExcerpt(blog.excerpt || '');
    setSections(parseContentIntoSections(blog.content || ''));
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

    // Unwrap if already wrapped with the same formatting marker
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
    const combinedContent = serializeSectionsToContent(sections);

    if (
      !title.trim() ||
      !excerpt.trim() ||
      !combinedContent.trim() ||
      !author.trim()
    ) {
      toast.error('Please fill in the blog title, summary, author, and at least one content section.');
      return;
    }

    // Automatically compute reading time and SEO fields in the background
    const words = combinedContent.trim().split(/\s+/).filter(Boolean).length;
    const autoReadTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
    const finalCover = coverImage.trim() || DEFAULT_COVER;

    const payload: Partial<BlogPost> = {
      title: title.trim(),
      slug: editingBlog ? editingBlog.slug : generateSlug(title),
      tag,
      tags: [tag],
      author: author.trim(),
      coverImage: finalCover,
      imageAlt: title.trim(),
      excerpt: excerpt.trim(),
      content: combinedContent,
      readTime: autoReadTime,
      status: 'Published',
      showInListing: true,
      allowIndexing: true,
      seoTitle: title.trim(),
      seoDescription: excerpt.trim(),
      ogImage: finalCover,
    };

    setSaving(true);
    try {
      if (editingBlog) {
        await BlogService.updateById(editingBlog._id || editingBlog.id, payload);
        toast.success('Blog updated!');
      } else {
        await BlogService.create(payload);
        toast.success('Blog published!');
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

  return (
    <div className="bg-white text-stone-800 rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Simple Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Manage Blogs ({blogs.length})</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Post an article once — its webpage URL and Google SEO tags are generated automatically.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs..."
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
                    alt={blog.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== DEFAULT_COVER) target.src = DEFAULT_COVER;
                    }}
                    className="w-16 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-stone-900 truncate">{blog.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mt-0.5">
                      <span className="text-teal-700 font-medium">{blog.tag}</span>
                      <span>·</span>
                      <span>{blog.date}</span>
                      <span>·</span>
                      <span>{blog.author}</span>
                      <span>·</span>
                      <Link
                        to={`/blogs/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-600 hover:text-teal-700 underline inline-flex items-center gap-0.5"
                      >
                        View page <ExternalLink className="w-3 h-3" />
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

      {/* Blog Create / Edit Modal with Section-by-Section Builder */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="text-base font-bold text-stone-900">
                {editingBlog ? 'Edit Blog Post' : 'New Blog Post'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-stone-800">
              {/* 1. Main Blog Title */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Main Blog Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter main blog title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-teal-600"
                />
                {title.trim() && !editingBlog && (
                  <p className="text-[11px] text-stone-400 mt-1 truncate">
                    Page link: /blogs/{generateSlug(title)}
                  </p>
                )}
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

              {/* 3. Cover Image */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cover Photo
                </label>
                <div className="flex items-center gap-3">
                  {coverImage && (
                    <img
                      src={resolveThumbUrl(coverImage)}
                      alt="Preview"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== DEFAULT_COVER) target.src = DEFAULT_COVER;
                      }}
                      className="w-16 h-11 rounded-lg object-cover border border-stone-200 shrink-0"
                    />
                  )}
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 cursor-pointer transition-colors shrink-0">
                    <Image className="w-3.5 h-3.5 text-teal-700" />
                    {uploadingImage ? 'Uploading...' : 'Choose Photo'}
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

              {/* 4. Short Summary */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Short Summary
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

              {/* 5. Content Sections (Title + Description blocks) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800">
                      Blog Sections ({sections.length})
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Add a section heading and description. Click &ldquo;+ Add Another Section&rdquo; for more paragraphs.
                    </p>
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
                    {/* Section Top Bar: Section Number + Formatting Buttons + Remove */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-md">
                        Section {idx + 1}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <div className="inline-flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-0.5">
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

                    {/* Section Heading Input */}
                    <div>
                      <input
                        type="text"
                        placeholder={`Section ${idx + 1} Title (optional, e.g. Eligibility Criteria)`}
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
