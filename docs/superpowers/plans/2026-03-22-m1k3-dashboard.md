# M1K3 Dashboard Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `public/M1K3/index.html` from a mobile-only bottom-nav app into a responsive dashboard — sidebar + content on desktop (≥900px), bottom nav + stacked layout on mobile (<900px). Zero new dependencies, all JS logic preserved unchanged.

**Architecture:** Single HTML file rewrite — new CSS design tokens and layout shell, updated HTML structure (sidebar added, main area restructured), three new JS helper functions wired into existing `showTab()` and `updateShopUI()`. All existing data, helpers, and build functions (buildBoodschappen, buildFitness, buildSchedGrid) are untouched.

**Tech Stack:** Vanilla HTML/CSS/JS, localStorage, inline SVG sprite (already present), Inter font (already loaded)

---

## File Map

| File | Change |
|---|---|
| `public/M1K3/index.html` | Full CSS rewrite + HTML shell restructure + 3 new JS functions |

No other files are touched. No new files created.

---

## Reference: Existing JS functions (DO NOT modify)

These functions exist and must keep working exactly as-is:
- `safeJSON(str, fallback)` — safe JSON.parse
- `isoWeek(d)`, `monday(d)`, `fmtDate(d)`, `fmtPrice(n)` — helpers
- `buildBoodschappen()` — renders checklist into `#checklist-root`, wires reset btn
- `updateShopUI(checked)` — updates `#price-checked`, `#item-count`, `#prog-fill`
- `buildFitness()` — renders day tabs into `#day-tabs` and panels into `#day-panels`
- `switchDay(id)`, `toggleSet(btn)`, `doneSession(id)` — fitness interactions
- `buildSchedGrid()` — renders training schedule into `#sched-grid`
- `showTab(id)` — will be **extended** (not replaced) in Task 3

Data constants that must remain: `BOODSCHAPPEN`, `PUSH`, `PULL`, `LEGS`, `SCHEMA`, `JS_DAY`

---

## Task 1: CSS — Design tokens, layout foundation, sidebar, responsive

**Files:**
- Modify: `public/M1K3/index.html` — replace entire `<style>` block

- [ ] **Step 1: Replace the `:root` block and reset**

Find and replace the existing `:root { ... }` and reset section (lines ~11–38) with:

```css
:root {
  --bg:           #0a0a0a;
  --surface:      #111111;
  --surface-2:    #161616;
  --surface-3:    #1c1c1c;
  --border:       #1e1e1e;
  --border-2:     #2a2a2a;
  --accent:       #4ade80;
  --accent-dim:   rgba(74,222,128,0.08);
  --accent-glow:  rgba(74,222,128,0.05);
  --text:         #efefef;
  --text-2:       #888888;
  --text-3:       #444444;
  --sidebar-w:    220px;
  --topbar-h:     56px;
  --nav-h:        62px;
  --r:            10px;
  --r-sm:         7px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  font-family: 'Inter', -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  overscroll-behavior: none;
}
button { cursor: pointer; font-family: inherit; border: none; background: none; }
svg { display: block; }
```

- [ ] **Step 2: Replace the app shell and tab system CSS**

Replace the `/* ── App shell */`, `/* ── Tab system */`, and `/* ── Bottom nav */` blocks with:

