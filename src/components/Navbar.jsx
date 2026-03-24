import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useScrollSpy } from "../hooks/useScrollSpy";

const NAV_LINKS = [
  { key: "portfolio", href: "/#portfolio", isPage: false },
  { key: "about",     href: "/#about",     isPage: false },
  { key: "pricing",   href: "/prijzen",    isPage: true  },
  { key: "contact",   href: "/#contact",   isPage: false },
];

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const sections = pathname === "/" ? ["portfolio", "about", "contact"] : [];
  const activeSection = useScrollSpy(sections);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/60 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(124,58,237,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav aria-label="Main navigation" className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-xl md:text-2xl font-extrabold gradient-text font-headline">
          Vexxo Studio
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 font-headline font-bold tracking-tight text-sm">
          {NAV_LINKS.map(({ key, href, isPage }) => {
            const isActive = activeSection === key;
            return (
              <div key={key} className="relative group">
                <Link
                  to={href}
                  className={`flex items-center transition-all duration-200 group-hover:scale-[1.06] ${
                    isActive ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface"
                  }`}
                >
                  {t(`nav.${key}`)}
                  {isPage && (
                    <span className="opacity-0 translate-x-[-4px] translate-y-[4px] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 ml-0 group-hover:ml-1 text-[10px]">
                      ↗
                    </span>
                  )}
                </Link>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
            );
          })}
        </div>

        {/* Right side: language toggle → CTA → Logout */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language switcher — left of CTA */}
          <button
            onClick={() => setLang(lang === "nl" ? "en" : "nl")}
            aria-label={lang === "nl" ? "Switch to English" : "Schakel naar Nederlands"}
            className="flex items-center gap-1 text-[11px] font-bold transition-colors hover:text-on-surface-variant"
          >
            <span lang="nl" className={lang === "nl" ? "text-on-surface" : "text-on-surface-variant/40"}>NL</span>
            <span className="text-on-surface-variant/30" aria-hidden="true">|</span>
            <span lang="en" className={lang === "en" ? "text-on-surface" : "text-on-surface-variant/40"}>EN</span>
          </button>

          {/* CTA — always visible, navigates to /prijzen */}
          <Link
            to="/prijzen"
            className="btn-primary text-sm px-6 py-2.5 group flex items-center hover:scale-[1.05] transition-transform duration-200"
          >
            <span>{t("nav.getStarted")}</span>
            <span className="opacity-0 translate-x-[-4px] translate-y-[4px] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 ml-0 group-hover:ml-1.5 text-xs">↗</span>
          </Link>

          {/* Logout — only visible when logged in */}
          {user && (
            <button
              onClick={signOut}
              aria-label={t("nav.signOut")}
              className="flex items-center text-[#55545b] hover:text-[#ef4444] hover:scale-110 hover:bg-red-500/8 px-2 py-1.5 rounded-lg transition-all duration-[250ms] group"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[80px] group-hover:opacity-100 group-hover:ml-1.5 text-[11px] font-bold transition-all duration-[250ms] whitespace-nowrap">
                {t("nav.signOut")}
              </span>
            </button>
          )}
        </div>

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
              <Link
                key={key}
                to={href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-semibold text-on-surface-variant hover:text-on-surface border-b border-white/5 transition-colors"
              >
                {t(`nav.${key}`)}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-4">
              <Link
                to="/prijzen"
                onClick={() => setOpen(false)}
                className="btn-primary text-sm px-6 py-2.5"
              >
                {t("nav.getStarted")}
              </Link>
              <button
                onClick={() => { setLang(lang === "nl" ? "en" : "nl"); setOpen(false); }}
                aria-label={lang === "nl" ? "Switch to English" : "Schakel naar Nederlands"}
                className="flex items-center gap-1 text-[11px] font-bold"
              >
                <span lang="nl" className={lang === "nl" ? "text-on-surface" : "text-on-surface-variant/40"}>NL</span>
                <span className="text-on-surface-variant/30" aria-hidden="true">|</span>
                <span lang="en" className={lang === "en" ? "text-on-surface" : "text-on-surface-variant/40"}>EN</span>
              </button>
            </div>
            {user && (
              <button
                onClick={() => { signOut(); setOpen(false); }}
                className="py-3 text-sm font-semibold text-red-400 hover:text-red-300 border-b border-white/5 transition-colors"
              >
                {t("nav.signOut")}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
