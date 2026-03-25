# Architecture

**Analysis Date:** 2026-03-25

## Pattern Overview

**Overall:** Single-Page Application with client-side routing, context-driven global state, and lazy-loaded page chunks.

**Key Characteristics:**
- React 18 SPA served by Vite, deployed on Vercel
- Three named routes (`/`, `/prijzen`, `/profiel`) via React Router v6
- Global state lives exclusively in React Context providers — no Redux, no Zustand
- Data access is direct Supabase client calls from hooks; no API layer or service abstraction
- All UI text is externalised; components never contain hardcoded strings

## Layers

**Entry / Bootstrap:**
- Purpose: Mount the React tree and apply global CSS
- Location: `src/main.jsx`
- Contains: `ReactDOM.createRoot`, global stylesheet import
- Depends on: `src/App.jsx`, `src/index.css`
- Used by: Browser (index.html entry point)

**App Shell:**
- Purpose: Provider composition, router setup, global overlays
- Location: `src/App.jsx`
- Contains: Provider nesting order, route definitions, lazy modal imports, `SeoHead`, `AppDispatcher`
- Depends on: All four context providers, `react-router-dom`, `react-helmet-async`
- Used by: `src/main.jsx`

**Context / Global State:**
- Purpose: Application-wide state accessible to any component via hooks
- Location: `src/context/`
- Contains: `LanguageContext.jsx`, `ModalContext.jsx`, `AuthContext.jsx`, `ThemeContext.jsx`
- Depends on: `src/lib/supabase.js` (AuthContext only)
- Used by: Pages, components, hooks

**Pages:**
- Purpose: Route-level containers that compose section components
- Location: `src/pages/`
- Contains: `HomePage.jsx`, `PricingPage.jsx`, `ProfilePage.jsx`
- Depends on: Components, context hooks, `src/lib/animations.js`
- Used by: `src/App.jsx` route definitions

**Components:**
- Purpose: Reusable UI sections and interactive widgets
- Location: `src/components/`
- Contains: Section components (`Hero`, `Portfolio`, `AboutMe`, `AboutCompany`, `Contact`), page-specific blocks (`PricingTeaser`, `PricingCalculator`, `PricingFAQ`), global chrome (`Navbar`, `Footer`, `ScrollToTop`, `CustomCursor`), modals (`ServiceRequestModal`, `AuthModal`), utility components (`StructuredData`, `HashScrollHandler`, `ProfileAvatar`, `Marquee`)
- Depends on: Context hooks, `src/lib/animations.js`, `src/config/*`, `src/locales/*` (via `useLanguage`)
- Used by: Pages and `src/App.jsx`

**Hooks:**
- Purpose: Encapsulate reusable stateful logic
- Location: `src/hooks/`
- Contains: `useScrollSpy.js`, `useCountUp.js`, `useReducedMotion.js`, `useProfile.js`
- Depends on: `src/lib/supabase.js` (`useProfile`), `src/context/AuthContext.jsx` (`useProfile`)
- Used by: Components and pages

**Config:**
- Purpose: Single source of truth for business data (never hardcoded in components)
- Location: `src/config/`
- Contains: `pricing.js`, `services.js`, `company.js`, `seo.js`, `portfolio.js`
- Depends on: Nothing (pure data)
- Used by: Components, pages

**Lib / Utilities:**
- Purpose: Shared logic modules
- Location: `src/lib/`
- Contains: `animations.js` (Framer Motion presets), `supabase.js` (singleton client), `profileValidation.js` (field validators), `utils.ts`
- Depends on: `@supabase/supabase-js`, `framer-motion`
- Used by: Components, hooks, context

**Locales:**
- Purpose: All UI copy in two languages
- Location: `src/locales/`
- Contains: `en.json`, `nl.json`
- Depends on: Nothing
- Used by: `src/context/LanguageContext.jsx`

## Data Flow

**Service Request CTA Flow:**

1. User clicks a CTA button (e.g. in `Hero`, `PricingCalculator`)
2. Component calls `requireAuth(payload)` from `useAuth()`
3. If no session: payload is stored in `sessionStorage` as `pendingAction`, `AuthModal` opens via `authOpen` state
4. User authenticates (email/password or Google OAuth via Supabase)
5. `onAuthStateChange` fires in `AuthContext`; `pendingAction` is retrieved from `sessionStorage`
6. `_dispatchFn` (registered by `AppDispatcher` in `App.jsx`) is called with the payload
7. `ModalContext.openModal(data)` executes, opening `ServiceRequestModal` with prefill data

**Pricing Calculator → Modal Flow:**

1. `PricingCalculator` computes price from user selections + `src/config/pricing.js`
2. User clicks "Start Project"; calculator calls `requireAuth({ action: 'openServiceModal', data: calculatedData })`
3. Same auth-gate flow above delivers `calculatedData` as `prefillData` into `ModalContext`
4. `ServiceRequestModal` reads `prefillData` via `useModal()` and pre-populates form fields

**Profile Data Flow:**

1. `useProfile()` hook observes `user` from `useAuth()`
2. On user change, fetches `profiles` row from Supabase (handles PGRST116 by inserting empty row)
3. `updateField()` applies optimistic update to local state, then fires Supabase `.update()`; rolls back on error
4. `uploadAvatar()` validates file, upserts to Supabase Storage `avatars` bucket, then calls `updateField('avatar_url', ...)`

**Language Switch Flow:**

