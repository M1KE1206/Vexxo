# Roadmap: Vexxo Studio

## Overview

Dit roadmap brengt Vexxo Studio van een werkende maar onvolledige basis naar een volledig functionele agency-site. De eerste fases leggen de technische fundering (HSL theming, light mode), gevolgd door UX-verfijning (animaties, portfolio), en eindigen met de volledige serviceaanvraagflow en prijscalculator. Elke fase levert een aantoonbare verbetering op die direct zichtbaar is voor bezoekers.

## Phases

- [ ] **Phase 1: HSL Theming & Light Mode** — Kleurensysteem migreren naar HSL en ThemeContext volledig aansluiten
- [ ] **Phase 2: Animaties & Portfolio Bugfix** — Scroll-animaties doorvoeren en portfolio filter repareren
- [ ] **Phase 3: Portfolio Content Update** — Actuele projecten toevoegen en portfolio sectie werkend maken
- [ ] **Phase 4: Serviceaanvraag Flow** — Design/Development/Fullstack categorieën met aanvraagformulier
- [ ] **Phase 5: Prijscalculator Uitbreiden** — Calculator koppelen aan servicecategorieën met prefill
- [ ] **Phase 6: Technische Schuld Opruimen** — Next.js layer, ongebruikte dependencies en Terminal component

## Phase Details

### Phase 1: HSL Theming & Light Mode
**Goal**: Alle thema-kleuren migreren naar HSL custom properties en ThemeContext volledig aansluiten in App.jsx zodat de site correct switcht tussen dark en light mode.
**Depends on**: Niets (eerste fase)
**Requirements**: THEME-01, THEME-02, THEME-03, THEME-04, THEME-05
**Success Criteria** (wat WAAR moet zijn):
  1. Alle CSS custom properties in index.css gebruiken hsl() notatie voor thema-kleuren
  2. De toggle in de Navbar schakelt zichtbaar tussen dark en light mode
  3. Light mode heeft correcte kleurwaarden (geen blinde spots of onleesbare tekst)
  4. Themakeuze blijft bewaard na pagina vernieuwen
  5. Zowel dark als light mode respecteren het 60/30/10 kleurprincipe uit CLAUDE.md
**Plans**: TBD

Plans:
- [ ] 01-01: Migreer index.css naar HSL custom properties (alle --color-* variabelen)
- [ ] 01-02: Definieer light mode token set en [data-theme="light"] overrides
- [ ] 01-03: Sluit ThemeContext aan in App.jsx en voeg toggle toe aan Navbar

### Phase 2: Animaties & Portfolio Bugfix
**Goal**: Scroll-animaties toevoegen aan alle homepage-secties en de portfolio filter bug fixen zodat "alles" opnieuw alle items toont.
**Depends on**: Phase 1
**Requirements**: BUG-01, ANIM-01, ANIM-02, ANIM-03
**Success Criteria** (wat WAAR moet zijn):
  1. Elke sectie op de homepage animeert bij eerste scroll via fadeUp of staggerContainer
  2. Alle animaties vuren slechts één keer (viewport once)
  3. Animaties zijn uitgeschakeld wanneer prefers-reduced-motion actief is
  4. Portfolio filter "alles" toont alle items opnieuw na filteren op een categorie
**Plans**: TBD

Plans:
- [ ] 02-01: Scroll-animaties toevoegen aan alle secties (Hero, Portfolio, AboutMe, AboutCompany, Contact)
- [ ] 02-02: Portfolio filter bug fixen in Portfolio.jsx

### Phase 3: Portfolio Content Update
**Goal**: Portfolio sectie vullen met actuele Vexxo-projecten en alle interacties werkend maken (filter, klikbare items, projectdetails).
**Depends on**: Phase 2
**Requirements**: PORT-01, PORT-02, PORT-03
**Success Criteria** (wat WAAR moet zijn):
  1. Portfolio toont minimaal 3 actuele projecten met echte content
  2. Alle filtercategorieën werken correct
  3. Portfolio items zijn klikbaar en tonen relevante projectinformatie
  4. Portfolio content komt uit config/portfolio.js, geen hardcoded data in het component
