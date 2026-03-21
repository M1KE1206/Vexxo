import { lazy, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useModal } from "../context/ModalContext";
import Marquee from "./Marquee";
import { fadeUp, scaleIn, slideRight, viewport, ease } from "../lib/animations";

const HeroComputer = lazy(() => import("./HeroComputer"));

export default function Hero() {
  const { t } = useLanguage();
  const { openModal, isOpen } = useModal();
  const reduce = useReducedMotion();
  const ini = reduce ? false : "hidden";

  const techStack = t("hero.techStack") || ["React", "Tailwind", "Figma", "Next.js", "Framer"];

  return (
    <>
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="relative min-h-[calc(100vh-80px)] flex items-center px-6 md:px-8 max-w-7xl mx-auto py-16 overflow-hidden"
      >
        <div className="grid md:grid-cols-12 gap-12 items-center w-full">
          {/* Left — text */}
          <div className="md:col-span-7 z-10 space-y-8">

            {/* Available badge */}
            <motion.div
              variants={fadeUp}
              initial={ini}
              animate="visible"
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-xs font-semibold text-on-surface-variant"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot flex-shrink-0" />
              {t("hero.available")}
            </motion.div>

            {/* Headline — each line animates in separately */}
            <h1 id="hero-heading" className="text-5xl md:text-6xl lg:text-7xl font-headline font-extrabold tracking-tight leading-[1.1]">
              {[t("hero.headline1"), t("hero.headline2")].map((line, i) => (
                <motion.span
                  key={i}
                  className="block"
                  variants={fadeUp}
                  initial={ini}
                  animate="visible"
                  transition={{ duration: 0.55, delay: 0.08 + i * 0.1, ease }}
                >
                  {line}
                </motion.span>
              ))}
              <motion.span
                className="block gradient-text-animated"
                variants={fadeUp}
                initial={ini}
                animate="visible"
                transition={{ duration: 0.55, delay: 0.28, ease }}
              >
                {t("hero.headline3")}
              </motion.span>
            </h1>

            {/* Subheadline */}
            <motion.p
              className="text-on-surface-variant text-lg md:text-xl max-w-xl leading-relaxed"
              variants={fadeUp}
              initial={ini}
              animate="visible"
              transition={{ duration: 0.5, delay: 0.4, ease }}
            >
              {t("hero.subheadline")}
            </motion.p>

            {/* Tech stack pills */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={ini === false ? false : "hidden"}
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } } }}
            >
              {techStack.map((tech) => (
                <motion.span
                  key={tech}
                  variants={scaleIn}
                  transition={{ duration: 0.3, ease }}
                  className="pill text-xs"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              variants={fadeUp}
              initial={ini}
              animate="visible"
              transition={{ duration: 0.5, delay: 0.6, ease }}
            >
              <button
                onClick={() => openModal()}
                className="btn-primary btn-shimmer text-base group"
              >
                {t("hero.ctaPrimary")}
                <span className="material-symbols-outlined text-sm ml-1 transition-[margin] duration-200 group-hover:ml-2">
                  arrow_forward
                </span>
              </button>
              <a href="#portfolio" className="btn-outline text-base">
                {t("hero.ctaSecondary")}
              </a>
            </motion.div>
          </div>

          {/* Right — HeroComputer */}
          <motion.div
            className="md:col-span-5 flex justify-center md:justify-end relative"
            aria-hidden="true"
            variants={slideRight}
            initial={ini}
            animate="visible"
            transition={{ duration: 0.7, delay: 0.25, ease }}
          >
            {/* Stronger radial glow behind the computer */}
            <div
              className="absolute inset-[-20%] pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)", filter: "blur(0px)" }}
            />
            <div className={`w-full scale-[0.8] sm:scale-90 md:scale-100 origin-center relative z-10 ${reduce ? "" : "animate-float"}`}>
              {!isOpen && (
                <Suspense fallback={null}>
                  <HeroComputer />
                </Suspense>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee ticker below hero */}
      <Marquee />
    </>
  );
}
