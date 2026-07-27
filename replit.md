# Aldric Private (Meridian)

Private banking and international capital transfer web app. Prospects complete a multi-step flow then submit an enquiry; submissions are saved to Postgres and synced to Google Sheets.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Production environment variables

### Vercel (frontend — adricprivate.com)
| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://meridian-production-960e.up.railway.app` |

**Must include `https://`.** Without it the browser treats the Railway hostname as a relative path on the Vercel domain, causing 405 errors.

### Railway (backend — meridian-production-960e.up.railway.app)
| Variable | Value |
|---|---|
| `ALLOW_ORIGIN` | `https://adricprivate.com` |
| `DATABASE_URL` | (Postgres connection string) |
| `GOOGLE_SHEETS_ID` | (Sheet ID) |
| `WHATSAPP_NUMBER` | (optional) |
| `WHATSAPP_LINK` | (optional) |

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
