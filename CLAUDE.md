# Vexxo Studio — Claude Code Design System

> Read this file before writing any code, making any design decision,
> or suggesting any UI change. This is the single source of truth.

---

## 🎯 Design Philosophy

Vexxo Studio is a **premium boutique web agency**. The site must feel
like Exicom, Decodable or Linear — not like a Tailwind template or
a vibe-coded gradient mess.

### The 3 rules that prevent "vibe coded" output:

**Rule 1 — Restraint over decoration**
Every visual element must earn its place. If removing it doesn't
hurt the design, remove it. No gradients for the sake of gradients.
No glow effects just because they look cool.

**Rule 2 — Typography does the heavy lifting**
Strong, well-spaced type is more premium than any gradient.
When in doubt: bigger text, more whitespace, less color.

**Rule 3 — Gradients are a spice, not a sauce**
Gradients appear in maximum 3 places per page:
- The logo wordmark
- The primary CTA button
- ONE highlight word or accent per section
Everywhere else: solid colors or transparent/glass.

---

## 🎨 Color System — 60/30/10 Rule

```
60% — Dark neutrals (backgrounds, surfaces)
30% — Primary purple #7C3AED (brand, interactive, focus)
10% — Secondary orange #F97316 + accent #C084FC (CTAs, highlights only)
```

### Tokens
```css
--color-primary:    #7C3AED;   /* Main purple */
--color-secondary:  #F97316;   /* Orange — use sparingly */
--color-accent:     #C084FC;   /* Light purple — hover states, subtle */

--color-bg:         #0a0a0f;   /* Page background */
--color-surface:    #0e0e13;   /* Section backgrounds */
--color-surface-2:  #131319;   /* Card backgrounds */
--color-surface-3:  #19191f;   /* Elevated cards */
--color-border:     rgba(255,255,255,0.08);  /* Default borders */
--color-border-hover: rgba(124,58,237,0.3); /* Hover borders */

--color-text:       #f9f5fd;   /* Primary text */
--color-text-muted: #acaab1;   /* Secondary text */
--color-text-faint: #55545b;   /* Placeholder, disabled */
```

### When to use each color
| Color | Use for | Never use for |
|---|---|---|
| #7C3AED | Labels, active states, icons, borders on highlight | Full card backgrounds |
| #F97316 | CTA button gradient end, price highlights, checkmarks | Text, backgrounds |
| #C084FC | Hover glows, step indicators, soft accents | Primary actions |
| Gradients | Logo, CTA button, ONE headline word | Card backgrounds, section BGs |

---

## 📐 Spacing & Layout

```css
/* Section padding — always */
section { padding: 6rem 2rem; }           /* py-24 px-8 */
.container { max-width: 80rem; margin: 0 auto; } /* max-w-7xl mx-auto */

/* Card padding */
.card-sm  { padding: 1.5rem; }            /* p-6  */
.card-md  { padding: 2rem;   }            /* p-8  */
.card-lg  { padding: 2.5rem; }            /* p-10 */

/* Grid gaps */
.grid-cards { gap: 2rem; }               /* gap-8 */
.grid-tight { gap: 1rem; }               /* gap-4 */
```

### Whitespace rules (prevents vibe-coded look)
- Section titles need at least 4rem margin-bottom before content
- Never place two glass cards directly touching — always gap-6 minimum
- Hero headline line-height: 1.05 — tight but not cramped
- Body text max-width: 65ch — never full width

---

## ✍️ Typography

```css
/* Fonts */
--font-headline: 'Manrope', sans-serif;   /* All headings */
--font-body:     'Inter', sans-serif;     /* All body text */

/* Scale */
--text-xs:   0.75rem;    /* Labels, tags */
--text-sm:   0.875rem;   /* Secondary text */
--text-base: 1rem;       /* Body */
--text-lg:   1.125rem;   /* Large body */
--text-xl:   1.25rem;    /* Sub-headings */
--text-2xl:  1.5rem;     /* Card titles */
--text-4xl:  2.25rem;    /* Section titles */
--text-6xl:  3.75rem;    /* Hero headline desktop */
--text-7xl:  4.5rem;     /* Hero headline wide */
```

