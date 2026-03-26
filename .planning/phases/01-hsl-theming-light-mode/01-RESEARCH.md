# Phase 1: HSL Theming & Light Mode - Research

**Researched:** 2026-03-26
**Domain:** CSS custom properties (HSL), React context wiring, Framer Motion icon animation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Light mode background: licht lila-getint (~`#F5F3FA`) — niet wit, niet crème.
- **D-02:** Primaire tekst light mode: diep donker `#1A1625` — WCAG AA compliant.
- **D-03:** Glass cards blijven herkenbaar in light mode — licht lila-witte tint, backdrop-filter blur behouden.
- **D-04:** CTA gradient light mode: `#6D28D9` → `#EA6808` (dieper dan dark mode voor contrast).
- **D-05:** Toggle gebruikt Material Symbols Outlined: `light_mode` (zon) bij dark, `dark_mode` (maan) bij light. Geen emoji's.
- **D-06:** Positie: links van taalschakelaar. Rechter Navbar-volgorde: `[thema-icoon] [NL/EN] [CTA]`.
- **D-07:** Icoon-wisselanimatie: 360° rotate bij klik via Framer Motion, past `useReducedMotion` toe.
- **D-08:** CSS `transition` op kleur-properties: duur 350–400ms.
- **D-09:** Transitie via `transition: color 350ms ease, background-color 350ms ease, border-color 350ms ease` op `:root` — geen `all` shorthand.

### Claude's Discretion

- **HSL token schrijfstijl:** `--color-bg: 240 25% 4%` (geen `hsl()` wrapper op variabele, alleen bij gebruik: `background: hsl(var(--color-bg))`). Tailwind-stijl.
- **Exacte HSL waarden:** Claude bepaalt op basis van huidige HEX waarden en CLAUDE.md token systeem.
- **`useTheme` guard:** Aanpassen naar `throw new Error(...)` patroon van `useLanguage` is Claude's keuze.

### Deferred Ideas (OUT OF SCOPE)

Geen — discussie bleef binnen fase-scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| THEME-01 | Alle thema-kleuren zijn gedefinieerd als HSL custom properties in index.css (geen hardcoded HEX/RGB voor thema-waarden) | HSL channel-only schrijfstijl gedocumenteerd; volledige token mapping in UI-SPEC aanwezig |
| THEME-02 | Light mode is volledig werkend via data-theme attribuut op `<html>` | ThemeContext schrijft al `data-theme` op `document.documentElement`; CSS `[data-theme="light"]` selector blok te voegen in index.css |
| THEME-03 | ThemeContext is aangesloten in App.jsx en togglet zichtbaar tussen dark/light | ThemeProvider bestaat maar ontbreekt in App.jsx provider-stack; integratiepunt exact geïdentificeerd |
| THEME-04 | Light mode toggle is bereikbaar via de Navbar | Navbar right-group anatomie geïdentificeerd; insertiepunt vóór bestaande language switcher op regel 106–116 |
| THEME-05 | Thema-keuze wordt bewaard in localStorage en hersteld bij paginalading | ThemeContext.jsx implementeert localStorage key `vexxo-theme` en `prefers-color-scheme` fallback al volledig |
</phase_requirements>

---

## Summary

Phase 1 is een pure CSS-plus-wiring fase — er is geen nieuwe technologie nodig. Alle benodigde infrastructuur bestaat al: ThemeContext is volledig gebouwd (localStorage, data-theme, toggle), Material Symbols zijn geladen, useReducedMotion is beschikbaar via Framer Motion. De enige echte implementatiearbeid is (1) index.css herschrijven naar HSL channels, (2) een `[data-theme="light"]` overrides-blok toevoegen, (3) ThemeProvider in App.jsx wrappen, en (4) de toggle-knop in Navbar invoegen.

De grootste valkuil is het Tailwind color system: `tailwind.config.ts` definieert kleuren als hardcoded HEX strings (bijv. `background: "#0e0e13"`). Tailwind Utilities zoals `bg-background` en `text-on-surface` resolven naar die hardcoded waarden — ze reageren NIET automatisch op CSS custom property veranderingen tenzij de config ook op variabelen wordt gezet. In `App.jsx` staat `className="... bg-background text-on-surface"` wat Tailwind-utilities zijn. Dit is een actief knelpunt dat in plan 01-01 opgelost moet worden.