```css
/* ── App shell — desktop grid ─────────────────────── */
#app {
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr;
  grid-template-rows: 100vh;
  height: 100vh;
  overflow: hidden;
}

/* ── Sidebar ────────────────────────────────────────── */
.sidebar {
  background: #080808;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  grid-column: 1;
  grid-row: 1;
}

.sidebar-logo {
  padding: 18px 14px 14px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.logo-mark {
  width: 28px; height: 28px;
  background: var(--accent);
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.logo-mark svg { width: 15px; height: 15px; color: #080808; }
.logo-text  { font-size: 0.9rem; font-weight: 800; letter-spacing: -0.01em; }
.logo-sub   { font-size: 0.6rem; color: var(--text-3); margin-top: 1px; }

.nav-section { padding: 10px 8px 4px; flex-shrink: 0; }
.nav-section-label {
  font-size: 0.55rem; font-weight: 700; letter-spacing: 0.15em;
  text-transform: uppercase; color: var(--text-3);
  padding: 0 8px; margin-bottom: 4px;
}

.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: var(--r-sm);
  font-size: 0.78rem; font-weight: 500; color: var(--text-3);
  cursor: pointer; margin-bottom: 1px;
  transition: background .12s, color .12s;
  border: none; background: none; width: 100%; text-align: left;
}
.nav-item svg { width: 16px; height: 16px; flex-shrink: 0; color: inherit; }
.nav-item:hover { background: var(--surface-2); color: var(--text-2); }
.nav-item.active { background: var(--accent-dim); color: var(--text); }
.nav-item.active svg { color: var(--accent); }
.nav-item.active .nav-badge { background: rgba(74,222,128,.15); color: var(--accent); }

.nav-badge {
  margin-left: auto; font-size: 0.58rem; font-weight: 700;
  background: var(--surface-3); color: var(--text-3);
  padding: 2px 7px; border-radius: 99px;
  transition: background .12s, color .12s;
}

.sidebar-spacer { flex: 1; }

/* ── User card ───────────────────────────────────────── */
.user-card {
  margin: 10px;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r);
  flex-shrink: 0;
}
.user-card-row {
  display: flex; align-items: center; gap: 10px;
}
.user-avatar {
  width: 32px; height: 32px; border-radius: 8px;
  background: linear-gradient(135deg, var(--accent), #22c55e);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 800; color: #080808;
  flex-shrink: 0; letter-spacing: -0.02em;
}
.user-name { font-size: 0.8rem; font-weight: 700; }
.user-meta { font-size: 0.62rem; color: var(--text-3); margin-top: 1px; }
.user-stats {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 6px; margin-top: 10px; padding-top: 10px;
  border-top: 1px solid var(--border);
}
.user-stat { text-align: center; }
.user-stat-val { font-size: 0.85rem; font-weight: 700; color: var(--accent); }
.user-stat-key { font-size: 0.58rem; color: var(--text-3); margin-top: 1px; }

/* ── Main area ───────────────────────────────────────── */
.main-area {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
}

/* ── Topbar ──────────────────────────────────────────── */
.topbar {
  height: var(--topbar-h);
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  background: var(--bg);
}
.topbar-left { }
.topbar-title { font-size: 1rem; font-weight: 700; }
.topbar-sub { font-size: 0.68rem; color: var(--text-3); margin-top: 2px; }
.topbar-actions { display: flex; align-items: center; gap: 8px; }
.topbar-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--border-2);
  border-radius: var(--r-sm);
  font-size: 0.72rem; font-weight: 600;
  color: var(--text-3);
  transition: color .12s, border-color .12s;
}
.topbar-btn svg { width: 13px; height: 13px; }
.topbar-btn:hover { color: var(--text-2); border-color: #3a3a3a; }

/* ── Stat row ────────────────────────────────────────── */
.stat-row {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 10px; padding: 14px 20px 0;
  flex-shrink: 0;
}
.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 12px 14px;
}
.stat-card-label {
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text-3);
  display: flex; align-items: center; gap: 5px;
  margin-bottom: 7px;
}
.stat-card-label svg { width: 11px; height: 11px; }
.stat-val { font-size: 1.3rem; font-weight: 800; line-height: 1; color: var(--accent); }
.stat-val.neutral { color: var(--text); }
.stat-meta { font-size: 0.63rem; color: var(--text-3); margin-top: 3px; }
.stat-bar { height: 3px; background: var(--surface-3); border-radius: 99px; overflow: hidden; margin-top: 8px; }
.stat-bar-fill { height: 100%; background: var(--accent); border-radius: 99px; transition: width .3s ease; }

/* ── Content (scrollable) ────────────────────────────── */
.content-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 14px 20px 20px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-2) transparent;
}

/* ── Tab visibility ──────────────────────────────────── */
.tab { display: none; }
.tab.active { display: block; animation: fadeUp .15s ease; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: none; }
}

/* ── Section header (sh) — mobile only, hidden on desktop ── */
.sh { display: none; }

/* ── Bottom nav — mobile only ────────────────────────── */
.bottom-nav {
  display: none; /* hidden on desktop */
}

/* ── Responsive: mobile < 900px ─────────────────────── */
@media (max-width: 899px) {
  #app {
    display: block;
    height: auto;
    min-height: 100dvh;
    overflow: visible;
  }
  .sidebar { display: none; }
  .main-area {
    display: block;
    height: auto;
    overflow: visible;
    padding-bottom: calc(var(--nav-h) + env(safe-area-inset-bottom) + 12px);
  }
  .topbar {
    height: auto;
    padding: 14px 16px;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .stat-row {
    grid-template-columns: repeat(2, 1fr);
    padding: 12px 16px 0;
    gap: 8px;
  }
  .stat-row .stat-card:last-child {
    grid-column: 1 / -1;
  }
  .content-area {
    padding: 12px 16px 16px;
    overflow: visible;
  }
  .sh { display: block; }
  .bottom-nav {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    position: fixed; bottom: 0; left: 0; right: 0;
    background: rgba(8,8,8,0.96);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid var(--border);
    padding-bottom: env(safe-area-inset-bottom);
    z-index: 100;
  }
  .nav-btn {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 4px; min-height: var(--nav-h);
    color: var(--text-3);
    font-size: 0.6rem; font-weight: 600; letter-spacing: 0.04em;
    border-top: 2px solid transparent;
    transition: color .15s, border-color .15s;
    padding: 0 4px;
  }
  .nav-btn svg { width: 20px; height: 20px; }
  .nav-btn.active { color: var(--accent); border-top-color: var(--accent); }
  .nav-btn:active { opacity: .65; }
}
```

