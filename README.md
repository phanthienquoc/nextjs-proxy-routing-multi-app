# Micro Frontend Playground

This repository contains a three-application micro frontend setup:

- **Main portal (`apps/main`)** – Next.js 14 host with proxy routing (`/survey` and `/chat`) plus the shared API layer backed by MySQL.
- **Survey experience (`apps/survey`)** – Next.js 14 application rendered through the host at `/survey` using static generation with background revalidation (SGR).
- **Chat experience (`apps/chat`)** – Vue 3 + Vite TypeScript application served via the host proxy at `/chat`.

Docker Compose is provided to run the stack locally, including a MySQL database.

## Prerequisites

- Node.js 20+
- npm v10+ (or another compatible package manager)
- Docker Desktop (for containerised workflows)

## Installation

Install dependencies for each workspace from the repository root:

```bash
npm install --workspace @microfe/main
npm install --workspace @microfe/survey
npm install --workspace @microfe/chat
```

Copy `.env.example` to `.env` and adjust values as needed. Proxy routing can be toggled per micro frontend by setting
`SURVEY_PROXY_ENABLED` or `CHAT_PROXY_ENABLED` to `false` when you want the host to serve the built-in fallback pages instead
of forwarding to the micro frontend containers.

When running with Docker Compose, uncomment the Docker-specific values in `.env` so the host resolves the other services via
their container names (for example `NEXT_PUBLIC_SURVEY_ORIGIN=http://survey:3001` and `NEXT_PUBLIC_INTERNAL_API_BASE_DOCKER=http://main:3000`).

### Local development (without Docker)

```bash
# Terminal 1
npm run dev:main

# Terminal 2
npm run dev:survey

# Terminal 3
npm run dev:chat
```

Make sure you have a MySQL instance running that matches the environment variables; the main app expects the schema described in `apps/main/src/lib/db.ts` and will bootstrap basic tables on demand.

### Dockerised setup

```bash
docker compose build
docker compose up
```

Services:

- Main host: http://localhost:3000
- Survey app (proxied): http://localhost:3000/survey (direct container port: http://localhost:3001)
- Chat app (proxied): http://localhost:3000/chat (direct container port: http://localhost:4173)
- MySQL: localhost:3306 (credentials in `docker-compose.yml`)

The MySQL container persists data inside the named volume `db_data`.

## Project Highlights

- **Proxy routing** is handled through `apps/main/next.config.mjs`, forwarding `/survey/*` and `/chat/*` to the respective services
  when the proxy is enabled; otherwise the host serves helpful fallback pages at those routes.
- **Shared API** inside `apps/main/src/app/api` exposes question and response resources backed by MySQL via `mysql2`.
- **Survey** uses `revalidate = 60` to enable static generation with background regeneration (SGR) while submitting answers with the main API.
- **Chat** demonstrates Vue micro frontend state isolation with Pinia and is exposed under the same origin by the host proxy.
- **Fallback experiences** are served from the host when a micro frontend is offline, keeping navigation functional even before the
  remote apps boot.

## Testing & linting

Each workspace contains its own scripts:

```bash
npm run lint --workspace @microfe/main
npm run lint --workspace @microfe/survey
npm run typecheck --workspace @microfe/chat
```

Feel free to add more tests or automation as the project evolves.
