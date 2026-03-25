# Codebase Structure

**Analysis Date:** 2026-03-25

## Directory Layout

```
Vexxo/
├── src/
│   ├── main.jsx                  # React root mount
│   ├── App.jsx                   # Provider tree, router, global layout
│   ├── index.css                 # Global styles, CSS custom properties, utility classes
│   ├── components/               # All UI components (sections, modals, chrome)
│   ├── pages/                    # Route-level page containers
│   ├── context/                  # React Context providers
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Shared utilities (animations, supabase, validation)
│   ├── config/                   # Business data (pricing, services, company, seo)
│   ├── locales/                  # i18n JSON files (en.json, nl.json)
│   └── utils/                    # Duplicate animation presets (legacy — prefer src/lib/)
├── public/                       # Static assets served at root
│   ├── favicon.svg
│   ├── og-image.svg
│   ├── manifest.json
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── VexxoLogoEmblem.svg       # New (untracked)
│   ├── VexxoLogoText.svg         # New (untracked)
│   └── M1K3/                     # Portfolio project assets
├── supabase/
│   └── migrations/               # SQL migration files
├── .planning/
│   └── codebase/                 # GSD codebase analysis documents
├── docs/
│   └── superpowers/              # Plans and specs
├── dist/                         # Vite build output (not committed)
├── .next/                        # Next.js build artifacts (stale — project runs on Vite)
├── index.html                    # Vite HTML entry point
├── vite.config.js                # Vite + Rollup chunk config
├── tailwind.config.ts            # Tailwind theme extending design tokens
├── tsconfig.json                 # TypeScript config (project uses JSX predominantly)
├── vercel.json                   # Vercel deployment + CSP headers config
└── package.json                  # Dependencies and scripts
```

## Directory Purposes

**`src/components/`:**
- Purpose: Every UI component lives here, regardless of size or reuse count
- Contains: Section components, modal components, global chrome (Navbar, Footer), utility display components
- Key files:
  - `Navbar.jsx` — fixed header, scroll-spy active state, auth-aware profile dropdown, language switcher
  - `Hero.jsx` — primary landing section with animated headline, CTA, IcosahedronScene
  - `IcosahedronScene.jsx` — Three.js canvas (raw WebGL via canvas API, not React Three Fiber)
  - `HeroComputer.jsx` — CSS-only 3D computer illustration (no WebGL)
  - `Terminal.jsx` — pure display component, receives state as props from `HeroComputer.jsx`
  - `ServiceRequestModal.jsx` — full-screen multi-step service request form (lazy-loaded)
  - `AuthModal.jsx` — email/password + Google OAuth modal (lazy-loaded)
  - `ProfileAvatar.jsx` — reads avatar URL from `useProfile()`, renders fallback initials
  - `PricingCalculator.jsx` — interactive price calculator (lazy-loaded on `/prijzen`)
  - `PricingTeaser.jsx` — hero section for `/prijzen` page
  - `PricingFAQ.jsx` — accordion FAQ for `/prijzen` page
  - `Marquee.jsx` — infinite horizontal ticker below hero
  - `StructuredData.jsx` — JSON-LD schema injection via `<Helmet>`
  - `HashScrollHandler.jsx` — smooth scrolls to `#hash` on route change
  - `CustomCursor.jsx` — custom cursor, desktop only (hidden on touch devices)
  - `ScrollToTop.jsx` — scroll-to-top button, appears after scroll threshold
  - Note: `Footer.tsx`, `Navbar.tsx`, `PricingCalculator.tsx`, `LogoMark.tsx` are stale TypeScript copies from an earlier Next.js migration attempt. The `.jsx` files are the active versions.

**`src/pages/`:**
- Purpose: Route containers — thin orchestrators that import and sequence section components
- Contains: `HomePage.jsx`, `PricingPage.jsx`, `ProfilePage.jsx`
- Pattern: Each page wraps its sections in `<main id="main-content" className="relative z-10 pt-20">` and handles its own `<Helmet>` SEO tags

**`src/context/`:**
- Purpose: Global React state; each file exports a Provider and a named hook
- Contains:
  - `LanguageContext.jsx` — `lang` state (`'nl'` | `'en'`), `t(key)` dot-path resolver, `setLang()`
  - `ModalContext.jsx` — `isOpen`, `prefillData`, `openModal(data?)`, `closeModal()`
  - `AuthContext.jsx` — `user`, `session`, `requireAuth(payload)`, `signOut()`, `authOpen`, `setAuthOpen`; also exports `_registerDispatch` and `_dispatch` for the AppDispatcher bridge
  - `ThemeContext.jsx` — `theme` (`'dark'` | `'light'`), `toggle()`; persists to `localStorage`; applies `data-theme` attribute to `<html>`

**`src/hooks/`:**
- Purpose: Reusable stateful logic extracted from components
- Contains:
  - `useProfile.js` — fetches/updates Supabase `profiles` table row for current user
  - `useScrollSpy.js` — watches section IDs in viewport, returns active section ID
  - `useCountUp.js` — animates a number from 0 to target value on viewport entry
  - `useReducedMotion.js` — wraps `window.matchMedia('(prefers-reduced-motion: reduce)')`

