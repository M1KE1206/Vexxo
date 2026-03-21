import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useModal } from "../context/ModalContext";

const NAV_LINKS = [
  { key: "portfolio", href: "#portfolio" },
  { key: "about",     href: "#about" },
  { key: "pricing",   href: "#pricing" },
  { key: "contact",   href: "#contact" },
];

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const { openModal } = useModal();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/60 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(189,157,255,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <a href="#hero" className="text-xl md:text-2xl font-extrabold gradient-text font-headline">
          Vexxo Studio
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 font-headline font-bold tracking-tight text-sm">
          {NAV_LINKS.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {t(`nav.${key}`)}
            </a>
          ))}

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "nl" ? "en" : "nl")}
            className="rounded-full border border-outline-variant/50 px-3 py-1 text-[11px] font-bold text-on-surface-variant hover:text-on-surface hover:border-primary/50 transition-all"
          >
            {lang === "nl" ? "EN" : "NL"}
          </button>
        </div>

        {/* Get Started CTA */}
        <button
          onClick={() => openModal()}
          className="hidden md:inline-flex btn-primary text-sm px-6 py-2.5"
        >
          {t("nav.getStarted")}
        </button>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          aria-label="Toggle navigation"
          className="inline-flex flex-col items-center justify-center gap-1.5 p-2 md:hidden"
        >
          <span
            className={`block h-0.5 w-5 bg-on-surface transition-all duration-300 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-on-surface transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-on-surface transition-all duration-300 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-zinc-950/90 backdrop-blur-xl">
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-semibold text-on-surface-variant hover:text-on-surface border-b border-white/5 transition-colors"
              >
                {t(`nav.${key}`)}
              </a>
            ))}
            <div className="flex items-center gap-4 pt-4">
              <button onClick={() => { openModal(); setOpen(false); }} className="btn-primary text-sm px-6 py-2.5">
                {t("nav.getStarted")}
              </button>
              <button
                onClick={() => { setLang(lang === "nl" ? "en" : "nl"); setOpen(false); }}
                className="rounded-full border border-outline-variant/50 px-3 py-1.5 text-[11px] font-bold text-on-surface-variant"
              >
                {lang === "nl" ? "EN" : "NL"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
