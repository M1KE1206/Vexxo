# Site Restructure & Interaction Design

**Date:** 2026-03-24
**Status:** Approved
**Scope:** Multi-page routing, prijzenpagina, scroll-reveal kaartjes, navbar hover-systeem, gradient border tokens, pricing update

---

## 1. Sitestructuur

### Huidige situatie
Één SPA met anchor-navigatie (#portfolio, #about, #pricing, #contact). Alle content op één scrollbare pagina.

### Nieuwe situatie
Twee pagina's via React Router:

| Route | Pagina | Secties |
|---|---|---|
| `/` | Homepage | Hero → Portfolio → Prijzenteaser → Over ons → Contact |
| `/prijzen` | Prijzenpagina | Scroll-reveal kaartjes → Calculator → FAQ |

**Belangrijk:** De `PricingCalculator` sectie verdwijnt van de homepage. In de plaats komt een `PricingTeaser` component met de 3 scroll-locked kaartjes + een "Bekijk volledige prijzen →" link naar `/prijzen`.

De volgorde op de homepage wijzigt: de prijzenteaser staat **vóór** de Over ons sectie (Wie zit er achter Vexxo Studio).

---

## 2. Routing

- **Package:** `react-router-dom` toevoegen
- **Provider nesting in `App.jsx`** — `BrowserRouter` omhult de volledige provider stack:
  ```jsx
  <BrowserRouter>
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <ModalProvider>
            {/*
              AppDispatcher: registreert de ModalContext dispatch-functie in AuthContext
              zodat requireAuth() na OAuth-redirect de ServiceModal kan openen.
              NIET VERWIJDEREN — zonder dit werkt de pendingAction flow niet na page reload.
              Zie src/context/AuthContext.jsx (_registerDispatch) voor de volledige uitleg.
            */}
            <AppDispatcher />
            <HashScrollHandler />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/prijzen" element={<PricingPage />} />
            </Routes>
          </ModalProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  </BrowserRouter>
  ```
- Navbar "Prijzen"-link: `<Link to="/prijzen">` via react-router-dom (geen anchor meer)
- Alle overige nav-links op homepage blijven anchors (`#portfolio`, `#about`, `#contact`)
- Op `/prijzen` navigeren de anchor-links via `<Link to="/#portfolio">` etc. React Router v6 scrollt **niet** automatisch naar de hash na navigatie. Oplossing: een `HashScrollHandler` component dat na elke route-change de hash uitleest en scrollt:
  ```jsx
  // src/components/HashScrollHandler.jsx
  import { useEffect } from 'react'
  import { useLocation } from 'react-router-dom'

  export default function HashScrollHandler() {
    const { hash, pathname } = useLocation()
    useEffect(() => {
      if (!hash) return
      // Geef de pagina even tijd om te renderen voor we scrollen
      const id = setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 50)
      return () => clearTimeout(id)
    }, [hash, pathname])
    return null
  }
  ```
  `HashScrollHandler` wordt als sibling van `<Routes>` in `App.jsx` geplaatst (binnen `BrowserRouter`)

---

## 3. PricingTeaser component (nieuw)

Herbruikbaar component, gebruikt op zowel homepage als prijzenpagina.

### Scroll-lock reveal gedrag

**Props:**
- `scrollLock?: boolean` — default `true` op homepage, `false` op `/prijzen` (bovenaan pagina = geen lock-effect)

**Desktop (niet-touch):**
1. Sectie scrollt in beeld → scroll-lock actief via `position: fixed` op body + opgeslagen `scrollY` (iOS-safe)
2. **Stap 1:** Vexxo kaartje verschijnt (fadeUp, center)
3. **Stap 2:** Scroll-delta > threshold → Freelancer kaartje schuift in vanuit links
4. **Stap 3:** Scroll-delta > threshold → Agency kaartje schuift in vanuit rechts
5. Alle 3 kaartjes zichtbaar → `position: fixed` verwijderd, `window.scrollTo` hersteld

**Touch/mobile:** Scroll-lock wordt volledig overgeslagen (`window.matchMedia('(hover: none)')` check). Kaartjes verschijnen via gewone Framer Motion `whileInView` animaties zonder lock.

Implementatie via `IntersectionObserver` + wheel/touch event listener.

### Kaartje design
- **Achtergrond:** `#0e0e13` (solid, geen gradient)
- **Border standaard:** `1px solid rgba(255,255,255,0.08)`
- **Freelancer:** `transform: rotate(-5deg)` — gekanteld naar links
- **Agency:** `transform: rotate(5deg)` — gekanteld naar rechts
- **Vexxo (center):** recht, gradient border:
  ```css
  background: linear-gradient(#0e0e13,#0e0e13) padding-box,
              linear-gradient(135deg,#7C3AED,#F97316) border-box;
  border: 1px solid transparent;
  ```
- Label kleur Vexxo: `#7C3AED`, anderen: `#55545b`

### CTA knop (Vexxo kaartje)
- Klikt door naar `/prijzen` — navigeert naar prijzenpagina, **geen** auth gate op dit niveau
- Rust: gradient achtergrond, geen pijltje, normale grootte
- Hover: `transform: scale(1.05)` + ↗ icoon schuift in (`opacity: 0 → 1`, `translate(-4px,4px) → (0,0)`)

---

## 4. Navbar

### Nieuwe volgorde (desktop, rechts)
```
NL|EN  →  [Aan de slag ↗]  →  [logout icon]
```

### useScrollSpy
Navbar gebruikt `useLocation()` om de route te detecteren:
```jsx
const { pathname } = useLocation()
const sections = pathname === '/' ? ['portfolio', 'about', 'contact'] : []
const activeSection = useScrollSpy(sections)
```
- Op `/`: actief voor `['portfolio', 'about', 'contact']` — `'pricing'` uit de lijst want die sectie verdwijnt
- Op `/prijzen`: lege array doorgeven → scroll listener registreert niets, geen performance leak, geen crash

### Alle nav-links omzetten naar router Links
Alle `<a href="#">` in Navbar worden `<Link>` of `<NavLink>` van react-router-dom:
- Portfolio / Over ons / Contact → `<Link to="/#portfolio">` etc.
- Prijzen → `<Link to="/prijzen">`

### Hover-systeem — alle links
Alle nav-links (Portfolio, Over ons, Prijzen, Contact) krijgen `transform: scale(1.06)` bij hover voor consistentie.

### Pagina-links (navigeert naar andere route)
"Prijzen" en "Aan de slag" krijgen **extra** het ↗ pijltje bij hover:
- Pijltje in rust: `opacity: 0`, `transform: translate(-4px, 4px)`
- Pijltje bij hover: `opacity: 1`, `transform: translate(0, 0)`, `margin-left: 3–5px`

### Logout knop
- Zichtbaar **alleen** als `user` niet null is (ingelogd)
- Rust: SVG logout-icoon, kleur `#55545b`, transparante achtergrond
- Hover: kleur `→ #ef4444`, `transform: scale(1.1)`, achtergrond `rgba(239,68,68,0.08)`, "Uitloggen" label schuift in (`max-width: 0 → 80px`)
- Wanneer niet ingelogd: logout knop volledig verborgen (geen lege ruimte)

### "Aan de slag" knop — auth flow
- Altijd zichtbaar (ook als ingelogd) — navigeert naar `/prijzen` voor zowel ingelogde als uitgelogde gebruikers
- **Geen** `requireAuth` meer op deze knop — de auth gate zit downstream in `PricingCalculator` en `PricingTeaser` CTA
- Huidige `user ? <signOut> : <CTA>` conditie in Navbar **vervalt** — nieuwe layout toont altijd de CTA knop + apart logout icon
- `requireAuth({ action: 'openServiceModal' })` blijft intact in `PricingCalculator` en in de `PricingTeaser` CTA knop

---

## 5. Prijzenpagina (`/prijzen`)

### Secties
1. **Scroll-reveal kaartjes** — `PricingTeaser` met `scrollLock={false}` (bovenaan pagina, lock heeft hier geen zin)
2. **PricingCalculator** — bestaande component, gradient border wijzigingen (zie §6)
3. **FAQ** — nieuwe sectie

### PricingTeaser CTA — gedrag per context
| Context | CTA knop doet |
|---|---|
| Homepage (`/`) | Navigeert naar `/prijzen` |
| Prijzenpagina (`/prijzen`) | Scrollt smooth naar `#calculator` sectie op dezelfde pagina |

`PricingTeaser` accepteert een `ctaTarget?: string` prop — default `"/prijzen"` (router navigate), of `"#calculator"` (scroll).

### SEO per route
- `/` — bestaande `SeoHead` met homepage title/description/canonical
- `/prijzen` — eigen `SeoHead` instantie in `PricingPage.jsx`:
  - title: `"Prijzen — Vexxo Studio"`
  - description: vertaald via i18n
  - canonical: `https://vexxo.be/prijzen`

### FAQ inhoud (voorbeeldvragen, uitwerken in i18n)
- Wat is inbegrepen in de basisprijs?
- Hoe lang duurt een gemiddeld project?
- Hoeveel revisies zijn inbegrepen?
- Wat als ik meer pagina's nodig heb later?
- Hoe verloopt de betaling?

---

## 6. Design tokens — gradient border

Overal waar nu een paarse of hover-border zit, wordt dit vervangen door een **standaard gradient border**:

```css
/* Gradient border patroon */
background:
  linear-gradient(var(--color-surface-2), var(--color-surface-2)) padding-box,
  linear-gradient(135deg, #7C3AED, #F97316) border-box;
border: 1px solid transparent;
```

**Toepassingen:**
- Vexxo kaartje in PricingTeaser
- "Best Value" / highlighted kaartje in PricingCalculator
- PricingCalculator container zelf (was: paarse border op hover → nu standaard)
- Timeline selector in PricingCalculator (was: paarse border op actief → nu gradient)

### Selecteerbare knoppen in calculator
Alle knoppen die je kan selecteren (pakket, add-ons, timeline) krijgen:
- Selectie: `transform: scale(1.03)` + gradient border
- Hover: `transform: scale(1.02)`
- Transitie: `all 0.2s ease`

---

## 7. Pricing update

De bestaande named exports in `src/config/pricing.js` blijven behouden zodat `PricingCalculator` niet breekt. Alleen de **waarden** wijzigen + `content` add-on verwijderd.

**Structuur blijft identiek, inclusief `comparison` export en `labelEN`/`labelNL` velden:**

```js
// src/config/pricing.js — waarden aanpassen, structuur 1-op-1 behouden
export const vexxo      = { base: 400, perPage: 60 }   // was: 299 / 49

export const comparison = {
  agency:     { base: 2000, perPage: 400, labelEN: 'Agency',     labelNL: 'Agency'     },
  freelancer: { base: 1000, perPage: 200, labelEN: 'Freelancer', labelNL: 'Freelancer' },
}

export const addOns = {
  // content: verwijderd — te vaag, buiten scope
  seo: { label: 'seo', perPage: 30 },
}

export const timeline = {
  // Key "7days" hernoemd naar "rush" — zie breaking change note hieronder
  rush:    { label: 'rush',    perPage: 40 },
  fast:    { label: 'fast',    perPage: 15 },
  regular: { label: 'regular', perPage: 0  },
}

export const MIN_PRICE = vexxo.base + vexxo.perPage  // €460
```

**⚠️ Breaking change: timeline key `"7days"` → `"rush"`**
- `PricingCalculator` default state `useState("7days")` → `useState("rush")`
- `ServiceRequestModal` en eventuele Supabase payloads die de string `"7days"` vergelijken → updaten naar `"rush"`
- Audit: grep op `"7days"` in de hele codebase voor implementatie

**`PricingCalculator.jsx` moet ook:**
- `content` state (`const [content, setContent]`) verwijderen
- `addOns.content.perPage` uit prijsberekening verwijderen
- Content add-on UI rij verwijderen

**Pricing invariant check** (max settings: 30 pagina's + SEO + rush):
- Vexxo: 400 + (60+30+40)×30 = **€4.300**
- Freelancer: 1000 + 200×30 = **€7.000** ✓

---

## 8. Nieuwe componenten & gewijzigde bestanden

| Bestand | Actie | Omschrijving |
|---|---|---|
| `src/pages/HomePage.jsx` | Nieuw | Assembleert homepage secties |
| `src/pages/PricingPage.jsx` | Nieuw | Assembleert prijzenpagina + eigen SeoHead |
| `src/components/PricingTeaser.jsx` | Nieuw | Scroll-reveal kaartjes, `scrollLock` prop |
| `src/components/PricingFAQ.jsx` | Nieuw | FAQ sectie voor prijzenpagina |
| `src/components/Navbar.jsx` | Gewijzigd | Router Links, hover-systeem, logout, scrollspy guard |
| `src/components/PricingCalculator.jsx` | Gewijzigd | Gradient borders, button scale, content add-on weg |
| `src/config/pricing.js` | Gewijzigd | Nieuwe waarden, content add-on verwijderd |
| `src/App.jsx` | Gewijzigd | React Router BrowserRouter + routes |
| `src/locales/nl.json` + `en.json` | Gewijzigd | FAQ teksten, prijzenpagina SEO labels |

---

## 9. Out of scope

- "Hoe het werkt" pagina — apart traject
- Supabase / backend wijzigingen
- Mobile menu redesign (anchor links werken via `Link to="/#section"`)
- Mobile scroll-lock (degradeert naar whileInView animaties op touch devices)
