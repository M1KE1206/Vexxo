# Codebase Concerns

**Analysis Date:** 2026-03-25

---

## Tech Debt

**ThemeContext exists but is never wired into the app:**
- Issue: `ThemeProvider` and `useTheme` are fully implemented in `src/context/ThemeContext.jsx`, but `ThemeProvider` is never added to the context tree in `src/App.jsx`. The `data-theme` attribute is never set. No component calls `useTheme()`. The light theme toggle is completely non-functional.
- Files: `src/context/ThemeContext.jsx`, `src/App.jsx`
- Impact: Light theme cannot be activated by any user action. Any future light-mode work must start by adding `ThemeProvider` as a wrapper in `App.jsx`.
- Fix approach: Wrap the root in `<ThemeProvider>` inside `src/App.jsx`, then expose a toggle button in `Navbar.jsx`.

**Hardcoded `dark` class on root div instead of theme-driven:**
- Issue: `src/App.jsx` line 81 sets `className="... dark"` as a static string, permanently forcing Tailwind's dark mode regardless of `ThemeContext`. This will prevent light mode from activating even after `ThemeProvider` is wired.
- Files: `src/App.jsx` line 81
- Impact: Tailwind `dark:` variants will never flip to light. Must be replaced with a dynamic class driven by `useTheme()`.
- Fix approach: Replace `"dark"` with `theme === 'dark' ? 'dark' : ''` after wiring `ThemeProvider`.

**Hardcoded background color `#0e0e13` in inline styles and CSS:**
- Issue: The token `--background: #0e0e13` exists in `:root`, but many components bypass it with the raw hex value in inline `style={}` props or CSS rules. These will not update when the theme changes.
- Files (inline styles):
  - `src/components/Navbar.jsx` line 145 — dropdown `bg-[#0e0e13]`
  - `src/components/PricingCalculator.jsx` lines 128, 200 — padding-box gradient trick
  - `src/components/PricingFAQ.jsx` lines 30, 35 — open/closed card backgrounds
  - `src/components/PricingTeaser.jsx` lines 109, 117 — card base + gradient border
  - `src/components/ProfileAvatar.jsx` line 15 — gradient border padding-box
  - `src/index.css` lines 246, 282, 291 — `.social-icon:hover`, `.section-fade::before/after`
- Impact: Every place that uses `#0e0e13` directly will remain dark even in light theme.
- Fix approach: Replace all instances with `var(--background)`. The padding-box gradient trick `linear-gradient(#0e0e13, #0e0e13)` must become `linear-gradient(var(--background), var(--background))`.

**`.section-fade` pseudo-elements hardcode `#0e0e13`:**
- Issue: `src/index.css` lines 282 and 291 use `linear-gradient(to bottom, #0e0e13, transparent)` and `linear-gradient(to top, #0e0e13, transparent)` for the fade overlays on the AboutMe section. These are raw hex literals.
- Files: `src/index.css` lines 278–294, `src/components/AboutMe.jsx` line 53
- Impact: Fade overlays will show a dark band on a light-theme page.
- Fix approach: Change to `linear-gradient(to bottom, var(--background), transparent)`.

**`src/components/HeroComputer.jsx` uses un-tokenized dark hex values in Tailwind classes:**
- Issue: Monitor body, stand, and keyboard base use `from-[#1c1c28] to-[#13131e]` and `from-[#1a1a26] to-[#111118]` as arbitrary Tailwind color values. Screen background is `bg-[#060a06]`.
- Files: `src/components/HeroComputer.jsx` lines 117, 122, 156, 158, 167
- Impact: Cannot be inverted for light theme without editing every class string individually.
- Fix approach: Add CSS custom properties for these two surface shades (e.g., `--computer-body-from`, `--computer-body-to`) and reference them via Tailwind's `bg-[var(...)]` syntax.

**`src/components/AuthModal.jsx` has the heaviest hardcoded color concentration:**
- Issue: The entire modal uses raw hex strings in inline `style={}` for every text, background, and border color: `#acaab1`, `#f9f5fd`, `#55545b`, `#C084FC`, and multiple `rgba(255,255,255,...)` opacity surfaces. There are ~20 inline color values.
- Files: `src/components/AuthModal.jsx` lines 197, 254, 274, 305, 316, 327, 331, 341, 352, 356, 365, 381, 398, 413, 434, 444, 450
- Impact: AuthModal will be entirely opaque to theme switching. It is also the most complex component to refactor.
- Fix approach: Replace all `#acaab1` with `var(--on-surface-variant)`, `#f9f5fd` with `var(--on-surface)`, `#55545b` with `var(--outline)`, etc. The `rgba(255,255,255,0.0x)` surfaces should become `rgba(var(--on-surface-rgb), 0.0x)` or dedicated CSS variables.

