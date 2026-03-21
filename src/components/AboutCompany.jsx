import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useModal } from "../context/ModalContext";
import { MIN_PRICE } from "../config/pricing";
import { fadeUp, scaleIn, stagger, viewport, ease } from "../lib/animations";

const VALUE_ICONS = ["visibility", "star", "bolt", "handshake"];
const VALUE_KEYS  = ["transparency", "quality", "speed", "partnership"];

function CheckIcon({ val }) {
  if (val === true)
    return <span className="material-symbols-outlined text-secondary" style={{ fontSize: 16 }}>check_circle</span>;
  if (val === "partial")
    return <span className="material-symbols-outlined text-on-surface-variant/50" style={{ fontSize: 16 }}>remove_circle</span>;
  return <span className="material-symbols-outlined text-outline/50" style={{ fontSize: 16 }}>cancel</span>;
}

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

function VexxoCard({ label, price, note, checks, features, badgeLabel, onCta, ctaLabel }) {
  return (
    <div
      className="relative order-first md:order-none"
      style={{ boxShadow: "0 0 24px rgba(124,58,237,0.25)" }}
    >
      <div
        className="absolute -inset-[1.5px] rounded-[1.1rem] z-0"
        style={{ background: "linear-gradient(135deg, #7C3AED, #F97316)" }}
      />
      <div
        className="relative z-10 rounded-2xl p-10 flex flex-col"
        style={{ background: "rgba(25,25,31,0.95)" }}
      >
        <div className="text-center mb-5">
          <span
            className="inline-block text-[10px] font-bold px-3 py-1 rounded-full text-on-primary-fixed mb-3"
            style={{ background: "linear-gradient(to right, #7C3AED, #F97316)" }}
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
        <button onClick={onCta} className="mt-6 btn-primary w-full justify-center text-sm">
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

export default function AboutCompany() {
  const { t } = useLanguage();
  const { openModal } = useModal();
  const reduce = useReducedMotion();
  const ini = reduce ? false : "hidden";

  const features         = t("company.comparison.features");
  const agencyChecks     = t("company.comparison.agencyChecks");
  const freelancerChecks = t("company.comparison.freelancerChecks");
  const vexxoChecks      = t("company.comparison.vexxoChecks");
  const processSteps     = t("company.process.steps");

  return (
    <section className="py-24 px-6 md:px-8 max-w-7xl mx-auto space-y-20">
      {/* Section header */}
      <motion.div
        className="text-center space-y-4"
        variants={fadeUp}
        initial={ini}
        whileInView="visible"
        viewport={viewport}
        transition={{ duration: 0.5, ease }}
      >
        <span className="text-accent font-bold text-xs tracking-widest uppercase">{t("company.badge")}</span>
        <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface">{t("company.title")}</h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto">{t("company.subtitle")}</p>
      </motion.div>

      {/* ── a) Mission & Vision — stagger cards ── */}
      <motion.div
        className="grid md:grid-cols-2 gap-6"
        variants={stagger(0.15)}
        initial={ini}
        whileInView="visible"
        viewport={viewport}
      >
        {[
          { icon: "rocket_launch", key: "mission" },
          { icon: "visibility",    key: "vision" },
        ].map(({ icon, key }) => (
          <motion.div key={key} variants={scaleIn} transition={{ duration: 0.45, ease }} className="glass-card rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">{icon}</span>
              </div>
              <h3 className="text-xl font-headline font-bold text-on-surface">{t(`company.${key}.title`)}</h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed">{t(`company.${key}.body`)}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── b) Values — pills stagger ── */}
      <div className="space-y-6">
        <motion.h3
          className="text-center text-xl font-headline font-bold text-on-surface"
          variants={fadeUp}
          initial={ini}
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.4, ease }}
        >
          {t("company.values.title")}
        </motion.h3>
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          variants={stagger(0.1)}
          initial={ini}
          whileInView="visible"
          viewport={viewport}
        >
          {VALUE_KEYS.map((vk, i) => (
            <motion.div key={vk} variants={scaleIn} transition={{ duration: 0.35, ease }} className="glass-card px-6 py-3 rounded-full flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-lg">{VALUE_ICONS[i]}</span>
              <span className="font-bold text-sm text-on-surface">{t(`company.values.${vk}`)}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── c) How We Work — steps stagger left→right, connector line draws ── */}
      <div className="space-y-8">
        <motion.div
          className="text-center space-y-2"
          variants={fadeUp}
          initial={ini}
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.4, ease }}
        >
          <h3 className="text-2xl font-headline font-bold text-on-surface">{t("company.process.title")}</h3>
          <p className="text-on-surface-variant text-sm max-w-xl mx-auto">{t("company.process.subtitle")}</p>
        </motion.div>

        <div className="relative">
          {/* Connector line — draws itself */}
          <motion.div
            className="absolute top-6 left-[10%] right-[10%] h-px hidden md:block"
            style={{ background: "linear-gradient(to right, #7C3AED, #C084FC)", originX: 0 }}
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewport}
            transition={{ duration: 0.8, delay: 0.2, ease }}
          />

          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-6"
            variants={stagger(0.12)}
            initial={ini}
            whileInView="visible"
            viewport={viewport}
          >
            {(Array.isArray(processSteps) ? processSteps : []).map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.4, ease }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div
                  className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-headline font-extrabold text-on-primary-fixed text-sm"
                  style={{ background: "#7C3AED", boxShadow: "0 0 12px rgba(124,58,237,0.5)" }}
                >
                  {i + 1}
                </div>
                <span className="text-sm font-semibold text-on-surface">{step}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── d) 3-card Comparison — stagger ── */}
      <div className="space-y-8">
        <motion.div
          className="text-center space-y-2"
          variants={fadeUp}
          initial={ini}
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.4, ease }}
        >
          <h3 className="text-2xl font-headline font-bold text-on-surface">{t("company.comparison.title")}</h3>
          <p className="text-on-surface-variant text-sm">{t("company.comparison.subtitle")}</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 items-stretch"
          variants={stagger(0.15)}
          initial={ini}
          whileInView="visible"
          viewport={viewport}
        >
          <motion.div variants={scaleIn} transition={{ duration: 0.45, ease }}>
            <MutedCard
              label={t("company.comparison.agencyLabel")}
              price={t("company.comparison.agencyPrice")}
              note={t("company.comparison.agencyNote")}
              checks={Array.isArray(agencyChecks) ? agencyChecks : []}
              features={Array.isArray(features) ? features : []}
            />
          </motion.div>
          <motion.div variants={scaleIn} transition={{ duration: 0.45, ease }}>
            <VexxoCard
              label={t("company.comparison.vexxoLabel")}
              price={`${t("modal.fromPrice")} €${MIN_PRICE}`}
              note={t("company.comparison.vexxoNote")}
              checks={Array.isArray(vexxoChecks) ? vexxoChecks : []}
              features={Array.isArray(features) ? features : []}
              badgeLabel={t("company.comparison.bestChoice")}
              onCta={openModal}
              ctaLabel={t("company.comparison.startProject")}
            />
          </motion.div>
          <motion.div variants={scaleIn} transition={{ duration: 0.45, ease }}>
            <MutedCard
              label={t("company.comparison.freelancerLabel")}
              price={t("company.comparison.freelancerPrice")}
              note={t("company.comparison.freelancerNote")}
              checks={Array.isArray(freelancerChecks) ? freelancerChecks : []}
              features={Array.isArray(features) ? features : []}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
