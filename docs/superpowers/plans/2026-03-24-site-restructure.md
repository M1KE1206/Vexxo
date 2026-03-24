# Site Restructure & Interaction Design — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Herstructureer de Vexxo Studio SPA naar twee pagina's (`/` en `/prijzen`) met React Router, scroll-reveal prijskaartjes, consistente navbar hover-effecten, gradient borders en bijgewerkte prijzen.

**Architecture:** React Router v6 voegt client-side routing toe aan de bestaande SPA. `App.jsx` omhult de provider stack met `BrowserRouter` en verdeelt de content over `HomePage` en `PricingPage`. Een nieuw `PricingTeaser` component verzorgt de scroll-locked card reveal op de homepage; dezelfde component verschijnt zonder scroll-lock bovenaan de prijzenpagina.

**Tech Stack:** React 18, React Router DOM v6, Framer Motion, Tailwind CSS, Supabase Auth, react-helmet-async

---

## File Map

| Bestand | Actie | Verantwoordelijkheid |
|---|---|---|
| `src/App.jsx` | Wijzigen | BrowserRouter wrapper, routes, AppDispatcher + HashScrollHandler plaatsing |
| `src/pages/HomePage.jsx` | Aanmaken | Assembleert homepage secties in juiste volgorde |
| `src/pages/PricingPage.jsx` | Aanmaken | Assembleert prijzenpagina + eigen SeoHead |
| `src/components/HashScrollHandler.jsx` | Aanmaken | Herstelt hash-scroll na React Router navigatie |
| `src/components/PricingTeaser.jsx` | Aanmaken | Scroll-locked 3-kaartjes reveal, herbruikbaar |
| `src/components/PricingFAQ.jsx` | Aanmaken | Accordion FAQ sectie |
| `src/components/Navbar.jsx` | Wijzigen | Router Links, hover-systeem, logout knop, scrollspy guard |
| `src/components/PricingCalculator.jsx` | Wijzigen | Gradient borders, button scale, content add-on verwijderen |
| `src/config/pricing.js` | Wijzigen | Nieuwe prijswaarden, timeline keys, content add-on weg |
| `src/locales/nl.json` | Wijzigen | FAQ teksten, prijzenpagina SEO labels |
| `src/locales/en.json` | Wijzigen | FAQ teksten, prijzenpagina SEO labels |

---

## Task 1: react-router-dom installeren

**Files:**
- Modify: `package.json` (automatisch via npm)

- [ ] **Stap 1: Installeer react-router-dom**

```bash
npm install react-router-dom
```

Verwacht output: `added N packages` zonder errors.

- [ ] **Stap 2: Controleer installatie**

```bash
node -e "require('react-router-dom'); console.log('OK')"
```

Verwacht: `OK`

- [ ] **Stap 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-router-dom"
```

---

## Task 2: Pricing config updaten

**Files:**
- Modify: `src/config/pricing.js`

De structuur van named exports blijft identiek — alleen waarden wijzigen + `content` add-on verwijderen + timeline keys hernoemen.

- [ ] **Stap 1: Grep op `"7days"`, `"14days"` en `perPageLabel` in hele codebase**

```bash
grep -rn "7days\|14days" src/
grep -rn "perPageLabel" src/locales/
```

Noteer alle gevonden `7days`/`14days` locaties — die worden bijgewerkt in latere taken. Controleer ook dat `pricing.perPageLabel` al bestaat in nl.json en en.json (wordt gebruikt in PricingTeaser). Als het ontbreekt, voeg het toe in Task 5.

- [ ] **Stap 2: Lees het huidige pricing.js**

Lees `src/config/pricing.js` volledig zodat je de exacte structuur kent voor je iets wijzigt.

- [ ] **Stap 3: Update waarden en verwijder content**

Pas aan in `src/config/pricing.js`:
- `vexxo.base`: `299` → `400`
- `vexxo.perPage`: `49` → `60`
- `addOns`: verwijder de `content` entry volledig
- `timeline` keys: `"7days"` → `"rush"`, `"14days"` → `"fast"`, `"regular"` blijft
- `MIN_PRICE` herberekenen: `vexxo.base + vexxo.perPage` = `460`
- Invariant comment updaten: Vexxo max = 400 + (60+30+40)×30 = €4.300, Freelancer = €7.000 ✓

- [ ] **Stap 4: Visuele check — open browser op `http://localhost:3005`**

De calculator moet laden zonder console errors. Prijzen tonen €400 basis.

- [ ] **Stap 5: Commit**

```bash
git add src/config/pricing.js
git commit -m "feat: update pricing — base €400, rush/fast keys, remove content addon"
```

---

## Task 3: PricingCalculator.jsx updaten

