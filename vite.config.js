import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'

function blogFullstackDevPlugin() {
  return {
    name: 'blog-fullstack-seo-dev',
    configureServer(server) {
      try {
        const backendEntry = path.resolve(process.cwd(), 'backend', 'index.js')
        const backendRequire = createRequire(backendEntry)

        backendRequire('dotenv').config({
          path: path.resolve(process.cwd(), 'backend', '.env'),
        })

        const express = backendRequire('express')
        const mongoose = backendRequire('mongoose')
        const blogRoutes = backendRequire('./routes/blogs')
        const {
          resolveBlogPageRequest,
          generateSitemapXml,
          resolveSiteOrigin,
        } = backendRequire('./utils/seoAndSitemap')

        const uploadsDir = path.resolve(process.cwd(), 'uploads')
        fs.mkdirSync(uploadsDir, { recursive: true })

        if (process.env.MONGODB_URI && mongoose.connection.readyState === 0) {
          mongoose
            .connect(process.env.MONGODB_URI)
            .then(() => console.log('[Vite Blog API] MongoDB connected for /api/blogs & SEO'))
            .catch((err) => console.error('[Vite Blog API] MongoDB connection error:', err.message))
        }

        const apiApp = express()
        apiApp.use(express.json({ limit: '10mb' }))
        apiApp.use('/uploads', express.static(uploadsDir))
        apiApp.use('/api/blogs', blogRoutes)

        const handleSitemap = async (req, res) => {
          try {
            const xml = await generateSitemapXml(req)
            res.setHeader('Content-Type', 'application/xml; charset=utf-8')
            res.statusCode = 200
            res.end(xml)
          } catch (err) {
            console.error('Error generating sitemap:', err)
            res.statusCode = 500
            res.end()
          }
        }

        apiApp.get('/sitemap.xml', handleSitemap)
        apiApp.get('/api/sitemap.xml', handleSitemap)

        apiApp.get('/robots.txt', (req, res) => {
          const origin = resolveSiteOrigin(req)
          const robotsTxt = [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            'Disallow: /api/',
            `Sitemap: ${origin}/sitemap.xml`,
            '',
          ].join('\n')
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.statusCode = 200
          res.end(robotsTxt)
        })

        // 1. Mount /api/blogs, /sitemap.xml, /robots.txt, and /uploads/blog-* directly in Vite dev server
        server.middlewares.use((req, res, next) => {
          const url = req.url || ''
          if (
            url.startsWith('/api/blogs') ||
            url.startsWith('/sitemap.xml') ||
            url.startsWith('/api/sitemap.xml') ||
            url.startsWith('/robots.txt') ||
            url.startsWith('/uploads/blog-')
          ) {
            return apiApp(req, res, next)
          }
          return next()
        })

        // 2. Intercept /blogs/:slug HTML requests for SSR SEO metadata, JSON-LD & 301 redirects
        server.middlewares.use(async (req, res, next) => {
          try {
            const url = req.url ? req.url.split('?')[0] : ''
            const match = url.match(/^\/blogs\/([^/]+)\/?$/)
            if (!match || req.method !== 'GET') {
              return next()
            }
            const accept = req.headers.accept || ''
            if (!accept.includes('text/html') && !accept.includes('*/*')) {
              return next()
            }

            const slug = decodeURIComponent(match[1])
            const mockReq = {
              headers: req.headers,
              protocol: 'http',
              get: (headerName) => req.headers[headerName.toLowerCase()],
            }

            const seoResult = await resolveBlogPageRequest(slug, mockReq)
            if (seoResult.action === 'redirect' && seoResult.location) {
              res.statusCode = seoResult.statusCode || 301
              res.setHeader('Location', seoResult.location)
              res.end()
              return
            }

            const rawHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8')
            const transformedHtml = await server.transformIndexHtml(req.url, rawHtml)
            let finalHtml = seoResult.headTags
              ? transformedHtml
                  .replace(/<title>[\s\S]*?<\/title>/i, '')
                  .replace('</head>', `    ${seoResult.headTags}\n  </head>`)
              : transformedHtml
            if (seoResult.bodyFallbackHtml) {
              finalHtml = finalHtml.replace(
                '</body>',
                `    ${seoResult.bodyFallbackHtml}\n  </body>`
              )
            }

            res.statusCode = seoResult.statusCode || 200
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(finalHtml)
          } catch {
            return next()
          }
        })
      } catch (err) {
        console.error('[Vite Blog Plugin] Setup error:', err)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    blogFullstackDevPlugin(),
    react(),
    tailwindcss(),
  ],

  server: {
    host: "127.0.0.1",
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
      },
    },
  },
})
