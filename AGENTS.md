# AGENTS.md — Mernchat (Next.js + Express + Prisma)

## Architecture
- **Frontend**: Next.js 15 (Turbopack) in `next-js-frontend/`, port 3000. Uses Redux Toolkit (RTK Query) for client-side API calls to the backend, and Next.js server actions with Prisma for auth/session directly against the DB.
- **Backend**: Express + Socket.IO in `backend/`, port 8000. TypeScript compiled to `build/` via `tsc -w`, run with `nodemon build/index.js`.
- **Database**: PostgreSQL 16 (compose service `db`). Both frontend and backend share the same database and the same Prisma schema.

## Key Quirks
- **Hardcoded JWT secret**: The backend's `verifyToken` and `socketAuthenticatorMiddleware` use the hardcoded secret `"helloWorld@123"` (NOT `JWT_SECRET`). The frontend's `SESSION_SECRET` must be set to `"helloWorld@123"` so the backend can verify tokens created by the frontend's session.
- **`JWT_SECRET`** is only used for the Google OAuth flow, not regular auth.
- **Firebase admin creds**: `backend/src/firebase-admin-cred.json` is gitignored. A placeholder file (with a dummy RSA key) is created at both `backend/src/` and `backend/build/` so the backend boots. Replace with real Firebase service account JSON for push notifications.
- **Prisma schema location (backend)**: The schema is at `backend/src/prisma/schema.prisma` (not the default `prisma/schema.prisma`). The `prisma.schema` field in `backend/package.json` points Prisma to it.
- **`assert { type: "json" }`**: The backend's `firebase.config.ts` uses the deprecated `assert` import attribute syntax. Must use Node 20 (not Node 22, which removed it).

## Environment
- `.env.base44-defaults` (repo root) holds placeholder values for all env vars so the app boots without real credentials.
- Real external credentials are delivered via `/run/base44/app.env` (platform secrets) and override the defaults.
- URL-dependent vars (`CLIENT_URL`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_ABSOLUTE_BASE_URL`, `NEXT_PUBLIC_CLIENT_URL`) are set in compose `environment:` using `${BASE44_PUBLIC_HOST_SUFFIX}`.
- The frontend's `session.ts` sets `sameSite: "none"` on the session cookie so it's sent cross-origin to the backend (different subdomains of the public suffix domain).

## Setup
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
- `db-setup` one-shot service runs `prisma migrate deploy` (frontend migrations) before the app services start.
- Both `backend` and `frontend` run `npm install && npx prisma generate && <dev command>` at startup.

## Verification
- Frontend health: `curl -s http://localhost:3000` should return HTML.
- Backend health: `curl -s http://localhost:8000/` should return `{"running":true}`.
- The login/signup page is at `/auth/login` and `/auth/signup`.

## External Credentials Needed
Cloudinary (file storage), Google OAuth, Firebase (push notifications), Email/Nodemailer, Tenor (GIFs). All have placeholder values — the app boots but these features won't work until real values are provided via the Base44 secrets dashboard.
