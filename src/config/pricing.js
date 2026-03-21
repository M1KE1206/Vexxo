// ─────────────────────────────────────────────
//  PRICING CONFIG — edit numbers here only.
//  All components read from this file.
// ─────────────────────────────────────────────

/** Service type buttons in the calculator (informational) */
export const serviceTypes = [
  { id: "landing",   label: "Landing Page" },
  { id: "multipage", label: "Multi-page App" },
  { id: "ecommerce", label: "E-commerce" },
];

/** Vexxo base pricing */
export const vexxo = {
  base: 399,      // fixed base price (€)
  perPage: 49.99, // added per page (€)
};

/** Add-ons — extra cost per page */
export const addOns = {
  seo: {
    perPage: 30,
    labelEN: "Advanced SEO Optimization",
    labelNL: "Geavanceerde SEO Optimalisatie",
  },
  content: {
    perPage: 30,
    labelEN: "Custom Content Strategy",
    labelNL: "Contentstrategieondersteuning",
  },
};

/** Timeline options — extra cost per page */
export const timeline = {
  "7days":  { perPage: 50, labelEN: "Within 7 days",  labelNL: "Binnen 7 dagen" },
  "14days": { perPage: 15, labelEN: "Within 14 days", labelNL: "Binnen 14 dagen" },
  regular:  { perPage: 0,  labelEN: "Regular speed",  labelNL: "Normale snelheid" },
};

/**
 * Competitor comparison pricing (static).
 *
 * Verification — worst case (30 pages + SEO + Content + 7 days):
 *   Vexxo:      399 + (49.99 + 30 + 30 + 50) × 30 = €5,199  ✓
 *   Freelancer: 1000 + 200 × 30               = €7,000  ✓ (Vexxo ~26% cheaper)
 *   Agency:     2000 + 400 × 30               = €14,000 ✓
 */
export const comparison = {
  agency:     { base: 2000, perPage: 400, labelEN: "Typical Agency",     labelNL: "Typisch Bureau" },
  freelancer: { base: 1000, perPage: 200, labelEN: "Regular Freelancer", labelNL: "Gewone Freelancer" },
};

/** Page range for the slider */
export const pageRange = { min: 1, max: 30, default: 5 };