### Heading hierarchy — STRICT
- **h1**: Hero headline only. One per page. Font-size: 6xl/7xl.
- **h2**: Section titles. Font-size: 4xl/5xl.
- **h3**: Card titles. Font-size: xl/2xl.
- Never skip levels. Never use bold text as a heading substitute.

### Section label pattern (above every h2)
```html
<span class="section-label">PORTFOLIO</span>
<h2>Selected Work</h2>
```
```css
.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-secondary);
  display: block;
  margin-bottom: 0.75rem;
}
```

---

## 🧊 Glass Card System

```css
/* Standard glass card */
.glass-card {
  background: rgba(37, 37, 45, 0.12);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
}

/* Hover state — always add this */
.glass-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: 0 0 0 1px rgba(124,58,237,0.1),
              inset 0 0 30px rgba(124,58,237,0.03);
  transform: translateY(-4px);
  transition: all 0.3s ease;
}

/* Highlighted card (Vexxo in comparison, selected state) */
.glass-card--highlight {
  background: rgba(124,58,237,0.08);
  border-color: rgba(124,58,237,0.4);
  box-shadow: 0 0 40px rgba(124,58,237,0.12);
}
```

### Glass card rules
- Never use a gradient as glass card background
- Highlight via border + subtle bg tint, not filled gradient
- Max 1 highlighted card per section
- Blur only when there's a background worth blurring

---

## ✨ Animation System

All animations use **Framer Motion**. Never use raw CSS keyframes
for entrance animations — only for loops (pulse, float, shimmer).

```js
// Animation presets — import from src/lib/animations.js
export const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } }
}

export const slideLeft = {
  hidden:  { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.5, ease: 'easeOut' } }
}

export const slideRight = {
  hidden:  { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } }
}
```

