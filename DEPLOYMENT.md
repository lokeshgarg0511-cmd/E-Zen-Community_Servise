# Deployment Guide

## Architecture

```
[ React + Vite frontend ]  --->  [ Express API ]  --->  [ MongoDB Atlas ]
        (static build)              (Node.js)
                                       |
                                       v
                               [ SMTP provider ]
```

The frontend is a static SPA after `npm run build` and can be hosted on any
static host. The backend is a standard Node/Express service.

---

## 1. Deploying the backend (Render / Railway / Fly.io / EC2 — any Node host)

Example using **Render**:

1. Push the `backend/` folder to a Git repository.
2. Create a new **Web Service** on Render, pointing at that repo/subfolder.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `.env.example` in Render's dashboard
   (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, SMTP vars, etc.).
6. Once deployed, note the public URL, e.g. `https://spms-api.onrender.com`.
7. Run the seed script once via Render's shell (or locally against the same
   `MONGO_URI`): `npm run seed`.

The same steps apply on Railway or Fly.io with their respective CLIs; the
app itself requires no platform-specific code.

---

## 2. Deploying the frontend (Vercel / Netlify / Cloudflare Pages)

Example using **Vercel**:

1. Push the `frontend/` folder to a Git repository.
2. Import the project in Vercel, set the root directory to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables:
   - `VITE_USE_MOCK=false`
   - `VITE_API_URL=https://spms-api.onrender.com/api` (your backend's URL)
6. Deploy. Vercel will give you a public URL, e.g. `https://spms.vercel.app`.

Then go back to the backend's environment variables and set:

```
CLIENT_URL=https://spms.vercel.app
```

…and redeploy the backend so CORS allows the live frontend origin.

---

## 3. MongoDB Atlas setup (if not already configured)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas.
2. Database Access → add a user with a strong password.
3. Network Access → add your deployment platform's IP range, or `0.0.0.0/0`
   for simplicity (acceptable for a coursework/demo deployment; restrict for
   production use).
4. Copy the connection string from "Connect" → "Drivers", swap in your
   username/password, and set it as `MONGO_URI`.

---

## 4. Production checklist

- [ ] `JWT_SECRET` is a long, random, unique value (not the placeholder)
- [ ] `NODE_ENV=production` is set on the backend host
- [ ] SMTP credentials use an app password / API key, not a personal password
- [ ] MongoDB Atlas network access is scoped to known IPs where possible
- [ ] `CLIENT_URL` matches the deployed frontend origin exactly
- [ ] Frontend `VITE_API_URL` points at the deployed backend's `/api` path
- [ ] Run `npm run seed` once against production data only if you want demo
      accounts there — otherwise skip it and register real accounts

---

## Standalone demo deployment (frontend only, no backend)

If you only want to showcase the UI without standing up MongoDB/SMTP, you can
deploy `frontend/` as-is (`VITE_USE_MOCK=true`, the default) to any static
host — Vercel, Netlify, GitHub Pages — with zero backend infrastructure. All
data lives in the visitor's browser `localStorage`.