De token-naamgeving in `index.css` wijkt af van CLAUDE.md. CLAUDE.md beschrijft `--color-bg`, `--color-surface`, etc., maar de werkelijke `index.css` gebruikt `--background`, `--surface`, `--on-surface`, enz. De UI-SPEC heeft al de CLAUDE.md-stijl namen gekozen voor de migratiedoelstelling. De planner moet dit expliciete rename meenemen en alle verwijzingen in componenten (Tailwind classes, inline CSS references) dienovereenkomstig bijwerken.

**Primary recommendation:** Voer de HSL-migratie uit in één gecoördineerde stap per plan: plan 01-01 pakt index.css CSS-custom-properties aan (inclusief Tailwind config), plan 01-02 voegt de `[data-theme="light"]` blok toe, en plan 01-03 wired de context en toggle.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | reeds in project | Icoon rotate-animatie, `useReducedMotion` | Verplicht per CLAUDE.md voor alle entrance-animaties |
| React context API | n/a (built-in) | ThemeContext state management | Consistent patroon reeds gebruikt voor Language + Modal |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Material Symbols Outlined | reeds geladen via `<link>` in index.html | `light_mode` / `dark_mode` iconen | Al beschikbaar, geen extra install |
| localStorage (browser API) | n/a | Thema persistentie | Al geïmplementeerd in ThemeContext |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS `[data-theme]` selector | Tailwind `dark:` class variant | `dark:` vereist `darkMode: "selector"` in tailwind config + class toggling; data-theme is flexibeler en al geïmplementeerd in ThemeContext |
| HSL channel-only variabelen | `hsl()` wrapper op variabele | Channel-only stijl (`240 25% 4%`) laat alpha-varianten toe: `hsl(var(--color-bg) / 0.5)`. Besloten in D-discretion. |

**Installation:** Geen nieuwe packages nodig.

---

## Architecture Patterns

### Recommended Project Structure

Geen structurele wijzigingen — alle werk zit in bestaande bestanden:

```
src/
  index.css              ← HSL migratie + [data-theme="light"] blok
  App.jsx                ← ThemeProvider toevoegen aan provider-stack
  context/
    ThemeContext.jsx      ← useTheme guard toevoegen
  components/
    Navbar.jsx            ← toggle-knop invoegen
  locales/
    en.json              ← 2 nieuwe i18n sleutels
    nl.json              ← 2 nieuwe i18n sleutels
```

### Pattern 1: HSL Channel-Only Custom Properties

**What:** CSS custom properties bevatten alleen de H S L waarden (zonder `hsl()` wrapper). De wrapper wordt pas bij gebruik toegevoegd.

**When to use:** Altijd voor thema-kleuren. Maakt alpha-varianten mogelijk zonder extra variabele.

```css
/* Definitie in :root */
--color-bg: 240 25% 4%;
--color-text: 270 67% 96%;
--primary: 262 82% 57%;

/* Gebruik in CSS */
background: hsl(var(--color-bg));
color: hsl(var(--color-text));

/* Alpha variant — geen extra variabele nodig */
background: hsl(var(--primary) / 0.08);
border-color: hsl(var(--primary) / 0.3);
```

### Pattern 2: data-theme Override Block

**What:** Light mode waarden als complete override van de `:root` tokens. Geen klasse-toggling, geen JS-stijl-injecties.

**When to use:** Altijd voor thema-switches. De `ThemeContext` schrijft `data-theme="light"` op `<html>` — de CSS reageert automatisch.

```css
/* Volledig licht palet — overschrijft :root waarden */
[data-theme="light"] {
  --color-bg:     270 20% 97%;
  --color-surface: 270 18% 94%;
  --color-text:   256 30% 12%;
  /* ... alle tokens */
}
```

### Pattern 3: Framer Motion Icoon Rotate via key-prop

**What:** De `key` prop op een `<motion.span>` wordt ingesteld op de huidige thema-waarde. Wanneer het thema verandert, gooit React het element weg en maakt een nieuwe instantie — dit triggert de `animate` prop opnieuw.

