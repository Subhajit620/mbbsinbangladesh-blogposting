const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    previousSlugs: {
      type: [String],
      default: [],
      index: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=450',
    },
    imageAlt: {
      type: String,
      default: '',
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: String,
      required: true,
      trim: true,
      default: 'NMC Guidelines',
    },
    tags: {
      type: [String],
      default: [],
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    date: {
      type: String,
      default: '',
    },
    // SEO Settings
    seoTitle: {
      type: String,
      default: '',
      trim: true,
    },
    seoDescription: {
      type: String,
      default: '',
      trim: true,
    },
    focusKeyword: {
      type: String,
      default: '',
      trim: true,
    },
    canonicalUrl: {
      type: String,
      default: '',
      trim: true,
    },
    ogImage: {
      type: String,
      default: '',
      trim: true,
    },
    // Publishing Settings
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Scheduled'],
      default: 'Published',
      index: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    showInListing: {
      type: Boolean,
      default: true,
    },
    allowIndexing: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        return ret;
      },
    },
  }
);

// Virtual alias for category -> tag
blogSchema.virtual('category').get(function () {
  return this.tag;
});

const deletedSlugSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

const Blog = mongoose.model('Blog', blogSchema);
const DeletedBlogSlug = mongoose.model('DeletedBlogSlug', deletedSlugSchema);

module.exports = { Blog, DeletedBlogSlug };