- [ ] **Step 3: Retain all existing section-specific CSS unchanged**

The following CSS blocks must remain in the `<style>` tag exactly as-is (do not delete or modify):
- `/* BOODSCHAPPEN */` section: `.week-row`, `.week-lbl`, `.reset-btn`, `.prog-card`, `.prog-row`, `.prog-price`, `.prog-price-num`, `.prog-count`, `.prog-track`, `.prog-fill`, `.cat-card`, `.cat-header`, `.c-item`, `.c-box`, `.c-info`, `.c-name`, `.c-item.checked`, `.c-price`
- `/* FITNESS */` section: `.day-scroll`, `.day-btn`, `.day-panel`, `.day-hdr`, `.rest-card`, `.rest-icon`, `.rest-msg`, `.ex-card`, `.ex-top`, `.ex-name`, `.ex-reps`, `.ex-sets`, `.set-btn`, `.sess-footer`, `.sess-btn`, `.sess-cel`
- `/* VOEDING */` section: `.macro-row`, `.macro-cell`, `.macro-val`, `.macro-lbl`, `.intake-note`, `.meal-card`, `.meal-sum`, `.meal-time`, `.meal-mid`, `.meal-name`, `.meal-kcal`, `.meal-chev`, `.meal-body`, `.meal-tip`
- `/* INFO */` section: `.weight-card`, `.weight-endpoints`, `.weight-side`, `.weight-kg`, `.weight-track`, `.weight-fill`, `.weight-meta`, `.stats-grid`, `.stat-cell`, `.stat-icon-wrap`, `.sched-grid`, `.sched-day`, `.sched-abbr`, `.sched-type` (push/pull/legs/rest), `.quote-card`, `.quote-text`, `.quote-by`
- The `.card` and `.card-label` generic card styles

Note: The existing `.tab { display:none; }` and `.tab.active { display:block; }` from the original are replaced by the new version above — they are NOT duplicated.

- [ ] **Step 4: Remove the old `.sh` CSS and old `#app` / `main` CSS**

Delete these old rules (they are superseded by the new ones):
- Old `#app { max-width: 430px; ... }`
- Old `main { padding-bottom: ... }`
- Old `.tab { display:none; }` and `.tab.active { ... }` and `@keyframes fadeUp { ... }` (replaced above)
- Old `.bottom-nav { position: fixed; ... }` and `.nav-btn { ... }` (replaced above)
- Old `.sh { ... }`, `.sh-label { ... }`, `.sh-title { ... }`, `.sh-sub { ... }`

---

## Task 2: HTML shell — Sidebar, topbar, stat row, content wrapper

**Files:**
- Modify: `public/M1K3/index.html` — replace `<div id="app">` structure

- [ ] **Step 1: Replace `<div id="app">` opening and `<main>` wrapper**

