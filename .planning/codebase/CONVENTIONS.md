# Coding Conventions

**Analysis Date:** 2026-03-25

## Naming Patterns

**Files:**
- Components: PascalCase `.jsx` — `Hero.jsx`, `PricingCalculator.jsx`, `ProfilePage.jsx`
- Hooks: camelCase with `use` prefix, `.js` extension — `useScrollSpy.js`, `useProfile.js`, `useReducedMotion.js`
- Context: PascalCase with `Context` suffix — `LanguageContext.jsx`, `AuthContext.jsx`, `ModalContext.jsx`
- Config: camelCase `.js` — `pricing.js`, `company.js`, `seo.js`
- Lib utilities: camelCase `.js` — `animations.js`, `profileValidation.js`
- Some components have both `.jsx` and `.tsx` variants present (e.g., `Navbar.jsx` and `Navbar.tsx`, `Footer.jsx` and `Footer.tsx`) — the `.jsx` versions are active in the Vite app; `.tsx` versions are for the Next.js layer

**Functions and Components:**
- Default export components: PascalCase function declaration — `export default function Hero() {`
- Named exports from contexts/hooks: PascalCase for providers, camelCase for hooks — `export function LanguageProvider`, `export function useLanguage`
- Internal helper functions (not exported): PascalCase when they are sub-components (`function Toast`, `function ProfileField`, `function CountStat`), camelCase for pure utilities (`function formatDate`, `const fmt`)
- Module-level prefixed bridge functions in `AuthContext.jsx`: underscore prefix signals internal — `_registerDispatch`, `_dispatch`

**Variables:**
- State variables: camelCase with descriptive names — `const [scrolled, setScrolled]`, `const [profileOpen, setProfileOpen]`
- Abbreviation convention for `initial`/`animate` reduced-motion pattern: `const ini = reduce ? false : "hidden"`
- Constants arrays/objects: UPPER_SNAKE_CASE for true constants — `const NAV_LINKS`, `const STATS`, `const ALLOWED_TYPES`, `const MAX_SIZE`
- Config exports: camelCase — `export const vexxo`, `export const addOns`, `export const timeline`

**Types/Interfaces:**
- TypeScript used only in `tailwind.config.ts`, `tsconfig.json`, and `src/lib/utils.ts` — no TypeScript in JSX components
- Tailwind config uses `type Config` import from `"tailwindcss"`

## Code Style

**Formatting:**
- No Prettier config present; formatting is enforced by eslint-config-next
- Indentation: 2 spaces throughout all JSX/JS files
- Semicolons: inconsistent — `.jsx` component files use them, `AuthContext.jsx` and hook files omit them
- String quotes: double quotes in JSX, single quotes in JS logic (e.g., `'hidden'`, `'easeOut'`)
- Trailing commas: present in multi-line objects and arrays

**Linting:**
- Config: `.eslintrc.json` extends `"next/core-web-vitals"` only
- Two deliberate `eslint-disable-line react-hooks/exhaustive-deps` suppressions:
  - `src/hooks/useScrollSpy.js` line 26 — `ids.join(",")` workaround
  - `src/pages/ProfilePage.jsx` line 36 — auto-cancel effect

## Import Organization

**Order (observed pattern):**
1. React and React hooks — `import { useState, useEffect, useRef } from "react"`
2. Third-party packages — `framer-motion`, `react-router-dom`, `react-helmet-async`
3. Internal contexts — `../context/LanguageContext`, `../context/AuthContext`
4. Internal hooks — `../hooks/useScrollSpy`
5. Internal components — `../components/ProfileAvatar`
6. Internal lib/config — `../lib/animations`, `../config/pricing`

**Path Aliases:**
- None configured — all imports use relative paths (`../context/`, `../lib/`, `../config/`)
- Note: `src/lib/utils.ts` exists but is unused in JSX components

## Error Handling

