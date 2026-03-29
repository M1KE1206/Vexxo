# M1K3 Bulk Tracker — Dashboard Redesign

**Date:** 2026-03-22
**Status:** Approved by user

---

## Doel

De huidige M1K3 pagina (`public/M1K3/index.html`) is mobile-only (max-width 430px) met een bottom-nav. Redesign naar een volledig responsief dashboard dat er professioneel uitziet op zowel desktop als mobile — geïnspireerd op New Relic / Linear dashboards.

---

## Design beslissingen (goedgekeurd)

- **Stijl:** Clean dark dashboard (Option B uit brainstorm)
- **Kleur:** Huidige tokens behouden — `#0f0f0f` bg, `#4ade80` accent groen
- **Icons:** Alleen SVG inline icons — nooit emojis
- **Data:** localStorage (geen externe sync/Firebase)
- **Font:** Inter (al geladen)

---

## Desktop layout (≥ 768px)

```
┌─────────────┬──────────────────────────────┐
│  Sidebar    │  Topbar                      │
│  220px      │  [Paginatitel] [Actieknoppen]│
│             ├──────────────────────────────┤
│  Logo       │  Stat cards (3 kolommen)     │
│  Nav items  │                              │
│  + badges   │  Content (checklist /        │
│             │  fitness / voeding / info)   │
│  ─────────  │                              │
│  User card  │                              │
│  (Mike,     │                              │
│  57→65kg)   │                              │
└─────────────┴──────────────────────────────┘
```

**Sidebar (220px, vast):**
- Logo: groen icoontje + "M1K3" + "Bulk Tracker" subtitle
- Nav items: SVG icon + label + badge (live data)
  - Boodschappen (winkelwagen icon, badge: "8/14")
  - Fitness (barbell icon, badge: huidig type "Push")
  - Voeding (compass icon, badge: kcal "2847")
  - Info (monitor icon, geen badge)
- User card onderaan: avatar (initialen), naam "Mike", huidig/doel gewicht

**Main area:**
- Topbar: paginatitel + subtitel + actie-knoppen (SVG icons, geen emojis)
- Stat row: 3 kaarten met metric + progress bar
- Content: tab-specifieke inhoud

---

## Mobile layout (< 768px)

Zelfde visuele stijl als desktop — geen aparte mobile-only design meer:
- Sidebar verdwijnt
- **Bottom nav** blijft maar met zelfde SVG icons als desktop
- Topbar blijft (compacter)
- Stat cards: 2 kolommen i.p.v. 3
- Content: full width, zelfde kaart-stijl

---

## Tab inhoud (ongewijzigd qua functionaliteit)

### Boodschappen
- 3 stat-cards: items gehaald / uitgegeven / rest budget
- Checklist met categorie-dividers en prijzen
- Reset-week knop

### Fitness
- Day-selector (horizontaal scroll op mobile, zichtbaar op desktop)
- Oefening-kaarten met set-knoppen
- Sessie afronden knop

### Voeding
- Macro-overzicht (3 stats: kcal, eiwit, koolh)
- Accordion maaltijden (details/summary)

### Info
- Gewicht progress bar (57→65kg)
- 6-stats grid
- Trainingsschema (Push/Pull/Legs/Rust)
- Quote kaart

---

## Stat cards per tab

| Tab | Stat 1 | Stat 2 | Stat 3 |
|---|---|---|---|
| Boodschappen | Items gehaald (done/total) | Uitgegeven (€sum) | Rest budget (€38−sum) |
| Fitness | Huidig dag-type (Push/Pull/Legs/Rust) | Sets vandaag (gedaan/totaal) | Trainingen deze week |
| Voeding | Kcal doel (3100) | Eiwit doel (155g) | Maaltijden (5×) |
| Info | Huidig gewicht (57kg) | Doel (65kg) | Te gaan (+8kg) |

## Topbar actieknoppen per tab

| Tab | Knoppen |
|---|---|
| Boodschappen | "Reset week" (ic-reset icon) |
| Fitness | Geen (dag-selector is de actie) |
| Voeding | Geen |
| Info | Geen |

## Sidebar badges (data sources)

Badges worden berekend bij `showTab()` en `updateShopUI()`:
- **Boodschappen**: `done + "/" + total` — lees van `localStorage.checklist_items` + `BOODSCHAPPEN` array
- **Fitness**: `SCHEMA[JS_DAY[new Date().getDay()]].type` — bijv. "Push"
- **Voeding**: hardcoded "3100" (kcal doel — statische waarde)
- **Info**: geen badge

## Breakpoint

- **≥ 900px**: sidebar zichtbaar, 3-kolom stat cards
- **< 900px**: sidebar verborgen, bottom nav actief, 2-kolom stat cards

## Wat NIET verandert

- Alle JavaScript logica (localStorage, checklist state, set tracking)
- Data structuur in localStorage
- Alle inhoud (producten, oefeningen, maaltijden)

---

## Implementatie

Eén bestand: `public/M1K3/index.html` — volledig herschreven CSS + HTML shell. JS-logica wordt meegenomen ongewijzigd.
