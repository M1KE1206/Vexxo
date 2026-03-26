---
phase: 1
slug: hsl-theming-light-mode
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vite.config.ts / vitest.config.ts |
| **Quick run command** | `npm run test -- --run` |
| **Full suite command** | `npm run test -- --run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- --run`
- **After every plan wave:** Run `npm run test -- --run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | THEME-01 | manual | visual browser check | N/A | ⬜ pending |
| 1-01-02 | 01 | 1 | THEME-02 | manual | visual browser check | N/A | ⬜ pending |
| 1-02-01 | 02 | 1 | THEME-02, THEME-03 | manual | visual browser check | N/A | ⬜ pending |
| 1-03-01 | 03 | 2 | THEME-04, THEME-05 | manual | visual browser check + localStorage | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — CSS/theming changes are visual and require manual browser verification.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dark/light toggle zichtbaar switcht | THEME-04 | Visuele CSS state change | Open browser, klik toggle in Navbar, controleer kleurwisseling |
| Light mode — geen blinde spots | THEME-03 | Visuele leesbaarheid | Switch naar light mode, scroll alle secties, controleer contrast |
| Themakeuze bewaard na refresh | THEME-05 | localStorage persistence | Zet light mode, druk F5, controleer dat light mode actief blijft |
| HSL tokens in gebruik | THEME-01 | CSS inspect | Open DevTools, inspect `:root`, controleer `hsl()` notatie |
| 60/30/10 rule — beide modes | THEME-02 | Visueel oordeel | Vergelijk beide modes met CLAUDE.md kleurprincipes |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