**Files:**
- Modify: `src/components/PricingCalculator.jsx`

- [ ] **Stap 1: Verwijder content state en UI**

In `PricingCalculator.jsx`:
1. Verwijder regel: `const [content, setContent] = useState(false)`
2. In de `addonExtra` berekening, verwijder `+ (content ? addOns.content.perPage : 0)` — behoud enkel `seo ? addOns.seo.perPage : 0`
3. In de add-ons array (rond regel 162–164), verwijder het `content` object uit de array: behoud alleen `{ checked: seo, set: setSeo, obj: addOns.seo }`

- [ ] **Stap 2: Fix `useState("7days")` → default `"regular"`**

Zoek `useState("7days")` in PricingCalculator en vervang door `useState("regular")`. De default is `"regular"` (geen toeslag) — logischer als startpunt voor de gebruiker.

- [ ] **Stap 3: Gradient border op de calculator container**

Het `glass-card` element (`lg:col-span-7`) heeft nu `className="glass-card p-6 md:p-8 rounded-3xl"`. Vervang de border door gradient via inline style:

```jsx
<motion.div
  className="lg:col-span-7 p-6 md:p-8 rounded-3xl space-y-10"
  style={{
    background: "linear-gradient(var(--color-surface-2,#131319), var(--color-surface-2,#131319)) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box",
    border: "1px solid transparent",
  }}
  // ... rest blijft
>
```

- [ ] **Stap 4: Gradient border op Vexxo "Best Value" kaartje**

Het Vexxo card heeft nu een inline `style` met `border: "1px solid rgba(124,58,237,0.35)"` en een gradient background. Vervang door:

```jsx
style={{
  background: "linear-gradient(#0c0c14,#0c0c14) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box",
  border: "1px solid transparent",
}}
```

Verwijder ook de `boxShadow` en de absolute glow div (`<div className="absolute -top-8 -right-8 ...">`) — te decoratief.

- [ ] **Stap 5: Gradient border op actieve timeline knoppen**

In de timeline radio buttons, vervang de actieve klasse van:
```
border-primary/60 bg-primary/8 text-primary
```
naar een inline style conditional:
```jsx
style={tl === key ? {
  background: "linear-gradient(#0e0e13,#0e0e13) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box",
  border: "1px solid transparent",
  transform: "scale(1.03)",
} : {}}
className={`flex flex-col gap-1 p-3 rounded-xl cursor-pointer transition-all ${
  tl === key ? "text-primary" : "border border-outline-variant/30 bg-white/[0.03] text-on-surface-variant hover:border-outline-variant/60 hover:scale-[1.02]"
}`}
```

- [ ] **Stap 6: Scale op service type en add-on knoppen**

Service type buttons: voeg `hover:scale-[1.02]` toe aan de className, en voor geselecteerde: `scale-[1.03]`.

Add-on labels: voeg `hover:scale-[1.01] transition-transform` toe.

- [ ] **Stap 7: Visuele check**

Open `http://localhost:3005` en scroll naar de calculator:
- Geen content add-on rij zichtbaar
- Gradient border zichtbaar om de calculator en het Vexxo kaartje
- Timeline knoppen: bij selectie kleine scale + gradient border
- Geen console errors

- [ ] **Stap 8: Commit**

```bash
git add src/components/PricingCalculator.jsx
git commit -m "feat: calculator gradient borders, remove content addon, button scale"
```

---

## Task 4: ServiceRequestModal — timeline key fix

**Files:**
- Modify: `src/components/ServiceRequestModal.jsx` (en `src/context/ModalContext.jsx` voor JSDoc)

- [ ] **Stap 1: Lees ServiceRequestModal.jsx**

Zoek alle voorkomens van `"7days"` en `"14days"` (uit de grep van Task 2).

- [ ] **Stap 2: Update string vergelijkingen**

Vervang:
- `"7days"` → `"rush"`
- `"14days"` → `"fast"`

Zowel in conditionele checks als in display-logica.

- [ ] **Stap 3: Update ModalContext.jsx JSDoc comment**

Zoek `timeline: "7days" | "14days" | "regular"` in de JSDoc en vervang door `timeline: "rush" | "fast" | "regular"`.

- [ ] **Stap 4: Commit**

```bash
git add src/components/ServiceRequestModal.jsx src/context/ModalContext.jsx
git commit -m "fix: timeline keys 7days→rush, 14days→fast in modal + jsdoc"
```

---

## Task 5: i18n uitbreiden (FAQ + prijzenpagina SEO)

**Files:**
- Modify: `src/locales/nl.json`
- Modify: `src/locales/en.json`

- [ ] **Stap 1: Voeg FAQ keys toe aan nl.json**

Voeg een `"faq"` sectie toe:

