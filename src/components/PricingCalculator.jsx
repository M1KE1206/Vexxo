import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { fadeUp, scaleIn, slideLeft, slideRight, stagger, viewport, ease } from "../lib/animations";
import {
  serviceTypes,
  vexxo,
  addOns,
  timeline,
  comparison,
  pageRange,
} from "../config/pricing";

const fmt = (n) =>
  new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

/** Smooth animated counter hook */
function useCountUp(target) {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  const rafRef  = useRef(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const from = prevRef.current;
    const diff = target - from;
    if (diff === 0) return;

    const duration = Math.min(Math.abs(diff) * 0.6, 600);
    const startTime = performance.now();

    const animate = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + diff * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
      else prevRef.current = target;
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target]);

  return display;
}

export default function PricingCalculator() {
  const { t, lang } = useLanguage();
  const { requireAuth } = useAuth();
  const [service,     setService]     = useState(serviceTypes[0].id);
  const [pages,       setPages]       = useState(pageRange.default);
  const [seo,         setSeo]         = useState(false);
  const [tl,          setTl]          = useState("regular");

  // Computed prices
  const tlExtra      = timeline[tl].perPage;
  const addonExtra   = (seo ? addOns.seo.perPage : 0);
  const effectivePPP = vexxo.perPage + tlExtra + addonExtra;

  const vexxoRaw      = vexxo.base + effectivePPP * pages;
  const agencyRaw     = comparison.agency.base     + comparison.agency.perPage     * pages;
  const freelancerRaw = comparison.freelancer.base + comparison.freelancer.perPage * pages;

  const vexxoDisplay      = useCountUp(vexxoRaw);
  const agencyDisplay     = useCountUp(agencyRaw);
  const freelancerDisplay = useCountUp(freelancerRaw);

  const tlabel = (obj) => lang === "nl" ? obj.labelNL : obj.labelEN;
  const reduce = useReducedMotion();
  const ini = reduce ? false : "hidden";

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="py-24 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-16 space-y-3"
        variants={fadeUp}
        initial={ini}
        whileInView="visible"
        viewport={viewport}
        transition={{ duration: 0.5, ease }}
      >
        <span className="text-accent font-bold text-xs tracking-widest uppercase">
          {t("pricing.badge")}
        </span>
        <h2 id="pricing-heading" className="text-4xl md:text-5xl font-headline font-bold text-on-surface">
          {t("pricing.title")}
        </h2>
        <p className="text-on-surface-variant">{t("pricing.subtitle")}</p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* ── Controls ── */}
        <motion.div
          className="lg:col-span-7 p-6 md:p-8 rounded-3xl space-y-10"
          style={{
            background: "linear-gradient(var(--color-surface-2,#131319), var(--color-surface-2,#131319)) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box",
            border: "1px solid transparent",
          }}
          variants={slideLeft}
          initial={ini}
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.6, ease }}
        >

          {/* Service type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-4 text-on-surface-variant">
              {t("pricing.serviceType")}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {serviceTypes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setService(s.id)}
                  className={`p-3 rounded-xl text-sm font-bold transition-all ${
                    service === s.id
                      ? "text-primary scale-[1.03]"
                      : "border border-outline-variant/30 bg-white/[0.03] text-on-surface-variant hover:border-outline-variant/60 hover:scale-[1.02]"
                  }`}
                  style={service === s.id ? {
                    background: "linear-gradient(#0e0e13,#0e0e13) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box",
                    border: "1px solid transparent",
                  } : {}}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pages slider */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {t("pricing.pages")}
              </label>
              <span className="text-primary font-bold text-sm">
                {pages} {pages === 1 ? "page" : "pages"} · {t("pricing.perPageLabel")}: €{effectivePPP}
              </span>
            </div>
            <input
              type="range"
              min={pageRange.min}
              max={pageRange.max}
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              className="w-full h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant mt-1">
              <span>{pageRange.min}</span>
              <span>{pageRange.max}</span>
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-4 text-on-surface-variant">
              {t("pricing.addOns")}
            </label>
            <div className="space-y-3">
              {[
                { checked: seo, set: setSeo, obj: addOns.seo },
              ].map(({ checked, set, obj }) => (
                <label key={obj.labelEN} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] cursor-pointer hover:bg-white/[0.06] transition-all border border-transparent hover:border-outline-variant/20 hover:scale-[1.01] transition-transform">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => set(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-on-surface">
                    {lang === "nl" ? obj.labelNL : obj.labelEN}
                    <span className="ml-2 text-xs text-on-surface-variant">+€{obj.perPage}/{t("pricing.perPageLabel")}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-4 text-on-surface-variant">
              {t("pricing.timeline")}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(timeline).map(([key, val]) => (
                <label
                  key={key}
                  className={`flex flex-col gap-1 p-3 rounded-xl cursor-pointer transition-all ${
                    tl === key ? "text-primary" : "border border-outline-variant/30 bg-white/[0.03] text-on-surface-variant hover:border-outline-variant/60 hover:scale-[1.02]"
                  }`}
                  style={tl === key ? {
                    background: "linear-gradient(#0e0e13,#0e0e13) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box",
                    border: "1px solid transparent",
                    transform: "scale(1.03)",
                  } : {}}
                >
                  <input type="radio" className="sr-only" checked={tl === key} onChange={() => setTl(key)} />
                  <span className="text-xs font-bold text-on-surface">{tlabel(val)}</span>
                  <span className="text-[11px]">
                    {val.perPage > 0 ? `+€${val.perPage}/${t("pricing.perPageLabel")}` : t("pricing.noSurcharge")}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Price cards ── */}
        <motion.div
          className="lg:col-span-5 space-y-4"
          variants={stagger(0.12)}
          initial={ini}
          whileInView="visible"
          viewport={viewport}
        >
          {/* Agency */}
          <motion.div variants={scaleIn} transition={{ duration: 0.4, ease }} className="p-6 rounded-2xl bg-surface-container border border-outline-variant/20 opacity-55">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  {lang === "nl" ? comparison.agency.labelNL : comparison.agency.labelEN}
                </p>
                <p className="text-2xl font-headline font-bold text-on-surface-variant tabular-nums">
                  {fmt(agencyDisplay)}
                </p>
                <p className="text-[11px] text-on-surface-variant/60 mt-1">
                  {t("pricing.baseLabel")} €{comparison.agency.base} + €{comparison.agency.perPage}/{t("pricing.perPageLabel")}
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40 text-3xl">corporate_fare</span>
            </div>
            <p className="text-xs text-on-surface-variant/60 mt-3">{t("pricing.agencyNote")}</p>
          </motion.div>

          {/* Freelancer */}
          <motion.div variants={scaleIn} transition={{ duration: 0.4, ease }} className="p-6 rounded-2xl bg-surface-container border border-outline-variant/20 opacity-55">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  {lang === "nl" ? comparison.freelancer.labelNL : comparison.freelancer.labelEN}
                </p>
                <p className="text-2xl font-headline font-bold text-on-surface-variant tabular-nums">
                  {fmt(freelancerDisplay)}
                </p>
                <p className="text-[11px] text-on-surface-variant/60 mt-1">
                  {t("pricing.baseLabel")} €{comparison.freelancer.base} + €{comparison.freelancer.perPage}/{t("pricing.perPageLabel")}
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40 text-3xl">person</span>
            </div>
            <p className="text-xs text-on-surface-variant/60 mt-3">{t("pricing.freelancerNote")}</p>
          </motion.div>

          {/* Vexxo — highlighted */}
          <motion.div variants={scaleIn} transition={{ duration: 0.4, ease }}
            className="relative p-8 rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(#0c0c14,#0c0c14) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box",
              border: "1px solid transparent",
            }}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="bg-gradient-to-r from-primary to-secondary text-on-primary-fixed text-[10px] font-bold px-2 py-0.5 rounded mb-2 inline-block">
                    BEST VALUE
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                    {t("pricing.withVexxo")}
                  </p>
                  <p className="text-5xl font-headline font-extrabold text-on-surface tabular-nums">
                    {fmt(vexxoDisplay)}
                  </p>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    {t("pricing.baseLabel")} €{vexxo.base} + €{effectivePPP}/{t("pricing.perPageLabel")}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="material-symbols-outlined text-primary">bolt</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {[
                t('pricing.vexxo.highlight1'),
                t('pricing.vexxo.highlight2'),
                t('pricing.vexxo.highlight3'),
              ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => requireAuth({
                  action: 'openServiceModal',
                  data: {
                    fromCalculator: true,
                    serviceType: service,
                    pages,
                    seoAddon: seo,
                    timeline: tl,
                    calculatedPrice: vexxoRaw,
                  }
                })}
                className="block w-full py-4 bg-white text-background rounded-xl font-bold text-center hover:scale-[1.02] active:scale-95 transition-all text-sm"
              >
                {t("pricing.selectPlan")}
              </button>
            </div>
          </motion.div>

          <motion.p variants={fadeUp} transition={{ duration: 0.4, ease }} className="text-[11px] text-on-surface-variant/60 text-center px-2">{t("pricing.note")}</motion.p>
        </motion.div>
      </div>
    </section>
  );
}
