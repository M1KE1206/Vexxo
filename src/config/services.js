// ─────────────────────────────────────────────
//  SERVICES CONFIG
//  Package data for service request modal.
//  All prices and features live here.
// ─────────────────────────────────────────────

export const serviceCategories = [
  { id: "design", labelEN: "Design", labelNL: "Design" },
  { id: "development", labelEN: "Development", labelNL: "Development" },
  { id: "fullstack", labelEN: "Fullstack", labelNL: "Fullstack" },
];

export const packages = {
  design: [
    {
      id: "logo-design",
      icon: "brush",
      name: "Logo Design",
      nameNL: "Logo Design",
      description: "A distinctive mark that makes your brand instantly recognizable.",
      descriptionNL: "Een onderscheidend logo dat jouw merk direct herkenbaar maakt.",
      price: 800,
      included: 0,
      hasSeo: false,
      features: {
        en: ["3 unique concepts", "Brand color palette", "All file formats (SVG, PNG, PDF)", "2 revision rounds"],
        nl: ["3 unieke concepten", "Merkkleurenpalet", "Alle bestandsformaten (SVG, PNG, PDF)", "2 revisierondes"],
      },
    },
    {
      id: "brand-identity",
      icon: "palette",
      name: "Brand Identity",
      nameNL: "Merkidentiteit",
      description: "Full visual system: logo, typography, colors, and brand guidelines.",
      descriptionNL: "Volledig visueel systeem: logo, typografie, kleuren en merkrichtlijnen.",
      price: 1200,
      included: 0,
      hasSeo: false,
      features: {
        en: ["Logo + icon set", "Typography system", "Color palette", "Brand style guide PDF"],
        nl: ["Logo + icoonsset", "Typografiesysteem", "Kleurenpalet", "Merkstijlgids PDF"],
      },
    },
    {
      id: "ui-ux-design",
      icon: "design_services",
      name: "UI/UX Design",
      nameNL: "UI/UX Design",
      description: "High-fidelity Figma designs ready to hand off to development.",
      descriptionNL: "High-fidelity Figma-designs klaar voor overdracht aan development.",
      price: 1500,
      included: 0,
      hasSeo: false,
      features: {
        en: ["Wireframes + user flows", "Full Figma file", "Mobile-first responsive", "Interactive prototype"],
        nl: ["Wireframes + gebruikersstromen", "Volledig Figma-bestand", "Mobile-first responsief", "Interactief prototype"],
      },
    }
  ],

  development: [
    {
      id: "landing-dev",
      icon: "web",
      name: "Single Page",
      nameNL: "Single Page",
      description: "Fast, conversion-focused single page built to capture leads.",
      descriptionNL: "Snelle, conversiegerichte pagina gebouwd om leads te verzamelen.",
      price: 450,
      included: 0,
      hasSeo: false,
      features: {
        en: ["Next.js / Vite build", "Mobile-first responsive", "Contact or lead form", "Core Web Vitals optimized"],
        nl: ["Next.js / Vite build", "Mobile-first responsief", "Contact- of leadformulier", "Core Web Vitals geoptimaliseerd"],
      },
    },
    {
      id: "multi-page",
      icon: "layers",
      name: "Multi-Page Site",
      nameNL: "Multi-Page Site",
      description: "Up to 8 pages with custom animations and a CMS.",
      descriptionNL: "Tot 8 pagina's met aangepaste animaties en een CMS.",
      price: 900,
      included: 8,
      hasSeo: true,
      features: {
        en: ["Up to 8 pages", "CMS integration (Sanity)", "Custom animations", "SEO setup + sitemap"],
        nl: ["Tot 8 pagina's", "CMS-integratie (Sanity)", "Aangepaste animaties", "SEO-setup + sitemap"],
      },
    },
    {
      id: "web-app",
      icon: "code",
      name: "Web App",
      nameNL: "Webapplicatie",
      description: "Full-featured app with auth, database, and dashboard UI.",
      descriptionNL: "Volledige applicatie met auth, database en dashboard-UI.",
      price: 2500,
      included: 0,
      hasSeo: false,
      features: {
        en: ["User authentication", "Supabase / PostgreSQL", "API integrations", "Dashboard UI", "Deployed on Vercel"],
        nl: ["Gebruikersauthenticatie", "Supabase / PostgreSQL", "API-integraties", "Dashboard-UI", "Gedeployd op Vercel"],
      },
    },
    {
      id: "multi-page-app",
      icon: "code",
      name: "Multi-Web App",
      nameNL: "Multi-Web App",
      description: "Full-featured app with auth, database, and dashboard UI.",
      descriptionNL: "Multi pagina met auth, database en dashboard-UI.",
      price: 4500,
      included: 8,
      hasSeo: true,
      features: {
        en: ["User authentication", "Supabase / PostgreSQL", "API integrations", "Dashboard UI", "Deployed on Vercel"],
        nl: ["Gebruikersauthenticatie", "Supabase / PostgreSQL", "API-integraties", "Dashboard-UI", "Gedeployd op Vercel"],
      },
    }
  ],

  fullstack: [
    {
      id: "starter-package",
      icon: "rocket_launch",
      name: "Starter Package",
      nameNL: "Starter Pakket",
      description: "Logo + landing page bundle to launch your brand fast.",
      descriptionNL: "Logo + landingspagina-bundel om jouw merk snel te lanceren.",
      price: 999,
      included: 0,
      hasSeo: false,
      features: {
        en: ["Logo design", "Landing page", "Mobile responsive", "2 revision rounds"],
        nl: ["Logo-ontwerp", "Landingspagina", "Mobiel responsief", "2 revisierondes"],
      },
    },
    {
      id: "growth-package",
      icon: "trending_up",
      name: "Growth Package",
      nameNL: "Groei Pakket",
      description: "Full brand + multi-page site with SEO and analytics.",
      descriptionNL: "Volledig merk + multi-paginasite met SEO en analytics.",
      price: 1800,
      included: 6,
      hasSeo: true,
      features: {
        en: ["Brand identity", "Up to 6 pages", "Advanced SEO", "Analytics setup", "1 month support"],
        nl: ["Merkidentiteit", "Tot 6 pagina's", "Geavanceerde SEO", "Analytics-setup", "1 maand support"],
      },
    },
    {
      id: "premium-studio",
      icon: "diamond",
      name: "Premium Studio",
      nameNL: "Premium Studio",
      description: "End-to-end digital presence: brand, site, and web app.",
      descriptionNL: "End-to-end digitale aanwezigheid: merk, site en webapplicatie.",
      price: 3500,
      included: 0,
      hasSeo: false,
      features: {
        en: ["Complete brand system", "Custom web app", "CMS + dashboard", "3 months priority support", "Performance guarantee"],
        nl: ["Compleet merksysteem", "Aangepaste webapplicatie", "CMS + dashboard", "3 maanden prioriteit support", "Prestatiegarantie"],
      },
    },
    {
      id: "maintenance",
      icon: "build",
      name: "Maintenance",
      nameNL: "Onderhoud",
      description: "Monthly care plan: updates, security patches, and uptime monitoring.",
      descriptionNL: "Maandelijks onderhoudsplan: updates, beveiligingspatches en uptime-monitoring.",
      price: 200,
      priceNote: "/mo",
      included: 0,
      hasSeo: false,
      features: {
        en: ["Monthly CMS updates", "Security monitoring", "Uptime alerts", "Priority bug fixes"],
        nl: ["Maandelijkse CMS-updates", "Beveiligingsmonitoring", "Uptime-meldingen", "Prioriteit bugfixes"],
      },
    },
  ],
};

// ── Legacy exports (used by old components) ──────────────
export const services = [
  { id: "design", label: "Design", tagline: "Van logo tot volledige brand identity", description: "Een visuele stijl die bij jou past en blijft hangen bij je klanten." },
  { id: "development", label: "Development", tagline: "Snelle, moderne websites en webapps", description: "Gebouwd met moderne tools, goed vindbaar en klaar om op te schalen." },
  { id: "fullstack", label: "Fullstack", tagline: "Design én development onder één dak", description: "Geen losse freelancers, maar één studio die alles voor je coördineert." },
];

export const processSteps = ["Discovery", "Strategy", "Build", "Launch", "Support"];