```json
"faq": {
  "badge": "FAQ",
  "title": "Veelgestelde vragen",
  "subtitle": "Alles wat je wil weten over onze prijzen en werkwijze.",
  "q1": "Wat is inbegrepen in de basisprijs?",
  "a1": "De basisprijs omvat het design, de ontwikkeling en de oplevering van je website. Inclusief 1 revisieronde, responsive layout en basis SEO-structuur.",
  "q2": "Hoe lang duurt een gemiddeld project?",
  "a2": "Een standaard website van 5 pagina's is klaar in 1–2 weken. Bij extra pagina's of spoedfactor kan dit variëren.",
  "q3": "Hoeveel revisies zijn inbegrepen?",
  "a3": "1 revisieronde is standaard inbegrepen. Extra revisies kunnen worden bijgeboekt.",
  "q4": "Wat als ik later meer pagina's nodig heb?",
  "a4": "Geen probleem — we voegen extra pagina's toe aan €60 per pagina. Je betaalt enkel voor wat je nodig hebt.",
  "q5": "Hoe verloopt de betaling?",
  "a5": "50% bij opstart, 50% bij oplevering. Betaling via bankoverschrijving."
},
"pricingPage": {
  "seoTitle": "Prijzen — Vexxo Studio",
  "seoDescription": "Transparante prijzen voor premium webdesign. Bekijk onze pakketten en bereken jouw prijs.",
  "seoCanonical": "https://vexxo.be/prijzen"
}
```

- [ ] **Stap 2: Voeg dezelfde keys toe aan en.json**

```json
"faq": {
  "badge": "FAQ",
  "title": "Frequently asked questions",
  "subtitle": "Everything you need to know about our pricing and process.",
  "q1": "What's included in the base price?",
  "a1": "The base price covers design, development and delivery of your website. Includes 1 revision round, responsive layout and basic SEO structure.",
  "q2": "How long does a typical project take?",
  "a2": "A standard 5-page website is delivered in 1–2 weeks. More pages or rush factor may affect timing.",
  "q3": "How many revisions are included?",
  "a3": "1 revision round is included by default. Additional revisions can be added on.",
  "q4": "What if I need more pages later?",
  "a4": "No problem — we add pages at €60 each. You only pay for what you need.",
  "q5": "How does payment work?",
  "a5": "50% upfront, 50% on delivery. Payment by bank transfer."
},
"pricingPage": {
  "seoTitle": "Pricing — Vexxo Studio",
  "seoDescription": "Transparent pricing for premium web design. View our packages and calculate your price.",
  "seoCanonical": "https://vexxo.be/prijzen"
}
```

- [ ] **Stap 3: Commit**

```bash
git add src/locales/nl.json src/locales/en.json
git commit -m "feat: add FAQ and pricing page i18n keys"
```

---

## Task 6: HashScrollHandler component aanmaken

**Files:**
- Create: `src/components/HashScrollHandler.jsx`

- [ ] **Stap 1: Maak het component aan**

```jsx
// src/components/HashScrollHandler.jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Herstelt hash-anchor scroll na React Router navigatie.
 * React Router v6 scrollt niet automatisch naar #hash na route-change.
 * Plaatsing: sibling van <Routes> binnen BrowserRouter.
 */
export default function HashScrollHandler() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = setTimeout(() => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 50)
    return () => clearTimeout(id)
  }, [hash, pathname])

  return null
}
```

- [ ] **Stap 2: Commit**

```bash
git add src/components/HashScrollHandler.jsx
git commit -m "feat: HashScrollHandler for hash-anchor scroll after navigation"
```

---

## Task 7: PricingTeaser component aanmaken

**Files:**
- Create: `src/components/PricingTeaser.jsx`

Dit is het meest complexe component. Het heeft twee modi: scroll-locked reveal (homepage) en directe weergave (prijzenpagina).

- [ ] **Stap 1: Maak het component aan**

