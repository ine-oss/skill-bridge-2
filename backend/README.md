# Skill Bridge — Backend API

Next.js 16 (App Router route handlers) + PostgreSQL + Prisma 7. It serves a JSON API at
`http://localhost:4000/api` for the React app in `../frontend`.

## First-time setup

1. **Install PostgreSQL** (or create a free hosted database on Neon or Supabase) and create a database:
   ```sql
   CREATE DATABASE skillbridge;
   ```
2. **Configure environment** — copy `.env.example` to `.env` and set `DATABASE_URL` to your database.
   Replace `JWT_SECRET` with a long random string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
3. **Install, create tables, add demo data**
   ```bash
   npm install
   npx prisma migrate deploy            # creates the tables from prisma/migrations
   npm run db:seed                      # demo users, jobs, programs…
   ```
4. **Run**
   ```bash
   npm run dev      # http://localhost:4000  (the home page lists every endpoint)
   ```
   Or, from the project root, `npm run dev` starts the API and the website together.

### Demo accounts (password `Password123!`)

| Role | Email |
| --- | --- |
| Admin | admin@skillbridge.app |
| Employer (Northstar Labs) | employer@skillbridge.app |
| Training provider | training@skillbridge.app |
| Job seeker | jobseeker@skillbridge.app |

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 4000 |
| `npm run build` / `npm start` | Production build / server |
| `npm run db:migrate` | Create + apply a migration after editing `prisma/schema.prisma` |
| `npm run db:deploy` | Apply migrations in production |
| `npm run db:seed` | Reset tables and load demo data |
| `npm run db:studio` | Browse the database in Prisma Studio |
| `npm run lint` | ESLint |

## Project layout

```
prisma/
  schema.prisma        data model (users, profiles, companies, jobs, applications,
                       interviews, training, enrollments, certificates, messages,
                       notifications, verification, audit logs, auth tokens)
  seed.js              demo data (mirrors the frontend's mock data)
prisma.config.ts       Prisma CLI config (reads DATABASE_URL from .env)
src/
  proxy.js             CORS for the frontend (Next.js 16 "proxy", formerly middleware)
  lib/
    prisma.js          Prisma client (pg driver adapter)
    auth.js            bcrypt password hashing, JWT sign/verify, requireAuth(request, roles)
    http.js            handler() wrapper, JSON errors, pagination helpers
    validators.js      zod schemas for every request body
    serializers.js     database rows → API JSON (never exposes passwordHash)
    matching.js        skill-match score between a job seeker and a job
    audit.js           audit log + notification helpers
  app/api/**/route.js  the endpoints
  generated/prisma     generated client (created by `prisma generate`, git-ignored)
```

## Authentication

- `POST /api/auth/login` and `POST /api/auth/register` return `{ user, token }`.
- Send the token on every request: `Authorization: Bearer <token>`. Tokens expire after `JWT_EXPIRES_IN` (default 7 days).
- Roles: `jobseeker`, `employer`, `training`, `admin` (the same strings the frontend uses).
- Password reset: `POST /api/auth/forgot-password` emails a one-hour link. Registering sends an email-verification link.

## Email

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and `MAIL_FROM` in `.env` (Gmail app passwords work).
The app then emails password-reset links, verification links and notifications (new applicant, status change,
interview, message, certificate, and so on). Users can turn off notification emails in Settings, and
`EMAIL_NOTIFICATIONS=false` turns them off for everyone.
Without SMTP settings, emails are printed in the terminal, and in development the reset link is also returned as
`devResetUrl` so the flow can be tested. Admins can check the configuration with `POST /api/admin/test-email`.

## File uploads

`POST /api/uploads` with multipart fields `file` and `purpose`:

| purpose | who | types | effect |
| --- | --- | --- | --- |
| `CV` | job seeker | PDF, DOCX | becomes the profile CV and is attached to new applications |
| `EVIDENCE` | job seeker | PDF, images | use the returned `url` on an evidence item |
| `VERIFICATION` | job seeker / employer / provider | PDF, images | attach to a verification request |
| `LOGO` | employer / provider | PNG, JPG, WebP, GIF | becomes the company logo |
| `AVATAR` | anyone | PNG, JPG, WebP, GIF | becomes the profile photo |

