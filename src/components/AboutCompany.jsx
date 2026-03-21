import { useLanguage } from "../context/LanguageContext";

const VALUE_ICONS = ["visibility", "star", "bolt", "handshake"];
const VALUE_KEYS  = ["transparency", "quality", "speed", "partnership"];

/** Single check/cross indicator */
function CheckIcon({ val }) {
  if (val === true)
    return <span className="material-symbols-outlined text-secondary" style={{ fontSize: 16 }}>check_circle</span>;
  if (val === "partial")
    return <span className="material-symbols-outlined text-on-surface-variant/50" style={{ fontSize: 16 }}>remove_circle</span>;
  return <span className="material-symbols-outlined text-outline/50" style={{ fontSize: 16 }}>cancel</span>;
}

/** Muted comparison card (Agency / Freelancer) */
function MutedCard({ label, price, note, checks, features }) {
  return (
    <div className="glass-card rounded-2xl p-8 flex flex-col opacity-60 hover:opacity-75 transition-opacity">
      <div className="text-center pb-5 mb-5 border-b border-outline-variant/20">
        <p className="font-headline font-bold text-on-surface text-lg">{label}</p>
        <p className="text-2xl font-headline font-bold text-on-surface-variant mt-1">{price}</p>
        <p className="text-xs text-on-surface-variant mt-2 leading-snug">{note}</p>
      </div>
      <ul className="space-y-3 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-on-surface-variant">
            <CheckIcon val={checks[i]} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Highlighted Vexxo card */
function VexxoCard({ label, price, note, checks, features, badgeLabel }) {
  return (
    <div className="relative order-first md:order-none">
      {/* Gradient border wrapper */}
      <div
        className="absolute -inset-[1px] rounded-[1.1rem] z-0"
        style={{ background: "linear-gradient(135deg, #bd9dff, #fd761a)" }}
      />
      {/* Glow behind card */}
      <div className="absolute -inset-6 bg-primary/10 blur-3xl rounded-3xl z-0 pointer-events-none" />

      <div
        className="relative z-10 rounded-2xl p-10 flex flex-col"
        style={{ background: "linear-gradient(135deg, rgba(189,157,255,0.12) 0%, rgba(14,14,19,0.98) 60%, rgba(253,118,26,0.08) 100%)" }}
      >
        {/* Badge */}
        <div className="text-center mb-5">
          <span
            className="inline-block text-[10px] font-bold px-3 py-1 rounded-full text-on-primary-fixed mb-3"
            style={{ background: "linear-gradient(to right, #bd9dff, #fd761a)" }}
          >
            {badgeLabel}
          </span>
          <p className="font-headline font-bold text-on-surface text-xl">{label}</p>
          <p className="text-3xl font-headline font-bold text-on-surface mt-1">{price}</p>
          <p className="text-xs text-on-surface-variant mt-2 leading-snug">{note}</p>
        </div>

        <div className="border-t border-primary/20 pt-5 mb-5" />

        <ul className="space-y-3 flex-1">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-on-surface font-medium">
              <CheckIcon val={checks[i]} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function AboutCompany() {
  const { t } = useLanguage();

  const features          = t("company.comparison.features");
  const agencyChecks      = t("company.comparison.agencyChecks");
  const freelancerChecks  = t("company.comparison.freelancerChecks");
  const vexxoChecks       = t("company.comparison.vexxoChecks");
  const processSteps      = t("company.process.steps");

  return (
    <section className="py-24 px-6 md:px-8 max-w-7xl mx-auto space-y-20">
      {/* Section header */}
      <div className="text-center space-y-4">
        <span className="text-secondary font-bold text-xs tracking-widest uppercase">{t("company.badge")}</span>
        <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface">{t("company.title")}</h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto">{t("company.subtitle")}</p>
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
              <h3 className="text-xl font-headline font-bold text-on-surface">{t(`company.${key}.title`)}</h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed">{t(`company.${key}.body`)}</p>
          </div>
        ))}
      </div>

      {/* ── b) Values ── */}
      <div className="space-y-6">
        <h3 className="text-center text-xl font-headline font-bold text-on-surface">{t("company.values.title")}</h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {VALUE_KEYS.map((vk, i) => (
            <div key={vk} className="glass-card px-6 py-3 rounded-full flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-lg">{VALUE_ICONS[i]}</span>
              <span className="font-bold text-sm text-on-surface">{t(`company.values.${vk}`)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── c) How We Work ── */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-headline font-bold text-on-surface">{t("company.process.title")}</h3>
          <p className="text-on-surface-variant text-sm max-w-xl mx-auto">{t("company.process.subtitle")}</p>
        </div>
        <div className="relative">
          <div className="absolute top-6 left-[10%] right-[10%] h-px hidden md:block"
            style={{ background: "linear-gradient(to right, #bd9dff, #fd761a)" }} />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {(Array.isArray(processSteps) ? processSteps : []).map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-headline font-extrabold text-on-primary-fixed text-sm"
                  style={{ background: "linear-gradient(135deg, #bd9dff, #fd761a)" }}>
                  {i + 1}
                </div>
                <span className="text-sm font-semibold text-on-surface">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── d) 3-card Comparison ── */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-headline font-bold text-on-surface">{t("company.comparison.title")}</h3>
          <p className="text-on-surface-variant text-sm">{t("company.comparison.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          <MutedCard
            label={t("company.comparison.agencyLabel")}
            price={t("company.comparison.agencyPrice")}
            note={t("company.comparison.agencyNote")}
            checks={Array.isArray(agencyChecks) ? agencyChecks : []}
            features={Array.isArray(features) ? features : []}
          />
          <VexxoCard
            label={t("company.comparison.vexxoLabel")}
            price={t("company.comparison.vexxoPrice")}
            note={t("company.comparison.vexxoNote")}
            checks={Array.isArray(vexxoChecks) ? vexxoChecks : []}
            features={Array.isArray(features) ? features : []}
            badgeLabel={t("company.comparison.bestChoice")}
          />
          <MutedCard
            label={t("company.comparison.freelancerLabel")}
            price={t("company.comparison.freelancerPrice")}
            note={t("company.comparison.freelancerNote")}
            checks={Array.isArray(freelancerChecks) ? freelancerChecks : []}
            features={Array.isArray(features) ? features : []}
          />
        </div>
      </div>
    </section>
  );
}
