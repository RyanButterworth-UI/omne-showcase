# Omne Showcase

Omne Showcase is a small full-stack demo that pairs a Next.js 16 frontend with an Express + PostgreSQL backend.

It is designed to show:

- a production-style dashboard UI
- a tracking page using AG Grid
- mobile-friendly AG Grid column toggling on the tracking page
- a Postgres-backed API with seeded manufacturing data
- Swagger/OpenAPI docs
- a Postman collection for quick API exploration

## Repository

Clone with either of these:

```bash
git clone git@github.com:RyanButterworth-UI/omne-showcase.git
```

```bash
git clone https://github.com/RyanButterworth-UI/omne-showcase.git
```

Then:

```bash
cd omne-showcase
pnpm install
```

## Git Workflow

This repo was worked in a way that makes the build process easy to review.

- `main` is the protected branch.
- `dev` is the active working branch for ongoing implementation.
- Feature work was built in branches and committed incrementally.
- The commit history is intentionally kept strong and readable so reviewers can inspect how the app was assembled over time.
- Branch history has been kept intact so the implementation path is visible, not flattened away.

If you want to review how the project evolved, start with the branch history and commit log rather than only looking at the final file state.

## Stack

- Frontend: Next.js 16, React 19, Tailwind CSS v4, TanStack Query, AG Grid
- Backend: Express 5, TypeScript, PostgreSQL
- Database tooling: Docker Compose, Flyway
- API docs: Swagger UI + generated OpenAPI document
- API client demo: Postman collection

## Project Layout

- `src/` - frontend app, components, hooks, services, API fetchers
- `BE/API/` - backend API, database access, service layer, OpenAPI generation
- `BE/API/flyway/sql/` - schema and seed migrations
- `postman/omne-showcase-dashboard.postman_collection.json` - Postman collection
- `BE/API/openapi.json` - generated OpenAPI spec artifact

## Quick Start

If you want the shortest path to seeing the app work locally, use three terminals.

### 1. Start Postgres

From the repo root:

```bash
pnpm --dir BE/API db:up
pnpm --dir BE/API db:migrate
```

This starts PostgreSQL on `localhost:5432` and runs the Flyway migrations that create and seed the demo data.

### 2. Start the backend API

From the repo root:

```bash
pnpm --dir BE/API start
```

Default backend URL:

```text
http://localhost:4001
```

### 3. Start the frontend

From the repo root:

```bash
pnpm dev
```

Frontend URL:

```text
http://localhost:3000
```

The root route redirects to the dashboard.

## Demo Flow

If you want the fastest review path, use this order:

1. Start Postgres and run migrations.
2. Start the backend API.
3. Start the frontend.
4. Open `http://localhost:3000/login`.
5. Sign in with one of the demo users below.
6. Review the dashboard and watch the API-backed UI states.
7. Open the tracking page and test the AG Grid interactions.
8. On mobile or a narrow viewport, use the tracking page column toggles.
9. Open Swagger UI.
10. Import the Postman collection and run the included requests.

## Local URLs

- Frontend: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`
- Tracking page: `http://localhost:3000/tracking`
- Backend API: `http://localhost:4001`
- Health check: `http://localhost:4001/health`
- Swagger UI: `http://localhost:4001/docs`
- OpenAPI JSON: `http://localhost:4001/openapi.json`

## Backend Setup Notes

The backend already has sane defaults, so it will usually start without extra env config.

Default values:

- `PORT=4001`
- `ALLOWED_ORIGIN=http://localhost:3000`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/omne_dashboard`
- `FAILURE_RATE=0.3`

Important:

- The API intentionally simulates failures by default with `FAILURE_RATE=0.3`.
- This is deliberate for UI/demo purposes so loading, retry, and error states can be shown in the frontend.
- For a smoother demo, set `FAILURE_RATE=0` before starting the backend.

Example:

```bash
cd BE/API
FAILURE_RATE=0 pnpm start
```

If you prefer, you can also create a `.env` file inside `BE/API/` with the same values.

## Frontend Setup Notes

The frontend fetchers default to the local backend, so no frontend env file is required for the local demo.

If the API is running elsewhere, set:

```text
NEXT_PUBLIC_API_BASE_URL=http://your-api-host:4001/api
```

## Environment Examples

### Frontend

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:4001/api
```

### Backend

```text
PORT=4001
ALLOWED_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/omne_dashboard
FAILURE_RATE=0.3
```

## Demo Login

The frontend includes demo user profiles.

These credentials are intentionally documented here because this is a demo app, not a production system.

Password for all demo accounts:

```text
1omneDemo#2026
```

Login steps:

1. Open `http://localhost:3000/login`
2. Choose one of the demo users below or type the username manually
3. Enter the shared password: `1omneDemo#2026`
4. Submit the login form to enter the dashboard

Important login note:

- Because the API intentionally simulates failures in this demo, login may occasionally fail even when the credentials are correct.
- If that happens, refresh the page and try again until the request succeeds.
- For a smoother demo, run the backend with `FAILURE_RATE=0`.

Demo users:

- `gregp` - Greg P. - VP of Product - Omnesoft
- `socialscientists` - Ryan Butterworth - Research and audience profile - UX wizard and part-time rockstar dev
- `noamalper` - Noam Alper - Chief Technology Officer - Omnesoft