**Async/await pattern in hooks and handlers:**
```js
// useProfile.js — optimistic update with rollback
const { error } = await supabase.from('profiles').update(...)
if (error) {
  setProfile(p => ({ ...p, [key]: prev }))  // rollback
  throw error                                 // bubble up to caller
}
```

**Error handling in components:**
```js
// ProfilePage.jsx — catch with typed error messages
try {
  await uploadAvatar(file)
} catch (err) {
  if (err.message === 'size') setAvatarError(t('profile.avatar.errorSize'))
  else if (err.message === 'type') setAvatarError(t('profile.avatar.errorType'))
  else setAvatarError(t('profile.edit.error'))
}
```

**Validation libraries:**
- No external validation library (no Zod, Yup) — custom validators in `src/lib/profileValidation.js`
- Validators return `null` for valid, i18n key string for invalid:
```js
export const profileValidators = {
  full_name(v) {
    if (!v) return null
    if (HAS_HTML.test(v)) return 'profile.validation.noHtml'
    if (v.length > 100) return 'profile.validation.max100'
    return null
  },
}
```

**Context guard pattern — throw on misuse:**
```js
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider")
  return ctx
}
```

## Logging

**Framework:** `console.warn` / `console.log` only — no logging library

**Patterns:**
- `console.warn` gated behind `import.meta.env.DEV` for internal bridge warnings:
  ```js
  if (import.meta.env.DEV) {
    console.warn('[AuthContext] _dispatch called but _dispatchFn not registered yet.')
  }
  ```
- `console.log` used as stub in contact form submit (`Contact.jsx` line 48) — not yet wired to email service

## Comments

**When to Comment:**
- Section separator headers using em-dash lines: `// ─── Per-veld inline editing component ───`
- JSDoc-style block comments on exported functions that have non-obvious behavior:
  ```js
  /**
   * Gate een CTA actie achter auth.
   * payload: { action: string, data?: any }
   */
  ```
- Dutch inline comments throughout — matches project language (bilingual codebase, NL preferred for code comments)
- Warning comments on critical wiring that must not be removed:
  ```js
  // NIET VERWIJDEREN — zonder dit werkt de pendingAction flow niet na page reload.
  ```

**JSDoc/TSDoc:**
- Used selectively for context bridge functions and hooks with complex behavior
- Not used on component props or standard React components

## Language / i18n Pattern

**Rule:** Zero hardcoded UI strings in components. All display text comes from `useLanguage()`.

**Hook usage:**
```jsx
const { t } = useLanguage()
<h2>{t('portfolio.title')}</h2>
```

**Key format:** dot-notation namespaced — `"hero.ctaPrimary"`, `"nav.getStarted"`, `"pricing.vexxo.highlight1"`

**Locale files:** `src/locales/en.json` and `src/locales/nl.json` — NL is default (`useState("nl")` in `LanguageContext.jsx`)

**Config files do NOT contain display text** — they use `labelEN`/`labelNL` fields on data objects for bilingual labels that cannot be in locale files (e.g., timeline options in `src/config/pricing.js`):
```js
export const addOns = {
  seo: {
    perPage: 30,
    labelEN: "Advanced SEO Optimization",
    labelNL: "Geavanceerde SEO Optimalisatie",
  },
}
```

**Currency:** Always EUR (`€`), formatted with `Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" })`

## CSS Class Composition

**Method:** Tailwind CSS utility classes as primary styling, with custom CSS classes defined in `src/index.css` for reusable patterns.

**Utility class composition pattern:**
```jsx
// Template literals for conditional classes
className={`fixed top-0 w-full z-50 transition-all duration-300 ${
  scrolled ? "bg-zinc-950/60 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
}`}
```

