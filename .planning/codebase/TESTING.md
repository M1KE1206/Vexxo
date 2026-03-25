# Testing Patterns

**Analysis Date:** 2026-03-25

## Test Framework

**Runner:** None configured — no test framework installed or configured.

**Assertion Library:** None

**Run Commands:** No test scripts defined in `package.json`.

```json
// package.json scripts — no test entry
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "dev:next": "next dev",
  "build:next": "next build",
  "lint": "next lint"
}
```

## Test File Organization

**Location:** No test files exist in the codebase.

```bash
# find result — zero matches
find src/ -name "*.test.*" -o -name "*.spec.*"
# (no output)
```

**Naming:** Not established.

**Structure:** Not established.

## Test Structure

No tests are written. No patterns to document.

## Mocking

**Framework:** Not configured.

**External dependencies that would need mocking in future tests:**
- `src/lib/supabase.js` — Supabase client (auth, database, storage)
- `src/context/AuthContext.jsx` — `useAuth()` hook (user, session, requireAuth, signOut)
- `src/context/LanguageContext.jsx` — `useLanguage()` hook (t, lang, setLang)
- `src/context/ModalContext.jsx` — `useModal()` hook
- Framer Motion's `useReducedMotion` from `framer-motion`
- `react-router-dom` — `useNavigate`, `useLocation`, `Link`

## Fixtures and Factories

**Test Data:** None established.

**Location:** No fixture or factory files exist.

## Coverage

**Requirements:** None enforced — no coverage configuration, no CI pipeline.

**View Coverage:** Not available.

## Test Types

**Unit Tests:** Not present.

**Integration Tests:** Not present.

**E2E Tests:** Not present. No Playwright, Cypress, or similar framework installed.

Note: `CLAUDE.md` references a "Playwright MCP — Visual Review Protocol" but this is a manual review checklist using Claude's screenshot capabilities, not automated Playwright tests.

## Testability Notes

These observations describe the current state to guide any future test setup.

**Well-isolated logic (easiest to unit test):**
- `src/lib/profileValidation.js` — pure functions, no dependencies, return null or i18n key string
- `src/config/pricing.js` — pure data + invariant comment (worst-case pricing verification)
- `src/lib/animations.js` — static variant objects
- `src/context/LanguageContext.jsx` — `t(key)` function is a pure dot-path lookup

**Hooks that need Supabase mocking:**
- `src/hooks/useProfile.js` — calls `supabase.from('profiles')`, `supabase.storage`
- `src/context/AuthContext.jsx` — calls `supabase.auth.getSession()`, `supabase.auth.onAuthStateChange`

**Components with browser API dependencies:**
- `src/hooks/useScrollSpy.js` — uses `window.scrollY`, `window.innerHeight`, `document.getElementById`
- `src/hooks/useCountUp.js` (inline in `PricingCalculator.jsx`) — uses `performance.now()`, `requestAnimationFrame`
- `src/components/CustomCursor.jsx` — pointer events, `window.matchMedia`

**Suggested test framework for this stack:**
- Vitest (matches Vite; add `vitest` + `@vitest/ui` devDependencies)
- `@testing-library/react` + `@testing-library/user-event` for component tests
- `msw` (Mock Service Worker) for Supabase API mocking
- Config file would be `vitest.config.js` at project root

**First candidates for test coverage (highest value, least complexity):**
1. `src/lib/profileValidation.js` — zero dependencies, pure functions
2. `src/config/pricing.js` invariant — verify Vexxo is always cheaper than freelancer at max settings
3. `src/context/LanguageContext.jsx` — `t()` key resolution and fallback behavior

---

*Testing analysis: 2026-03-25*
