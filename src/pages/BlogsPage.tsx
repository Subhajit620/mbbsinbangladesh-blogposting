import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Clock,
  Calendar,
  ArrowUpRight,
  BookOpen,
  X,
} from 'lucide-react';
import { BlogService, BlogPost } from '../components/BlogService';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=450';

const ITEMS_PER_PAGE = 6;

function resolveImageUrl(imgUrl?: string): string {
  if (!imgUrl) return DEFAULT_FALLBACK_IMAGE;
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('data:')) {
    return imgUrl;
  }
  const base = import.meta.env.VITE_API_URL || '';
  return `${base}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
}

function getInitials(name?: string): string {
  if (!name) return 'MB';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function BlogsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTag = searchParams.get('tag') || 'All';

  const [blogs, setBlogs] = useState<BlogPost[]>(() => BlogService.getAll());
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const tagFromUrl = searchParams.get('tag');
    if (tagFromUrl) {
      setSelectedTag(tagFromUrl);
    } else {
      setSelectedTag('All');
    }
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    document.title = 'Articles & Admission Guides | MBBS in Bangladesh';
    let metaDesc = document.head.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Read practical guides, NMC Foreign Medical Graduate regulations, FMGE preparation notes, and student life stories from medical colleges in Bangladesh.'
    );
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadBlogs = async () => {
      setLoading(true);
      try {
        const data = await BlogService.fetchPublished();
        if (isMounted) {
          setBlogs(data);
        }
      } catch (err) {
        console.error('Error loading blogs from API:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  const tags = useMemo(() => {
    const set = new Set<string>(['All']);
    blogs.forEach((b) => {
      if (b.tag) set.add(b.tag);
    });
    if (selectedTag !== 'All' && !set.has(selectedTag)) {
      set.add(selectedTag);
    }
    return Array.from(set);
  }, [blogs, selectedTag]);

  const filteredBlogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return blogs.filter((blog) => {
      const matchesSearch =
        !q ||
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q) ||
        blog.content.toLowerCase().includes(q) ||
        (blog.author && blog.author.toLowerCase().includes(q)) ||
        (blog.tags || []).some((t) => t.toLowerCase().includes(q));

      const matchesTag =
        selectedTag === 'All' ||
        blog.tag === selectedTag ||
        (blog.tags || []).some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesTag;
    });
  }, [blogs, searchQuery, selectedTag]);

  const showFeaturedHero =
    safePageCheck(currentPage) &&
    !searchQuery.trim() &&
    selectedTag === 'All' &&
    filteredBlogs.length > 1;

  function safePageCheck(page: number) {
    return page === 1;
  }

  const featuredBlog = showFeaturedHero ? filteredBlogs[0] : null;
  const gridSourceBlogs = showFeaturedHero ? filteredBlogs.slice(1) : filteredBlogs;

  const totalPages = Math.max(1, Math.ceil(gridSourceBlogs.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedBlogs = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return gridSourceBlogs.slice(start, start + ITEMS_PER_PAGE);
  }, [gridSourceBlogs, safeCurrentPage]);

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
    if (tag === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ tag });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 font-sans pt-28">
      <Navbar />

      {/* Warm Light Editorial Hero Banner */}
      <header className="relative overflow-hidden border-b border-stone-200/80 bg-gradient-to-b from-teal-50/60 via-[#FAF9F6] to-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-9">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/80 text-teal-800 text-xs font-semibold tracking-wide mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Editorial &amp; Admission Guides
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
              Insights on Studying{' '}
              <span className="text-teal-700">MBBS in Bangladesh</span>
            </h1>
            <p className="text-stone-600 text-base sm:text-lg mt-3.5 leading-relaxed">
              Practical guides on NMC regulations, FMGE preparation, college fee structures, and real campus experiences written by our academic counselors.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => {
                const active = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                      active
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-white border border-stone-200/90 text-stone-700 hover:border-teal-600/50 hover:text-teal-800'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search articles, topics, authors..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-stone-200/90 rounded-full text-sm text-stone-800 placeholder-stone-400 shadow-2xs focus:outline-none focus:border-teal-700"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {loading && blogs.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white border border-stone-200 rounded-2xl p-4 animate-pulse space-y-4"
              >
                <div className="aspect-[16/10] bg-stone-200 rounded-xl" />
                <div className="h-4 bg-stone-200 rounded w-1/3" />
                <div className="h-6 bg-stone-200 rounded w-5/6" />
                <div className="h-12 bg-stone-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white border border-stone-200 rounded-3xl shadow-2xs max-w-lg mx-auto my-6">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-stone-900">No matching articles found</h2>
            <p className="text-stone-500 text-sm mt-1">
              We couldn&rsquo;t find any posts matching your current filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                handleTagSelect('All');
              }}
              className="mt-5 px-5 py-2.5 bg-teal-700 text-white text-xs font-semibold rounded-full cursor-pointer hover:bg-teal-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured Lead Article Card */}
            {featuredBlog && (
              <article
                onClick={() => navigate(`/blogs/${featuredBlog.slug}`)}
                className="mb-12 bg-white border border-stone-200/90 hover:border-teal-600/40 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <Link
                  to={`/blogs/${featuredBlog.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="grid grid-cols-1 lg:grid-cols-12"
                >
                  <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-stone-100">
                    <img
                      src={resolveImageUrl(featuredBlog.coverImage)}
                      alt={featuredBlog.imageAlt || featuredBlog.title}
                      loading="eager"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                          target.src = DEFAULT_FALLBACK_IMAGE;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-teal-700 text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                        Featured Guide
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-stone-800 text-xs font-semibold shadow-xs">
                        {featuredBlog.tag}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-br from-white via-white to-stone-50/70">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-teal-700" />
                          {featuredBlog.date}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal-700" />
                          {featuredBlog.readTime}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 group-hover:text-teal-700 transition-colors leading-snug">
                        {featuredBlog.title}
                      </h2>

                      <p className="text-stone-600 text-sm sm:text-base mt-3.5 line-clamp-3 leading-relaxed">
                        {featuredBlog.excerpt}
                      </p>
                    </div>

                    <div className="mt-7 pt-5 border-t border-stone-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">
                          {getInitials(featuredBlog.author)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">
                            {featuredBlog.author}
                          </div>
                          <div className="text-[11px] text-stone-500">Admission Counselor</div>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform">
                        Read Article <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* Article Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {paginatedBlogs.map((blog) => (
                <article
                  key={blog.id || blog.slug}
                  onClick={() => navigate(`/blogs/${blog.slug}`)}
                  className="bg-white border border-stone-200/90 hover:border-teal-600/40 rounded-2xl overflow-hidden flex flex-col cursor-pointer shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <Link
                    to={`/blogs/${blog.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col flex-1"
                  >
                    {/* Cover Image with Floating Category Badge */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 border-b border-stone-100">
                      <img
                        src={resolveImageUrl(blog.coverImage)}
                        alt={blog.imageAlt || blog.title}
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
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-teal-800 text-[11px] font-bold shadow-xs">
                        {blog.tag}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2.5">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            {blog.date}
                          </span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            {blog.readTime}
                          </span>
                        </div>

                        <h2 className="text-lg font-bold text-stone-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
                          {blog.title}
                        </h2>

                        <p className="text-stone-600 text-sm mt-2.5 line-clamp-3 leading-relaxed">
                          {blog.excerpt}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                            {getInitials(blog.author)}
                          </div>
                          <span className="text-xs font-semibold text-stone-700 truncate">
                            {blog.author}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 shrink-0 group-hover:translate-x-0.5 transition-transform">
                          Read <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Blog pagination" className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage <= 1}
                  className="px-4 py-2 rounded-full border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                      safeCurrentPage === pageNum
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage >= totalPages}
                  className="px-4 py-2 rounded-full border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </nav>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
