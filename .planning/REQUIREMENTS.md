# Requirements: Vexxo Studio

**Defined:** 2026-03-25
**Core Value:** Bezoekers kunnen in één bezoek begrijpen wat Vexxo kost en een aanvraag indienen — van landing tot ingevuld formulier zonder wrijving.

## v1 Requirements

### Theming

- [x] **THEME-01**: Alle thema-kleuren zijn gedefinieerd als HSL custom properties in index.css (geen hardcoded HEX/RGB voor thema-waarden)
- [x] **THEME-02**: Light mode is volledig werkend via data-theme attribuut op `<html>`
- [ ] **THEME-03**: ThemeContext is aangesloten in App.jsx en togglet zichtbaar tussen dark/light
- [ ] **THEME-04**: Light mode toggle is bereikbaar via de Navbar
- [ ] **THEME-05**: Thema-keuze wordt bewaard in localStorage en hersteld bij paginalading

### Bugfixes

- [ ] **BUG-01**: Portfolio filter "alles" toont opnieuw alle items na filteren op categorie

### Animaties

- [ ] **ANIM-01**: Alle secties op de homepage hebben scroll-gebaseerde entrance animaties (fadeUp / staggerContainer)
- [ ] **ANIM-02**: Alle animaties respecteren prefers-reduced-motion
- [ ] **ANIM-03**: Animaties vuren slechts één keer (viewport={{ once: true }})

### Portfolio

- [ ] **PORT-01**: Portfolio sectie toont actuele projecten met echte content
- [ ] **PORT-02**: Portfolio filter werkt correct voor alle categorieën inclusief "alles"
- [ ] **PORT-03**: Portfolio items zijn klikbaar en tonen projectdetails

### Serviceflow

- [ ] **SERV-01**: Gebruiker kan een servicecategorie kiezen: Design, Development of Fullstack
- [ ] **SERV-02**: Design-categorie biedt keuze uit: Logo design, UX design, UI design
- [ ] **SERV-03**: Development-categorie biedt keuze uit: Landing page, Multi-page site (max. 8 p.), Web applicatie
- [ ] **SERV-04**: Fullstack-categorie biedt bundelpakketten (minimaal: Logo + Landing page)
- [ ] **SERV-05**: Aanvraagformulier bevat verplichte velden: Bedrijfsnaam, Telefoonnummer, Projectbeschrijving, Deadline, Gewenst resultaat
- [ ] **SERV-06**: Servicecategoriekeuze prefult het aanvraagformulier correct
- [ ] **SERV-07**: Aanvraag wordt opgeslagen in Supabase

### Prijscalculator

- [ ] **PRICE-01**: Prijscalculator ondersteunt de drie servicecategorieën (Design, Development, Fullstack)
- [ ] **PRICE-02**: Calculator toont realtime prijsindicatie op basis van geselecteerde opties
- [ ] **PRICE-03**: Alle prijzen komen uit src/config/pricing.js — geen hardcoded bedragen in components
- [ ] **PRICE-04**: Calculator-resultaat wordt doorgegeven aan het aanvraagformulier als prefill

### Opruiming technische schuld

- [ ] **TECH-01**: Dormant Next.js layer (src/app/) verwijderd of gedocumenteerd als expliciet niet-actief
- [ ] **TECH-02**: Ongebruikte dependencies (three.js, @next/font) verwijderd of gerechtvaardigd
- [ ] **TECH-03**: Terminal component (src/components/Terminal.jsx) geïntegreerd of verwijderd

## v2 Requirements

### Admin / Dashboard

- **ADMIN-01**: Vexxo-eigenaar kan ingekomen aanvragen bekijken in een dashboard
- **ADMIN-02**: Aanvragen kunnen worden gemarkeerd als behandeld / in behandeling / afgewezen
- **ADMIN-03**: Klantcommunicatie vanuit het dashboard (e-mail reply)

### Uitgebreide Fullstack bundels

- **FULL-01**: Alle Fullstack bundelpakketten zijn gedefinieerd met vaste combinaties en beschrijvingen
- **FULL-02**: Bundelkorting is verwerkt in de calculator

### SEO & Performance

- **SEO-01**: Lighthouse Performance score ≥ 90 na alle wijzigingen
- **SEO-02**: Lighthouse SEO score = 100
- **SEO-03**: Lighthouse Accessibility score ≥ 90

## Out of Scope

| Feature | Reason |
|---------|--------|
| Hardcoded prijzen per pakket | Prijzen zijn nog niet finaal; altijd via calculator |
| WebGL / Three.js visuele effecten | HeroComputer blijft pure CSS; Three.js is ongebruikte dependency |
| Mobiele app | Website-first |
| CMS voor content beheer | Te vroeg; content zit in locales/ |
| Realtimechat met klanten | Hoge complexiteit, buiten v1 scope |
| WordPress / Framer migratie | Primaire stack is React + Vite + Supabase |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| THEME-01 | Phase 1 | Complete |
| THEME-02 | Phase 1 | Complete |
| THEME-03 | Phase 1 | Pending |
| THEME-04 | Phase 1 | Pending |
| THEME-05 | Phase 1 | Pending |
| BUG-01 | Phase 2 | Pending |
| ANIM-01 | Phase 2 | Pending |
| ANIM-02 | Phase 2 | Pending |
| ANIM-03 | Phase 2 | Pending |
| PORT-01 | Phase 3 | Pending |
| PORT-02 | Phase 3 | Pending |
| PORT-03 | Phase 3 | Pending |
| SERV-01 | Phase 4 | Pending |
| SERV-02 | Phase 4 | Pending |
| SERV-03 | Phase 4 | Pending |
| SERV-04 | Phase 4 | Pending |
| SERV-05 | Phase 4 | Pending |
| SERV-06 | Phase 4 | Pending |
| SERV-07 | Phase 4 | Pending |
| PRICE-01 | Phase 5 | Pending |
| PRICE-02 | Phase 5 | Pending |
| PRICE-03 | Phase 5 | Pending |
| PRICE-04 | Phase 5 | Pending |
| TECH-01 | Phase 6 | Pending |
| TECH-02 | Phase 6 | Pending |
| TECH-03 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 26
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-25*
*Last updated: 2026-03-25 after initial definition*
