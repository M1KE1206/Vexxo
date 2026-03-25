# Vexxo Studio

## What This Is

Vexxo is een premium web design & development agency gerund door een student, gepositioneerd als goedkoper dan freelancers of grote agencies maar met professionele output. De site op vexxo.be informeert bezoekers over diensten en prijzen, en laat hen direct een serviceaanvraag indienen via een gestructureerde flow. De doelgroep zijn startups en middelgrote bedrijven.

## Core Value

Bezoekers moeten in één bezoek kunnen begrijpen wat Vexxo kost en een aanvraag kunnen indienen — van landing tot ingevuld formulier zonder wrijving.

## Requirements

### Validated

- ✓ React 18 SPA met Vite, gedeployed op Vercel — bestaand
- ✓ Supabase authenticatie (email/password + Google OAuth) — bestaand
- ✓ Service Request Modal met auth-gate flow — bestaand
- ✓ Meertaligheid (NL/EN) via LanguageContext — bestaand
- ✓ Prijscalculator op /prijzen — bestaand
- ✓ Portfolio sectie op homepage — bestaand (gefilterd, met bekende bug)
- ✓ Contactformulier — bestaand
- ✓ Profielpagina (/profiel) met avatar upload — bestaand
- ✓ ThemeContext gedefinieerd, localStorage-persistentie — bestaand maar niet aangesloten
- ✓ CSP security headers via vercel.json — bestaand

### Active

- [ ] Light mode volledig implementeren via HSL kleurensysteem (ThemeContext is aanwezig maar niet gewired in App.jsx)
- [ ] Portfolio filter bug fixen: "alles" na gefilterde categorie toont niet alle items opnieuw
- [ ] Scroll-animaties toevoegen aan alle secties
- [ ] Portfolio sectie updaten en werkend maken (content + filter)
- [ ] Serviceaanvraag flow uitbreiden: Design / Development / Fullstack categorieën met specifieke pakketten
- [ ] Prijscalculator uitwerken voor de nieuwe servicecategorieën
- [ ] Fullstack bundels definiëren (Logo + Landing page, etc.)
- [ ] HSL kleurensysteem doorvoeren — alle thema-kleuren als HSL custom properties, geen hardcoded HEX/RGB
- [ ] Terminal component integreren (src/components/Terminal.jsx bestaat maar is niet gebruikt)
- [ ] Dormant Next.js layer opruimen of documenteren (src/app/ + package.json rommel)

### Out of Scope

- Vaste hardcoded prijzen per pakket — prijzen worden pas finaal na calculator validatie; altijd via config/pricing.js
- WebGL / Three.js rendering — HeroComputer blijft pure CSS/HTML (three.js dependency aanwezig maar ongebruikt)
- Mobiele app — website only
- CMS voor content beheer — te vroeg, content zit in locales/

## Context

**Bestaande codebase:** Volwassen React SPA met goed gestructureerde context-laag, config-gedreven content, en een werkende auth + modal flow. De codebase is "brownfield" — er is al veel gebouwd maar een aantal features zijn half-klaar (ThemeContext, Terminal component) of gebugd (portfolio filter).

**Technische schuld:**
- ThemeContext bestaat maar is niet aangesloten in App.jsx — de app is altijd dark
- Next.js 14 staat in package.json naast Vite; src/app/ bevat een oudere versie van pagina's met andere tokens en Urbanist font — dit is dode code
- Three.js dependency aanwezig maar geen actieve scenes
- Kleuren zijn momenteel HEX/RGB in index.css; user wil overstap naar HSL voor eenvoudige light/dark toggle

**Designsysteem:** Volledig gedocumenteerd in CLAUDE.md — 60/30/10 kleurverhouding, glass card systeem, Framer Motion presets, typografie hiërarchie. Strikte regels over gradients (max 3 per pagina), geen hardcoded UI-tekst.

**Workflow:** HSL kleurensysteem is de enabler voor light mode. Alle andere UI-verbeteringen bouwen hierop voort.

## Constraints

- **Tech stack:** React + Vite + Supabase — geen alternatieven tenzij expliciet beslist
- **Styling:** HSL custom properties voor alle thema-kleuren — RGB/HEX alleen voor vaste niet-thema waarden
- **Content:** Altijd via useLanguage() en locales/ — nooit hardcoded tekst in components
- **Prijzen:** Altijd via src/config/pricing.js — nooit hardcoded bedragen
- **Animations:** Altijd Framer Motion met prefers-reduced-motion check — nooit raw CSS keyframes voor entrance animaties
- **Database:** Altijd Supabase — geen andere database integraties

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| HSL kleurensysteem als basis voor theming | Eenvoudige light/dark toggle via saturation & lightness zonder brightness-hack | — Pending |
| Prijscalculator ipv vaste prijzen | Prijzen nog niet finaal per pakket/element | — Pending |
| Vite als actieve build tool (niet Next.js) | Next.js is dormant, vercel.json deployt via Vite | ✓ Good |
| Supabase voor alle database-integraties | Consistentie, al geïmplementeerd voor auth + profiles | ✓ Good |
| ThemeContext beschikbaar maar niet gewired | Bewust uitgesteld totdat HSL systeem klaar is | — Pending |

## Evolution

Dit document evolueert bij fase-overgangen en milestone-grenzen.

**Na elke fase-overgang** (via `/gsd:transition`):
1. Requirements ongeldig geworden? → Verplaats naar Out of Scope met reden
2. Requirements gevalideerd? → Verplaats naar Validated met fase-referentie
3. Nieuwe requirements ontstaan? → Voeg toe aan Active
4. Beslissingen te loggen? → Voeg toe aan Key Decisions
5. "What This Is" nog accuraat? → Update indien nodig

**Na elke milestone** (via `/gsd:complete-milestone`):
1. Volledige review van alle secties
2. Core Value check — nog steeds de juiste prioriteit?
3. Audit Out of Scope — redenen nog steeds geldig?
4. Update Context met huidige staat

---
*Last updated: 2026-03-25 after initialization*