**`src/lib/`:**
- Purpose: Shared non-component modules
- Contains:
  - `animations.js` — canonical Framer Motion variant presets and `viewport` config (use this, not `src/utils/motion.js`)
  - `supabase.js` — singleton Supabase client created from `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
  - `profileValidation.js` — per-field validators returning i18n key strings
  - `utils.ts` — general utilities (TypeScript)

**`src/config/`:**
- Purpose: All business data; components import from here, never hardcode values
- Contains:
  - `pricing.js` — `vexxo`, `addOns`, `timeline`, `comparison`, `MIN_PRICE`, `pageRange`, `serviceTypes`
  - `services.js` — service packages and categories consumed by `ServiceRequestModal`
  - `company.js` — name, email, social links, stats
  - `seo.js` — `SEO` object with `siteUrl`, `siteName`, `locale`, `twitterHandle`, `keywords`
  - `portfolio.js` — portfolio project data

**`src/locales/`:**
- Purpose: All user-facing text in English and Dutch
- Contains: `en.json`, `nl.json`
- Pattern: Nested JSON; resolved by `t('section.key')` dot-path lookup in `LanguageContext`

**`src/utils/`:**
- Purpose: Legacy duplicate of animation presets (created during Next.js migration)
- Contains: `motion.js` — same presets as `src/lib/animations.js` but without transition config
- Note: Prefer `src/lib/animations.js` for all new code; `src/utils/motion.js` is kept for backward compatibility only

**`supabase/migrations/`:**
- Purpose: Version-controlled Supabase schema changes
- Contains: `20260325_create_profiles.sql` — creates `profiles` table with RLS

**`public/`:**
- Purpose: Static assets copied verbatim to build output
- Generated: No
- Committed: Yes (except dist/)

## Key File Locations

**Entry Points:**
- `src/main.jsx`: React root mount — start here to trace the full tree
- `index.html`: Vite entry HTML — loads fonts, Material Symbols, and the React bundle

**Configuration:**
- `vite.config.js`: Build config, dev port (3001), manual Rollup chunks
- `tailwind.config.ts`: Full design token extension — colors, fonts, shadows, border-radius
- `vercel.json`: CSP and security headers for production
- `src/index.css`: Global CSS variables (`:root`), utility classes (`.glass-card`, `.btn-primary`, `.gradient-text`), keyframe animations

**Core Logic:**
- `src/App.jsx`: Provider nesting order and route definitions — consult before adding any new provider or route
- `src/context/AuthContext.jsx`: Auth state and the `requireAuth` / `_dispatch` bridge pattern
- `src/lib/supabase.js`: Single Supabase client instance — import from here only
- `src/config/pricing.js`: All pricing numbers — only place to change prices

**Styling Tokens:**
- `src/index.css` `:root` block: CSS custom properties (`--background`, `--primary`, `--on-surface`, etc.)
- `tailwind.config.ts` `theme.extend.colors`: Tailwind color utilities that map to the same values

## Naming Conventions

**Files:**
- React components: `PascalCase.jsx` (e.g., `HeroComputer.jsx`, `ServiceRequestModal.jsx`)
- Hooks: `camelCase.js` prefixed with `use` (e.g., `useScrollSpy.js`)
- Config/data modules: `camelCase.js` (e.g., `pricing.js`, `company.js`)
- Utilities/lib: `camelCase.js` or `camelCase.ts` (e.g., `animations.js`, `utils.ts`)
- Locales: `[lang-code].json` (e.g., `en.json`, `nl.json`)

**Directories:**
- All lowercase, singular for grouping (e.g., `context/`, `hooks/`, `lib/`, `config/`, `locales/`)
- `components/` is flat — no subdirectories

**CSS Classes:**
- BEM-style utility classes: `.glass-card`, `.btn-primary`, `.btn-outline`, `.gradient-text`
- Animation classes: `.animate-float`, `.animate-pulse-dot`, `.animate-marquee`
- Tailwind utilities used directly in JSX `className` props

## Where to Add New Code

**New Page Route:**
1. Create `src/pages/NewPage.jsx`
2. Add `React.lazy()` import in `src/App.jsx`
3. Add `<Route>` inside the `<Routes>` block in `src/App.jsx`
4. Add nav link entry to `NAV_LINKS` array in `src/components/Navbar.jsx` if needed

**New Section Component:**
1. Create `src/components/NewSection.jsx`
2. Import context hooks from `src/context/`; animations from `src/lib/animations.js`
3. All text via `const { t } = useLanguage()` — add keys to both `src/locales/en.json` and `src/locales/nl.json`
4. Import `src/components/NewSection.jsx` into the relevant page in `src/pages/`

**New Business Data:**
- Add to the appropriate file in `src/config/`; never put data values in component files

**New UI Text:**
- Add the key to both `src/locales/en.json` and `src/locales/nl.json`
- Reference via `t('section.key')` in the component

**New Hook:**
- Create `src/hooks/useMyHook.js`
- If it needs the Supabase client, import from `src/lib/supabase.js`

**New Animation Variant:**
- Add to `src/lib/animations.js` as a named export
- Do not add to `src/utils/motion.js`

**New CSS Utility:**
- Add to `src/index.css` under the appropriate comment section block
- Or extend `tailwind.config.ts` for design-token-level additions

## Special Directories

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis documents consumed by `/gsd:plan-phase` and `/gsd:execute-phase`
- Generated: By Claude Code GSD commands
- Committed: Yes

**`supabase/migrations/`:**
- Purpose: Schema migration SQL files for Supabase
- Generated: No (hand-authored)
- Committed: Yes

**`dist/`:**
- Purpose: Vite production build output
- Generated: Yes (`npm run build`)
- Committed: No

**`.next/`:**
- Purpose: Next.js build cache from an aborted migration attempt
- Generated: Yes (stale)
- Committed: Partially (appears in repo); safe to ignore — the active build tool is Vite

**`Sketches/`:**
- Purpose: HTML mockup files used for visual design exploration
- Generated: No
- Committed: Partially (some deleted in working tree)

---

*Structure analysis: 2026-03-25*