**When to use:** Voor eenmalige animaties die herhaald moeten worden bij een state-wijziging (niet bij mount).

```jsx
// Source: CONTEXT.md D-07, UI-SPEC Component Contract
import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

const prefersReduced = useReducedMotion()

<motion.span
  key={theme}
  animate={prefersReduced ? {} : { rotate: 360 }}
  transition={{ duration: 0.35, ease: 'easeOut' }}
  className="material-symbols-outlined"
  style={{ fontSize: '20px', display: 'inline-block' }}
>
  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
</motion.span>
```

### Pattern 4: Provider-Stack Volgorde in App.jsx

**What:** ThemeProvider wordt gewrapped binnen HelmetProvider, buiten LanguageProvider en AuthProvider. ThemeProvider heeft geen dependencies op andere providers.

**When to use:** Altijd. ThemeProvider moet buiten taalcontext zijn, maar `SeoHead` (die useLanguage aanroept) moet binnen LanguageProvider blijven.

```jsx
// Huidige App.jsx volgorde + ThemeProvider invoeging:
<BrowserRouter>
  <HelmetProvider>
    <ThemeProvider>          {/* NIEUW — wraps alles */}
      <LanguageProvider>
        <AuthProvider>
          <ModalProvider>
            {/* ... rest ongewijzigd */}
          </ModalProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </HelmetProvider>
</BrowserRouter>
```

### Anti-Patterns to Avoid

- **`transition: all` op `:root`:** Triggert onnodige repaints op transform-properties (scale, translateY van hover-effecten). Gebruik alleen kleur-properties (D-09).
- **Tailwind `dark:` variant zonder config-aanpassing:** De huidige config heeft `darkMode: "class"` — dit werkt niet met `data-theme`. Niet aanraken; thema-switching gaat via CSS `[data-theme]` selector.
- **Hardcoded RGB/RGBA in component-stijlen:** Componenten als `.glass-card` en `body::before` in index.css gebruiken `rgba(124,58,237,...)` — deze moeten voor licht-modus overrides via `[data-theme="light"]` blokken worden aangepakt, niet via HSL variabelen (rgba-waarden zijn niet themable via de HSL token aanpak).
- **`useTheme()` zonder guard buiten provider:** Huidige implementatie retourneert `undefined` bij gebruik buiten ThemeProvider. Dit moet worden gewijzigd naar het `throw new Error` patroon van LanguageContext (D-discretion).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Icoon rotate animatie | CSS @keyframes rotate | Framer Motion `animate={{ rotate: 360 }}` met `key` prop | Framer Motion integreert prefers-reduced-motion automatisch via de hook; keyframes zijn niet conditioneel |
| Thema persistentie | Eigen cookie/sessionStorage logica | Al geïmplementeerd in ThemeContext.jsx (localStorage + prefers-color-scheme fallback) | Volledig gebouwd, enkel wiring nodig |
| Icoon componenten | SVG handmatig tekenen | Material Symbols Outlined `light_mode` + `dark_mode` | Al geladen in project, consistente lijndikte/stijl |

---

## Critical Finding: Tailwind Config Conflict

**Confidence:** HIGH — direct geobserveerd in codebase.

`tailwind.config.ts` definieert alle kleuren als hardcoded HEX-strings:
```ts
colors: {
  background: "#0e0e13",
  "on-surface": "#f9f5fd",
  primary: "#7C3AED",
  // ...
}
```

`App.jsx` en componenten gebruiken Tailwind utilities als `bg-background`, `text-on-surface`, `text-primary`. Deze utilities resolven naar de hardcoded HEX waarden in de gebundelde CSS — ze reageren **niet** op CSS custom property veranderingen in `[data-theme="light"]`.

**Gevolg:** Als alleen index.css wordt gemigreerd naar HSL maar tailwind.config.ts niet wordt aangepast, zullen alle Tailwind utility classes (bg-*, text-*, border-*) blijven werken met de dark mode HEX waarden in light mode.

**Oplossing:** Tailwind colors in de config omzetten naar CSS variable referenties:
```ts
colors: {
  background: "hsl(var(--color-bg))",
  "on-surface": "hsl(var(--color-text))",
  primary: "hsl(var(--primary))",
  // ...
}
```

Dit moet in plan 01-01 worden opgenomen samen met de index.css migratie.