Old structure:
```html
<div id="app">
  <main>
    <section id="tab-boodschappen" class="tab active"> ...
    <section id="tab-fitness" class="tab"> ...
    <section id="tab-voeding" class="tab"> ...
    <section id="tab-info" class="tab"> ...
  </main>
  <nav class="bottom-nav" ...> ... </nav>
</div>
```

New structure — wrap the existing `<main>` contents inside a new shell:
```html
<div id="app">

  <!-- SIDEBAR (desktop only) -->
  <aside class="sidebar" role="navigation" aria-label="Hoofdnavigatie">
    <div class="sidebar-logo">
      <div class="logo-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      </div>
      <div>
        <div class="logo-text">M1K3</div>
        <div class="logo-sub">Bulk Tracker</div>
      </div>
    </div>

    <div class="nav-section">
      <div class="nav-section-label">Menu</div>
      <button class="nav-item active" id="sidebar-boodschappen" onclick="showTab('boodschappen')" aria-label="Boodschappen">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39A2 2 0 009.66 16h9.72a2 2 0 001.97-1.67L23 6H6"/>
        </svg>
        Boodschappen
        <span class="nav-badge" id="sidebar-badge-boodschappen">–</span>
      </button>
      <button class="nav-item" id="sidebar-fitness" onclick="showTab('fitness')" aria-label="Fitness">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        Fitness
        <span class="nav-badge" id="sidebar-badge-fitness">–</span>
      </button>
      <button class="nav-item" id="sidebar-voeding" onclick="showTab('voeding')" aria-label="Voeding">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><line x1="7" y1="2" x2="7" y2="22"/>
          <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
        </svg>
        Voeding
        <span class="nav-badge" id="sidebar-badge-voeding">3100</span>
      </button>
      <button class="nav-item" id="sidebar-info" onclick="showTab('info')" aria-label="Info">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        Info
      </button>
    </div>

    <div class="sidebar-spacer"></div>

    <div class="user-card">
      <div class="user-card-row">
        <div class="user-avatar" aria-hidden="true">M</div>
        <div>
          <div class="user-name">Mike</div>
          <div class="user-meta">Bulk fase</div>
        </div>
      </div>
      <div class="user-stats">
        <div class="user-stat">
          <div class="user-stat-val">57 kg</div>
          <div class="user-stat-key">huidig</div>
        </div>
        <div class="user-stat">
          <div class="user-stat-val">65 kg</div>
          <div class="user-stat-key">doel</div>
        </div>
      </div>
    </div>
  </aside>

  <!-- MAIN AREA -->
  <div class="main-area">

    <!-- Topbar (updated by JS per tab) -->
    <div class="topbar" id="topbar">
      <div class="topbar-left">
        <div class="topbar-title" id="topbar-title">Boodschappen</div>
        <div class="topbar-sub" id="topbar-sub"></div>
      </div>
      <div class="topbar-actions" id="topbar-actions"></div>
    </div>

    <!-- Stat cards (updated by JS per tab) -->
    <div class="stat-row" id="stat-row"></div>

    <!-- Scrollable tab content -->
    <div class="content-area">
      [PASTE ALL EXISTING <section> TAGS HERE UNCHANGED]
    </div>
  </div>

  <!-- Bottom nav (mobile only — shown via CSS media query) -->
  <nav class="bottom-nav" role="navigation" aria-label="Hoofdnavigatie mobiel">
    <button class="nav-btn active" id="nav-boodschappen" onclick="showTab('boodschappen')" aria-label="Boodschappen">
      <svg width="20" height="20"><use href="#ic-cart"/></svg>
      <span>Boodschappen</span>
    </button>
    <button class="nav-btn" id="nav-fitness" onclick="showTab('fitness')" aria-label="Fitness">
      <svg width="20" height="20"><use href="#ic-activity"/></svg>
      <span>Fitness</span>
    </button>
    <button class="nav-btn" id="nav-voeding" onclick="showTab('voeding')" aria-label="Voeding">
      <svg width="20" height="20"><use href="#ic-utensils"/></svg>
      <span>Voeding</span>
    </button>
    <button class="nav-btn" id="nav-info" onclick="showTab('info')" aria-label="Info">
      <svg width="20" height="20"><use href="#ic-user"/></svg>
      <span>Info</span>
    </button>
  </nav>

</div>
```

