# Pricing Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the duplicate PricingTeaser + PricingCalculator on PricingPage with a single unified `PricingSection` component that matches the glass-v4.html mockup — category tabs, service cards, inline page slider, SEO add-on, contact form with live validation, and sticky price sidebar.

**Architecture:** Single new component `src/components/PricingSection.jsx` with all state (category, selected card, pages, SEO, form) managed locally via `useState`. Existing `services.js` is extended with `included` and `hasSeo` flags. `PricingPage.jsx` drops `PricingTeaser` and `PricingCalculator` and renders `PricingSection` directly. The old `PricingCalculator.jsx` and `ServiceRequestModal.jsx` are left untouched — they're still used on the homepage flow.

**Tech Stack:** React 18, Framer Motion v12, Tailwind/CSS custom properties, `useLanguage` i18n hook, `services.js` + `pricing.js` config.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/config/services.js` | Add `included` + `hasSeo` to relevant packages |
| Create | `src/components/PricingSection.jsx` | Full unified pricing UI |
| Modify | `src/locales/nl.json` | Add `pricingSection.*` keys |
| Modify | `src/locales/en.json` | Add `pricingSection.*` keys |
| Modify | `src/pages/PricingPage.jsx` | Swap PricingTeaser+PricingCalculator → PricingSection |

---

## Task 1: Extend services.js with `included` and `hasSeo`

**Files:**
- Modify: `src/config/services.js`

Only two packages have per-page pricing beyond the base: `multi-page` (8 included) and `growth-package` (6 included). All others have `included: 0, hasSeo: false`.

- [ ] **Step 1: Add fields to multi-page package**

In `src/config/services.js`, find the `multi-page` package object (around line 83) and add two fields after `price: 900`:

```js
price: 900,
included: 8,
hasSeo: true,
```

- [ ] **Step 2: Add fields to growth-package**

Find the `growth-package` package object (around line 139) and add two fields after `price: 1800`:

```js
price: 1800,
included: 6,
hasSeo: true,
```

- [ ] **Step 3: Add default fields to all other packages**

For every other package (logo-design, brand-identity, ui-ux-design, social-media-kit, landing-dev, web-app, website-audit, starter-package, premium-studio, maintenance), add after their `price` line:

```js
included: 0,
hasSeo: false,
```

- [ ] **Step 4: Verify by reading the file**

Open `src/config/services.js` and confirm:
- `multi-page` has `included: 8, hasSeo: true`
- `growth-package` has `included: 6, hasSeo: true`
- All others have `included: 0, hasSeo: false`

- [ ] **Step 5: Commit**

```bash
git add src/config/services.js
git commit -m "feat(services): add included pages + hasSeo flags to packages"
```

---

## Task 2: Add i18n keys

**Files:**
- Modify: `src/locales/nl.json`
- Modify: `src/locales/en.json`

- [ ] **Step 1: Add Dutch keys**

In `src/locales/nl.json`, find the `"pricingPage"` key and add a new `"pricingSection"` key directly after it:

```json
"pricingSection": {
  "badge": "PRIJZEN",
  "title": "Kies jouw dienst",
  "subtitle": "Stel je pakket samen en vraag direct aan. Transparante prijs, geen verrassingen.",
  "step1Label": "Wat heb je nodig?",
  "step2Label": "Add-ons",
  "stepFormLabel": "Jouw gegevens",
  "emptyTitle": "Kies een categorie",
  "emptyText": "Selecteer Design, Development of Fullstack om de beschikbare diensten te zien.",
  "sliderLabel": "Aantal pagina's",
  "sliderIncluded": "· inbegrepen",
  "seoAddonName": "Advanced SEO Optimalisatie",
  "seoAddonDesc": "Technische SEO, meta-tags, sitemap & structured data",
  "seoAddonPrice": "+€30/pag.",
  "fieldNaam": "Naam",
  "fieldBedrijf": "Bedrijf",
  "fieldEmail": "E-mail",
  "fieldTel": "Telefoon",
  "fieldNotes": "Projectomschrijving",
  "placeholderNaam": "Jan Janssen",
  "placeholderBedrijf": "Optioneel",
  "placeholderEmail": "jan@bedrijf.be",
  "placeholderTel": "+32 495 00 00 00",
  "placeholderNotes": "Vertel kort over je project, doelgroep, deadline...",
  "sidebarTitle": "Jouw offerte",
  "sidebarEmptyText": "Kies een dienst links om de prijs te berekenen.",
  "sidebarCat": "Categorie",
  "sidebarSvc": "Dienst",
  "sidebarPages": "Pagina's",
  "sidebarSeo": "SEO add-on",
  "sidebarTotal": "Totaal (excl. btw)",
  "sidebarNote": "Vrijblijvende offerte",
  "ctaLabel": "Aanvraag versturen",
  "trustText": "Geen verplichtingen — reactie binnen 24u",
  "socialProof": "15 klanten gingen je voor — gemiddeld 4.9★",
  "errNaamShort": "Minimaal 2 tekens vereist.",
  "errNaamChars": "Alleen letters, spaties en koppeltekens toegestaan.",
  "errInjection": "Ongeldige tekens gedetecteerd.",
  "errEmailInvalid": "Voer een geldig e-mailadres in.",
  "errEmailLong": "E-mailadres te lang.",
  "errTelLetters": "Telefoonnummer mag geen letters bevatten.",
  "errTelChars": "Alleen cijfers, +, spaties en - toegestaan.",
  "errTelShort": "Minimaal 8 cijfers vereist.",
  "errNotesShort": "Minimaal 10 tekens voor een goede beschrijving.",
  "errNotesLong": "Maximaal 1000 tekens.",
  "errBedrijfChars": "Ongeldige tekens in bedrijfsnaam."
}
```

- [ ] **Step 2: Add English keys**

In `src/locales/en.json`, find the `"pricingPage"` key and add `"pricingSection"` after it:

```json
"pricingSection": {
  "badge": "PRICING",
  "title": "Choose your service",
  "subtitle": "Configure your package and request a quote. Transparent pricing, no surprises.",
  "step1Label": "What do you need?",
  "step2Label": "Add-ons",
  "stepFormLabel": "Your details",
  "emptyTitle": "Choose a category",
  "emptyText": "Select Design, Development or Fullstack to see available services.",
  "sliderLabel": "Number of pages",
  "sliderIncluded": "· included",
  "seoAddonName": "Advanced SEO Optimisation",
  "seoAddonDesc": "Technical SEO, meta tags, sitemap & structured data",
  "seoAddonPrice": "+€30/page",
  "fieldNaam": "Name",
  "fieldBedrijf": "Company",
  "fieldEmail": "Email",
  "fieldTel": "Phone",
  "fieldNotes": "Project description",
  "placeholderNaam": "John Smith",
  "placeholderBedrijf": "Optional",
  "placeholderEmail": "john@company.com",
  "placeholderTel": "+44 7700 000000",
  "placeholderNotes": "Tell us briefly about your project, audience, deadline...",
  "sidebarTitle": "Your quote",
  "sidebarEmptyText": "Choose a service on the left to calculate the price.",
  "sidebarCat": "Category",
  "sidebarSvc": "Service",
  "sidebarPages": "Pages",
  "sidebarSeo": "SEO add-on",
  "sidebarTotal": "Total (excl. VAT)",
  "sidebarNote": "Non-binding quote",
  "ctaLabel": "Send request",
  "trustText": "No obligations — reply within 24h",
  "socialProof": "15 clients went before you — average 4.9★",
  "errNaamShort": "Minimum 2 characters required.",
  "errNaamChars": "Only letters, spaces and hyphens allowed.",
  "errInjection": "Invalid characters detected.",
  "errEmailInvalid": "Please enter a valid email address.",
  "errEmailLong": "Email address too long.",
  "errTelLetters": "Phone number cannot contain letters.",
  "errTelChars": "Only digits, +, spaces and - allowed.",
  "errTelShort": "Minimum 8 digits required.",
  "errNotesShort": "Minimum 10 characters for a good description.",
  "errNotesLong": "Maximum 1000 characters.",
  "errBedrijfChars": "Invalid characters in company name."
}
```

- [ ] **Step 3: Commit**

```bash
git add src/locales/nl.json src/locales/en.json
git commit -m "feat(i18n): add pricingSection keys to nl + en locales"
```

---

## Task 3: Create PricingSection.jsx

**Files:**
- Create: `src/components/PricingSection.jsx`

This is the main component. It replicates glass-v4.html as React with Framer Motion.

- [ ] **Step 1: Create the file**

Create `src/components/PricingSection.jsx` with this full content:

```jsx
// src/components/PricingSection.jsx
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { packages, serviceCategories } from '../config/services'
import { addOns } from '../config/pricing'