```jsx
// src/components/PricingTeaser.jsx
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { vexxo, comparison } from '../config/pricing'

const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

/**
 * Prijsteaser met scroll-locked card reveal.
 *
 * Props:
 *   scrollLock  — boolean, default true. False op /prijzen (bovenaan pagina).
 *   ctaTarget   — string, default "/prijzen". "#calculator" scrollt naar sectie op zelfde pagina.
 */
export default function PricingTeaser({ scrollLock = true, ctaTarget = '/prijzen' }) {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const [step, setStep] = useState(0) // 0=hidden, 1=vexxo, 2=+freelancer, 3=+agency

  const touch = isTouch()
  const doLock = scrollLock && !touch

  // ── Scroll-lock reveal (desktop, homepage only) ──
  useEffect(() => {
    if (!doLock) {
      setStep(3) // alles direct zichtbaar op touch of /prijzen
      return
    }

    let locked = false
    let savedY = 0
    let delta = 0
    const THRESHOLD = 80 // px scroll per stap

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && step < 3) {
          lock()
        }
      },
      { threshold: 0.4 }
    )

    function lock() {
      if (locked) return
      locked = true
      savedY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${savedY}px`
      document.body.style.width = '100%'
      delta = 0
      setStep(1)
      window.addEventListener('wheel', onWheel, { passive: false })
    }

    function unlock() {
      locked = false
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, savedY)
      window.removeEventListener('wheel', onWheel)
    }

    function onWheel(e) {
      e.preventDefault()
      delta += e.deltaY

      if (delta > THRESHOLD && step < 2) {
        setStep(2)
        delta = 0
      } else if (delta > THRESHOLD && step < 3) {
        setStep((s) => {
          const next = s + 1
          if (next >= 3) {
            setTimeout(unlock, 300)
          }
          return next
        })
        delta = 0
      }
    }

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
      if (locked) unlock()
    }
  }, [doLock]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Stap state in effect ──
  useEffect(() => {
    // Herschrijf delta-tracking via ref zodat wheel handler altijd actuele step ziet
  }, [step])

  function handleCta() {
    if (ctaTarget.startsWith('#')) {
      const el = document.querySelector(ctaTarget)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(ctaTarget)
    }
  }

  const cardBase = {
    background: '#0e0e13',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '28px 24px',
    fontFamily: 'Inter, sans-serif',
  }

  const gradientBorder = {
    background: 'linear-gradient(#0e0e13,#0e0e13) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box',
    border: '1px solid transparent',
    borderRadius: '14px',
    padding: '32px 28px',
  }

  const labelStyle = { fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '20px', display: 'block' }
  const priceStyle = { fontSize: '32px', fontWeight: 800, color: '#f9f5fd', lineHeight: 1 }
  const perPageStyle = { fontSize: '12px', color: '#55545b', marginTop: '4px', marginBottom: '24px' }
  const divider = { width: '24px', height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 0 20px' }
  const featureStyle = { fontSize: '12px', color: '#acaab1' }

  return (
    <section ref={sectionRef} id="pricing-teaser" className="py-24 px-8">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <span className="section-label">{t('pricing.badge')}</span>
        <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface">
          {t('pricing.title')}
        </h2>
        <p className="text-on-surface-variant mt-3">{t('pricing.subtitle')}</p>
      </div>

      <div className="max-w-3xl mx-auto flex items-center justify-center gap-6">

        {/* Freelancer — links, tilt -5deg */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={step >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
          transition={{ duration: 0.5, ease: [0.25,0.46,0.45,0.94] }}
          style={{ ...cardBase, transform: 'rotate(-5deg)', flexShrink: 0, width: '200px' }}
        >
          <span style={{ ...labelStyle, color: '#55545b' }}>
            {lang === 'nl' ? comparison.freelancer.labelNL : comparison.freelancer.labelEN}
          </span>
          <div style={{ ...priceStyle, fontSize: '28px' }}>€{comparison.freelancer.base.toLocaleString()}</div>
          <div style={perPageStyle}>+ €{comparison.freelancer.perPage} / {t('pricing.perPageLabel')}</div>
          <div style={divider} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={featureStyle}>{t('pricing.teaser.standardDesign')}</div>
            <div style={featureStyle}>{t('pricing.teaser.basicSeo')}</div>
            <div style={featureStyle}>{t('pricing.teaser.weeks4to6')}</div>
          </div>
        </motion.div>

        {/* Vexxo — midden, recht, gradient border */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={step >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: [0.25,0.46,0.45,0.94] }}
          style={{ ...gradientBorder, flexShrink: 0, width: '220px', position: 'relative', zIndex: 2 }}
        >
          <span style={{ ...labelStyle, color: '#7C3AED' }}>Vexxo Studio</span>
          <div style={priceStyle}>€{vexxo.base.toLocaleString()}</div>
          <div style={perPageStyle}>+ €{vexxo.perPage} / {t('pricing.perPageLabel')}</div>
          <div style={divider} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            <div style={featureStyle}>{t('pricing.teaser.premiumDesign')}</div>
            <div style={featureStyle}>{t('pricing.teaser.fullSeo')}</div>
            <div style={featureStyle}>{t('pricing.teaser.weeks1to2')}</div>
          </div>
          <button
            onClick={handleCta}
            className="w-full btn-primary text-sm py-2.5 group flex items-center justify-center"
          >
            <span>{t('pricing.teaser.cta')}</span>
            <span className="opacity-0 translate-x-[-4px] translate-y-[4px] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 ml-0 group-hover:ml-1.5 text-xs">↗</span>
          </button>
        </motion.div>

        {/* Agency — rechts, tilt +5deg */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={step >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
          transition={{ duration: 0.5, ease: [0.25,0.46,0.45,0.94] }}
          style={{ ...cardBase, transform: 'rotate(5deg)', flexShrink: 0, width: '200px' }}
        >
          <span style={{ ...labelStyle, color: '#55545b' }}>
            {lang === 'nl' ? comparison.agency.labelNL : comparison.agency.labelEN}
          </span>
          <div style={{ ...priceStyle, fontSize: '28px' }}>€{comparison.agency.base.toLocaleString()}</div>
          <div style={perPageStyle}>+ €{comparison.agency.perPage} / {t('pricing.perPageLabel')}</div>
          <div style={divider} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={featureStyle}>{t('pricing.teaser.enterpriseDesign')}</div>
            <div style={featureStyle}>{t('pricing.teaser.dedicatedTeam')}</div>
            <div style={featureStyle}>{t('pricing.teaser.weeks8to12')}</div>
          </div>
        </motion.div>

      </div>

      {/* Link naar /prijzen (alleen op homepage) */}
      {ctaTarget !== '#calculator' && (
        <div className="text-center mt-10">
          <button onClick={handleCta} className="text-sm text-on-surface-variant hover:text-on-surface transition-colors group flex items-center gap-1 mx-auto">
            {t('pricing.teaser.viewAll')}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
          </button>
        </div>
      )}
    </section>
  )
}
```

- [ ] **Stap 2: Voeg teaser i18n keys toe aan nl.json en en.json**

Voeg toe onder `"pricing"`:

```json
"teaser": {
  "cta": "Aan de slag",
  "viewAll": "Bekijk alle pakketten en bereken je prijs",
  "standardDesign": "Standaard design",
  "basicSeo": "Basis SEO",
  "weeks4to6": "4–6 weken",
  "premiumDesign": "Premium design",
  "fullSeo": "Volledige SEO",
  "weeks1to2": "1–2 weken",
  "enterpriseDesign": "Enterprise design",
  "dedicatedTeam": "Dedicated team",
  "weeks8to12": "8–12 weken"
}
```

En in `en.json`:
```json
"teaser": {
  "cta": "Get started",
  "viewAll": "View all packages and calculate your price",
  "standardDesign": "Standard design",
  "basicSeo": "Basic SEO",
  "weeks4to6": "4–6 weeks",
  "premiumDesign": "Premium design",
  "fullSeo": "Full SEO",
  "weeks1to2": "1–2 weeks",
  "enterpriseDesign": "Enterprise design",
  "dedicatedTeam": "Dedicated team",
  "weeks8to12": "8–12 weeks"
}
```

- [ ] **Stap 3: Commit**

```bash
git add src/components/PricingTeaser.jsx src/locales/nl.json src/locales/en.json
git commit -m "feat: PricingTeaser card reveal (scroll-lock fix komt in Task 11)"
```

---

## Task 8: PricingFAQ component aanmaken

**Files:**
- Create: `src/components/PricingFAQ.jsx`

- [ ] **Stap 1: Maak het component aan**

```jsx
// src/components/PricingFAQ.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const FAQ_KEYS = ['1', '2', '3', '4', '5']

export default function PricingFAQ() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" className="py-24 px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label">{t('faq.badge')}</span>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface">
            {t('faq.title')}
          </h2>
          <p className="text-on-surface-variant mt-3">{t('faq.subtitle')}</p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQ_KEYS.map((k) => (
            <div
              key={k}
              style={
                open === k
                  ? {
                      background: 'linear-gradient(#0e0e13,#0e0e13) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box',
                      border: '1px solid transparent',
                      borderRadius: '12px',
                    }
                  : {
                      background: '#0e0e13',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                    }
              }
            >
              <button
                onClick={() => setOpen(open === k ? null : k)}
                className="w-full flex justify-between items-center px-6 py-5 text-left"
                aria-expanded={open === k}
              >
                <span className="text-sm font-bold text-on-surface">{t(`faq.q${k}`)}</span>
                <span
                  className="text-on-surface-variant ml-4 flex-shrink-0 transition-transform duration-200"
                  style={{ transform: open === k ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open === k && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="px-6 pb-5 text-sm text-on-surface-variant leading-relaxed">
                      {t(`faq.a${k}`)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Stap 2: Commit**

```bash
git add src/components/PricingFAQ.jsx
git commit -m "feat: PricingFAQ accordion component"
```

---

## Task 9: Navbar updaten

**Files:**
- Modify: `src/components/Navbar.jsx`

- [ ] **Stap 1: Lees de huidige Navbar.jsx volledig**

Let op: de huidige Navbar importeert `useScrollSpy` met hardcoded `["portfolio", "about", "pricing", "contact"]` en gebruikt `<a href="#">` tags.

- [ ] **Stap 2: Voeg imports toe**

Voeg toe bovenaan:
```jsx
import { Link, useLocation, useNavigate } from 'react-router-dom'
```

Verwijder of vervang `requireAuth` import — wordt niet meer gebruikt in Navbar.

- [ ] **Stap 3: useScrollSpy conditioneel maken**

Vervang:
```jsx
const activeSection = useScrollSpy(["portfolio", "about", "pricing", "contact"]);
```
Door:
```jsx
const { pathname } = useLocation()
const sections = pathname === '/' ? ['portfolio', 'about', 'contact'] : []
const activeSection = useScrollSpy(sections)
```

- [ ] **Stap 4: Nav-links updaten**

`NAV_LINKS` array aanpassen:
```jsx
const NAV_LINKS = [
  { key: "portfolio", href: "/#portfolio", isPage: false },
  { key: "about",     href: "/#about",     isPage: false },
  { key: "pricing",   href: "/prijzen",    isPage: true  },
  { key: "contact",   href: "/#contact",   isPage: false },
]
```

Desktop nav-link render:
```jsx
{NAV_LINKS.map(({ key, href, isPage }) => {
  const isActive = activeSection === key
  return (
    <div key={key} className="relative group">
      <Link
        to={href}
        className={`flex items-center transition-all duration-200 group-hover:scale-[1.06] ${
          isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'
        }`}
      >
        {t(`nav.${key}`)}
        {/* Pijltje enkel voor paginalinks — group zit op de wrapper div */}
        {isPage && (
          <span className="opacity-0 translate-x-[-4px] translate-y-[4px] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 ml-0 group-hover:ml-1 text-[10px]">
            ↗
          </span>
        )}
      </Link>
      {isActive && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
      )}
    </div>
  )
})}

- [ ] **Stap 5: Rechts — nieuwe volgorde (NL|EN → CTA → Logout)**

Desktop right-side vervangen door:
```jsx
<div className="hidden md:flex items-center gap-4">
  {/* Taalwisselaar */}
  <button
    onClick={() => setLang(lang === 'nl' ? 'en' : 'nl')}
    aria-label={lang === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands'}
    className="flex items-center gap-1 text-[11px] font-bold transition-colors hover:text-on-surface-variant"
  >
    <span lang="nl" className={lang === 'nl' ? 'text-on-surface' : 'text-on-surface-variant/40'}>NL</span>
    <span className="text-on-surface-variant/30" aria-hidden="true">|</span>
    <span lang="en" className={lang === 'en' ? 'text-on-surface' : 'text-on-surface-variant/40'}>EN</span>
  </button>

  {/* CTA — altijd zichtbaar, navigeert naar /prijzen */}
  <Link
    to="/prijzen"
    className="btn-primary text-sm px-6 py-2.5 group flex items-center gap-0 hover:gap-1.5 hover:scale-[1.05] transition-all duration-200"
  >
    <span>{t('nav.getStarted')}</span>
    <span className="opacity-0 translate-x-[-4px] translate-y-[4px] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-xs">↗</span>
  </Link>

  {/* Logout — alleen zichtbaar als ingelogd */}
  {user && (
    <button
      onClick={signOut}
      aria-label={t('nav.signOut')}
      className="flex items-center gap-0 text-[#55545b] hover:text-[#ef4444] hover:scale-110 hover:bg-red-500/8 px-2 py-1.5 rounded-lg transition-all duration-250 group"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[80px] group-hover:opacity-100 group-hover:ml-1.5 text-[11px] font-bold transition-all duration-250 whitespace-nowrap">
        {t('nav.signOut')}
      </span>
    </button>
  )}
</div>
```

- [ ] **Stap 6: Mobile menu updaten**

Vervang `<a href>` door `<Link to>` in het mobile menu. Voeg logout toe onder de taalwisselaar (als ingelogd).

- [ ] **Stap 7: Verwijder ongebruikte imports**

`requireAuth` is niet meer nodig in Navbar — verwijder uit de useAuth destructuring.

- [ ] **Stap 8: Visuele check**

- Open `http://localhost:3005`
- Hover over alle nav-links: scale effect aanwezig
- Hover over "Prijzen" en "Aan de slag": ↗ pijltje verschijnt
- Log in → logout icon verschijnt rechts
- Hover over logout: rood, label schuift in

- [ ] **Stap 9: Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: navbar router links, hover system, logout button, scrollspy guard"
```

---

## Task 10: App.jsx herstructureren + pages aanmaken

**Files:**
- Modify: `src/App.jsx`
- Create: `src/pages/HomePage.jsx`
- Create: `src/pages/PricingPage.jsx`

- [ ] **Stap 1: Maak HomePage.jsx aan**

```jsx
// src/pages/HomePage.jsx
import Hero from '../components/Hero'
import Portfolio from '../components/Portfolio'
import PricingTeaser from '../components/PricingTeaser'
import AboutMe from '../components/AboutMe'
import AboutCompany from '../components/AboutCompany'
import Contact from '../components/Contact'

export default function HomePage() {
  return (
    <main id="main-content" className="relative z-10 pt-20">
      <Hero />
      <Portfolio />
      <PricingTeaser scrollLock={true} ctaTarget="/prijzen" />
      <AboutMe />
      <AboutCompany />
      <Contact />
    </main>
  )
}
```

- [ ] **Stap 2: Maak PricingPage.jsx aan**

```jsx
// src/pages/PricingPage.jsx
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../context/LanguageContext'
import { SEO } from '../config/seo'
import PricingTeaser from '../components/PricingTeaser'
import PricingCalculator from '../components/PricingCalculator'
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
        <meta property="og:url" content={t('pricingPage.seoCanonical')} />
      </Helmet>
      <main id="main-content" className="relative z-10 pt-20">
        <PricingTeaser scrollLock={false} ctaTarget="#calculator" />
        <PricingCalculator />
        <PricingFAQ />
      </main>
    </>
  )
}
```

- [ ] **Stap 3: Herstructureer App.jsx**

Vervang de volledige inhoud van `App.jsx`:

```jsx
import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { LanguageProvider } from './context/LanguageContext'
import { ModalProvider } from './context/ModalContext'
import { AuthProvider, _registerDispatch } from './context/AuthContext'
import { useLanguage } from './context/LanguageContext'
import { useModal } from './context/ModalContext'
import { SEO } from './config/seo'
import { Helmet } from 'react-helmet-async'
import StructuredData from './components/StructuredData'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CustomCursor from './components/CustomCursor'
import HashScrollHandler from './components/HashScrollHandler'
import HomePage from './pages/HomePage'
import PricingPage from './pages/PricingPage'

const ServiceRequestModal = lazy(() => import('./components/ServiceRequestModal'))
const AuthModal           = lazy(() => import('./components/AuthModal'))

/** Homepage SEO — taal-aware, leeft binnen LanguageProvider */
function SeoHead() {
  const { lang, t } = useLanguage()
  const isNL = lang === 'nl'
  return (
    <Helmet>
      <html lang={isNL ? 'nl-BE' : 'en-GB'} />
      <title>{t('seo.title')}</title>
      <meta name="description"  content={t('seo.description')} />
      <meta name="keywords"     content={SEO.keywords} />
      <meta name="author"       content={SEO.siteName} />
      <link rel="canonical"     href={SEO.siteUrl} />
      <meta name="robots"       content="index, follow" />
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={SEO.siteUrl} />
      <meta property="og:title"       content={t('seo.title')} />
      <meta property="og:description" content={t('seo.description')} />
      <meta property="og:image"       content={`${SEO.siteUrl}/og-image.png`} />
      <meta property="og:locale"      content={isNL ? SEO.locale : SEO.localeAlt} />
      <meta property="og:site_name"   content={SEO.siteName} />
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={SEO.twitterHandle} />
      <meta name="twitter:title"       content={t('seo.title')} />
      <meta name="twitter:description" content={t('seo.description')} />
      <meta name="twitter:image"       content={`${SEO.siteUrl}/og-image.png`} />
      <link rel="alternate" hreflang="nl" href={`${SEO.siteUrl}/?lang=nl`} />
      <link rel="alternate" hreflang="en" href={`${SEO.siteUrl}/?lang=en`} />
      <link rel="alternate" hreflang="x-default" href={SEO.siteUrl} />
    </Helmet>
  )
}

/**
 * AppDispatcher: registreert de ModalContext dispatch-functie in AuthContext.
 * Zorgt dat requireAuth() na OAuth-redirect de ServiceModal kan openen.
 * NIET VERWIJDEREN — zonder dit werkt de pendingAction flow niet na page reload.
 */
function AppDispatcher() {
  const { openModal } = useModal()
  useEffect(() => {
    _registerDispatch((payload) => {
      if (payload?.action === 'openServiceModal') openModal(payload.data ?? null)
    })
    return () => _registerDispatch(null)
  }, [openModal])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <LanguageProvider>
          <AuthProvider>
            <ModalProvider>
              <AppDispatcher />
              <HashScrollHandler />
              <SeoHead />
              <StructuredData />

              <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary/30 dark">
                <CustomCursor />
                <div className="page-content">
                  <Navbar />
                  <Routes>
                    <Route path="/"        element={<HomePage />} />
                    <Route path="/prijzen" element={<PricingPage />} />
                  </Routes>
                  <Footer />
                  <ScrollToTop />
                </div>

                <Suspense fallback={null}><ServiceRequestModal /></Suspense>
                <Suspense fallback={null}><AuthModal /></Suspense>
              </div>
            </ModalProvider>
          </AuthProvider>
        </LanguageProvider>
      </HelmetProvider>
    </BrowserRouter>
  )
}
```

- [ ] **Stap 4: Verwijder `src/components/PricingCalculator` import uit App.jsx**

Die is nu alleen in `PricingPage.jsx`.

- [ ] **Stap 5: Visuele check**

- Open `http://localhost:3005` — homepage laadt correct (Hero → Portfolio → Teaser → About → Contact)
- Ga naar `http://localhost:3005/prijzen` — prijzenpagina laadt (Teaser zonder lock → Calculator → FAQ)
- Klik "Prijzen" in navbar → navigeert naar `/prijzen` in dezelfde tab
- Klik "Portfolio" vanuit `/prijzen` → gaat terug naar homepage en scrollt naar Portfolio
- Geen console errors

- [ ] **Stap 6: Commit**

```bash
git add src/App.jsx src/pages/HomePage.jsx src/pages/PricingPage.jsx
git commit -m "feat: React Router routing, HomePage and PricingPage"
```

---

## Task 11: Scroll-lock bug-fix — step state in wheel handler

**Files:**
- Modify: `src/components/PricingTeaser.jsx`

De `onWheel` handler in PricingTeaser sluit over `step` state, maar React state is stale in event listeners. Fix via ref:

- [ ] **Stap 1: Fix stale closure op step**

In `PricingTeaser.jsx`, voeg een `stepRef` toe die gesynchroniseerd blijft met `step`:

```jsx
const stepRef = useRef(0)

// In de useEffect, vervang setStep calls:
function advance() {
  stepRef.current += 1
  setStep(stepRef.current)
  delta = 0
  if (stepRef.current >= 3) {
    setTimeout(unlock, 300)
  }
}

function onWheel(e) {
  e.preventDefault()
  delta += e.deltaY
  if (delta > THRESHOLD && stepRef.current < 3) {
    advance()
  }
}
```

Verwijder ook de lege tweede `useEffect` (de comment-only one).

- [ ] **Stap 2: Test scroll-lock flow**

Op desktop:
1. Open `http://localhost:3005`
2. Scroll naar de teaser sectie
3. Pagina vergrendelt bij eerste zichtbaarheid — Vexxo kaartje verschijnt
4. Scroll → Freelancer kaartje
5. Scroll → Agency kaartje
6. Pagina ontgrendelt, scrollen gaat verder

- [ ] **Stap 3: Commit**

```bash
git add src/components/PricingTeaser.jsx
git commit -m "fix: stale closure in scroll-lock wheel handler via stepRef"
```

---

## Task 12: Visuele eindcheck + .superpowers gitignore

- [ ] **Stap 1: Controleer .gitignore op .superpowers/**

```bash
grep -n "superpowers" .gitignore
```

Als niet aanwezig:
```bash
echo ".superpowers/" >> .gitignore
```

- [ ] **Stap 2: Volledige visuele check**

Open `http://localhost:3005` en controleer:

**Homepage:**
- [ ] Hero zichtbaar
- [ ] Portfolio zichtbaar
- [ ] Prijsteaser: scroll-lock actief, kaartjes ontvouwen stap voor stap
- [ ] About Me en About Company aanwezig
- [ ] Contact aanwezig
- [ ] Geen PricingCalculator op homepage

**Navbar:**
- [ ] Hover op alle links: scale ×1.06
- [ ] Hover op Prijzen en Aan de slag: ↗ pijltje
- [ ] Login → logout icon rechts zichtbaar, grijs → rood bij hover
- [ ] NL|EN links van Aan de slag knop

**Prijzenpagina (`/prijzen`):**
- [ ] Kaartjes direct zichtbaar (geen scroll-lock)
- [ ] PricingCalculator: gradient border zichtbaar
- [ ] Best Value kaartje: gradient border
- [ ] Timeline knoppen: gradient + scale bij selectie
- [ ] Geen content add-on rij
- [ ] FAQ: accordion werkt, open item heeft gradient border
- [ ] Browser tab toont "Prijzen — Vexxo Studio"

**Navigatie:**
- [ ] Klik "Portfolio" vanuit `/prijzen` → scrollt naar Portfolio op homepage
- [ ] Klik "Aan de slag" op homepage → navigeert naar `/prijzen`

- [ ] **Stap 3: Final commit**

```bash
git add .gitignore
git commit -m "chore: add .superpowers to gitignore"
```