---

## Critical Finding: Token Naam Discrepantie

**Confidence:** HIGH — direct geobserveerd.

| In index.css (huidig) | In CLAUDE.md / UI-SPEC (doel) |
|----------------------|-------------------------------|
| `--background` | `--color-bg` |
| `--surface` | `--color-surface` |
| `--on-surface` | `--color-text` |
| `--on-surface-variant` | `--color-text-muted` |
| `--primary` | `--primary` (gelijk) |
| `--secondary` | `--secondary` (gelijk) |

De UI-SPEC kiest CLAUDE.md-stijl namen als doel. Een rename is vereist. Alle Tailwind config sleutels, component Tailwind classes, en CSS-intern gebruik moeten worden bijgewerkt. Plan 01-01 moet een expliciete zoek-en-vervang stap bevatten.

**Opmerking:** `--background` wordt gebruikt in `body { background-color: var(--background) }` en via Tailwind `bg-background`. Na rename naar `--color-bg` en Tailwind config update werkt dit automatisch, mits beide simultaan worden gedaan.

---

## Common Pitfalls

### Pitfall 1: `section-fade` en `social-icon` met hardcoded achtergrondkleur
**What goes wrong:** `.section-fade::before/::after` en `.social-icon:hover` in index.css bevatten `background: linear-gradient(to bottom, #0e0e13, transparent)` en `background: linear-gradient(#0e0e13, #0e0e13) padding-box`. In light mode toont dit donkere strepen over een lichte achtergrond.
**Why it happens:** Hardcoded HEX kleur — niet themable via custom property zonder expliciete override.
**How to avoid:** In plan 01-02 (light mode token blok) ook `[data-theme="light"] .section-fade::before/::after` en `[data-theme="light"] .social-icon:hover` overrides toevoegen die `hsl(var(--color-surface))` gebruiken.
**Warning signs:** In light mode zichtbare donkere banden boven/onder secties, of donkere vierkante hovereffecten op social icons.

### Pitfall 2: `body::before` orb-gradients zijn hardcoded RGBA
**What goes wrong:** De paarse/oranje radial gradient orbs in `body::before` gebruiken `rgba(124,58,237,0.08)` en `rgba(249,115,22,0.06)`. In light mode zijn deze onzichtbaar of te fel afhankelijk van hoe browsers de laag renderen.
**Why it happens:** Hardcoded RGBA zonder thema-gevoeligheid.
**How to avoid:** `[data-theme="light"] body::before` override toevoegen met lagere opaciteit (~0.04 purple, ~0.03 orange) zoals gespecificeerd in UI-SPEC.
**Warning signs:** Lichte achtergrond met nauwelijks zichtbare of té dominante kleurwolken.

### Pitfall 3: `tailwind.config.ts` `darkMode: "class"` versus `data-theme` selector
**What goes wrong:** Tailwind's ingebouwde `dark:` utilities werken via de `.dark` class op `<html>`, niet via `[data-theme]`. In `App.jsx` staat `className="... dark"` hardcoded — dit kan conflicteren of verwarring geven.
**Why it happens:** Tailwind dark mode is geconfigureerd als `"class"` maar het thema-systeem werkt via `data-theme` attribuut.
**How to avoid:** Niet de Tailwind `dark:` prefix gebruiken voor thema-afhankelijke stijlen. Alle light-mode overrides gaan via `[data-theme="light"]` CSS selector. De hardcoded `dark` class in App.jsx kan worden verwijderd of gehandhaafd als fallback, maar mag niet worden uitgebreid.
**Warning signs:** `dark:` utilities werken niet in light mode (ze reageren niet op `data-theme`).

### Pitfall 4: `:root` transition conflicteert met `prefers-reduced-motion`
**What goes wrong:** De 350ms kleur-transition op `:root` werkt voor muisgebruikers, maar moet worden uitgeschakeld voor gebruikers met `prefers-reduced-motion: reduce`. In `index.css` staat al een `@media (prefers-reduced-motion: reduce)` blok dat `transition-duration: 0.01ms !important` zet — dit vat de `:root` transitie ook automatisch op.
**Why it happens:** Geen probleem als het bestaande reduced-motion blok intact blijft en de `:root` transition ná dat blok in de cascade niet wordt herdefinieerd.
**How to avoid:** Het bestaande reduced-motion blok in index.css niet verplaatsen of overschrijven. Het staat op regel 297-305 en vangt de `:root` transition correct op.
**Warning signs:** Gebruikers met reduced-motion melding: trage kleurovergang zichtbaar.