**`PricingTeaser.jsx` uses inline `style={}` objects for all card rendering:**
- Issue: Almost the entire card layout uses JavaScript style objects with hardcoded values (`#0e0e13`, `#55545b`, `#f9f5fd`, `#acaab1`, `#7C3AED`). The component is the most structurally resistant to theming.
- Files: `src/components/PricingTeaser.jsx` lines 108–128 (style objects), 188, 206, 219, 231
- Impact: Cannot participate in CSS variable theming without a significant JSX restructure.
- Fix approach: Convert style objects to Tailwind classes using design-system tokens (`text-on-surface`, `text-on-surface-variant`, etc.).

**Navbar uses `bg-zinc-950` instead of a design token:**
- Issue: The scrolled navbar state uses `bg-zinc-950/60` (Tailwind built-in) and the mobile menu uses `bg-zinc-950/90`. These are not tied to CSS variables and will not respect a light theme.
- Files: `src/components/Navbar.jsx` lines 68, 201
- Impact: Navbar background will remain near-black in light mode.
- Fix approach: Replace with `bg-background/60` once Tailwind is configured to expose the `--background` token as `bg-background`.

---

## Known Bugs

**Contact form submission is stubbed — emails are never sent:**
- Symptoms: Submitting the contact form logs to console and shows a success toast, but no email is dispatched.
- Files: `src/components/Contact.jsx` lines 47–53
- Trigger: Any contact form submission in production
- Workaround: None. Users believe they have sent a message but nothing is received.

**Service request modal submission is stubbed — orders are never recorded:**
- Symptoms: Clicking "Send" in `ServiceRequestModal` logs to console and shows a sent state after a 1.4s artificial delay, but nothing is stored or emailed.
- Files: `src/components/ServiceRequestModal.jsx` lines 251–256
- Trigger: Any service request submission in production
- Workaround: None.

**`ProfilePage` auth guard uses a 100ms fixed timer instead of a proper loading state:**
- Issue: `authChecked` is set via `setTimeout(100)` rather than waiting for the Supabase auth session to resolve. On slow connections this may redirect an authenticated user before the session is available.
- Files: `src/pages/ProfilePage.jsx` lines 200–203
- Impact: Authenticated users can be briefly redirected to `/` and shown the auth modal on page load.
- Fix approach: Gate on `user === undefined` (loading) vs `user === null` (unauthenticated), which `useAuth` should surface explicitly.

---

## Security Considerations

**Two `console.log` calls leak user data in production:**
- Risk: Sensitive form content (name, email, message, selected package) is logged to the browser console.
- Files: `src/components/Contact.jsx` line 48, `src/components/ServiceRequestModal.jsx` line 253
- Current mitigation: None.
- Recommendations: Remove both `console.log` calls. Add ESLint `no-console` rule to prevent recurrence.

**Footer social links are placeholder `href="#"` anchors:**
- Risk: Low security impact but real trust/UX risk — clicking any social icon does nothing, which may undermine credibility for a premium agency site.
- Files: `src/components/Footer.jsx` lines 7, 16, 24
- Current mitigation: None.
- Recommendations: Replace with real URLs from `src/config/company.js` before launch.

---

## Fragile Areas

**`PricingTeaser.jsx` scroll-lock mechanism:**
- Files: `src/components/PricingTeaser.jsx` lines 29–97
- Why fragile: Manually mutates `document.body.style.position`, `top`, and `width` to simulate scroll locking. Conflicts with `AuthModal` and `ModalContext` which independently mutate `document.body.style.overflow`. If two of these activate simultaneously (e.g., user scrolls to teaser then opens a modal) the body styles can be left in an inconsistent state.
- Safe modification: Do not add more `document.body.style` mutations elsewhere. Always call `unlock()` in cleanup. Consider a centralized scroll-lock hook.
- Test coverage: None.

**Three independent scroll-lock implementations:**
- Files: `src/components/PricingTeaser.jsx` (position:fixed trick), `src/components/AuthModal.jsx` (overflow:hidden), `src/context/ModalContext.jsx` (overflow:hidden)
- Why fragile: All three write to `document.body.style` directly without coordinating. If multiple are active at once the last cleanup to run wins, potentially restoring scroll when it should still be locked.
- Fix approach: Introduce a single `useScrollLock` hook that ref-counts lock requests.

