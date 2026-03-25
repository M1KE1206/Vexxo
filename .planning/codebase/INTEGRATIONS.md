# External Integrations

**Analysis Date:** 2026-03-25

## APIs & External Services

**Backend-as-a-Service:**
- Supabase — database, auth, and file storage
  - SDK/Client: `@supabase/supabase-js` 2.100.0
  - Client initialized: `src/lib/supabase.js`
  - Auth: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - Connection allowed in CSP: `https://*.supabase.co`, `wss://*.supabase.co`

**Font & Icon Services:**
- Google Fonts — Inter, Manrope, Material Symbols Outlined
  - Loaded via `<link>` in `index.html`
  - Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`
  - Allowed in CSP `style-src` and `font-src`

## Data Storage

**Database:**
- Supabase Postgres (hosted)
  - Connection: `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
  - Client: `@supabase/supabase-js` with RLS enforced
  - Tables: `profiles` (see `supabase/migrations/20260325_create_profiles.sql`)
  - Row Level Security: enabled — users can only read/write their own row
  - Auto-row creation: Postgres trigger `on_auth_user_created` inserts a profile row on new user signup

**File Storage:**
- Supabase Storage — avatar uploads
  - Used in `src/hooks/useProfile.js` via `supabase.storage`
  - Allowed in CSP `img-src`: `https://*.supabase.co`
  - Upload constraints enforced client-side: JPEG/PNG/WebP only, max 2 MB

**Caching:**
- None (no Redis, no service worker cache)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth
  - Implementation: `src/context/AuthContext.jsx` wraps the entire app
  - Session management: `supabase.auth.getSession()` on mount + `onAuthStateChange` listener
  - Sign-out: `supabase.auth.signOut()`

**Auth Methods:**
- Email/password: `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()`
- Google OAuth: `supabase.auth.signInWithOAuth({ provider: 'google' })`
  - Post-OAuth avatar URLs from `googleusercontent.com` are allowed in CSP `img-src`
- Both methods exposed via `src/components/AuthModal.jsx`

**Auth Gate Pattern:**
- `requireAuth(payload)` in `AuthContext` — if no session, stores action in `sessionStorage` as `pendingAction` and opens `AuthModal`. After OAuth redirect, `onAuthStateChange` fires, reads `pendingAction`, and dispatches to `ModalContext`.
- `_registerDispatch` / `_dispatch` bridge in `src/context/AuthContext.jsx` connects auth events to `ModalContext` without circular imports. Wired in `App.jsx` via `AppDispatcher` component.

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, no LogRocket, no Datadog)

**Logs:**
- `console.warn` in dev mode for auth edge cases (`import.meta.env.DEV` guard in `src/context/AuthContext.jsx`)
- No structured logging

## CI/CD & Deployment

**Hosting:**
- Vercel
  - Config: `vercel.json`
  - Build command: `npx vite build`
  - Output: `dist/`
  - Framework: `null` (manually configured, not auto-detected as Next.js or Vite preset)

**CI Pipeline:**
- Not detected (no `.github/workflows/`, no CircleCI, no GitLab CI)

## Environment Configuration

**Required env vars:**
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key

**Documented in:**
- `.env.example` — contains both keys with empty values

**Secrets location:**
- `.env.local` — present, not committed (gitignored). Contains actual values for local dev.

## Webhooks & Callbacks

**Incoming:**
- None detected (no `/api/` routes, no webhook endpoint handlers)

**Outgoing:**
- None detected

## SEO & Metadata

**Structured Data:**
- `src/components/StructuredData.jsx` — renders JSON-LD schema markup in `<head>` via react-helmet-async

**Open Graph / Twitter Card:**
- Managed in `src/App.jsx` via `SeoHead` component (react-helmet-async)
- Config values from `src/config/seo.js`
- Localized title/description from `src/locales/en.json` and `src/locales/nl.json` via `useLanguage()`
- hreflang alternate links: `nl` → `/?lang=nl`, `en` → `/?lang=en`

---

*Integration audit: 2026-03-25*