// ── SVG icon map (outline only) ──────────────────────────────
const ICONS = {
  brush: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 13.5V19a2 2 0 002 2h5.5M22 6l-4-4-9 9v4h4l9-9z"/>
      <path d="M14 4l4 4"/>
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="8" cy="14" r="1.5"/>
      <circle cx="10" cy="9" r="1.5"/>
      <circle cx="15" cy="9" r="1.5"/>
      <circle cx="16.5" cy="14" r="1.5"/>
    </svg>
  ),
  design_services: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  photo_camera: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1"/>
    </svg>
  ),
  web: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  manage_search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  rocket_launch: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/>
    </svg>
  ),
  trending_up: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 9 18 21 6 21 2 9 12 2"/>
    </svg>
  ),
  build: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
}

// ── Validation (security-aware) ───────────────────────────────
const SQL_RE      = /(\b(select|insert|update|delete|drop|union|exec|script|alert|eval|where|from|having|cast|convert|declare|xp_)\b|--|;|\/\*|\*\/|<[^>]*>)/i
const SAFE_NAME   = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'\-.]{2,60}$/
const SAFE_COMPANY= /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s'\-.&,]{1,80}$/
const SAFE_TEL    = /^[\+\d\s\-()]{8,20}$/
const EMAIL_RE    = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