Quick copy/paste credentials:

```text
Username: gregp
Password: 1omneDemo#2026
```

```text
Username: socialscientists
Password: 1omneDemo#2026
```

```text
Username: noamalper
Password: 1omneDemo#2026
```

## Known Demo Notes

- The API intentionally simulates failures when `FAILURE_RATE=0.3`.
- This is part of the showcase so the UI can demonstrate loading, error, and retry behavior.
- Login may occasionally fail for the same reason; refresh and try again.
- Only the Dashboard and Tracking routes are intentionally wired in this demo.
- The tracking page includes mobile-friendly column toggles for smaller screens.
- The auth experience is intentionally lightweight because this is a demo app.

## Swagger / OpenAPI

Swagger UI is already wired into the backend.

Use it here when the API is running:

```text
http://localhost:4001/docs
```

Raw OpenAPI JSON:

```text
http://localhost:4001/openapi.json
```

To regenerate the checked-in OpenAPI document:

```bash
pnpm api:swagger:generate
```

That command writes the spec to:

```text
BE/API/openapi.json
```

## Postman

The repo includes a ready-to-import Postman collection:

```text
postman/omne-showcase-dashboard.postman_collection.json
```

### Import steps

1. Open Postman.
2. Click `Import`.
3. Choose `postman/omne-showcase-dashboard.postman_collection.json`.
4. Confirm the `baseUrl` variable is set to `http://localhost:4001`.

### Included requests

- `GET /health`
- `GET /api/dashboard-data`
- `GET /api/dashboard-data?id={{dashboardId}}`
- `GET /api/dashboard-data/list?page=1&pageSize=25`

## Useful Commands

### Frontend

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm test
```

### Backend

```bash
pnpm --dir BE/API dev
pnpm --dir BE/API start
pnpm --dir BE/API build
pnpm --dir BE/API test
pnpm --dir BE/API swagger:generate
```

### Database

```bash
pnpm --dir BE/API db:up
pnpm --dir BE/API db:migrate
pnpm --dir BE/API db:down
```

## Architecture Summary

The repo follows a clear frontend and backend layering pattern.

### Frontend flow

- Component
- Hook
- Service
- API fetcher
- Backend endpoint

Examples:

- Dashboard: `src/components/dashboard/DashboardScreen.tsx` -> `src/hooks/useDashboard.ts` -> `src/services/dashboard.ts` -> `src/api/dashboard.ts`
- Tracking: `src/components/tracking/TrackingScreen.tsx` -> `src/hooks/useTracking.ts` -> `src/services/tracking.ts` -> `src/api/tracking.ts`

### Backend flow

- Route
- Service
- Repository
- PostgreSQL

Example:

- `BE/API/src/routes/data.routes.ts` -> `BE/API/src/services/dashboard.service.ts` -> `BE/API/src/repositories/dashboard.repository.ts`

## What To Look At

If another developer is reviewing the repo, these are the main entry points:

- Dashboard route: `src/app/dashboard/page.tsx`
- Tracking route: `src/app/tracking/page.tsx`
- Dashboard UI: `src/components/dashboard/DashboardScreen.tsx`
- Tracking UI: `src/components/tracking/TrackingScreen.tsx` including mobile column toggles for smaller screens
- Frontend dashboard service mapping: `src/services/dashboard.ts`
- Frontend tracking service mapping: `src/services/tracking.ts`
- Backend app setup: `BE/API/src/app.ts`
- Dashboard API routes: `BE/API/src/routes/data.routes.ts`
- Backend dashboard service: `BE/API/src/services/dashboard.service.ts`
- OpenAPI generator: `BE/API/src/openapi.ts`

## Reviewer Checklist

- Can start Postgres, migrate the database, and run the API.
- Can start the frontend and reach the login page.
- Can sign in with a demo user.
- Can load the dashboard successfully.
- Can see the error handling when the simulated API failure occurs.
- Can open the tracking page and use AG Grid sorting/filtering.
- Can use the mobile column toggles on the tracking page.
- Can open Swagger UI at `/docs`.
- Can import the Postman collection and hit the API.

## Troubleshooting

### The frontend loads but no data appears

Check that:

- Postgres is running on `localhost:5432`
- Flyway migrations have run
- the backend is running on `localhost:4001`

### The dashboard sometimes errors even though the backend is up

That may be expected if `FAILURE_RATE` is left at the default `0.3`.

This is intentional in this demo so reviewers can see how the UI behaves when the API is unavailable or unstable.

For a clean demo:

```bash
cd BE/API
FAILURE_RATE=0 pnpm start
```

### CORS issues in the browser

Make sure:

- frontend is on `http://localhost:3000`
- backend `ALLOWED_ORIGIN` matches that URL

### Need a clean database reset

```bash
pnpm --dir BE/API db:down
pnpm --dir BE/API db:up
pnpm --dir BE/API db:migrate
```

## Sharing This Repo

GitHub:

- `git@github.com:RyanButterworth-UI/omne-showcase.git`
- `https://github.com/RyanButterworth-UI/omne-showcase.git`

When sharing with another team, send them:

- the repository URL
- the Postman collection in `postman/omne-showcase-dashboard.postman_collection.json`
- the local startup steps from this README
- the Swagger URL once they have the backend running
