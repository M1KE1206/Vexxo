# Phase 1: HSL Theming & Light Mode - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Alle thema-kleuren in `index.css` migreren van HEX/RGB naar HSL custom properties, een volledig `[data-theme="light"]` token set definiëren, `ThemeProvider` aansluiten in `App.jsx`, en een dark/light toggle toevoegen aan de Navbar.

Scope is beperkt tot het kleurensysteem en de toggle-UI. Geen nieuwe componenten buiten Navbar, geen wijzigingen aan paginalayout of content.

</domain>

<decisions>
## Implementation Decisions

### Light Mode Kleurpalet

- **D-01:** Achtergrondkleur light mode is **licht lila-getint** (~`#F5F3FA`) — niet wit, niet crème. Consistent met het merk.
- **D-02:** Primaire tekst in light mode: **diep donker `#1A1625`** — maximaal contrast, WCAG AA compliant.
- **D-03:** Glass cards **blijven herkenbaar** in light mode — krijgen een licht lila-witte tint met subtiele `backdrop-filter: blur` behouden.
- **D-04:** CTA gradient licht verdiept voor contrast op lichte achtergrond: `#6D28D9` → `#EA6808` (ipv `#7C3AED` → `#F97316` in dark mode).

### Toggle UI in Navbar

- **D-05:** Toggle gebruikt **Material Symbols Outlined** iconen: `light_mode` (zon) bij dark thema, `dark_mode` (maan) bij light thema. Geen emoji's.
- **D-06:** **Positie: links van taalschakelaar** — volgorde rechts in Navbar: `[thema-icoon] [NL/EN] [CTA]`.
- **D-07:** Icoon-wisselanimatie: **360° rotate** bij klik via Framer Motion (past `useReducedMotion` toe).

### Kleurovergangsanimatie

- **D-08:** CSS `transition` op alle custom properties met duur **350–400ms** — bewust zichtbaar maar niet traag.
- **D-09:** Implementatie via `transition: color 350ms ease, background-color 350ms ease, border-color 350ms ease` op `:root` — GPU-friendly, geen `all` shorthand om onnodige repaints te vermijden.

### Claude's Discretion

- **HSL token schrijfstijl:** Gebruik `--color-bg: 240 25% 4%` (geen `hsl()` wrapper op de variabele zelf, alleen bij gebruik: `background: hsl(var(--color-bg))`). Tailwind-stijl, maximale flexibiliteit voor light mode overrides.
- **Exacte HSL waarden** voor alle tokens in dark én light mode: Claude bepaalt op basis van de huidige HEX waarden en het CLAUDE.md token systeem.
- **`useTheme` guard:** Huidig `ThemeContext.jsx` gooit geen error bij gebruik buiten provider — aanpassen naar het `throw new Error(...)` patroon van `useLanguage` is Claude's keuze.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System & Kleurregels
- `CLAUDE.md` — 60/30/10 kleurverhouding, dark mode token set, gradient-regels (max 3 per pagina), glass card systeem

### Bestaande Code die Gewijzigd Wordt
- `src/index.css` — huidige `:root` token set (HEX/RGB) — dit is het startpunt voor de HSL migratie
- `src/context/ThemeContext.jsx` — volledig gebouwde ThemeContext, nog niet in App.jsx aangesloten
- `src/components/Navbar.jsx` — hier wordt de toggle UI toegevoegd
- `src/App.jsx` — hier wordt `ThemeProvider` omheen gewrapped

### Bestaande Code ter Referentie (patronen)
- `src/context/LanguageContext.jsx` — patroon voor context guard (`throw new Error`)
- `src/lib/animations.js` — Framer Motion presets voor de rotate-animatie
- `src/hooks/useReducedMotion.js` — verplicht te gebruiken bij de icoon-animatie

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ThemeContext.jsx`: al volledig gebouwd — `data-theme` op `<html>`, localStorage met sleutel `vexxo-theme`, `prefers-color-scheme` fallback. Alleen App.jsx-integratie ontbreekt.
- `Material Symbols Outlined`: al geladen in de app — `light_mode` en `dark_mode` iconen direct beschikbaar.
- `useReducedMotion.js`: beschikbaar en verplicht voor de rotate-animatie op het toggle-icoon.
- `animations.js`: Framer Motion presets (fadeIn, scaleIn) als basis voor eventuele icoon-animatie.

### Established Patterns
- Context guard patroon: `if (!ctx) throw new Error("useTheme must be used inside ThemeProvider")` — consistent met LanguageContext.
- Navbar stijl: icoon-knoppen rechts met paarse hover `color: var(--primary)` en subtiele achtergrond.
- CSS class compositie: Tailwind utilities + custom properties in `index.css`.

### Integration Points
- `src/App.jsx`: `ThemeProvider` wrappen rond de bestaande provider-stack (na `HelmetProvider`, naast `LanguageProvider`).
- `src/index.css` `:root`: alle HEX/RGB waarden vervangen door HSL channels, `[data-theme="light"]` block toevoegen.
- `src/components/Navbar.jsx`: toggle-knop invoegen vóór de taalschakelaar in de rechter navigatiegroep.

</code_context>

<specifics>
## Specific Ideas

- Thema-overgang via `transition` op `:root` (350–400ms, alleen kleur-properties, geen `all`).
- Light mode achtergrond: licht lila-getint palet starting from `hsl(270 20% 97%)` als basis.
- Gradient in light mode: `#6D28D9` → `#EA6808` (iets dieper dan dark mode voor contrast).
- Toggle-icoon: 360° rotate bij klik via Framer Motion `animate={{ rotate: 360 }}` met `key` prop voor re-trigger.

</specifics>

<deferred>
## Deferred Ideas

Geen — discussie bleef binnen fase-scope.

</deferred>

---

*Phase: 01-hsl-theming-light-mode*
*Context gathered: 2026-03-26*