function makeValidators(t) {
  return {
    naam: (v) => {
      if (!v) return null
      if (v.length < 2) return t('pricingSection.errNaamShort')
      if (SQL_RE.test(v)) return t('pricingSection.errInjection')
      if (!SAFE_NAME.test(v)) return t('pricingSection.errNaamChars')
      return true
    },
    bedrijf: (v) => {
      if (!v) return null
      if (SQL_RE.test(v)) return t('pricingSection.errInjection')
      if (!SAFE_COMPANY.test(v)) return t('pricingSection.errBedrijfChars')
      return true
    },
    email: (v) => {
      if (!v) return null
      if (SQL_RE.test(v)) return t('pricingSection.errInjection')
      if (!EMAIL_RE.test(v)) return t('pricingSection.errEmailInvalid')
      if (v.length > 120) return t('pricingSection.errEmailLong')
      return true
    },
    tel: (v) => {
      if (!v) return null
      if (/[a-zA-Z]/.test(v)) return t('pricingSection.errTelLetters')
      if (!SAFE_TEL.test(v)) return t('pricingSection.errTelChars')
      if (v.replace(/\D/g, '').length < 8) return t('pricingSection.errTelShort')
      return true
    },
    notes: (v) => {
      if (!v) return null
      if (SQL_RE.test(v)) return t('pricingSection.errInjection')
      if (v.length < 10) return t('pricingSection.errNotesShort')
      if (v.length > 1000) return t('pricingSection.errNotesLong')
      return true
    },
  }
}

// ── Sub-components ────────────────────────────────────────────

function FieldIcon({ state }) {
  // state: null | 'valid' | 'invalid'
  if (!state) return null
  const isValid = state === 'valid'
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className="absolute right-[11px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full flex items-center justify-center pointer-events-none"
      style={{
        background: isValid
          ? 'linear-gradient(135deg,#22c55e,#16a34a)'
          : 'linear-gradient(135deg,#ef4444,#dc2626)',
      }}
    >
      <svg viewBox="0 0 24 24" className="w-[9px] h-[9px]" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {isValid
          ? <polyline points="20 6 9 17 4 12"/>
          : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
        }
      </svg>
    </motion.div>
  )
}

function TextareaIcon({ state }) {
  if (!state) return null
  const isValid = state === 'valid'
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className="absolute right-[11px] bottom-[11px] w-[18px] h-[18px] rounded-full flex items-center justify-center pointer-events-none"
      style={{
        background: isValid
          ? 'linear-gradient(135deg,#22c55e,#16a34a)'
          : 'linear-gradient(135deg,#ef4444,#dc2626)',
      }}
    >
      <svg viewBox="0 0 24 24" className="w-[9px] h-[9px]" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {isValid
          ? <polyline points="20 6 9 17 4 12"/>
          : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
        }
      </svg>
    </motion.div>
  )
}