Note: The `[PASTE ALL EXISTING <section> TAGS HERE UNCHANGED]` placeholder means copy all four existing `<section id="tab-*">` elements verbatim into `.content-area`. Do not modify their content.

- [ ] **Step 2: Remove old `<main>` wrapper tags**

The `<main>` and `</main>` wrapper tags are removed — the four `<section>` elements now live directly inside `.content-area > div`. The `id="main-content"` attribute is also removed (not used by JS).

---

## Task 3: JS — showTab extension + 3 new helper functions

**Files:**
- Modify: `public/M1K3/index.html` — `<script>` block

- [ ] **Step 1: Add `updateSidebarBadges()` function** (add before `showTab`)

```js
function updateSidebarBadges() {
  // Boodschappen badge: done/total
  const all     = BOODSCHAPPEN.flatMap(c => c.items);
  const checked = safeJSON(localStorage.getItem('checklist_items'), {});
  const done    = Object.keys(checked).length;
  const total   = all.length;
  const bb = document.getElementById('sidebar-badge-boodschappen');
  if (bb) bb.textContent = done + '/' + total;

  // Fitness badge: today's training type
  const todayId  = JS_DAY[new Date().getDay()];
  const todayDay = SCHEMA.find(d => d.id === todayId);
  const fb = document.getElementById('sidebar-badge-fitness');
  if (fb && todayDay) fb.textContent = todayDay.type;
}
```

- [ ] **Step 2: Add `renderTopbar(tabId)` function** (add after `updateSidebarBadges`)

```js
const TOPBAR_CONFIG = {
  boodschappen: {
    title: 'Boodschappen',
    sub: () => {
      const now  = new Date();
      const M    = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
      const mon  = monday(now);
      return 'Week van ' + mon.getDate() + ' ' + M[mon.getMonth()];
    },
    actions: () => `
      <button class="topbar-btn" id="topbar-reset-btn" aria-label="Week resetten">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
        </svg>
        Reset week
      </button>`
  },
  fitness: {
    title: 'Fitness',
    sub: () => {
      const todayId  = JS_DAY[new Date().getDay()];
      const todayDay = SCHEMA.find(d => d.id === todayId);
      return todayDay ? todayDay.label + ' — ' + todayDay.type : 'Training';
    },
    actions: () => ''
  },
  voeding: {
    title: 'Voeding',
    sub: () => 'Dagplan · 3100 kcal · 155g eiwit',
    actions: () => ''
  },
  info: {
    title: 'Info',
    sub: () => 'Bulk fase — week ' + isoWeek(new Date()),
    actions: () => ''
  }
};

function renderTopbar(tabId) {
  const cfg = TOPBAR_CONFIG[tabId];
  if (!cfg) return;
  const titleEl   = document.getElementById('topbar-title');
  const subEl     = document.getElementById('topbar-sub');
  const actionsEl = document.getElementById('topbar-actions');
  if (titleEl)   titleEl.textContent = cfg.title;
  if (subEl)     subEl.textContent   = cfg.sub();
  if (actionsEl) actionsEl.innerHTML = cfg.actions();

  // Wire reset button if present
  const resetBtn = document.getElementById('topbar-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!confirm('Week resetten? Alle vinkjes worden gewist.')) return;
      localStorage.removeItem('checklist_items');
      localStorage.setItem('checklist_week', String(isoWeek(new Date())));
      buildBoodschappen();
      renderStatCards('boodschappen');
      updateSidebarBadges();
    });
  }
}
```

- [ ] **Step 3: Add `renderStatCards(tabId)` function** (add after `renderTopbar`)