**Plans**: TBD

Plans:
- [ ] 03-01: Portfolio data bijwerken in config/portfolio.js met actuele projecten
- [ ] 03-02: Portfolio component updaten voor klikbare items en projectdetailweergave

### Phase 4: Serviceaanvraag Flow
**Goal**: De serviceaanvraagflow uitbreiden met Design, Development en Fullstack categorieën, elk met specifieke pakketten en een aanvraagformulier dat de juiste verplichte velden bevat en wordt opgeslagen in Supabase.
**Depends on**: Phase 1
**Requirements**: SERV-01, SERV-02, SERV-03, SERV-04, SERV-05, SERV-06, SERV-07
**Success Criteria** (wat WAAR moet zijn):
  1. Gebruiker kan een servicecategorie kiezen (Design / Development / Fullstack)
  2. Per categorie worden de juiste pakketten getoond
  3. Aanvraagformulier bevat alle verplichte velden (Bedrijfsnaam, Tel, Beschrijving, Deadline, Gewenst resultaat)
  4. Geselecteerde categorie/pakket is zichtbaar als prefill in het formulier
  5. Ingevuld formulier wordt correct opgeslagen in Supabase
**Plans**: TBD

Plans:
- [ ] 04-01: Servicecategorieën en pakketten definiëren in config/services.js
- [ ] 04-02: ServiceRequestModal uitbreiden met categorie/pakket selectie UI
- [ ] 04-03: Aanvraagformulier velden uitbreiden en Supabase opslag implementeren

### Phase 5: Prijscalculator Uitbreiden
**Goal**: De prijscalculator koppelen aan de drie servicecategorieën zodat hij een realtime prijsindicatie toont op basis van de selecties, en het resultaat als prefill doorstuurt naar het aanvraagformulier.
**Depends on**: Phase 4
**Requirements**: PRICE-01, PRICE-02, PRICE-03, PRICE-04
**Success Criteria** (wat WAAR moet zijn):
  1. Calculator ondersteunt Design, Development én Fullstack opties
  2. Prijsindicatie updatet realtime bij elke selectiewijziging
  3. Alle berekeningen komen uitsluitend uit config/pricing.js
  4. "Start Project" knop opent ServiceRequestModal met calculator-data als prefill
**Plans**: TBD

Plans:
- [ ] 05-01: pricing.js uitbreiden met Design en Fullstack tarieven
- [ ] 05-02: PricingCalculator component updaten voor alle drie categorieën
- [ ] 05-03: Prefill-koppeling tussen calculator en ServiceRequestModal testen en verfijnen

### Phase 6: Technische Schuld Opruimen
**Goal**: De codebase opschonen door de dormante Next.js layer te verwijderen, ongebruikte dependencies te schrappen en de Terminal component te integreren of verwijderen.
**Depends on**: Phase 5
**Requirements**: TECH-01, TECH-02, TECH-03
**Success Criteria** (wat WAAR moet zijn):
  1. src/app/ is verwijderd of expliciet gedocumenteerd als niet-actief
  2. package.json bevat geen ongebruikte dependencies (next, @next/font, three)
  3. Terminal component is geïntegreerd in de site of verwijderd
  4. Bundle size is kleiner of gelijk aan vóór opruiming
**Plans**: TBD

Plans:
- [ ] 06-01: Dormant Next.js code (src/app/, next in package.json) verwijderen
- [ ] 06-02: Ongebruikte dependencies (three.js, @next/font) verwijderen
- [ ] 06-03: Terminal component beslissing: integreren of verwijderen

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. HSL Theming & Light Mode | 0/3 | Not started | - |
| 2. Animaties & Portfolio Bugfix | 0/2 | Not started | - |
| 3. Portfolio Content Update | 0/2 | Not started | - |
| 4. Serviceaanvraag Flow | 0/3 | Not started | - |
| 5. Prijscalculator Uitbreiden | 0/3 | Not started | - |
| 6. Technische Schuld Opruimen | 0/3 | Not started | - |
