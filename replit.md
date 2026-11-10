# Envoi & Co (Meridian)

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
| `GOOGLE_SERVICE_ACCOUNT_KEY` | (Google service account JSON, stringified) |
| `RESEND_API_KEY` | (Resend API key for OTP email delivery) |
| `OTP_FROM_EMAIL` | (Verified Resend sender, e.g. Envoi & Co <no-reply@yourdomain.com>) |
| `OTP_SECRET` | (Random secret used to hash OTP codes server-side) |
| `WHATSAPP_ACCESS_TOKEN` | (Optional) Permanent Meta System User token with whatsapp_business_messaging + whatsapp_business_management |
| `WHATSAPP_PHONE_NUMBER_ID` | (Optional) Phone number ID from Meta → WhatsApp → API Setup (not the number itself) |
| `WHATSAPP_APP_SECRET` | (Optional) Meta app secret (App settings → Basic); verifies webhook signatures |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | (Optional) Any long random phrase; also entered in Meta's webhook settings |

Admin review dashboard: `/envoi-dashboard/admin` (unauthenticated by design). Two WhatsApp modes:
- **Automatic** (WhatsApp Cloud API) when `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` are set: approving sends template `mma_1_invite` / `pbi_1_invite`; the API's scheduler sends follow-ups on days 2, 5, 9, 14 (weekdays 08:00–20:00 UK) and stops when the applicant replies or opts out; replies arrive via the webhook `POST /api/whatsapp/webhook` (subscribe to the `messages` field) and show in the dashboard Inbox. Template names and texts: `artifacts/api-server/src/lib/whatsappTemplates.ts` (all `en_GB`, one `{{1}}` variable = first name; also `reply_chose_whatsapp`, `reply_chose_call` with a Calendly URL button, and `envoi_restart`).
- **Manual** otherwise: each message opens WhatsApp pre-filled and the admin records what was sent.
Review state and inbox messages live in `application_reviews` and `whatsapp_messages`, which the API creates (and adds new columns to) on first use.

OTP email templates live in `artifacts/api-server/src/lib/otpEmailTemplate.ts`.
Use `renderOtpEmail(...)` for Resend's `html` field and `renderOtpEmailText(...)` for the plain-text fallback.

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