**Reusable CSS class system (`src/index.css`):**
- `.glass-card` — backdrop blur card with hover state
- `.btn-primary` — gradient CTA button (purple → orange)
- `.btn-outline` — ghost button
- `.btn-shimmer` — shimmer sweep modifier on primary button
- `.gradient-text` — static purple-to-orange gradient text
- `.gradient-text-animated` — cycling animated gradient (hero headline only)
- `.pill` — tag/badge chip
- `.card`, `.card-hover` — legacy card utilities
- `.social-icon` — footer social icon with gradient border on hover
- `.animate-float`, `.animate-marquee`, `.animate-pulse-dot` — CSS loop animations

**Tailwind custom tokens (from `tailwind.config.ts`):**
- Colors: `text-primary`, `text-secondary`, `text-accent`, `bg-surface-container`, `text-on-surface`, `text-on-surface-variant`, `border-outline-variant`
- Font families: `font-headline` (Manrope), `font-body` (Inter), `font-mono` (Fira Code)
- Shadows: `shadow-glow-primary`, `shadow-glow-secondary`, `shadow-glow-sm`

**Inline styles — only for dynamic/gradient values:**
```jsx
// Gradient border trick (padding-box / border-box pattern)
style={{
  background: "linear-gradient(var(--color-surface-2,#131319), ...) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box",
  border: "1px solid transparent",
}}
// Radial glow with dynamic positioning
style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.18) 0%, transparent 70%)" }}
```

**No CSS Modules** — not used anywhere in the codebase.

## Animation Pattern

**Framework:** Framer Motion — all entrance animations use variants.

**Canonical import path:** `src/lib/animations.js` (not `src/utils/motion.js` — that file is a duplicate and should not be used)

**Standard variant names:** `hidden` / `visible` — consistent across all components

**Reduced-motion pattern — applied in every animated component:**
```jsx
const reduce = useReducedMotion()  // from src/hooks/useReducedMotion.js
const ini = reduce ? false : "hidden"
// Then use ini as initial prop:
<motion.div variants={fadeUp} initial={ini} animate="visible" />
// For whileInView sections:
<motion.div variants={fadeUp} initial={ini} whileInView="visible" viewport={viewport} />
```

**Hero animations:** Use `animate="visible"` (not `whileInView`) since hero is immediately visible on load.

**Section animations:** Use `whileInView="visible"` with `viewport={viewport}` (`{ once: true, margin: '-60px 0px' }`).

**Stagger pattern:**
```jsx
// Container with staggerChildren
variants={stagger(0.12)}
// Or inline for custom delays:
variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } } }}
```

**CSS-only loop animations** (not Framer Motion): `animate-float`, `animate-marquee`, `animate-pulse-dot`, `gradient-shift` keyframes in `src/index.css`.

## Function Design

**Component size:** Components are medium-to-large. Sub-components are defined in the same file and not exported when they are page-specific (e.g., `ProfileField`, `ProviderBadge`, `Card`, `Toast` in their respective files).

**Event handler naming:** `handle` prefix for async event handlers (`handleSubmit`, `handleAvatarChange`), verb-only for simple setters (`startEdit`, `cancel`, `save`).

**Functional updater pattern for state that depends on previous value:**
```js
setProfile(p => ({ ...p, [key]: sanitized }))
setOpen(p => !p)
```

## Module Design

**Exports:**
- Components: single default export per file (`export default function ComponentName`)
- Hooks/contexts: named exports — provider + hook from same file (`export function LanguageProvider`, `export function useLanguage`)
- Config: named exports only — `export const vexxo`, `export const addOns`
- Animations: named exports — `export const fadeUp`, `export const viewport`

**No barrel files** (`index.js`) — all imports reference specific file paths directly.

**Lazy loading:**
```js
// App.jsx — heavy pages and modals are lazy loaded
const PricingPage = lazy(() => import('./pages/PricingPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const ServiceRequestModal = lazy(() => import('./components/ServiceRequestModal'))
const AuthModal = lazy(() => import('./components/AuthModal'))
```

---

*Convention analysis: 2026-03-25*