### Pitfall 5: `useTheme()` retourneert `undefined` buiten provider
**What goes wrong:** Huidige `useTheme` implementatie: `export const useTheme = () => useContext(ThemeContext)` retourneert `undefined` als de hook buiten ThemeProvider wordt aangeroepen. Destructuring `const { theme, toggle } = useTheme()` crasht runtime zonder duidelijke foutmelding.
**Why it happens:** ThemeContext is aangemaakt met `createContext()` (geen default value) maar heeft geen guard.
**How to avoid:** Guard toevoegen conform LanguageContext patroon (D-discretion):
```js
export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
```
**Warning signs:** Cryptische runtime errors bij gebruik van toggle in Navbar als ThemeProvider nog niet is gewrapped.

---

## Code Examples

Verified patterns from project codebase:

### ThemeContext Guard (conform LanguageContext patroon)
```js
// Source: src/context/LanguageContext.jsx (bestaand patroon)
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
```

### App.jsx Provider-Stack Invoeging
```jsx
// Source: App.jsx regel 71-103 (bestaande structuur) + UI-SPEC Provider Order
// ThemeProvider direct binnen HelmetProvider, buiten LanguageProvider
<HelmetProvider>
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <ModalProvider>
          {/* ... ongewijzigd */}
        </ModalProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
</HelmetProvider>
```

### Navbar Toggle Knop (Desktop)
```jsx
// Source: UI-SPEC Component Contract + Navbar.jsx regel 106-116 (insertiepunt)
// Invoegen VÓÓR de bestaande language switcher button in de hidden md:flex div
<button
  onClick={toggle}
  aria-label={theme === 'dark' ? t('nav.toggleThemeLight') : t('nav.toggleThemeDark')}
  className="flex items-center justify-center w-9 h-9 rounded-full
             text-on-surface-variant hover:text-primary
             hover:bg-primary/[0.08] transition-colors duration-200"
>
  <motion.span
    key={theme}
    animate={prefersReduced ? {} : { rotate: 360 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="material-symbols-outlined"
    style={{ fontSize: '20px' }}
  >
    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
  </motion.span>
</button>
```

### index.css — Dark Mode HSL Blok (structuur)
```css
/* Source: UI-SPEC Color table + D-discretion HSL channel-only schrijfstijl */
:root {
  /* === Thema-tokens (HSL channels — gebruik: hsl(var(--token))) === */
  --color-bg:          240 25% 4%;
  --color-surface:     240 20% 6%;
  --color-surface-2:   240 18% 9%;
  --color-surface-3:   240 17% 11%;
  --color-border:      0 0% 100% / 0.08;
  --color-border-hover: 262 82% 58% / 0.3;
  --color-text:        270 67% 96%;
  --color-text-muted:  270 5% 67%;
  --color-text-faint:  255 5% 35%;
  --primary:           262 82% 57%;
  --primary-dim:       263 71% 50%;
  --secondary:         25 95% 53%;
  --accent:            280 93% 75%;

  /* === Kleurovergang === */
  transition:
    color 350ms ease,
    background-color 350ms ease,
    border-color 350ms ease;
}

[data-theme="light"] {
  --color-bg:          270 20% 97%;
  --color-surface:     270 18% 94%;
  --color-surface-2:   270 15% 91%;
  --color-surface-3:   270 12% 88%;
  --color-border:      0 0% 0% / 0.08;
  --color-border-hover: 263 71% 42% / 0.3;
  --color-text:        256 30% 12%;
  --color-text-muted:  256 10% 40%;
  --color-text-faint:  256 8% 62%;
  --primary:           263 71% 50%;
  --primary-dim:       263 60% 44%;
  --secondary:         24 88% 46%;
  --accent:            280 80% 65%;
}
```

