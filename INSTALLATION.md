# Installation Guide

## Prerequisites

- Node.js 18+ and npm
- A MongoDB Atlas cluster (free tier is fine) — only needed for the live backend
- An SMTP account for sending real emails (Gmail app password, SendGrid, Mailtrap, etc.) — only needed for the live backend

---

## 1. Standalone demo (no backend required)

This is the fastest way to explore every screen and role.

```bash
cd frontend
npm install
npm run dev
```

Visit the local URL Vite prints (default `http://localhost:5173`). Use the
role tabs on the login page and the **"Use demo account"** button to sign in
instantly as a Student, Faculty, Parent, or Admin.

Data is persisted to `localStorage` under the key `spms_db_v1`, so changes
(new marks, attendance, assignments) survive page refreshes. To reset to the
original seed data, clear your browser's local storage for the site or run:

```js
localStorage.removeItem("spms_db_v1");
```

in the browser console, then refresh.

---

## 2. Live backend setup

### 2.1 Install dependencies

```bash
cd backend
npm install
```

### 2.2 Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Description |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random string |
| `JWT_EXPIRE` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend origin, e.g. `http://localhost:5173` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | Your email provider's SMTP credentials |
| `OTP_EXPIRE_MINUTES` | OTP validity window, default `10` |

### 2.3 Seed demo data (optional but recommended)

```bash
npm run seed
```

This creates the same students/faculty/parent/admin accounts used in the
standalone demo, all with password `Demo@1234`.

### 2.4 Run the API

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start        # plain node
```

The API starts on `http://localhost:5000` by default. Check it's alive:

```bash
curl http://localhost:5000/api/health
```

### 2.5 Point the frontend at the live backend

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:

```
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:5000/api
```

Then `npm run dev` as usual. The frontend will now call the real Express API
instead of the simulated `mockApi.js` layer (swap is done at the
`services/` boundary — components are unaffected).

---

## Troubleshooting

- **CORS errors**: ensure `CLIENT_URL` in `backend/.env` exactly matches the
  origin the frontend is served from (protocol + host + port).
- **OTP emails not arriving**: most SMTP providers require an "app password"
  rather than your normal account password (Gmail, Outlook). In development,
  the API also returns `devOtp` in the response body when `NODE_ENV` is not
  `production`, so you can verify without email delivery.
- **MongoDB connection refused**: confirm your Atlas cluster's network access
  list includes your current IP (or `0.0.0.0/0` for development only).
