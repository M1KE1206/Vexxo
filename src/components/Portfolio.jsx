import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { projects, tagIds } from "../config/portfolio";
import { fadeUp, scaleIn, stagger, viewport, ease } from "../lib/animations";

const PLACEHOLDERS = [
  "from-primary/20 to-secondary/10",
  "from-secondary/20 to-primary/10",
  "from-primary/15 to-tertiary/15",
];

export default function Portfolio() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const ini = reduce ? false : "hidden";
  const [activeTag, setActiveTag] = useState("All");

  const filtered = activeTag === "All" ? projects : projects.filter((p) => p.tagId === activeTag);

  return (
    <section id="portfolio" aria-labelledby="portfolio-heading" className="py-24 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        variants={fadeUp}
        initial={ini}
        whileInView="visible"
        viewport={viewport}
        transition={{ duration: 0.5, ease }}
      >
        <div>
          <span className="text-accent font-bold text-xs tracking-widest uppercase">
            {t("portfolio.badge")}
          </span>
          <h2 id="portfolio-heading" className="text-4xl md:text-5xl font-headline font-bold mt-2 text-on-surface">
            {t("portfolio.title")}
          </h2>
        </div>
        <p className="text-on-surface-variant max-w-md md:text-right text-sm hidden md:block">
          {t("portfolio.subtitle")}
        </p>
      </motion.div>

      {/* Tag filter */}
      <motion.div
        className="flex flex-wrap gap-2 mb-10"
        variants={fadeUp}
        initial={ini}
        whileInView="visible"
        viewport={viewport}
        transition={{ duration: 0.4, delay: 0.1, ease }}
      >
        {tagIds.map((tagId) => (
          <button
            key={tagId}
            onClick={() => setActiveTag(tagId)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              activeTag === tagId
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-outline-variant/40 text-on-surface-variant hover:border-primary/40 hover:text-on-surface"
            }`}
          >
            {t(`portfolio.tags.${tagId.toLowerCase()}`)}
          </button>
        ))}
      </motion.div>

      {/* Cards — staggered scaleIn */}
      <motion.div
        className="grid md:grid-cols-3 gap-8"
        variants={stagger(0.15)}
        initial={ini}
        whileInView="visible"
        viewport={viewport}
      >
        {filtered.map((project, i) => {
          const title = t(`portfolio.projects.${project.id}.title`);
          const description = t(`portfolio.projects.${project.id}.description`);
          return (
            <motion.div
              key={project.id}
              variants={scaleIn}
              transition={{ duration: 0.45, ease }}
              className="glass-card rounded-2xl p-4 group cursor-pointer"
            >
              {/* Placeholder image */}
              <div className={`relative overflow-hidden rounded-xl mb-6 aspect-video bg-gradient-to-br ${PLACEHOLDERS[i % PLACEHOLDERS.length]} border border-white/5`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-on-surface-variant/30 text-xs font-mono">{title}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="px-2">
                <h3 className="text-lg font-bold mb-1 text-on-surface">{title}</h3>
                <p className="text-on-surface-variant text-sm mb-4">
                  {t(`portfolio.tags.${project.tagId.toLowerCase()}`)} · {description.slice(0, 50)}…
                </p>
                <span className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-4 transition-all">
                  {t("portfolio.viewProject")}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <p className="mt-10 text-xs text-on-surface-variant text-center">{t("portfolio.moreComingSoon")}</p>
    </section>
  );
}