```js
function renderStatCards(tabId) {
  const row = document.getElementById('stat-row');
  if (!row) return;

  if (tabId === 'boodschappen') {
    const all     = BOODSCHAPPEN.flatMap(c => c.items);
    const checked = safeJSON(localStorage.getItem('checklist_items'), {});
    const done    = Object.keys(checked).length;
    const total   = all.length;
    let sum = 0;
    all.forEach(i => { if (checked[i.id]) sum += i.price; });
    const budget  = all.reduce((acc, i) => acc + i.price, 0);
    const rest    = Math.max(0, budget - sum);
    const pct     = total > 0 ? Math.round(done / total * 100) : 0;

    row.innerHTML = `
      <div class="stat-card">
        <div class="stat-card-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          Items gehaald
        </div>
        <div class="stat-val">${done}</div>
        <div class="stat-meta">van ${total} items · ${pct}%</div>
        <div class="stat-bar"><div class="stat-bar-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          Uitgegeven
        </div>
        <div class="stat-val">${fmtPrice(sum)}</div>
        <div class="stat-meta">budget ~${fmtPrice(budget)}</div>
        <div class="stat-bar"><div class="stat-bar-fill" style="width:${budget > 0 ? Math.round(sum/budget*100) : 0}%"></div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Rest budget
        </div>
        <div class="stat-val neutral">${fmtPrice(rest)}</div>
        <div class="stat-meta">${total - done} items resterend</div>
        <div class="stat-bar"><div class="stat-bar-fill" style="width:${budget > 0 ? Math.round(rest/budget*100) : 0}%; background:var(--surface-3);"></div></div>
      </div>`;

  } else if (tabId === 'fitness') {
    const todayId  = JS_DAY[new Date().getDay()];
    const todayDay = SCHEMA.find(d => d.id === todayId);
    const type     = todayDay ? todayDay.type : '–';
    const sessionsThisWeek = SCHEMA.filter(d => !d.rest && localStorage.getItem('fitness_done_' + d.id) === 'true').length;
    const totalSessions    = SCHEMA.filter(d => !d.rest).length;

    // Count today's completed sets
    let setsTotal = 0, setsDone = 0;
    if (todayDay && !todayDay.rest) {
      todayDay.exercises.forEach((ex, idx) => {
        const sets = safeJSON(localStorage.getItem('fitness_sets_' + todayDay.id + '_' + idx), new Array(ex.sets).fill(false));
        setsTotal += ex.sets;
        setsDone  += sets.filter(Boolean).length;
      });
    }

    row.innerHTML = `
      <div class="stat-card">
        <div class="stat-card-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Vandaag
        </div>
        <div class="stat-val">${type}</div>
        <div class="stat-meta">${todayDay?.label || '–'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          Sets vandaag
        </div>
        <div class="stat-val">${setsDone}</div>
        <div class="stat-meta">van ${setsTotal} sets</div>
        <div class="stat-bar"><div class="stat-bar-fill" style="width:${setsTotal > 0 ? Math.round(setsDone/setsTotal*100) : 0}%"></div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Sessions week
        </div>
        <div class="stat-val">${sessionsThisWeek}</div>
        <div class="stat-meta">van ${totalSessions} trainingen</div>
        <div class="stat-bar"><div class="stat-bar-fill" style="width:${Math.round(sessionsThisWeek/totalSessions*100)}%"></div></div>
      </div>`;

  } else if (tabId === 'voeding') {
    row.innerHTML = `
      <div class="stat-card">
        <div class="stat-card-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Kcal doel
        </div>
        <div class="stat-val">3100</div>
        <div class="stat-meta">kcal per dag</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          Eiwit doel
        </div>
        <div class="stat-val">155g</div>
        <div class="stat-meta">per dag</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><line x1="7" y1="2" x2="7" y2="22"/><path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
          Maaltijden
        </div>
        <div class="stat-val neutral">5×</div>
        <div class="stat-meta">per dag</div>
      </div>`;

  } else if (tabId === 'info') {
    row.innerHTML = `
      <div class="stat-card">
        <div class="stat-card-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/></svg>
          Huidig gewicht
        </div>
        <div class="stat-val">57 kg</div>
        <div class="stat-meta">startgewicht bulk</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          Doelgewicht
        </div>
        <div class="stat-val">65 kg</div>
        <div class="stat-meta">bulk eindgewicht</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Te gaan
        </div>
        <div class="stat-val neutral">+8 kg</div>
        <div class="stat-meta">~0.5–1 kg / maand</div>
      </div>`;
  }
}
```

- [ ] **Step 4: Extend `showTab(id)` — add sidebar active state + render calls**

Find the existing `showTab` function:
```js
function showTab(id) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id)?.classList.add('active');
  document.getElementById('nav-' + id)?.classList.add('active');
  localStorage.setItem('active_tab', id);
}
```

Replace with:
```js
function showTab(id) {
  // Tabs
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + id)?.classList.add('active');

  // Bottom nav (mobile)
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('nav-' + id)?.classList.add('active');

  // Sidebar nav (desktop)
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('sidebar-' + id)?.classList.add('active');

  // Topbar + stat cards
  renderTopbar(id);
  renderStatCards(id);
  updateSidebarBadges();

  localStorage.setItem('active_tab', id);
}
```

- [ ] **Step 5: Update `updateShopUI` to also refresh sidebar badge and stat cards**

Find in `updateShopUI(checked)`:
```js
  const fill = document.getElementById('prog-fill');
  if (fill) fill.style.width = total > 0 ? `${done / total * 100}%` : '0%';
}
```

Add two lines after the last `if (fill)` line, before the closing `}`:
```js
  updateSidebarBadges();
  // Refresh stat cards if boodschappen tab is active
  if (document.getElementById('tab-boodschappen')?.classList.contains('active')) {
    renderStatCards('boodschappen');
  }
```

- [ ] **Step 6: Fix emoji in `doneSession` — replace text emoji with plain text**

Find in `doneSession(id)`:
```js
  if (btn) { btn.disabled = true; btn.textContent = '✓ Sessie voltooid'; }
```

Replace with:
```js
  if (btn) { btn.disabled = true; btn.textContent = 'Sessie voltooid'; }
```

- [ ] **Step 7: Update DOMContentLoaded boot to call new functions**

Find:
```js
document.addEventListener('DOMContentLoaded', () => {
  buildBoodschappen();
  buildFitness();
  buildSchedGrid();
  // Restore last tab (must run after sections are built)
  showTab(localStorage.getItem('active_tab') || 'boodschappen');
});
```

No change needed — `showTab()` now calls `renderTopbar`, `renderStatCards`, and `updateSidebarBadges` automatically.

---

## Task 4: Verify and commit

**Files:** none new

- [ ] **Step 1: Open browser at `http://localhost:5173/M1K3/`** (or wherever Vite dev server runs)

Run dev server if not already running:
```bash
cd C:/Users/david/Vexxo
npm run dev
```

- [ ] **Step 2: Verify desktop layout (browser width ≥ 900px)**

Check:
- Sidebar visible on left (220px), logo + 4 nav items + user card at bottom
- Active tab has green icon + accent-dim background in sidebar
- Topbar shows correct title + subtitle for each tab
- Stat cards show correct 3 values per tab
- All 4 tabs switch correctly via sidebar clicks
- Boodschappen checklist works (checkboxes toggle, badge + stat cards update live)
- Fitness set buttons toggle, day selector works
- Voeding accordion opens/closes
- Info weight bar, stats grid, schedule all render

- [ ] **Step 3: Verify mobile layout (browser width < 900px — use DevTools responsive mode)**

Check:
- Sidebar hidden
- Bottom nav visible and functional
- Topbar renders correctly (compact)
- Stat cards in 2 columns (third full-width)
- All tabs work, no layout overflow

- [ ] **Step 4: Commit**

```bash
cd C:/Users/david/Vexxo
git add public/M1K3/index.html
git commit -m "feat: M1K3 dashboard redesign — sidebar on desktop, responsive mobile"
```

---

## Quick Reference: ID map

| Element | ID |
|---|---|
| Sidebar nav boodschappen | `#sidebar-boodschappen` |
| Sidebar nav fitness | `#sidebar-fitness` |
| Sidebar nav voeding | `#sidebar-voeding` |
| Sidebar nav info | `#sidebar-info` |
| Sidebar badge boodschappen | `#sidebar-badge-boodschappen` |
| Sidebar badge fitness | `#sidebar-badge-fitness` |
| Sidebar badge voeding | `#sidebar-badge-voeding` |
| Topbar title | `#topbar-title` |
| Topbar subtitle | `#topbar-sub` |
| Topbar actions | `#topbar-actions` |
| Reset button (injected) | `#topbar-reset-btn` |
| Stat row | `#stat-row` |
| Bottom nav boodschappen | `#nav-boodschappen` |
| Bottom nav fitness | `#nav-fitness` |
| Bottom nav voeding | `#nav-voeding` |
| Bottom nav info | `#nav-info` |
