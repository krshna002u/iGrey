# iGrey Holdings

iGrey Holdings is a premium property management website in Bangalore that helps people rent, lease, and buy with clarity and confidence.

## Run & Operate

- `pnpm install --frozen-lockfile` — install all workspace dependencies
- `pnpm --filter @workspace/igrey-holdings run dev` — run the React/Vite frontend (managed preview port 25302)
- `pnpm --filter @workspace/api-server run dev` — run the Express API (managed preview port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `PORT=25302 BASE_PATH=/ pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

### Replit Preview

- The `artifacts/igrey-holdings: web` workflow serves the frontend at `/`.
- The `artifacts/api-server: API Server` workflow serves the API at `/api`; its health check is `/api/healthz`.
- The artifact workflows provide `PORT` and `BASE_PATH` automatically. For a standalone frontend build, use `PORT=25302 BASE_PATH=/ pnpm --filter @workspace/igrey-holdings run build`.
- The project uses Replit's provisioned PostgreSQL database; `DATABASE_URL` is supplied by the database connection.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