1. `Navbar` calls `setLang(newLang)` from `useLanguage()`
2. `LanguageProvider` updates `lang` state
3. All components re-render and `t('key')` resolves against the new locale object from `src/locales/`

**State Management:**
- Language: `LanguageContext` — in-memory, defaults to `'nl'`, not persisted
- Auth/Session: `AuthContext` — driven by `supabase.auth.onAuthStateChange`
- Modal open/prefill: `ModalContext` — in-memory, cleared on close
- Theme: `ThemeContext` — persisted to `localStorage` under key `vexxo-theme`, applied via `data-theme` attribute on `<html>`
- Profile data: `useProfile` hook — local component state, fetched on demand

## Key Abstractions

**Context Providers:**
- Purpose: Provide global state without prop drilling
- Examples: `src/context/LanguageContext.jsx`, `src/context/AuthContext.jsx`, `src/context/ModalContext.jsx`, `src/context/ThemeContext.jsx`
- Pattern: `createContext` + Provider component + named hook with guard (`if (!ctx) throw`)

**AppDispatcher Bridge:**
- Purpose: Decouple `AuthContext` (module-level) from `ModalContext` (React tree); allows OAuth redirect to re-open modal after page reload
- Pattern: Module-level `_dispatchFn` variable; `App.jsx` registers the real function via `_registerDispatch` on mount
- Location: `src/App.jsx` (`AppDispatcher` component) + `src/context/AuthContext.jsx` (`_registerDispatch`, `_dispatch`)

**Animation Presets:**
- Purpose: Canonical Framer Motion variants used by all animated components
- Examples: `src/lib/animations.js` — `fadeUp`, `fadeIn`, `scaleIn`, `slideLeft`, `slideRight`, `staggerContainer`, `viewport`
- Pattern: Named exports imported directly; `viewport={{ once: true }}` always passed to `whileInView`

**Config Modules:**
- Purpose: Centralise all business data so numbers/text never appear in JSX
- Examples: `src/config/pricing.js`, `src/config/services.js`, `src/config/company.js`
- Pattern: Named exports; components import only what they need

**Glass Card:**
- Purpose: Primary visual surface for content cards
- Pattern: CSS class `.glass-card` defined in `src/index.css`; `border-radius`, hover lift, and backdrop-blur included

## Entry Points

**Application Entry:**
- Location: `src/main.jsx`
- Triggers: Browser loads `index.html` → Vite serves `main.jsx`
- Responsibilities: Create React root, render `<App />` with `StrictMode`

**Home Route:**
- Location: `src/pages/HomePage.jsx`
- Triggers: React Router matches `/`
- Responsibilities: Render `Hero → Portfolio → AboutMe → AboutCompany → Contact` in sequence

**Pricing Route:**
- Location: `src/pages/PricingPage.jsx`
- Triggers: React Router matches `/prijzen`
- Responsibilities: Render `PricingTeaser → PricingCalculator (lazy) → PricingFAQ`; set page-specific SEO via `<Helmet>`

**Profile Route:**
- Location: `src/pages/ProfilePage.jsx`
- Triggers: React Router matches `/profiel`
- Responsibilities: Auth guard (redirect to `/` if unauthenticated), render editable profile cards using `useProfile()` data

## Error Handling

**Strategy:** Localised, per-interaction error feedback; no global error boundary in use.

**Patterns:**
- Auth errors: `AuthModal` maps Supabase error messages to i18n keys via `mapError()` function in `src/components/AuthModal.jsx`
- Profile save errors: `ProfileField` (in `src/pages/ProfilePage.jsx`) catches thrown errors, shows inline message for 1.5s, then resets
- Supabase JWT expiry: `useProfile` (`src/hooks/useProfile.js`) detects `PGRST301` / JWT errors and calls `supabase.auth.signOut()`
- Avatar upload errors: `ProfilePage` catches `'size'` and `'type'` error messages thrown by `uploadAvatar()` and shows translated strings
- Missing profile row: `useProfile` handles `PGRST116` by inserting an empty `profiles` row

## Cross-Cutting Concerns

**Logging:** `console.warn` in dev only, guarded by `import.meta.env.DEV` checks in `src/context/AuthContext.jsx`

**Validation:** Client-side field validation in `src/lib/profileValidation.js`; returns i18n key strings, not error messages. Additional HTML-strip sanitisation in `useProfile.updateField()`.

**Authentication:** `useAuth()` hook; all CTA actions that require login go through `requireAuth(payload)` which stores the pending action and gates on session presence.

**Theme:** `ThemeContext` provides `theme` (`'dark'` | `'light'`) and `toggle`. Theme applied as `data-theme` attribute on `<html>`. ThemeProvider is created but **not yet wired into `App.jsx`** — it is available in `src/context/ThemeContext.jsx` but the provider is not currently in the provider tree. The app hardcodes `className="... dark"` on the root `<div>` in `App.jsx`.

**Reduced Motion:** `src/hooks/useReducedMotion.js` and Framer Motion's built-in `useReducedMotion()`; CSS `@media (prefers-reduced-motion: reduce)` blanket rule in `src/index.css` as fallback.

**Modal Scroll Lock:** `ModalContext.openModal()` sets `document.body.style.overflow = 'hidden'` and adds `.modal-open` class. `src/index.css` pauses all animations on `.page-content *` while `.modal-open` is active.

---

*Architecture analysis: 2026-03-25*