### Tailwind Config — CSS Variable Referenties
```ts
// Source: tailwind.config.ts (aan te passen in plan 01-01)
colors: {
  background:         "hsl(var(--color-bg))",
  surface:            "hsl(var(--color-surface))",
  "surface-2":        "hsl(var(--color-surface-2))",
  "surface-3":        "hsl(var(--color-surface-3))",
  "on-surface":       "hsl(var(--color-text))",
  "on-surface-variant": "hsl(var(--color-text-muted))",
  primary:            "hsl(var(--primary))",
  "primary-dim":      "hsl(var(--primary-dim))",
  secondary:          "hsl(var(--secondary))",
  accent:             "hsl(var(--accent))",
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| HEX/RGB waarden in CSS custom properties | HSL channel-only (`240 25% 4%`) | Nu (Phase 1 doel) | Alpha-varianten mogelijk zonder extra token |
| `transition: all` voor thema-switch | Granulaire kleur-only transitions | Nu (D-09) | Geen onnodige GPU-repaints op transform-properties |
| Context zonder guard | `throw new Error` guard consistent met LanguageContext | Nu (D-discretion) | Betere developer experience bij mis-gebruik |

**Deprecated/outdated:**
- Hardcoded HEX in tailwind.config.ts colors: wordt vervangen door CSS variable referenties zodat Tailwind utilities thema-gevoelig worden.
- `--background`, `--on-surface` token namen in index.css: worden hernoemd naar `--color-bg`, `--color-text` conform CLAUDE.md en UI-SPEC.

---

## Open Questions

1. **Token rename scope: welke component-bestanden gebruiken de huidige token namen direct?**
   - What we know: index.css, App.jsx (via Tailwind `bg-background`), Navbar.jsx (`text-on-surface-variant`, `text-primary`), mogelijk andere componenten
   - What's unclear: volledig overzicht van alle componenten die Tailwind utilities of CSS variables gebruiken die worden hernoemd
   - Recommendation: Plan 01-01 moet een expliciete grep-stap bevatten voor `bg-background`, `text-on-surface`, `var(--background)`, `var(--surface)`, etc. om scope te bepalen voor de rename

2. **`body.modal-open .page-content *` transition override conflict**
   - What we know: Regel 308-311 in index.css zet `transition: none !important` op alle child elementen wanneer een modal open is. Dit overschrijft de `:root` kleur-transition niet (want `:root` is niet een child van `.page-content`), maar kan wel de toggle-animatie beïnvloeden als de modal open is.
   - What's unclear: Is dit een probleem in de praktijk?
   - Recommendation: Geen actie nodig — thema toggle werkt buiten modal context; documenten voor toekomstige referentie.

---

## Environment Availability

Step 2.6: SKIPPED — deze fase is een pure code/config wijziging. Geen externe tools, services, runtimes of CLI utilities vereist buiten de bestaande project toolchain (Node.js, Vite, npm).

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Geen gedetecteerd — geen vitest/jest config, geen tests/ map aanwezig |
| Config file | Geen (Wave 0 gap) |
| Quick run command | n/a — zie Wave 0 gaps |
| Full suite command | n/a — zie Wave 0 gaps |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| THEME-01 | Alle custom properties in `:root` zijn HSL channels | Visuele inspectie / smoke | Handmatig: `grep -n "hsl\|#[0-9a-f]" src/index.css` | ❌ Wave 0 |
| THEME-02 | `[data-theme="light"]` selector effectief op `<html>` | Manual smoke | Handmatig: toggle via console, controleer body-achtergrond | ❌ Wave 0 |
| THEME-03 | Toggle-knop schakelt zichtbaar tussen dark/light | Manual smoke | Handmatig: klik toggle in browser | ❌ Wave 0 |
| THEME-04 | Toggle bereikbaar via Navbar keyboard (Tab + Enter) | Manual a11y | Handmatig: keyboard navigatie test | ❌ Wave 0 |
| THEME-05 | localStorage `vexxo-theme` bewaard en hersteld | Manual smoke | Handmatig: toggle → refresh → check theme | ❌ Wave 0 |

**Opmerking:** Dit project heeft geen geautomatiseerd testframework. THEME-01 t/m THEME-05 zijn het meest effectief te valideren via visuele browser-inspectie (Playwright screenshot na implementatie conform CLAUDE.md protocol). Geautomatiseerde unit tests zijn niet van toepassing voor zuiver visuele/CSS wijzigingen.

### Sampling Rate

- **Per task commit:** Handmatige browser-check: toggle dark/light, refresh, controleer localStorage
- **Per wave merge:** Volledige visuele scan: alle secties in beide modi, keyboard navigatie, Playwright screenshot
- **Phase gate:** Beide modi correct, geen blinde vlekken of onleesbare tekst, Playwright screenshots goedgekeurd

### Wave 0 Gaps

- [ ] Geen testframework installatie vereist — validatie via Playwright screenshot protocol (CLAUDE.md)
- [ ] Aanbevolen: na plan 01-02 Playwright screenshot nemen van beide modi voor visuele diff

---

## Project Constraints (from CLAUDE.md)

| Directive | Implication voor Phase 1 |
|-----------|-------------------------|
| Nul hardcoded UI-tekst in componenten — alle strings via `useLanguage()` | Toggle `aria-label` moet via `t('nav.toggleThemeLight')` en `t('nav.toggleThemeDark')` — twee nieuwe i18n sleutels toevoegen aan en.json en nl.json |
| Gebruik `€` niet `$` voor prijzen | Niet van toepassing op Phase 1 |
| Gradients max 3 plaatsen per pagina | Toggle-knop heeft geen gradient — correct |
| Animaties altijd met `prefers-reduced-motion` check | Toggle rotate-animatie moet `useReducedMotion` gebruiken (D-07, al verplicht) |
| `viewport={{ once: true }}` op alle animaties | Toggle-animatie is klik-triggered, niet scroll — niet van toepassing; `key` prop pattern is het equivalent |
| Geen inline styles behalve voor dynamische waarden | `style={{ fontSize: '20px' }}` op motion.span is acceptabel (dynamische waarde voor icoongrootte) |
| Geen nieuw npm package zonder bundle-impact check | Geen nieuwe packages in Phase 1 |
| Playwright visuele review na elke componentwijziging | Na plan 01-02 en 01-03 screenshots nemen — dark + light mode beide controleren |
| Geen `!important` tenzij third-party override | Bestaand reduced-motion `!important` in index.css is correct en blijft intact |
| Nooit heading levels overslaan | Niet van toepassing op Phase 1 |
| Alle knoppen hebben beschrijvende tekst of aria-label | Toggle heeft dynamische `aria-label` via i18n — compliant |
| Focus states: nooit outline verwijderen zonder :focus-visible vervanger | Toggle-knop heeft `focus-visible` ring via `--primary` nodig — toevoegen in implementatie |

---

## Sources

### Primary (HIGH confidence)

- Directe code-inspectie: `src/index.css`, `src/context/ThemeContext.jsx`, `src/App.jsx`, `src/components/Navbar.jsx`, `src/context/LanguageContext.jsx`, `src/lib/animations.js`, `src/hooks/useReducedMotion.js`, `tailwind.config.ts`, `src/locales/en.json`, `src/locales/nl.json`
- `.planning/phases/01-hsl-theming-light-mode/01-CONTEXT.md` — locked decisions D-01 t/m D-09
- `.planning/phases/01-hsl-theming-light-mode/01-UI-SPEC.md` — volledige token mapping, component contract, i18n sleutels
- `CLAUDE.md` — design system constraints, animation rules, accessibility requirements

### Secondary (MEDIUM confidence)

- Tailwind CSS documentatie (uit training): `darkMode: "class"` gedrag, CSS variable referenties in config — consistent met wat in tailwind.config.ts staat

### Tertiary (LOW confidence)

- Geen LOW-confidence bevindingen — alle kritieke claims zijn direct geobserveerd in de codebase.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — alles geobserveerd in bestaande codebase, geen nieuwe dependencies
- Architecture: HIGH — provider-stack, CSS selector aanpak, en token structuur zijn volledig gedocumenteerd in CONTEXT.md en UI-SPEC
- Pitfalls: HIGH — Tailwind conflict en token rename zijn direct waargenomen in code; overige pitfalls volgen uit gekende CSS cascade regels

**Research date:** 2026-03-26
**Valid until:** 2026-04-26 (stabiele technologie — CSS custom properties, React context, Framer Motion)