**`IcosahedronScene.jsx` Three.js is CLAUDE.md-prohibited:**
- Issue: `CLAUDE.md` explicitly states "HeroComputer: pure CSS/HTML only, no WebGL, no canvas." The `IcosahedronScene` component uses Three.js WebGL in the hero section, contradicting this rule. `HeroComputer.jsx` (CSS-only) also exists and appears to be the intended component.
- Files: `src/components/IcosahedronScene.jsx`, `src/components/Hero.jsx` line 128
- Impact: `Hero.jsx` renders `IcosahedronScene` (WebGL/canvas), not `HeroComputer` (CSS). Bundle includes Three.js (~150KB gzipped). Violates the performance contract.
- Clarify: Determine which hero visual is canonical and remove the other.

**Duplicate `.jsx` / `.tsx` component pairs:**
- Issue: Three components exist in both JSX and TSX form with no clear ownership:
  - `src/components/Navbar.jsx` (253 lines) and `src/components/Navbar.tsx` (92 lines)
  - `src/components/Footer.jsx` (80 lines) and `src/components/Footer.tsx` (45 lines)
  - `src/components/PricingCalculator.jsx` (328 lines) and `src/components/PricingCalculator.tsx` (301 lines)
- Files: All six files listed above.
- Impact: Unclear which version is imported and rendered. Dead code increases maintenance surface. Both versions can diverge silently.
- Fix approach: Delete the unused version of each pair. The `.jsx` versions are imported by `src/pages/` and `src/App.jsx`, making the `.tsx` versions likely orphaned.

**`src/app/` Next.js directory coexists with Vite `src/pages/`:**
- Issue: `package.json` contains both `vite` (the active build) and `next` (with its own `dev:next` script). A full `src/app/` directory exists with Next.js App Router pages (`layout.tsx`, `page.tsx`, `clientportaal/`, `over-mij/`, `portfolio/`, `services/`). These are never built or served by the active Vite config.
- Files: `src/app/` (all files), `package.json`
- Impact: Significant confusion risk. The Next.js app directory is dead code that shadows the real application structure. New contributors may edit the wrong files. Bundle analysis is cluttered.
- Fix approach: Remove `src/app/` entirely if Next.js migration is not actively planned. Remove `next` and `@next/font` from `package.json`.

---

## Performance Bottlenecks

**Three.js loaded in hero viewport:**
- Problem: `IcosahedronScene.jsx` dynamically imports Three.js (`import('three')`) but this still adds ~600KB parsed JS (uncompressed) to the critical path of the hero section.
- Files: `src/components/IcosahedronScene.jsx`, `src/components/Hero.jsx`
- Cause: Three.js is a large library loaded immediately on hero mount.
- Improvement path: Either remove in favour of the CSS-only `HeroComputer.jsx` (per CLAUDE.md), or defer with `IntersectionObserver` and a placeholder that only triggers after the user has seen the text content.

**`useCountUp` duplicated between `PricingCalculator.jsx` and `src/hooks/useCountUp.js`:**
- Problem: An inline `useCountUp` function is defined inside `src/components/PricingCalculator.jsx` (lines 22–50) duplicating the hook already in `src/hooks/useCountUp.js`.
- Files: `src/components/PricingCalculator.jsx`, `src/hooks/useCountUp.js`
- Cause: Copy-paste rather than import.
- Improvement path: Delete the inline version and import from `src/hooks/useCountUp.js`.

---

## Missing Critical Features

**No email delivery backend:**
- Problem: Both the contact form (`src/components/Contact.jsx`) and the service request modal (`src/components/ServiceRequestModal.jsx`) are UI shells that do not send any data anywhere.
- Blocks: The site cannot receive client enquiries. Any form submission silently succeeds without creating a record.

**No Supabase table for service requests:**
- Problem: The `ServiceRequestModal` collects package selection, calculator data, and a brief, but `handleSend` only logs to console. There is no `supabase.from('service_requests').insert(...)` call.
- Files: `src/components/ServiceRequestModal.jsx` lines 250–257
- Blocks: Order intake is entirely non-functional.

---

## Test Coverage Gaps

**Zero test files exist:**
- What's not tested: Everything. No unit, integration, or E2E tests are present anywhere in the project.
- Files: Entire `src/` tree
- Risk: Any refactor (particularly the theme migration) can silently break pricing calculations, auth flows, or form validation.
- Priority: High — at minimum, pricing calculation logic in `src/config/pricing.js` and `src/components/PricingCalculator.jsx` should have unit tests to protect the invariant that Vexxo always costs less than the freelancer card at maximum settings.

---

*Concerns audit: 2026-03-25*
