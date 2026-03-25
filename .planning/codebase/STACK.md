# Technology Stack

**Analysis Date:** 2026-03-25

## Languages

**Primary:**
- JavaScript (JSX) — all Vite/React components in `src/components/`, `src/context/`, `src/hooks/`, `src/lib/`, `src/pages/`
- TypeScript (TSX) — Next.js app-router layer in `src/app/`, config in `tailwind.config.ts`, `src/lib/utils.ts`

**Secondary:**
- CSS — global styles and component utilities in `src/index.css` (311 lines)
- SQL — Supabase migrations in `supabase/migrations/`

## Runtime

**Environment:**
- Node.js (version not pinned — no `.nvmrc` or `.node-version`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core (primary — what runs in production):**
- React 18.2.0 — UI rendering, served by Vite
- Vite 6.4.1 — dev server (port 3001) and production build, output to `dist/`
- react-router-dom 7.13.2 — client-side routing with three routes: `/`, `/prijzen`, `/profiel`

**Dormant / Parallel (not deployed):**
- Next.js 14.2.3 — present in `package.json` and `src/app/` tree, but `vercel.json` deploys via `npx vite build`. Scripts `dev:next` and `build:next` exist but are not the active path. The `src/app/` directory contains an older version of pages (client portal, portfolio, services) with different color tokens and an `Urbanist` font.

**Styling:**
- Tailwind CSS 3.4.1 — configured in `tailwind.config.ts` with full custom token extension
- PostCSS with autoprefixer — `postcss.config.mjs`
- **Pattern:** Tailwind utility classes in components + CSS custom properties in `:root` inside `src/index.css`. Both systems are synchronized (same color values). Global semantic classes (`.glass-card`, `.btn-primary`, `.gradient-text`, `.section-label`) are defined in `src/index.css` and take precedence.

**Animation:**
- Framer Motion 12.38.0 — all entrance and interactive animations
- Canonical presets exported from `src/lib/animations.js`
- Secondary (unused in Vite app): `src/utils/motion.js` — older variant presets used by the Next.js `src/app/` layer

**SEO:**
- react-helmet-async 3.0.0 — per-route `<head>` management (`src/App.jsx` → `SeoHead` component)

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` 2.100.0 — authentication and database client, initialized in `src/lib/supabase.js`
- `framer-motion` 12.38.0 — used across all animated components; removing it breaks all entrance animations
- `react-router-dom` 7.13.2 — all routing logic; routes defined in `src/App.jsx`

**Present but unused in active build:**
- `three` 0.183.0 — imported as a dependency but no active Three.js scenes exist in `src/` (the `IcosahedronScene.jsx` component exists in `src/components/` but is not imported in `App.jsx` or any page)
- `next` 14.2.3 — installed, scripts exist, but Vite is the active build system
- `@next/font` 13.5.0 — used only in `src/app/layout.tsx`

## Configuration

**Environment:**
- Configured via Vite `import.meta.env` prefix
- Required variables documented in `.env.example`:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- `.env.local` present (contents not read)

**Build:**
- `vite.config.js` — manual chunk splitting: `vendor-react`, `vendor-motion`, `vendor-supabase`
- `vercel.json` — deployment target, rewrites SPA fallback to `/index.html` except `/M1K3/*` prefix (reserved for future dashboard/admin area)
- `tsconfig.json` — strict TypeScript, path alias `@/*` → `./src/*`, targets ESNext

**Fonts:**
- Inter (400, 600, 700) — body text
- Manrope (700, 800) — headlines
- Material Symbols Outlined — icon font
- All loaded via `<link>` tags in `index.html` from Google Fonts (not `@import`, avoids render blocking)
- Tailwind maps: `font-headline` → Manrope, `font-body` / `font-label` → Inter, `font-mono` → Fira Code/Cascadia Code

## Theming Infrastructure

**CSS Custom Properties (`:root` in `src/index.css`):**
All brand colors are defined as CSS variables. Tailwind config in `tailwind.config.ts` mirrors the same values as named tokens (e.g. `primary`, `surface`, `on-surface`). Components can use either `var(--primary)` or `class="text-primary"`.

**Dark mode:**
- Tailwind `darkMode: "class"` — dark class applied to `<html>` in `index.html`
- `ThemeContext.jsx` (`src/context/ThemeContext.jsx`) provides runtime toggle, persists to `localStorage` under key `vexxo-theme`, reads `prefers-color-scheme` as default. **Note:** ThemeContext is defined but not wired into `App.jsx` — the app is currently always dark.

**PWA:**
- `public/manifest.json` present, `theme-color` set to `#7C3AED`
- No service worker detected

## Platform Requirements

**Development:**
- `npm run dev` — Vite dev server on port 3001
- Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`

**Production:**
- Deployed to Vercel via `npx vite build` → `dist/` output directory
- Vercel rewrites handle SPA routing and preserve `/M1K3/*` paths
- CSP headers set in `vercel.json` covering Google Fonts, Supabase, and Google user content (avatars)

---

*Stack analysis: 2026-03-25*