### Animation rules (prevents vibe-coded feel)
- Entrance animations: **one direction only** per section
  (don't mix fadeUp and slideLeft in the same section)
- Duration: 0.4–0.6s max. Longer = slower = cheaper feeling.
- Easing: always custom cubic-bezier or 'easeOut'. Never 'linear'.
- Stagger: 0.1–0.15s between children. Never more.
- Loop animations (float, pulse): subtle. Max 8px movement.
- **Always** add `viewport={{ once: true }}` — animate once only.
- **Always** respect prefers-reduced-motion:

```js
// src/hooks/useReducedMotion.js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
// Pass { animate: prefersReduced ? 'visible' : undefined } to skip animation
```

---

## 🧩 Component Patterns

### Button
```jsx
// Primary CTA
<button className="
  bg-gradient-to-r from-[#7C3AED] to-[#F97316]
  text-white px-8 py-4 rounded-full
  font-bold text-sm tracking-wide
  hover:scale-[1.02] active:scale-[0.98]
  transition-transform duration-150
  shadow-[0_0_30px_rgba(124,58,237,0.25)]
">

// Ghost/secondary
<button className="
  px-8 py-4 rounded-full
  border border-white/10
  font-bold text-sm
  hover:bg-white/5 hover:border-white/20
  transition-all duration-200
">
```

### Section wrapper
```jsx
<section id="section-id" className="py-24 px-8">
  <div className="max-w-7xl mx-auto">
    <motion.div variants={staggerContainer} initial="hidden"
      whileInView="visible" viewport={{ once: true }}>
      {/* content */}
    </motion.div>
  </div>
</section>
```

### Price display
```jsx
// Always show € not $
// Always pull from config/pricing.js
import { PRICING, MIN_PRICE } from '../config/pricing'
```

---

## 📁 File Structure — Source of Truth

```
src/
  components/
    Navbar.jsx
    Hero.jsx
    HeroComputer.jsx      ← CSS-only 3D computer, no WebGL
    Marquee.jsx           ← infinite scroll ticker below hero
    Portfolio.jsx
    AboutMe.jsx
    AboutCompany.jsx
    PricingCalculator.jsx
    ServiceModal.jsx      ← full-screen request modal
    Contact.jsx
    Footer.jsx
    ScrollToTop.jsx
    CustomCursor.jsx      ← desktop only
    StructuredData.jsx    ← JSON-LD SEO schemas
  context/
    LanguageContext.jsx   ← EN/NL switcher
    ModalContext.jsx      ← modal open/close + order state
  config/
    pricing.js            ← ALL prices, never hardcode
    services.js           ← ALL packages and descriptions
    company.js            ← name, email, socials, stats
    seo.js                ← meta, OG, Twitter card data
  locales/
    en.json               ← ALL English UI text
    nl.json               ← ALL Dutch UI text
  hooks/
    useScrollSpy.js
    useCountUp.js
    useReducedMotion.js
  lib/
    animations.js         ← all Framer Motion presets
  App.jsx
  index.css
```

---

## 🌍 Language Rules

- **Zero hardcoded UI text in components** — ever.
- Every string comes from `useLanguage()` hook.
- Config files (pricing.js, services.js) store keys, not display text.
- Display text for packages, labels, CTAs → en.json / nl.json.

```jsx
// Correct
const { t } = useLanguage()
<h2>{t('portfolio.title')}</h2>

// Wrong — never do this
<h2>Selected Work</h2>
```

---

## 💰 Pricing Rules

```js
// src/config/pricing.js — always import from here
export const PRICING = {
  vexxo:      { base: 299,  perPage: 49  },
  agency:     { base: 2000, perPage: 400 },
  freelancer: { base: 1000, perPage: 200 },
  addons: {
    content: 30,  // per page
    seo:     30,  // per page
  },
  timeline: {
    rush:    40,  // per page, within 7 days
    fast:    15,  // per page, within 14 days
    regular:  0,
  },
}

// Minimum price — always derived, never hardcoded
export const MIN_PRICE = PRICING.vexxo.base + PRICING.vexxo.perPage  // €348
```

**Invariant:** At maximum settings (30 pages + all add-ons + rush),
Vexxo must always be cheaper than the freelancer card.
Verify this after any pricing change.

---

## 🔍 Playwright MCP — Visual Review Protocol

After building or modifying any component, always:

```
1. Take a screenshot of the full page
2. Check against these criteria:
   - Is the 60/30/10 color rule maintained?
   - Are gradients used in max 3 places?
   - Does any section feel "vibe coded" or over-decorated?
   - Is typography hierarchy correct (h1 → h2 → h3)?
   - Do animations feel purposeful, not just decorative?
   - Is there enough whitespace between sections?
3. If any criteria fails — fix before moving to next component
4. Take a final screenshot and confirm
```

### Red flags to catch visually:
- More than 2 gradient elements visible at once → reduce
- Cards with gradient backgrounds (not borders) → fix to solid
- Text smaller than 14px → increase
- Sections that look identical to each other → differentiate
- Any element that pulses, glows or moves without purpose → remove

---

## ⚡ Performance Rules

- HeroComputer: pure CSS/HTML only, no WebGL, no canvas
- Lazy load HeroComputer and ServiceModal via React.lazy
- Images: always add width, height, loading="lazy" (except hero)
- Hero image/visual: fetchpriority="high"
- Never add a new npm package without checking bundle impact first
- Target Lighthouse scores: Performance 90+, SEO 100, A11y 90+

---

## ♿ Accessibility Rules

- One h1 per page, never skip heading levels
- All buttons have descriptive text or aria-label
- All images have meaningful alt text
- Focus states: never remove outline without :focus-visible replacement
- Color is never the only way to convey information
- Language switcher uses lang attribute: `<button lang="en">`

---

## 🚫 What Claude Code must NEVER do

- Hardcode any price, text or color value in a component
- Add `!important` unless fixing a third-party override
- Use `any` in TypeScript
- Add inline styles except for dynamic values (e.g. transform)
- Create a new component without checking if one already exists
- Use a full gradient as a card background
- Add animations without a prefers-reduced-motion check
- Use $ instead of € for prices
- Place language switcher inside the main nav links group
- Write text directly in JSX instead of using useLanguage()