# SPMS — Student Performance & Early Warning System

A full-stack MERN application for university academic monitoring: attendance,
internal marks, assignment submissions, and an automated composite-score
early-warning system across four roles — **Student, Faculty, Parent, Admin**.

This project ships in **two modes**:

1. **Standalone demo (default)** — the React frontend runs entirely on its
   own using a realistic simulated backend (`frontend/src/services/mockApi.js`)
   backed by `localStorage`. No database, no server setup, no `.env` required.
   Open the app and log in immediately with the demo accounts below.
2. **Live backend** — a complete Express + MongoDB Atlas API in `/backend`
   implementing every endpoint the frontend expects, ready to deploy. Point
   the frontend at it (see `frontend/.env.example`) to go fully production.

---

## Quick start (standalone demo)

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

### Demo accounts

All seeded demo accounts use the password **`Demo@1234`** (also pre-filled by
the "Use demo account" button on the login screen):

| Role    | Email                          |
|---------|---------------------------------|
| Student | akshaj.mehta@university.edu     |
| Faculty | meera.krishnan@university.edu   |
| Parent  | rajesh.mehta@gmail.com          |
| Admin   | admin@university.edu            |

---

## Going live with the real backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MongoDB Atlas URI, JWT secret, SMTP creds
npm run seed            # populates demo data identical to the standalone mode
npm run dev
```

Then in `frontend/.env`:

```
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:5000/api
```

See `INSTALLATION.md` and `DEPLOYMENT.md` for full details.

---

## Tech stack

**Frontend:** React (Vite), Tailwind CSS, React Router DOM, Axios, Recharts, React Icons
**Backend:** Node.js, Express.js
**Database:** MongoDB Atlas, Mongoose
**Auth:** JWT, bcrypt, email OTP verification
**Email:** Nodemailer / SMTP

## Core feature: the composite early-warning score

```
Composite Score = (Attendance × 0.30) + (Assessment Marks × 0.40) + (Submission Timeliness × 0.30)

Excellent : score ≥ 80
Normal    : 65 ≤ score < 80
At Risk   : score < 65
```

When a student crosses into **At Risk**, SPMS automatically creates in-app
notifications and emails the student, their linked parent, and flags them on
the faculty/admin dashboards (`backend/controllers/warningService.js`).

## Project structure

```
spms/
├── backend/             Express + MongoDB API (production-ready)
│   ├── config/          Database connection
│   ├── controllers/      Route handlers, incl. warningService.js (score engine)
│   ├── middleware/       JWT auth, role guards, error handling
│   ├── models/           Mongoose schemas (User + role discriminators, etc.)
│   ├── routes/           REST endpoints per resource
│   └── utils/            Email, OTP, JWT, composite-score helpers, DB seed
├── frontend/             React + Vite + Tailwind SPA
│   └── src/
│       ├── components/   Sidebar, Topbar, RiskGauge, Charts, ChatBox, etc.
│       ├── context/      Auth + theme (dark/light) providers
│       ├── pages/        Landing, auth flows, and 4 role-based dashboards
│       └── services/     mockApi.js (standalone demo) / api.js (live backend)
├── INSTALLATION.md
└── DEPLOYMENT.md
```

## Notable UI features

- Fully responsive: collapsible sidebar on mobile, fluid grids on tablet/desktop
- Dark mode / light mode toggle, persisted per user
- Composite-score gauge visualizing the 30/40/30 formula as three arcs
- Floating in-app help chat widget (bottom-right) for FAQs
- Role-based protected routing with read-only enforcement for parents
