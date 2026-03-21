// ─────────────────────────────────────────────
//  SERVICES CONFIG
//  Package data for service request modal.
//  All prices and features live here.
// ─────────────────────────────────────────────

export const serviceCategories = [
  { id: "design",      labelEN: "Design",      labelNL: "Design" },
  { id: "development", labelEN: "Development", labelNL: "Development" },
  { id: "fullstack",   labelEN: "Fullstack",   labelNL: "Fullstack" },
];

export const packages = {
  design: [
    {
      id: "logo-design",
      icon: "brush",
      name: "Logo Design",
      nameNL: "Logo Design",
      description: "Premium visual identity for modern startups.",
      descriptionNL: "Premium visuele identiteit voor moderne startups.",
      price: 800,
      features: {
        en: ["Custom logo (3 concepts)", "Brand color palette", "Typography system", "All file formats included"],
        nl: ["Aangepast logo (3 concepten)", "Merkkleurenpalet", "Typografiesysteem", "Alle bestandsformaten inbegrepen"],
      },
    },
    {
      id: "one-pager",
      icon: "article",
      name: "One-Pager",
      nameNL: "One-Pager",
      description: "High-conversion landing page for your product.",
      descriptionNL: "Hoge-conversie landingspagina voor jouw product.",
      price: 1500,
      features: {
        en: ["Custom UX/UI Design", "Responsive Development", "SEO Optimization", "Content Integration"],
        nl: ["Aangepast UX/UI Design", "Responsieve Development", "SEO Optimalisatie", "Content Integratie"],
      },
    },
    {
      id: "business-site",
      icon: "store",
      name: "Business Site",
      nameNL: "Zakelijke Website",
      description: "Complete web presence for established brands.",
      descriptionNL: "Volledige online aanwezigheid voor gevestigde merken.",
      price: 3200,
      features: {
        en: ["Full brand identity", "Multi-page website", "CMS integration", "Analytics setup", "3 months support"],
        nl: ["Volledige merkidentiteit", "Meerdere pagina's", "CMS integratie", "Analytics setup", "3 maanden support"],
      },
    },
  ],

  development: [
    {
      id: "landing-dev",
      icon: "code",
      name: "Landing Page",
      nameNL: "Landingspagina",
      description: "Fast, SEO-ready landing page built to convert.",
      descriptionNL: "Snelle, SEO-klare landingspagina gebouwd om te converteren.",
      price: 999,
      features: {
        en: ["Next.js build", "Mobile-first responsive", "Core Web Vitals optimized", "Form integration"],
        nl: ["Next.js build", "Mobile-first responsief", "Core Web Vitals geoptimaliseerd", "Formulierintergratie"],
      },
    },
    {
      id: "multi-page",
      icon: "layers",
      name: "Multi-Page Site",
      nameNL: "Multi-Pagina Site",
      description: "Scalable website with up to 10 pages.",
      descriptionNL: "Schaalbare website met tot 10 pagina's.",
      price: 2200,
      features: {
        en: ["Up to 10 pages", "Custom animations", "CMS (Sanity / Contentful)", "Performance audit", "SEO setup"],
        nl: ["Tot 10 pagina's", "Aangepaste animaties", "CMS (Sanity / Contentful)", "Performance audit", "SEO setup"],
      },
    },
    {
      id: "web-app",
      icon: "web_asset",
      name: "Web Application",
      nameNL: "Webapplicatie",
      description: "Full-featured web app with auth and database.",
      descriptionNL: "Volledige webapplicatie met auth en database.",
      price: 4500,
      features: {
        en: ["User authentication", "Supabase / PostgreSQL", "API integrations", "Dashboard UI", "Deployment on Vercel"],
        nl: ["Gebruikersauthenticatie", "Supabase / PostgreSQL", "API integraties", "Dashboard UI", "Deployment op Vercel"],
      },
    },
  ],

  fullstack: [
    {
      id: "startup-kit",
      icon: "rocket_launch",
      name: "Startup Kit",
      nameNL: "Startup Pakket",
      description: "Brand + landing page bundle for new ventures.",
      descriptionNL: "Brand + landingspagina bundel voor nieuwe ventures.",
      price: 2000,
      features: {
        en: ["Logo + brand identity", "Landing page", "SEO setup", "2 rounds of revisions"],
        nl: ["Logo + merkidentiteit", "Landingspagina", "SEO setup", "2 revisierondes"],
      },
    },
    {
      id: "growth-package",
      icon: "trending_up",
      name: "Growth Package",
      nameNL: "Groei Pakket",
      description: "Multi-page site with branding and full SEO.",
      descriptionNL: "Multi-paginasite met branding en volledige SEO.",
      price: 4000,
      features: {
        en: ["Full branding", "Up to 8 pages", "Advanced SEO", "Analytics", "1 month support"],
        nl: ["Volledige branding", "Tot 8 pagina's", "Geavanceerde SEO", "Analytics", "1 maand support"],
      },
    },
    {
      id: "premium",
      icon: "diamond",
      name: "Premium Studio",
      nameNL: "Premium Studio",
      description: "End-to-end digital presence for serious brands.",
      descriptionNL: "End-to-end digitale aanwezigheid voor serieuze merken.",
      price: 7500,
      features: {
        en: ["Complete brand system", "Custom web app", "CMS + dashboard", "Priority support 3 mo.", "Performance guarantee"],
        nl: ["Compleet merksysteem", "Aangepaste webapp", "CMS + dashboard", "Prioriteit support 3 md.", "Prestatiegarantie"],
      },
    },
  ],
};

// ── Legacy exports (used by old components) ──────────────
export const services = [
  { id: "design",      label: "Design",      tagline: "Van logo tot volledige brand identity",          description: "Een visuele stijl die bij jou past en blijft hangen bij je klanten." },
  { id: "development", label: "Development", tagline: "Snelle, moderne websites en webapps",            description: "Gebouwd met moderne tools, goed vindbaar en klaar om op te schalen." },
  { id: "fullstack",   label: "Fullstack",   tagline: "Design én development onder één dak",            description: "Geen losse freelancers, maar één studio die alles voor je coördineert." },
];

export const processSteps = ["Discovery", "Strategy", "Build", "Launch", "Support"];
