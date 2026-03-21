import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { founder, company } from "../config/company";
import { slideLeft, slideRight, scaleIn, stagger, viewport, ease } from "../lib/animations";

const STATS = [
  { numValue: 3, suffix: "+", key: "projects" },
  { numValue: 2, suffix: "",  key: "countries" },
  { numValue: 100, suffix: "%", key: "satisfaction" },
];

function CountStat({ numValue, suffix, statKey, t, reduce }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(reduce ? numValue : 0);

  useEffect(() => {
    if (!isInView || reduce) return;
    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(numValue * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, reduce, numValue]);

  return (
    <motion.div
      ref={ref}
      variants={scaleIn}
      transition={{ duration: 0.35, ease }}
      className="glass-card px-6 py-3 rounded-full flex items-center gap-3"
    >
      <span className="text-primary font-bold text-lg tabular-nums">{count}{suffix}</span>
      <span className="text-sm font-semibold text-on-surface-variant">{t(`about.stats.${statKey}`)}</span>
    </motion.div>
  );
}

export default function AboutMe() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const ini = reduce ? false : "hidden";

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-24 px-6 md:px-8 bg-surface-container-low relative overflow-hidden section-fade"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/6 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        {/* Text — slides from left */}
        <motion.div
          className="order-2 md:order-1 space-y-8"
          variants={slideLeft}
          initial={ini}
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.6, ease }}
        >
          <div>
            <span className="text-accent font-bold text-xs tracking-widest uppercase">
              {t("about.badge")}
            </span>
            <h2 id="about-heading" className="text-4xl md:text-5xl font-headline font-bold mt-3 text-on-surface">
              {t("about.title")}
            </h2>
          </div>

          <p className="text-on-surface-variant text-lg leading-relaxed">
            {t("about.subtitle")}
          </p>

          {/* Stats with count-up */}
          <motion.div
            className="flex flex-wrap gap-4"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
            initial={ini}
            whileInView="visible"
            viewport={viewport}
          >
            {STATS.map(({ numValue, suffix, key }) => (
              <CountStat key={key} numValue={numValue} suffix={suffix} statKey={key} t={t} reduce={reduce} />
            ))}
          </motion.div>

          {/* Skills */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">
              {t("about.skillsTitle")}
            </h3>
            <motion.div
              className="flex flex-wrap gap-2"
              variants={stagger(0.05)}
              initial={ini}
              whileInView="visible"
              viewport={viewport}
            >
              {founder.skills.map((skill) => (
                <motion.span key={skill} variants={scaleIn} transition={{ duration: 0.3 }} className="pill">
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Photo / card — slides from right */}
        <motion.div
          className="order-1 md:order-2 relative flex justify-center"
          variants={slideRight}
          initial={ini}
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.6, delay: 0.15, ease }}
        >
          <div className="glass-card p-2 rounded-3xl md:rotate-3 w-full max-w-sm aspect-square overflow-hidden relative">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/20 via-surface-container to-secondary/15 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto text-2xl font-bold text-on-primary-fixed font-headline">
                  {founder.initials}
                </div>
                <p className="text-on-surface font-semibold">{founder.name}</p>
                <p className="text-on-surface-variant text-xs">{company?.tagline}</p>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-4 -left-4 glass-card p-4 rounded-2xl hidden md:flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">school</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">{t("about.badge2")}</p>
              <p className="text-[11px] text-on-surface-variant">{t("about.badge2sub")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
