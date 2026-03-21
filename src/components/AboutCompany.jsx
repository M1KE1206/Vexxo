import { useLanguage } from "../context/LanguageContext";

const VALUE_ICONS = ["visibility", "star", "bolt", "handshake"];
const VALUE_KEYS  = ["transparency", "quality", "speed", "partnership"];

const COMPARISON_FEATURES = [
  { agency: false, freelancer: "partial", vexxo: true },
  { agency: false, freelancer: false,     vexxo: true },
  { agency: false, freelancer: "partial", vexxo: true },
  { agency: "partial", freelancer: true,  vexxo: true },
  { agency: false, freelancer: false,     vexxo: true },
  { agency: true,  freelancer: false,     vexxo: true },
];

function Check({ val }) {
  if (val === true)      return <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>;
  if (val === "partial") return <span className="material-symbols-outlined text-on-surface-variant text-lg">remove_circle</span>;
  return <span className="material-symbols-outlined text-outline text-lg">cancel</span>;
}

export default function AboutCompany() {
  const { t } = useLanguage();

  const processSteps = t("company.process.steps");
  const features     = t("company.comparison.features");

  return (
    <section className="py-24 px-6 md:px-8 max-w-7xl mx-auto space-y-20">
      {/* Section header */}
      <div className="text-center space-y-4">
        <span className="text-secondary font-bold text-xs tracking-widest uppercase">
          {t("company.badge")}
        </span>
        <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface">
          {t("company.title")}
        </h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          {t("company.subtitle")}
        </p>
      </div>

      {/* ── a) Mission & Vision ── */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { icon: "rocket_launch", key: "mission" },
          { icon: "visibility",    key: "vision" },
        ].map(({ icon, key }) => (
          <div key={key} className="glass-card rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">{icon}</span>
              </div>
              <h3 className="text-xl font-headline font-bold text-on-surface">
                {t(`company.${key}.title`)}
              </h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              {t(`company.${key}.body`)}
            </p>
          </div>
        ))}
      </div>

      {/* ── b) Values ── */}
      <div className="space-y-6">
        <h3 className="text-center text-xl font-headline font-bold text-on-surface">
          {t("company.values.title")}
        </h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {VALUE_KEYS.map((vk, i) => (
            <div key={vk} className="glass-card px-6 py-3 rounded-full flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-lg">
                {VALUE_ICONS[i]}
              </span>
              <span className="font-bold text-sm text-on-surface">
                {t(`company.values.${vk}`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── c) How We Work — 5-step horizontal flow ── */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-headline font-bold text-on-surface">
            {t("company.process.title")}
          </h3>
          <p className="text-on-surface-variant text-sm max-w-xl mx-auto">
            {t("company.process.subtitle")}
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div
            className="absolute top-6 left-[calc(10%+16px)] right-[calc(10%+16px)] h-px hidden md:block"
            style={{ background: "linear-gradient(to right, #bd9dff, #fd761a)" }}
          />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {(Array.isArray(processSteps) ? processSteps : []).map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-headline font-extrabold text-on-primary-fixed text-sm"
                  style={{ background: `linear-gradient(135deg, #bd9dff, #fd761a)` }}>
                  {i + 1}
                </div>
                <span className="text-sm font-semibold text-on-surface">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── d) Comparison table ── */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-headline font-bold text-on-surface">
            {t("company.comparison.title")}
          </h3>
          <p className="text-on-surface-variant text-sm">
            {t("company.comparison.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-0 relative">
          {/* Agency */}
          <div className="glass-card rounded-2xl md:rounded-r-none md:rounded-l-2xl p-6 space-y-4 opacity-60">
            <div className="text-center pb-4 border-b border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant text-2xl">corporate_fare</span>
              <p className="font-bold text-on-surface mt-2">{t("company.comparison.agencyLabel")}</p>
            </div>
            <ul className="space-y-3">
              {(Array.isArray(features) ? features : []).map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Check val={COMPARISON_FEATURES[i]?.agency} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vexxo — highlighted centre */}
          <div className="relative rounded-2xl p-6 space-y-4 z-10 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(189,157,255,0.18) 0%, rgba(8,8,16,0.95) 50%, rgba(253,118,26,0.12) 100%)",
              border: "1px solid rgba(189,157,255,0.35)",
              boxShadow: "0 0 40px rgba(189,157,255,0.15), 0 0 80px rgba(253,118,26,0.05)",
            }}>
            {/* Glow blob */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-secondary/20 blur-[50px] rounded-full" />
            <div className="relative text-center pb-4 border-b border-primary/30">
              <span className="bg-gradient-to-r from-primary to-secondary text-on-primary-fixed text-[10px] font-bold px-2 py-0.5 rounded mb-3 inline-block">
                {t("company.comparison.bestValue")}
              </span>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-2xl">bolt</span>
              </div>
              <p className="font-bold text-on-surface">{t("company.comparison.vexxoLabel")}</p>
            </div>
            <ul className="space-y-3 relative">
              {(Array.isArray(features) ? features : []).map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-on-surface">
                  <Check val={COMPARISON_FEATURES[i]?.vexxo} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Freelancer */}
          <div className="glass-card rounded-2xl md:rounded-l-none md:rounded-r-2xl p-6 space-y-4 opacity-60">
            <div className="text-center pb-4 border-b border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant text-2xl">person</span>
              <p className="font-bold text-on-surface mt-2">{t("company.comparison.freelancerLabel")}</p>
            </div>
            <ul className="space-y-3">
              {(Array.isArray(features) ? features : []).map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Check val={COMPARISON_FEATURES[i]?.freelancer} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
