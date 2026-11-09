# MBBS in Bangladesh

React (Vite) frontend + Express/MongoDB backend. In production the Express
server serves both the API (`/api/*`) and the built React app, so it deploys as
a **single web service**.

## Local development

```bash
# 1. Install dependencies (root + backend)
npm install
npm install --prefix backend

# 2. Configure the backend
cp backend/.env.example backend/.env   # then edit values

# 3. Run both servers (frontend :3000, backend :5001)
npm run dev
```

The Vite dev server proxies `/api` and `/uploads` to the backend (see
`vite.config.js`), so no API URL needs to be configured for local dev.

## Seeding colleges

```bash
npm run seed
```

## Deploying (single service)

Any Node host works (Render, Railway, Fly.io, a VPS, etc.).

- **Build command:** `npm install && npm install --prefix backend && npm run build`
- **Start command:** `node backend/index.js`  (or `npm start`)
- **Environment variables:** set everything from `backend/.env.example`
  in the host's dashboard. Do **not** commit `backend/.env`.
  Most hosts set `PORT` automatically — leave it unset.

`render.yaml` is included for Render's Blueprint deploy. A `Procfile` is
included for Heroku-style hosts.

After the build, `dist/` exists and `backend/index.js` serves it with SPA
fallback, so `https://your-app/` and `https://your-app/api/health` both work
from the same origin.

## Deploying frontend and backend separately (optional)

1. Deploy the backend anywhere; note its public URL.
2. Build the frontend with `VITE_API_URL` pointing at that URL:
   ```bash
   VITE_API_URL=https://your-api.example.com npm run build
   ```
   then host `dist/` on any static host.
3. On the backend, set `CORS_ORIGIN=https://your-frontend.example.com`.

## Security note

`backend/.env` and `server/.env` currently contain real credentials and were
committed to this project. Rotate those secrets (MongoDB password, Cloudinary
keys, Gmail app password) before publishing the repo, and keep the new values
only in the host's environment settings. The `server/` folder is unused and can
be deleted.
