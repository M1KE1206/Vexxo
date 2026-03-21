import { lazy, Suspense } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useModal } from "../context/ModalContext";

// Lazy-load the heavy 3D terminal — only render when visible and modal is closed
const HeroComputer = lazy(() => import("./HeroComputer"));

export default function Hero() {
  const { t } = useLanguage();
  const { openModal, isOpen } = useModal();

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-[calc(100vh-80px)] flex items-center px-6 md:px-8 max-w-7xl mx-auto py-16 overflow-hidden"
    >
      {/* Background glow blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/8 blur-[140px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/6 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="grid md:grid-cols-12 gap-12 items-center w-full">
        {/* Left — text */}
        <div className="md:col-span-7 z-10 space-y-8">
          <span className="inline-block text-accent font-bold tracking-[0.2em] text-xs uppercase">
            {t("hero.badge")}
          </span>

          <h1 id="hero-heading" className="text-5xl md:text-6xl lg:text-7xl font-headline font-extrabold tracking-tight leading-[1.1]">
            {t("hero.headline1")}<br />
            {t("hero.headline2")}<br />
            <span className="gradient-text">{t("hero.headline3")}</span>
          </h1>

          <p className="text-on-surface-variant text-lg md:text-xl max-w-xl leading-relaxed">
            {t("hero.subheadline")}
          </p>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => openModal()} className="btn-primary text-base">
              {t("hero.ctaPrimary")}
            </button>
            <a href="#portfolio" className="btn-outline text-base">
              {t("hero.ctaSecondary")}
            </a>
          </div>
        </div>

        {/* Right — 3D Computer (unmounted while modal is open for performance) */}
        <div className="md:col-span-5 flex justify-center md:justify-end" aria-hidden="true">
          <div className="w-full scale-[0.8] sm:scale-90 md:scale-100 origin-center">
            {!isOpen && (
              <Suspense fallback={null}>
                <HeroComputer />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
