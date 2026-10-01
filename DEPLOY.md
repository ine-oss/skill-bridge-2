# Deploying Skill Bridge

The recommended free setup puts the app on two Vercel projects and the database on Neon:

| Part | Service | Folder |
| --- | --- | --- |
| Database | [Neon](https://neon.tech) (PostgreSQL) | — |
| API | Vercel project #1 (Next.js) | `backend/` |
| Website | Vercel project #2 (Vite) | `frontend/` |

Uploaded files (CVs, logos, documents) are stored in the database, so no extra storage service
is needed. Emails need an SMTP account (Gmail works for small volumes).

---

## 1. Put the code on GitHub

From the project root:

```bash
git add -A
git commit -m "Skill Bridge: frontend + backend"
git remote add origin https://github.com/<you>/skill-bridge.git   # once
git push -u origin main
```

Check that `.env` files are **not** committed (they are in `.gitignore`).

## 2. Create the database (Neon)

1. Sign up at neon.tech → **New project** → region close to your users (e.g. Frankfurt for Rwanda).
2. On the dashboard open **Connect** and copy two connection strings:
   - **Pooled** (host contains `-pooler`) → will be `DATABASE_URL`
   - **Direct** (turn "Connection pooling" off) → will be `DIRECT_URL`
3. Load the tables and (optionally) the demo data from your computer:

   ```powershell
   cd backend
   $env:DATABASE_URL="<pooled url>"; $env:DIRECT_URL="<direct url>"
   npx prisma migrate deploy
   # Optional demo accounts — this DELETES existing data, so only on a fresh database:
   npm run db:seed
   ```

## 3. Deploy the API (backend)

1. vercel.com → **Add New… → Project** → import the GitHub repo.
2. **Root Directory:** `backend` · Framework: Next.js (auto-detected).
3. **Build Command:** `npm run vercel-build`
   (runs `prisma generate`, applies new migrations, then `next build`).
4. **Environment Variables:**

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | Neon pooled URL |
   | `DIRECT_URL` | Neon direct URL |
   | `JWT_SECRET` | a new random string: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
   | `FRONTEND_URL` | the website URL from step 4, e.g. `https://skill-bridge.vercel.app` |
   | `CORS_ORIGINS` | same as `FRONTEND_URL` (add `,https://skill-bridge-*.vercel.app` to allow preview deployments) |
   | `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `MAIL_FROM` | your email settings (see below) |

5. Deploy, then open `https://<api-project>.vercel.app/api/health`. It should show `"database":"up"`.

## 4. Deploy the website (frontend)

1. **Add New… → Project** → the same repo again.
2. **Root Directory:** `frontend` · Framework: Vite.
3. **Environment Variable:** `VITE_API_URL` = `https://<api-project>.vercel.app/api`
4. Deploy. `frontend/vercel.json` makes page refreshes on routes like `/jobs/123` work.
5. Copy the website URL into the API project's `FRONTEND_URL` and `CORS_ORIGINS`, then **redeploy the API**
   (Deployments → ⋯ → Redeploy) so it picks them up.

## 5. Email (SMTP)

**Gmail**, for testing and small schools:

1. Turn on 2-Step Verification on the Google account.
2. Create an App Password at <https://myaccount.google.com/apppasswords>.
3. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER=<the gmail address>`,
   `SMTP_PASS=<16-letter app password>`, `MAIL_FROM=Skill Bridge <the gmail address>`.

Gmail allows about 500 emails a day. For more, use a transactional provider such as Brevo, Resend or
SendGrid, which all give SMTP settings you can use in the same variables.

To check the settings, sign in as an admin and call `POST /api/admin/test-email`, for example from the
browser console:

```js
fetch('/api/admin/test-email', { method: 'POST', headers: { Authorization: 'Bearer ' + localStorage.getItem('skillbridge-token') } }).then(r => r.json()).then(console.log)
```

## After deploying

- **Change the demo passwords** or delete the demo accounts before real users sign up.
- **Schema changes:** run `npm run db:migrate` locally, commit `backend/prisma/migrations/`, and push.
  The next API deploy applies the migration automatically.
- **Limits:** Vercel caps uploads at 4.5 MB per request, and the app allows 4 MB. The free Neon plan has 0.5 GB
  of storage, which holds roughly a few thousand CVs.
- **Custom domain:** add it in each Vercel project, then update `FRONTEND_URL`, `CORS_ORIGINS` and
  `VITE_API_URL`.

## Other hosts

The backend is a standard Next.js app, so it runs anywhere Node 20.19+ runs (Render, Railway, a VPS
with `npm run build && npm start`). The frontend is static files: `npm run build` produces
`frontend/dist`, which can go on Netlify, Cloudflare Pages, or any web server that sends unknown
paths to `index.html`.