Files are stored in PostgreSQL (`FileUpload` table), up to `MAX_UPLOAD_MB` (default 4). This works the same locally
and on Vercel. `GET /api/files/:id` serves them: logos and avatars are public; a CV can be opened by its owner,
admins, employers the person applied to, and training providers they're enrolled with.
Verification documents are visible only to the owner and admins.

## Errors

All errors are JSON: `{ "error": "message", "details": [...] }`.
`401` not signed in · `403` wrong role/not owner · `404` not found · `409` duplicate · `422` validation failed.

## Endpoints

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/register` · `POST /auth/login` · `GET /auth/me` · `POST /auth/logout` · `POST /auth/forgot-password` · `POST /auth/reset-password` · `POST /auth/change-password` · `GET/POST /auth/verify-email` |
| Users | `GET/PUT /users/me` · `GET/PUT /users/me/profile` (job seeker) · `GET/POST /users/me/evidence` · `DELETE /users/me/evidence/:id` · `GET/PUT /users/:id` |
| Skills | `GET /skills` · `POST /skills` (admin) · `DELETE /skills/:id` (admin) · `GET/PUT /skills/me` · `GET /skills/gap/:userId` (`me` allowed, optional `?jobId=`) |
| Jobs | `GET /jobs` (`q, mode, type, industry, skill, company, page, limit`) · `POST /jobs` (employer) · `GET /jobs/mine` · `GET /jobs/matched` · `GET/PATCH/DELETE /jobs/:id` · `POST/DELETE /jobs/:id/save` · `GET /saved-jobs` |
| Companies | `GET /companies` · `GET/PUT /companies/me` · `GET /companies/:idOrSlug` |
| Applications | `GET /applications` (role-aware) · `POST /applications` · `GET/PATCH /applications/:id` |
| Interviews | `GET /interviews` · `POST /interviews` (employer) · `PATCH /interviews/:id` |
| Training | `GET /training` · `POST /training` (provider) · `GET /training/mine` · `GET/PUT /training/me` · `GET/PATCH/DELETE /training/:id` · `POST /training/:id/enroll` · `GET /enrollments` · `PATCH /enrollments/:id` · `GET /certificates` · `GET /certificates/verify/:code` |
| Messages | `GET /messages` (conversations) · `POST /messages` · `GET /messages/:userId` (thread) |
| Notifications | `GET /notifications` · `PATCH/DELETE /notifications/:id` · `POST /notifications/read-all` |
| Files | `POST /uploads` · `GET/DELETE /files/:id` |
| Verification | `GET/POST /verification` |
| Dashboard | `GET /dashboard` (numbers for the signed-in role) |
| Admin | `GET /admin/users` · `PATCH/DELETE /admin/users/:id` · `GET /admin/verifications` · `PATCH /admin/verifications/:id` · `GET /admin/audit-logs` · `GET /admin/analytics` · `POST /admin/test-email` |
| Health | `GET /health` |

Business rules worth knowing:
- Applying computes a skill **match %** from the job's skills and the job seeker's skill scores.
- Employers move applications through `NEW → REVIEWING → SHORTLISTED → INTERVIEW → OFFERED/HIRED/REJECTED`; applicants can only `WITHDRAWN`. Every change is kept as a timeline event and notifies the other side.
- Only the training provider (or an admin) can mark an enrollment `COMPLETED`; that issues a certificate with a public verification code.
- Approving an employer/provider verification marks their company/provider as verified.

## Deploying

See `../DEPLOY.md`. In short, deploy this folder to Vercel with the build command `npm run vercel-build`
(generate the client, apply migrations, build) and set the variables from `.env.example`.

## Not built yet

- Recruiter team invitations (the list on the company profile page is kept in the browser only).
- Rate limiting on login/register before a public launch.