// ── Field input with validation display ──────────────────────
function ValidatedField({ label, required, children }) {
  return (
    <div className="flex flex-col gap-[7px]">
      <label className="text-[9px] font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--color-text-faint)' }}>
        {label}
        {required && <span className="ml-[2px]" style={{ color: 'var(--color-secondary)' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

// ── Glass block wrapper ───────────────────────────────────────
function Block({ children, className = '' }) {
  return (
    <div
      className={`rounded-[20px] p-6 ${className}`}
      style={{
        background: 'rgba(18,15,32,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(124,58,237,0.18)',
      }}
    >
      {children}
    </div>
  )
}

function StepLabel({ num, text }) {
  return (
    <div className="flex items-center gap-[10px] text-[10px] font-bold tracking-[0.16em] uppercase mb-[18px]" style={{ color: 'var(--color-text-muted)' }}>
      <span
        className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0"
        style={{ background: 'linear-gradient(135deg,#7C3AED,#F97316)' }}
      >
        {num}
      </span>
      {text}
    </div>
  )
}

// ── Service card ──────────────────────────────────────────────
function ServiceCard({ pkg, lang, selected, onSelect, animDelay }) {
  const icon = ICONS[pkg.icon] || ICONS.code
  const price = pkg.price
  const priceNote = pkg.priceNote || ''
  const name = lang === 'nl' ? pkg.nameNL : pkg.name
  const desc = lang === 'nl' ? pkg.descriptionNL : pkg.description

  const gradientBorder = {
    background: 'linear-gradient(rgba(13,10,26,1),rgba(13,10,26,1)) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box',
    border: '1.5px solid transparent',
    boxShadow: '0 0 32px rgba(124,58,237,0.18),inset 0 0 20px rgba(124,58,237,0.04)',
  }
  const defaultBorder = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: selected ? -2 : 0, scale: 1 }}
      transition={{ duration: 0.35, delay: animDelay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={selected ? {} : { y: -4, scale: 1.005 }}
      onClick={onSelect}
      className="rounded-[12px] p-[18px] cursor-pointer relative overflow-hidden"
      style={selected ? gradientBorder : defaultBorder}
    >
      {/* Gradient overlay when selected */}
      {selected && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[12px]"
          style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.06) 0%,rgba(249,115,22,0.03) 100%)' }}
        />
      )}

      {/* Check badge */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="absolute top-[11px] right-[11px] w-[20px] h-[20px] rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#F97316)' }}
          >
            <svg viewBox="0 0 24 24" className="w-[10px] h-[10px]" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon */}
      <div
        className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center mb-3"
        style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)', color: '#C084FC' }}
      >
        <div className="w-[16px] h-[16px]">{icon}</div>
      </div>

      <h4 className="text-[13px] font-bold mb-1" style={{ color: '#C084FC' }}>{name}</h4>
      <p className="text-[11px] leading-[1.5] mb-3" style={{ color: 'var(--color-text-faint)' }}>{desc}</p>
      <div className="text-[16px] font-extrabold" style={{ fontFamily: 'Manrope, sans-serif', fontVariantNumeric: 'tabular-nums' }}>
        €{price.toLocaleString('nl-BE')}
        {priceNote && <span className="text-[10px] font-normal ml-[2px]" style={{ color: 'var(--color-text-faint)' }}>{priceNote}</span>}
      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function PricingSection() {
  const { t, lang } = useLanguage()

  const [selCat, setSelCat] = useState(null)
  const [selPkg, setSelPkg] = useState(null)
  const [pages, setPages] = useState(5)
  const [seoOn, setSeoOn] = useState(false)

  // Form state
  const [form, setForm] = useState({ naam: '', bedrijf: '', email: '', tel: '', notes: '' })
  // touched tracks if user has interacted with a field (for showing errors)
  const [touched, setTouched] = useState({})

  const telRef = useRef(null)

  // Block non-numeric keypress in tel field
  useEffect(() => {
    const el = telRef.current
    if (!el) return
    const handler = (e) => {
      const allowed = /[\d+\s\-()]/
      if (!allowed.test(e.key) && !['Backspace','Delete','Tab','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault()
      }
    }
    el.addEventListener('keypress', handler)
    return () => el.removeEventListener('keypress', handler)
  }, [])

  const validators = makeValidators(t)

  function getFieldState(key) {
    const val = form[key]
    if (!touched[key] && !val) return null  // untouched + empty = neutral
    const result = validators[key](val)
    if (result === null) return null         // empty = neutral
    return result === true ? 'valid' : 'invalid'
  }

  function getFieldError(key) {
    const val = form[key]
    const result = validators[key](val)
    return (typeof result === 'string') ? result : null
  }

  const handleInput = useCallback((key, value) => {
    setForm(f => ({ ...f, [key]: value }))
  }, [])

  const handleBlur = useCallback((key) => {
    setTouched(t => ({ ...t, [key]: true }))
  }, [])

  function selectCat(catId) {
    setSelCat(catId)
    setSelPkg(null)
    setSeoOn(false)
  }

  function selectPkg(pkg) {
    setSelPkg(pkg)
    setSeoOn(false)
    if (pkg.included > 0) {
      setPages(p => Math.min(Math.max(p, 1), 30))
    }
  }

  const EXTRA_PPP = 60

  function calcPrice() {
    if (!selPkg) return null
    if (selPkg.included > 0) {
      const extra = Math.max(0, pages - selPkg.included)
      return selPkg.price + extra * EXTRA_PPP + (seoOn ? pages * addOns.seo.perPage : 0)
    }
    return selPkg.price
  }

  const price = calcPrice()
  const extraPages = selPkg?.included > 0 ? Math.max(0, pages - selPkg.included) : 0
  const sliderPct = ((pages - 1) / 29) * 100

  const catPackages = selCat ? packages[selCat] : []
  const showSlider = selPkg?.included > 0
  const showAddons = selPkg?.hasSeo
  const formStep = showAddons ? 3 : 2

  const inputBase = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '11px 38px 11px 14px',
    fontSize: '13px',
    color: 'var(--color-text)',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
  }

  function getInputStyle(key) {
    const state = getFieldState(key)
    if (state === 'valid') return { ...inputBase, borderColor: 'rgba(34,197,94,0.45)' }
    if (state === 'invalid') return { ...inputBase, borderColor: 'rgba(239,68,68,0.5)' }
    return inputBase
  }

  const seoGradientBorder = {
    background: 'linear-gradient(rgba(14,11,28,1),rgba(14,11,28,1)) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box',
    border: '1px solid transparent',
    boxShadow: '0 0 20px rgba(124,58,237,0.12),inset 0 0 16px rgba(124,58,237,0.04)',
  }
  const seoDefaultBorder = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
  }

  return (
    <section className="py-24 px-8 relative">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed w-[700px] h-[700px] rounded-full -top-[250px] -left-[150px] z-0"
        style={{ background: 'radial-gradient(circle,rgba(124,58,237,0.11) 0%,transparent 68%)' }} />
      <div className="pointer-events-none fixed w-[550px] h-[550px] rounded-full -bottom-[120px] -right-[100px] z-0"
        style={{ background: 'radial-gradient(circle,rgba(249,115,22,0.07) 0%,transparent 68%)' }} />

      <div className="max-w-[1120px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-[560px] mx-auto mb-[52px]">
          <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase mb-[14px]" style={{ color: 'var(--color-secondary)' }}>
            {t('pricingSection.badge')}
          </span>
          <h1
            className="font-extrabold leading-[1.08] mb-[14px]"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(28px,4vw,42px)',
              background: 'linear-gradient(135deg,#7C3AED 0%,#F97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('pricingSection.title')}
          </h1>
          <p className="text-[15px] leading-[1.65]" style={{ color: 'var(--color-text-muted)' }}>
            {t('pricingSection.subtitle')}
          </p>
        </div>

        {/* Layout: left column + sticky sidebar */}
        <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 320px', alignItems: 'start' }}>
          <div className="flex flex-col gap-4">

            {/* Block 1: Category + Cards */}
            <Block>
              <StepLabel num="1" text={t('pricingSection.step1Label')} />

              {/* Category tabs */}
              <div
                className="grid grid-cols-3 gap-2 p-[6px] rounded-[14px] mb-4"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {serviceCategories.map(cat => {
                  const active = selCat === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => selectCat(cat.id)}
                      className="py-3 px-2 text-center rounded-[10px] text-[13px] font-bold cursor-pointer transition-all duration-[250ms]"
                      style={{
                        color: active ? 'var(--color-text)' : 'var(--color-text-faint)',
                        background: active ? 'rgba(124,58,237,0.14)' : 'transparent',
                        border: active ? '1px solid rgba(124,58,237,0.35)' : '1px solid transparent',
                        boxShadow: active ? '0 0 20px rgba(124,58,237,0.1)' : 'none',
                      }}
                    >
                      {lang === 'nl' ? cat.labelNL : cat.labelEN}
                    </button>
                  )
                })}
              </div>

              {/* Empty state */}
              {!selCat && (
                <div className="text-center py-9 px-5">
                  <div
                    className="w-[52px] h-[52px] rounded-full flex items-center justify-center mx-auto mb-[14px]"
                    style={{ background: 'rgba(124,58,237,0.07)', border: '1px dashed rgba(124,58,237,0.22)' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="var(--color-text-faint)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1"/>
                      <rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" rx="1"/>
                      <rect x="14" y="14" width="7" height="7" rx="1"/>
                    </svg>
                  </div>
                  <strong className="block text-[14px] mb-[6px]" style={{ color: 'var(--color-text-muted)' }}>
                    {t('pricingSection.emptyTitle')}
                  </strong>
                  <p className="text-[12px] leading-[1.6]" style={{ color: 'var(--color-text-faint)' }}>
                    {t('pricingSection.emptyText')}
                  </p>
                </div>
              )}

              {/* Cards grid */}
              {selCat && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selCat}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 gap-3 mt-4"
                  >
                    {catPackages.map((pkg, i) => (
                      <ServiceCard
                        key={pkg.id}
                        pkg={pkg}
                        lang={lang}
                        selected={selPkg?.id === pkg.id}
                        onSelect={() => selectPkg(pkg)}
                        animDelay={0.04 + i * 0.065}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Inline page slider */}
              <AnimatePresence>
                {showSlider && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex justify-between items-baseline mb-3">
                        <span className="text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: 'var(--color-text-muted)' }}>
                          {t('pricingSection.sliderLabel')}
                        </span>
                        <span>
                          <span className="text-[13px] font-bold" style={{ color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>
                            {pages} pagina{pages === 1 ? '' : "'s"}
                          </span>
                          <span
                            className="text-[11px] ml-[6px]"
                            style={{ color: extraPages > 0 ? 'var(--color-secondary)' : 'var(--color-text-faint)' }}
                          >
                            {extraPages > 0 ? `· +${extraPages} extra` : t('pricingSection.sliderIncluded')}
                          </span>
                        </span>
                      </div>

                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={pages}
                        onChange={e => setPages(Number(e.target.value))}
                        className="w-full h-[5px] rounded-[3px] outline-none cursor-pointer appearance-none"
                        style={{
                          background: `linear-gradient(to right,#7C3AED ${sliderPct}%,rgba(255,255,255,0.08) ${sliderPct}%)`,
                        }}
                      />

                      <div className="flex justify-between text-[10px] mt-[6px]" style={{ color: 'var(--color-text-faint)' }}>
                        <span>1</span>
                        <span>{selPkg.included} (inbegrepen)</span>
                        <span>30</span>
                      </div>

                      {/* Extra cost badge */}
                      <AnimatePresence>
                        {extraPages > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="inline-flex items-center gap-[6px] mt-[10px] px-3 py-[7px] rounded-[20px] text-[11px] font-semibold"
                            style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: 'var(--color-secondary)' }}
                          >
                            <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="8" x2="12" y2="12"/>
                              <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {extraPages} extra × €{EXTRA_PPP} = +€{(extraPages * EXTRA_PPP).toLocaleString('nl-BE')}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Block>

            {/* Block 2: Add-ons (only when hasSeo) */}
            <AnimatePresence>
              {showAddons && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <Block>
                    <StepLabel num="2" text={t('pricingSection.step2Label')} />
                    <button
                      onClick={() => setSeoOn(v => !v)}
                      className="flex items-center gap-[14px] w-full p-[14px] rounded-[12px] cursor-pointer text-left transition-all duration-200"
                      style={seoOn ? seoGradientBorder : seoDefaultBorder}
                    >
                      {/* Toggle */}
                      <div
                        className="w-[38px] h-[22px] rounded-[11px] relative flex-shrink-0 transition-all duration-200"
                        style={{
                          background: seoOn ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)',
                          border: seoOn ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                          boxShadow: seoOn ? '0 0 10px rgba(124,58,237,0.3)' : 'none',
                        }}
                      >
                        <motion.div
                          animate={{ left: seoOn ? 18 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          className="absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white"
                          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] font-semibold" style={{ color: 'var(--color-text)' }}>
                          {t('pricingSection.seoAddonName')}
                        </div>
                        <div className="text-[11px] mt-[2px]" style={{ color: 'var(--color-text-faint)' }}>
                          {t('pricingSection.seoAddonDesc')}
                        </div>
                      </div>
                      <div className="text-[11px] font-bold whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                        {t('pricingSection.seoAddonPrice')}
                      </div>
                    </button>
                  </Block>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Block 3/2: Contact form */}
            <Block>
              <StepLabel num={formStep} text={t('pricingSection.stepFormLabel')} />

              <div className="grid grid-cols-2 gap-3">

                {/* Naam */}
                <ValidatedField label={t('pricingSection.fieldNaam')} required>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.naam}
                      placeholder={t('pricingSection.placeholderNaam')}
                      autoComplete="name"
                      maxLength={60}
                      onChange={e => handleInput('naam', e.target.value)}
                      onBlur={() => handleBlur('naam')}
                      style={getInputStyle('naam')}
                    />
                    <AnimatePresence mode="wait">
                      {getFieldState('naam') && <FieldIcon key={getFieldState('naam')} state={getFieldState('naam')} />}
                    </AnimatePresence>
                  </div>
                  {touched.naam && getFieldError('naam') && (
                    <p className="text-[10px] mt-[5px] px-[2px]" style={{ color: 'rgba(239,68,68,0.9)' }}>
                      {getFieldError('naam')}
                    </p>
                  )}
                </ValidatedField>

                {/* Bedrijf */}
                <ValidatedField label={t('pricingSection.fieldBedrijf')}>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.bedrijf}
                      placeholder={t('pricingSection.placeholderBedrijf')}
                      autoComplete="organization"
                      maxLength={80}
                      onChange={e => handleInput('bedrijf', e.target.value)}
                      onBlur={() => handleBlur('bedrijf')}
                      style={getInputStyle('bedrijf')}
                    />
                    <AnimatePresence mode="wait">
                      {getFieldState('bedrijf') && <FieldIcon key={getFieldState('bedrijf')} state={getFieldState('bedrijf')} />}
                    </AnimatePresence>
                  </div>
                  {touched.bedrijf && getFieldError('bedrijf') && (
                    <p className="text-[10px] mt-[5px] px-[2px]" style={{ color: 'rgba(239,68,68,0.9)' }}>
                      {getFieldError('bedrijf')}
                    </p>
                  )}
                </ValidatedField>

                {/* Email */}
                <ValidatedField label={t('pricingSection.fieldEmail')} required>
                  <div className="relative">
                    <input
                      type="email"
                      value={form.email}
                      placeholder={t('pricingSection.placeholderEmail')}
                      autoComplete="email"
                      maxLength={120}
                      onChange={e => handleInput('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      style={getInputStyle('email')}
                    />
                    <AnimatePresence mode="wait">
                      {getFieldState('email') && <FieldIcon key={getFieldState('email')} state={getFieldState('email')} />}
                    </AnimatePresence>
                  </div>
                  {touched.email && getFieldError('email') && (
                    <p className="text-[10px] mt-[5px] px-[2px]" style={{ color: 'rgba(239,68,68,0.9)' }}>
                      {getFieldError('email')}
                    </p>
                  )}
                </ValidatedField>

                {/* Telefoon */}
                <ValidatedField label={t('pricingSection.fieldTel')}>
                  <div className="relative">
                    <input
                      ref={telRef}
                      type="tel"
                      value={form.tel}
                      placeholder={t('pricingSection.placeholderTel')}
                      autoComplete="tel"
                      maxLength={20}
                      onChange={e => handleInput('tel', e.target.value)}
                      onBlur={() => handleBlur('tel')}
                      style={getInputStyle('tel')}
                    />
                    <AnimatePresence mode="wait">
                      {getFieldState('tel') && <FieldIcon key={getFieldState('tel')} state={getFieldState('tel')} />}
                    </AnimatePresence>
                  </div>
                  {touched.tel && getFieldError('tel') && (
                    <p className="text-[10px] mt-[5px] px-[2px]" style={{ color: 'rgba(239,68,68,0.9)' }}>
                      {getFieldError('tel')}
                    </p>
                  )}
                </ValidatedField>

                {/* Notes */}
                <div className="col-span-2">
                  <ValidatedField label={t('pricingSection.fieldNotes')}>
                    <div className="relative">
                      <textarea
                        value={form.notes}
                        placeholder={t('pricingSection.placeholderNotes')}
                        rows={3}
                        maxLength={1000}
                        onChange={e => handleInput('notes', e.target.value)}
                        onBlur={() => handleBlur('notes')}
                        style={{
                          ...inputBase,
                          padding: '11px 14px',
                          resize: 'none',
                          ...(getFieldState('notes') === 'valid' && { borderColor: 'rgba(34,197,94,0.45)' }),
                          ...(getFieldState('notes') === 'invalid' && { borderColor: 'rgba(239,68,68,0.5)' }),
                        }}
                      />
                      <AnimatePresence mode="wait">
                        {getFieldState('notes') && <TextareaIcon key={getFieldState('notes')} state={getFieldState('notes')} />}
                      </AnimatePresence>
                    </div>
                    {touched.notes && getFieldError('notes') && (
                      <p className="text-[10px] mt-[5px] px-[2px]" style={{ color: 'rgba(239,68,68,0.9)' }}>
                        {getFieldError('notes')}
                      </p>
                    )}
                  </ValidatedField>
                </div>

              </div>
            </Block>

          </div>

          {/* Sticky sidebar */}
          <div className="sticky top-6">
            <div
              className="rounded-[20px] p-[26px]"
              style={{
                background: 'linear-gradient(160deg,rgba(18,13,38,.88),rgba(10,9,22,.94))',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: '1px solid rgba(124,58,237,0.22)',
                boxShadow: '0 0 50px rgba(124,58,237,0.07),inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              <h3 className="text-[17px] font-extrabold mb-[22px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {t('pricingSection.sidebarTitle')}
              </h3>

              <AnimatePresence mode="wait">
                {!selPkg ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-7 px-3"
                  >
                    <div
                      className="w-[46px] h-[46px] rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ background: 'rgba(124,58,237,0.07)', border: '1px dashed rgba(124,58,237,0.2)' }}
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="var(--color-text-faint)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    </div>
                    <p className="text-[12px] leading-[1.6]" style={{ color: 'var(--color-text-faint)' }}>
                      {t('pricingSection.sidebarEmptyText')}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="filled"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Summary rows */}
                    {[
                      { label: t('pricingSection.sidebarCat'), value: selCat ? serviceCategories.find(c=>c.id===selCat)?.[lang==='nl'?'labelNL':'labelEN'] : '—', hi: false },
                      { label: t('pricingSection.sidebarSvc'), value: lang==='nl' ? selPkg.nameNL : selPkg.name, hi: true },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between items-center py-[7px]">
                        <span className="text-[11px]" style={{ color: 'var(--color-text-faint)' }}>{row.label}</span>
                        <span className="text-[12px] font-semibold" style={{ color: row.hi ? '#C084FC' : 'var(--color-text)' }}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                    {selPkg.included > 0 && (
                      <div className="flex justify-between items-center py-[7px]">
                        <span className="text-[11px]" style={{ color: 'var(--color-text-faint)' }}>{t('pricingSection.sidebarPages')}</span>
                        <span className="text-[12px] font-semibold" style={{ color: 'var(--color-text)' }}>{pages} pagina's</span>
                      </div>
                    )}
                    {seoOn && selPkg.hasSeo && (
                      <div className="flex justify-between items-center py-[7px]">
                        <span className="text-[11px]" style={{ color: 'var(--color-text-faint)' }}>{t('pricingSection.sidebarSeo')}</span>
                        <span className="text-[12px] font-semibold" style={{ color: 'var(--color-text)' }}>+€30/pag.</span>
                      </div>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '14px 0' }} />

                    {/* Features */}
                    <ul className="list-none mb-5">
                      {(lang === 'nl' ? selPkg.features.nl : selPkg.features.en).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] py-1 leading-[1.4]" style={{ color: 'var(--color-text-muted)' }}>
                          <span
                            className="w-[14px] h-[14px] rounded-full flex items-center justify-center flex-shrink-0 mt-[1px]"
                            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.28)' }}
                          >
                            <svg viewBox="0 0 24 24" className="w-2 h-2" fill="none" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '14px 0' }} />

                    {/* Price total */}
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <span className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>
                          {t('pricingSection.sidebarTotal')}
                        </span>
                        <small className="block text-[10px]" style={{ color: 'var(--color-text-faint)' }}>
                          {t('pricingSection.sidebarNote')}
                        </small>
                      </div>
                      <span
                        className="text-[36px] font-black leading-none"
                        style={{ fontFamily: 'Manrope, sans-serif', fontVariantNumeric: 'tabular-nums' }}
                      >
                        €{price?.toLocaleString('nl-BE')}{selPkg.priceNote || ''}
                      </span>
                    </div>

                    <button
                      className="flex items-center justify-center gap-2 w-full py-[15px] rounded-[12px] text-[14px] font-bold text-white cursor-pointer mb-3 transition-all duration-150"
                      style={{
                        background: 'linear-gradient(to right,#7C3AED,#F97316)',
                        border: 'none',
                        boxShadow: '0 4px 24px rgba(124,58,237,0.28)',
                        fontFamily: 'Inter, sans-serif',
                        letterSpacing: '0.02em',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      {t('pricingSection.ctaLabel')}
                      <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] flex-shrink-0" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>

                    <div
                      className="flex items-center gap-2 p-[10px] rounded-[10px] mb-[14px]"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] flex-shrink-0" fill="none" stroke="var(--color-text-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      <span className="text-[11px] leading-[1.4]" style={{ color: 'var(--color-text-faint)' }}>
                        {t('pricingSection.trustText')}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social proof (always visible) */}
              <div className="flex items-center gap-[10px] pt-[14px]" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex">
                  {[
                    { letter: 'M', bg: '#7C3AED' },
                    { letter: 'A', bg: '#F97316' },
                    { letter: 'J', bg: '#6d28d9' },
                  ].map((av, i) => (
                    <div
                      key={i}
                      className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[9px] font-bold text-white -mr-[7px]"
                      style={{ background: av.bg, border: '2px solid #07070d' }}
                    >
                      {av.letter}
                    </div>
                  ))}
                  <div
                    className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[8px] font-bold -mr-[7px]"
                    style={{ background: '#1a1a2e', color: '#acaab1', border: '2px solid #07070d' }}
                  >
                    +12
                  </div>
                </div>
                <p className="text-[11px] leading-[1.4] flex-1" style={{ color: 'var(--color-text-faint)', paddingLeft: '14px' }}>
                  {t('pricingSection.socialProof')}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add range input thumb styles to index.css**

The range slider thumb needs CSS that can't be done inline. In `src/index.css`, add at the end of the file:

```css
/* PricingSection range slider */
.pricing-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #7C3AED;
  border: 2px solid #07070d;
  box-shadow: 0 0 10px rgba(124,58,237,0.5);
  cursor: pointer;
}
.pricing-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #7C3AED;
  border: 2px solid #07070d;
  box-shadow: 0 0 10px rgba(124,58,237,0.5);
  cursor: pointer;
}
```

Then in `PricingSection.jsx`, add `className="pricing-slider"` to the range input element (alongside the existing `className`).

- [ ] **Step 3: Commit**

```bash
git add src/components/PricingSection.jsx src/index.css
git commit -m "feat(pricing): add PricingSection unified component"
```

---

## Task 4: Update PricingPage.jsx

**Files:**
- Modify: `src/pages/PricingPage.jsx`

Remove `PricingTeaser` and the lazy `PricingCalculator`. Replace with `PricingSection`.

- [ ] **Step 1: Rewrite PricingPage.jsx**

Replace the entire content of `src/pages/PricingPage.jsx` with:

```jsx
// src/pages/PricingPage.jsx
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../context/LanguageContext'
import PricingSection from '../components/PricingSection'
import PricingFAQ from '../components/PricingFAQ'

export default function PricingPage() {
  const { t } = useLanguage()

  return (
    <>
      <Helmet>
        <title>{t('pricingPage.seoTitle')}</title>
        <meta name="description" content={t('pricingPage.seoDescription')} />
        <link rel="canonical" href={t('pricingPage.seoCanonical')} />
        <meta property="og:title" content={t('pricingPage.seoTitle')} />
        <meta property="og:description" content={t('pricingPage.seoDescription')} />
        <meta property="og:url" content={t('pricingPage.seoCanonical')} />
        <meta name="twitter:title" content={t('pricingPage.seoTitle')} />
        <meta name="twitter:description" content={t('pricingPage.seoDescription')} />
      </Helmet>
      <main id="main-content" className="relative z-10 pt-20">
        <PricingSection />
        <PricingFAQ />
      </main>
    </>
  )
}
```

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:5173/prijzen` and check:
- Page loads with gradient title "Kies jouw dienst"
- Empty state shown by default (no pre-selection)
- Clicking Design/Development/Fullstack pops in service cards
- Selecting Multi-page Site shows inline page slider
- Slider only shows for multi-page and growth-package
- SEO add-on block appears for multi-page and growth-package only
- SEO add-on gets gradient border when toggled on
- Contact form shows green check / red X on valid / invalid input
- Phone field blocks letter input in real-time
- Sidebar updates live with selected service + price
- No console errors

- [ ] **Step 3: Commit**

```bash
git add src/pages/PricingPage.jsx
git commit -m "feat(pricing-page): replace PricingTeaser+PricingCalculator with PricingSection"
```

---

## Self-Review

**Spec coverage:**
- [x] Category tabs (Design / Development / Fullstack) — Task 3 Step 1
- [x] Empty state before category selection — Task 3 Step 1
- [x] Service cards pop in on category select — Task 3 Step 1 (AnimatePresence + stagger delay)
- [x] Page slider only for multi-page services, INSIDE cards block — Task 3 Step 1 (inline-slider with AnimatePresence)
- [x] Included pages = free, beyond = €60/page extra with badge — Task 3 Step 1 (calcPrice + extraPages badge)
- [x] SEO add-on only for hasSeo services — Task 3 Step 1 (showAddons gate)
- [x] SEO add-on gets gradient border when active — Task 3 Step 1 (seoGradientBorder style)
- [x] Contact form inline (no modal) — Task 3 Step 1 (form inside PricingSection)
- [x] Sticky sidebar with live price + CTA — Task 3 Step 1
- [x] Green check / red X validation — Task 3 Step 1 (FieldIcon + getFieldState)
- [x] SQL injection blocking — Task 3 Step 1 (SQL_RE in validators)
- [x] Phone field blocks letters in real-time — Task 3 Step 1 (keypress handler via useEffect + telRef)
- [x] Gradient title "Kies jouw dienst" — Task 3 Step 1 (h1 with gradient text)
- [x] `included` + `hasSeo` on services.js — Task 1
- [x] i18n keys — Task 2
- [x] PricingTeaser removed from pricing page — Task 4
- [x] PricingCalculator removed from pricing page — Task 4

**Placeholder scan:** None found.

**Type consistency:** `selPkg` is always a package object from `packages[selCat]` — same shape throughout. `getFieldState` returns `null | 'valid' | 'invalid'` consistently. `calcPrice()` returns `number | null`.

**Note:** `PricingCalculator.jsx` and `ServiceRequestModal.jsx` are NOT touched — they remain for the homepage flow (`App.jsx` still mounts `ServiceRequestModal` globally).
