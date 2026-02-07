# Ticket Management System (Full Repo)

A complete, GitHub-ready Ticket Management System with:

- ✅ Users + Roles (USER / AGENT / ADMIN)
- ✅ Auth (JWT access token)
- ✅ Ticket CRUD + comments + assignment
- ✅ Admin APIs (stats, recent activity, user management)
- ✅ Email notifications (password reset + ticket updates) via SMTP
- ✅ PostgreSQL + Prisma migrations
- ✅ Simple Admin Dashboard UI (static HTML) that talks to the API
- ✅ Docker Compose for local + production
- ✅ One-command install script

## Repo layout

```
ticket-system/
  server/                 # Node/Express API
  web/                    # Admin dashboard (static)
  docker-compose.yml      # Local dev DB
  docker-compose.prod.yml # Production (API + DB)
  install.sh              # Local setup (db+migrate+seed+run)
  deploy/                 # Production notes + env templates
```

---

## Quick start (local)

### 1) Requirements
- Docker + Docker Compose
- Node.js 18+ (or 20+)

### 2) Run installer
From repo root:

```bash
bash install.sh
```

This will:
- start Postgres via Docker
- install server deps
- generate Prisma client
- run DB migration
- seed an admin user
- start the API on port **4000**

### 3) Open admin dashboard
Open:

- `web/admin.html` in your browser

Log in using the seeded admin credentials printed by the installer.

---

## API URLs
- Health: `GET /health`
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
- Tickets:
  - `GET /api/tickets`
  - `POST /api/tickets`
  - `PATCH /api/tickets/:id`
  - `POST /api/tickets/:id/comments`
  - `POST /api/tickets/:id/assign` (AGENT/ADMIN)
- Users:
  - `GET /api/users/me`
  - `GET /api/users` (ADMIN)
  - `PATCH /api/users/:id` (ADMIN)
- Admin:
  - `GET /api/admin/stats` (ADMIN)
  - `GET /api/admin/recent` (ADMIN)

---

## Production deploy (Docker)

### 1) Create a production `.env`
Copy:

- `deploy/.env.prod.example` → `.env.prod`

Fill in:
- `DATABASE_URL`
- `JWT_SECRET`
- SMTP settings (optional but recommended)

### 2) Start services

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

### 3) Run migrations (first deploy)
Inside the API container:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod exec api npx prisma migrate deploy
```

### 4) Seed admin (optional)
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod exec api node src/seedAdmin.js
```

### Notes (recommended for production)
- Put a reverse proxy (Nginx/Caddy) in front of the API for TLS
- Use a strong `JWT_SECRET`
- Prefer SMTP provider (SendGrid, Mailgun, SES, etc.)
- Consider adding a job queue for email (BullMQ/Redis) if volume grows
- Use a real frontend app (Next.js/React) if you need richer UI

See `deploy/PRODUCTION.md` for a full guide.

---

## License
MIT