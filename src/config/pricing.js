// ─────────────────────────────────────────────
//  PRICING CONFIG — edit numbers here only.
//  All components read from this file.
// ─────────────────────────────────────────────

/** Service type buttons (informational, same base price for all) */
export const serviceTypes = [
  { id: "landing",   label: "Landing Page" },
  { id: "multipage", label: "Multi-page App" },
  { id: "ecommerce", label: "E-commerce" },
];

/** Vexxo base pricing */
export const vexxo = {
  base: 599,      // fixed base price (€)
  perPage: 100,   // added per page (€)
};

/** Add-ons — each adds extra cost per page */
export const addOns = {
  seo: {
    perPage: 50,
    labelEN: "Advanced SEO Optimization",
    labelNL: "Geavanceerde SEO Optimalisatie",
  },
  content: {
    perPage: 50,
    labelEN: "Custom Content Strategy",
    labelNL: "Contentstrategieondersteuning",
  },
};

/** Timeline options — adds cost per page */
export const timeline = {
  "7days":  { perPage: 100, labelEN: "Within 7 days",  labelNL: "Binnen 7 dagen" },
  "14days": { perPage: 25,  labelEN: "Within 14 days", labelNL: "Binnen 14 dagen" },
  regular:  { perPage: 0,   labelEN: "Regular speed",  labelNL: "Normale snelheid" },
};

/** Competitor comparison pricing (static — changes only here) */
export const comparison = {
  agency:     { base: 2000, perPage: 400, labelEN: "Typical Agency",     labelNL: "Typisch Bureau" },
  freelancer: { base: 1000, perPage: 200, labelEN: "Regular Freelancer", labelNL: "Gewone Freelancer" },
};

/** Page range for the slider */
export const pageRange = { min: 1, max: 30, default: 5 };
