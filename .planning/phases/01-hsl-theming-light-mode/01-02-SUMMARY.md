---
phase: 01-hsl-theming-light-mode
plan: 02
subsystem: css-theming
tags: [light-mode, css-custom-properties, glass-cards, section-fade, theming]
dependency_graph:
  requires: [01-01]
  provides: [light-mode-css, data-theme-overrides]
  affects: [src/index.css]
tech_stack:
  added: []
  patterns: [data-theme-attribute-overrides, css-specificity-theming]
key_files:
  created: []
  modified:
    - src/index.css
decisions:
  - "Light mode token block placed immediately after :root, before html/body — clean cascade order"
  - "Glass card override uses rgba(230,225,245,0.45) lila-white tint per D-03 (not a gradient background)"
  - "Background orbs reduced to 0.04/0.03 opacity in light mode — visible but non-dominant"
  - "section-fade uses hsl(var(--color-bg)) instead of hardcoded #0e0e13 — fully theme-aware"
  - "social-icon hover uses CSS variable gradient border — adapts to light primary/secondary tokens"
  - "Navbar/mobile menu/dropdown Tailwind class overrides deferred to Plan 03 (component-level)"
metrics:
  duration_minutes: 5
  completed_date: "2026-03-26"
  tasks_completed: 1
  tasks_total: 1
  files_changed: 1
requirements_satisfied: [THEME-02]
---

# Phase 1 Plan 02: Light Mode CSS Override Blocks Summary

**One-liner:** Added complete `[data-theme="light"]` override set to index.css — 13 token overrides plus component-specific overrides for glass cards (D-03), background orbs (Pitfall 2), section-fade gradients (Pitfall 1), social icons, and outline buttons.

---

## What Was Built

### Task 1: Light Mode CSS Blocks in index.css

Six CSS blocks were added to `src/index.css`, inserted at the correct cascade positions to override the dark mode `:root` values when `data-theme="light"` is set on `<html>`.

**Block 1 — Token Override Block** (inserted after `:root`, before `html, body`):

All 13 theme tokens overridden for the lila-tinted light palette:

| Token | Light Value | Approx Hex |
|-------|-------------|------------|
| `--color-bg` | `270 20% 97%` | `#F5F3FA` |
| `--color-surface` | `270 18% 94%` | `#EDE9F5` |
| `--color-surface-2` | `270 15% 91%` | `#E4E0EE` |
| `--color-surface-3` | `270 12% 88%` | `#DDD9E8` |
| `--color-border` | `0 0% 0% / 0.08` | `rgba(0,0,0,0.08)` |
| `--color-border-hover` | `263 71% 42% / 0.3` | `rgba(109,40,217,0.3)` |
| `--color-text` | `256 30% 12%` | `#1A1625` |
| `--color-text-muted` | `256 10% 40%` | `#605B70` |
| `--color-text-faint` | `256 8% 62%` | `#9A95A8` |
| `--primary` | `263 71% 50%` | `#6D28D9` |
| `--primary-dim` | `263 60% 44%` | `#5B20C0` |
| `--secondary` | `24 88% 46%` | `#EA6808` |
| `--accent` | `280 80% 65%` | `#B555F0` |

**Block 2 — Glass Card Override** (after `.glass-card:hover`):

Lila-white tint `rgba(230, 225, 245, 0.45)` with dark border `rgba(0,0,0,0.08)`. Hover state uses purple shadow at reduced opacity. `backdrop-filter: blur(16px)` is inherited from base `.glass-card` — not overridden, so blur is preserved (D-03).

**Block 3 — Background Orbs** (after `body::before`):

Purple orb reduced from `rgba(124,58,237,0.08)` to `rgba(109,40,217,0.04)`. Orange orb reduced from `rgba(249,115,22,0.06)` to `rgba(234,104,8,0.03)`. Orbs remain visible but do not dominate the light surface.

**Block 4 — Section Fade** (after `.section-fade::after`):

Overrides both `::before` and `::after` with `hsl(var(--color-bg))` instead of hardcoded `#0e0e13`. Eliminates dark stripe artifact on light backgrounds (Pitfall 1 from RESEARCH.md).

**Block 5 — Social Icon** (after `.social-icon:active`):

Base state: border changed to `rgba(0,0,0,0.1)` (was `rgba(255,255,255,0.1)` — invisible on light bg).
Hover: gradient border uses `hsl(var(--primary))` and `hsl(var(--secondary))` — adapts to deepened light mode values (D-04). Padding-box background references `hsl(var(--color-bg))` instead of hardcoded `#0e0e13`.

**Block 6 — Outline Button** (after `.btn-outline:active`):

Hover background overridden from `rgba(255,255,255,0.05)` (invisible on light) to `rgba(0,0,0,0.04)` (subtle dark tint on light bg).

---

## Verification

```
grep -c '[data-theme="light"]' src/index.css  → 9
grep "270 20% 97%" src/index.css              → --color-bg: 270 20% 97%;
```

All acceptance criteria confirmed:
- `[data-theme="light"]` block with `--color-bg: 270 20% 97%` — PASS
- `[data-theme="light"]` block with `--color-text: 256 30% 12%` — PASS
- `[data-theme="light"]` block with `--primary: 263 71% 50%` — PASS
- `[data-theme="light"]` block with `--secondary: 24 88% 46%` — PASS
- `[data-theme="light"] .glass-card` with `rgba(230, 225, 245, 0.45)` — PASS
- `[data-theme="light"] body::before` with `rgba(109, 40, 217, 0.04)` — PASS
- `[data-theme="light"] .section-fade::before` rule — PASS
- `[data-theme="light"] .social-icon:hover` rule — PASS
- `[data-theme="light"] .btn-outline:hover` with `rgba(0, 0, 0, 0.04)` — PASS
- `@media (prefers-reduced-motion: reduce)` block intact — PASS
- `body.modal-open .page-content *` block intact — PASS

---

## Commits

| Task | Commit | Message |
|------|--------|---------|
| 1 | b533ee5 | feat(01-02): add [data-theme='light'] CSS override blocks to index.css |

---

## Deviations from Plan

None — plan executed exactly as written.

Blocks 7-9 (navbar scroll state, mobile menu, dropdown) were explicitly excluded per plan instructions. These use Tailwind hardcoded utility classes and will be handled at component level in Plan 03.

---

## Known Stubs

None.

The following CSS classes still contain hardcoded dark values that are correctly overridden by the light mode blocks added in this plan:
- `.section-fade::before/::after`: `#0e0e13` (dark mode base, overridden by Block 4)
- `.social-icon:hover`: `#0e0e13` padding-box (dark mode base, overridden by Block 5)
- `body::before`: `rgba(124,58,237,0.08)` / `rgba(249,115,22,0.06)` (dark mode base, overridden by Block 3)

These are intentionally preserved in the dark mode base rules and correctly handled via `[data-theme="light"]` specificity overrides.

---

## Self-Check: PASSED

| Check | Result |
|-------|--------|
| src/index.css exists | FOUND |
| commit b533ee5 (Task 1) exists | FOUND |
| `[data-theme="light"]` selector count = 9 | FOUND |
| `--color-bg: 270 20% 97%` in light block | FOUND |
| `@media (prefers-reduced-motion: reduce)` intact | FOUND |
| `body.modal-open .page-content *` intact | FOUND |
