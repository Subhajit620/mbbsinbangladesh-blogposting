import axios from 'axios';

export type BlogStatus = 'Draft' | 'Published' | 'Scheduled';

export interface BlogPost {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  previousSlugs?: string[];
  content: string;
  excerpt: string;
  coverImage: string;
  imageAlt?: string;
  tag: string;
  tags?: string[];
  author: string;
  readTime: string;
  date: string;
  // SEO Settings
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogImage?: string;
  // Publishing Settings
  status?: BlogStatus;
  publishDate?: string;
  showInListing?: boolean;
  allowIndexing?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogDetailResponse {
  redirect: boolean;
  statusCode?: number;
  oldSlug?: string;
  newSlug?: string;
  redirectUrl?: string;
  blog: BlogPost;
  relatedBlogs?: BlogPost[];
}

export interface SlugCheckResponse {
  slug: string;
  available: boolean;
  suggestedSlug: string;
}

/**
 * Convert any string into a clean, lowercase, SEO-friendly URL slug.
 */
export function generateSlug(input: string): string {
  const cleaned = String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)+/g, '');

  return cleaned || 'blog-post';
}

function getAdminHeaders() {
  const token = localStorage.getItem('admin_token') || 'aspiring_life_auth_token';
  return {
    'x-admin-token': token,
    Authorization: `Bearer ${token}`,
  };
}

function normalizeBlog(raw: any): BlogPost {
  return {
    ...raw,
    id: raw.id || raw._id || raw.slug,
    _id: raw._id || raw.id,
    slug: raw.slug || generateSlug(raw.title || ''),
    tag: raw.tag || raw.category || 'NMC Guidelines',
    tags: Array.isArray(raw.tags) && raw.tags.length > 0 ? raw.tags : [raw.tag || 'NMC Guidelines'],
    imageAlt: raw.imageAlt || raw.title || '',
    seoTitle: raw.seoTitle || raw.title || '',
    seoDescription: raw.seoDescription || raw.excerpt || '',
    focusKeyword: raw.focusKeyword || '',
    canonicalUrl: raw.canonicalUrl || '',
    ogImage: raw.ogImage || raw.coverImage || '',
    status: raw.status || 'Published',
    publishDate: raw.publishDate || raw.createdAt || new Date().toISOString(),
    showInListing: raw.showInListing !== undefined ? Boolean(raw.showInListing) : true,
    allowIndexing: raw.allowIndexing !== undefined ? Boolean(raw.allowIndexing) : true,
  };
}

export const BlogService = {
  slugify: generateSlug,

  /**
   * Fetch all publicly visible blogs for the /blogs listing page.
   */
  fetchPublished: async (params?: { search?: string; tag?: string }): Promise<BlogPost[]> => {
    const res = await axios.get('/api/blogs', { params });
    const list = Array.isArray(res.data) ? res.data : res.data?.blogs || [];
    const normalized = list.map(normalizeBlog);
    localStorage.setItem('mbbs_blogs', JSON.stringify(normalized));
    return normalized;
  },

  /**
   * Fetch all blogs (including Drafts, Scheduled, hidden) for the Admin Dashboard.
   */
  fetchAdminAll: async (): Promise<BlogPost[]> => {
    const res = await axios.get('/api/blogs/admin/all', {
      headers: getAdminHeaders(),
    });
    const list = Array.isArray(res.data) ? res.data : [];
    return list.map(normalizeBlog);
  },

  /**
   * Fetch a single blog by its slug (handles 301 redirect payloads & related blogs).
   */
  fetchBySlug: async (slug: string, preview = false): Promise<BlogDetailResponse> => {
    const res = await axios.get(`/api/blogs/slug/${encodeURIComponent(slug)}`, {
      params: preview ? { preview: 'true' } : undefined,
      headers: preview ? getAdminHeaders() : undefined,
    });
    const data = res.data;
    return {
      ...data,
      blog: data.blog ? normalizeBlog(data.blog) : data.blog,
      relatedBlogs: Array.isArray(data.relatedBlogs) ? data.relatedBlogs.map(normalizeBlog) : [],
    };
  },

  /**
   * Check whether a candidate slug is unique before publishing.
   */
  checkSlug: async (slug: string, excludeId?: string): Promise<SlugCheckResponse> => {
    const res = await axios.get('/api/blogs/check-slug', {
      params: { slug, excludeId },
    });
    return res.data;
  },

  /**
   * Upload a cover/OG image file to the backend (/uploads or Cloudinary).
   */
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await axios.post('/api/blogs/upload-image', formData, {
      headers: {
        ...getAdminHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.url;
  },

  /**
   * Create a new blog post in MongoDB.
   */
  create: async (blogData: Partial<BlogPost>): Promise<BlogPost> => {
    const res = await axios.post('/api/blogs', blogData, {
      headers: getAdminHeaders(),
    });
    return normalizeBlog(res.data);
  },

  /**
   * Update an existing blog post in MongoDB.
   */
  updateById: async (id: string, updatedBlog: Partial<BlogPost>): Promise<BlogPost> => {
    const res = await axios.put(`/api/blogs/${encodeURIComponent(id)}`, updatedBlog, {
      headers: getAdminHeaders(),
    });
    return normalizeBlog(res.data);
  },

  /**
   * Delete a blog post from MongoDB.
   */
  deleteById: async (id: string): Promise<void> => {
    await axios.delete(`/api/blogs/${encodeURIComponent(id)}`, {
      headers: getAdminHeaders(),
    });
  },

  // Cached synchronous fallback methods for backward compatibility
  getAll: (): BlogPost[] => {
    try {
      const stored = localStorage.getItem('mbbs_blogs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  getById: (id: string): BlogPost | undefined => {
    return BlogService.getAll().find((blog) => blog.id === id || blog._id === id || blog.slug === id);
  },
};
