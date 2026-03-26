---
phase: 01-hsl-theming-light-mode
plan: 01
subsystem: css-theming
tags: [hsl, css-custom-properties, tailwind, theming, dark-mode]
dependency_graph:
  requires: []
  provides: [hsl-tokens, tailwind-variable-references]
  affects: [src/index.css, tailwind.config.ts, all-tailwind-utility-consumers]
tech_stack:
  added: []
  patterns: [hsl-channel-only-tokens, css-variable-tailwind-integration]
key_files:
  created: []
  modified:
    - src/index.css
    - tailwind.config.ts
decisions:
  - "HSL channel-only format for all theme tokens (no hsl() wrapper on variable itself, only at usage)"
  - "Theme transition added to :root: color 350ms, background-color 350ms, border-color 350ms"
  - "Tailwind colors now reference CSS variables, making utilities theme-aware for Plan 02 data-theme overrides"
  - "Removed 13 deprecated/unused Tailwind color keys (surface-container*, surface-bright, tertiary, etc.)"
  - "Legacy orbit-purple and border keys kept with updated CSS variable values for src/app/ compat"
metrics:
  duration_minutes: 2
  completed_date: "2026-03-26"
  tasks_completed: 2
  tasks_total: 2
  files_changed: 2
requirements_satisfied: [THEME-01]
---

# Phase 1 Plan 01: HSL Token Migration Summary

**One-liner:** Migrated all 13 theme color tokens in index.css from HEX/RGB to HSL channel-only format and wired Tailwind config to CSS variable references via `hsl(var(--token))`.

---

## What Was Built

### Task 1: index.css :root HSL Migration

The entire `:root` block was replaced with HSL channel-only custom properties matching the CLAUDE.md token convention. All 8 old property names were removed (`--background`, `--surface`, `--on-surface`, `--on-surface-variant`, `--orbit-purple`, `--border`, `--text-primary`, `--text-muted`) and replaced with the canonical names (`--color-bg`, `--color-surface`, etc.).

New tokens in `:root`:
- `--color-bg: 240 25% 4%`
- `--color-surface: 240 20% 6%`
- `--color-surface-2: 240 18% 9%`
- `--color-surface-3: 240 17% 11%`
- `--color-border: 0 0% 100% / 0.08`
- `--color-border-hover: 262 82% 58% / 0.3`
- `--color-text: 270 67% 96%`
- `--color-text-muted: 270 5% 67%`
- `--color-text-faint: 255 5% 35%`
- `--primary: 262 82% 57%`
- `--primary-dim: 263 71% 50%`
- `--secondary: 25 95% 53%`
- `--accent: 280 93% 75%`

Theme transition (D-08/D-09) added: `color 350ms ease, background-color 350ms ease, border-color 350ms ease`.

All CSS property usages updated to `hsl(var(...))` format at call sites: `body`, `.glass-card`, `.gradient-text`, `.btn-primary`, `.btn-outline`, `.card`, `.pill`, `.social-icon`, `input[type="range/checkbox/radio"]`.

Decorative hardcoded HEX preserved as specified: `gradient-text-animated` colors, `section-fade` background (#0e0e13 — Plan 02 will override with `[data-theme="light"]`), `social-icon:hover` padding-box background, `body::before` orb rgba values.

### Task 2: tailwind.config.ts CSS Variable References

All 17 hardcoded HEX color values replaced with `hsl(var(--token))` references. 13 deprecated/unused keys removed. Final color map:

```ts
background:           "hsl(var(--color-bg))"
surface:              "hsl(var(--color-surface))"
"surface-2":          "hsl(var(--color-surface-2))"
"surface-3":          "hsl(var(--color-surface-3))"
"on-surface":         "hsl(var(--color-text))"
"on-surface-variant": "hsl(var(--color-text-muted))"
primary:              "hsl(var(--primary))"
"primary-dim":        "hsl(var(--primary-dim))"
secondary:            "hsl(var(--secondary))"
accent:               "hsl(var(--accent))"
"on-primary":         "#ffffff"
"on-primary-fixed":   "#ffffff"
error:                "#ff6e84"
"orbit-purple":       "hsl(var(--primary))"   // legacy compat
border:               "hsl(var(--color-border))"
```

Tailwind utilities (`bg-background`, `text-on-surface`, `text-primary`, etc.) now respond dynamically to CSS variable changes — enabling Plan 02's `[data-theme="light"]` block to affect all utility classes automatically.

---

## Commits

| Task | Commit | Message |
|------|--------|---------|
| 1 | 076f086 | feat(01-01): migrate index.css :root to HSL channel-only tokens |
| 2 | 679145f | feat(01-01): update tailwind.config.ts to use CSS variable references |

---

## Deviations from Plan

None — plan executed exactly as written.

The `.card` and `.pill` Tailwind `@apply` directives were updated from `bg-[var(--surface)]`/`text-[var(--text-muted)]` to `bg-surface-2`/`text-on-surface-variant` per the plan's step 2 guidance. The `border-[var(--border)]` was updated to `border-[hsl(var(--color-border))]` (theme-aware, as specified).

---

## Known Stubs

None — this plan is pure CSS/config. No data flows or UI rendering.

The following hardcoded HEX values remain intentionally preserved for Plan 02 to override via `[data-theme="light"]`:
- `src/index.css` `.section-fade::before/::after`: `#0e0e13` background
- `src/index.css` `.social-icon:hover`: `#0e0e13` padding-box background
- `src/index.css` `body::before`: `rgba(124,58,237,0.08)` / `rgba(249,115,22,0.06)` orbs
- `src/index.css` `.gradient-text-animated`: `#7C3AED`, `#F97316`, `#C084FC` (decorative, fixed — intentionally not themable)

These are documented per the plan's "Step 3: Keep hardcoded colors" directive.

---

## Self-Check: PASSED

| Check | Result |
|-------|--------|
| src/index.css exists | FOUND |
| tailwind.config.ts exists | FOUND |
| commit 076f086 (Task 1) exists | FOUND |
| commit 679145f (Task 2) exists | FOUND |
