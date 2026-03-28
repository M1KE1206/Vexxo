import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrollSpy } from "../hooks/useScrollSpy";
import ProfileAvatar from "./ProfileAvatar";

const NAV_LINKS = [
  { key: "home",      href: "/",           isPage: false },
  { key: "portfolio", href: "/#portfolio", isPage: false },
  { key: "about",     href: "/#about",     isPage: false },
  { key: "contact",   href: "/#contact",   isPage: false },
  { key: "pricing",   href: "/prijzen",    isPage: true  },
];

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const avatarBtnRef = useRef(null);
  const dropdownRef  = useRef(null);
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const sections = pathname === "/" ? ["portfolio", "pricing-teaser", "about", "contact"] : [];
  const activeSection = useScrollSpy(sections);

  // Map pricing-teaser section → "pricing" nav key; also active on /prijzen route
  const getIsActive = (key) => {
    if (key === "pricing") return activeSection === "pricing-teaser" || pathname === "/prijzen";
    if (key === "home")    return pathname === "/" && !activeSection;
    return activeSection === key;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          avatarBtnRef.current && !avatarBtnRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') {
        setProfileOpen(false);
        avatarBtnRef.current?.focus();
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [profileOpen]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/60 backdrop-blur-xl border-b border-on-surface-variant/10 shadow-[0_8px_32px_0_rgba(124,58,237,0.08)]"
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
            const isActive = getIsActive(key);
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

        {/* Right side: theme toggle → language toggle → CTA → avatar */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme toggle — per D-05, D-06, D-07 */}
          <button
            onClick={toggle}
            aria-label={theme === 'dark' ? t('nav.toggleThemeLight') : t('nav.toggleThemeDark')}
            className="flex items-center justify-center w-9 h-9 rounded-full
                       text-on-surface-variant hover:text-primary
                       hover:bg-primary/[0.08] transition-colors duration-200
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <motion.span
              key={theme}
              animate={prefersReduced ? {} : { rotate: 360 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="material-symbols-outlined"
              style={{ fontSize: '20px', display: 'inline-block' }}
            >
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </motion.span>
          </button>

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
            <span className="opacity-0 translate-y-[4px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ml-0 group-hover:ml-1.5 text-xs">↗</span>
          </Link>

          {/* Desktop: avatar + dropdown (alleen ingelogd) */}
          {user && (
            <div className="relative">
              <button
                ref={avatarBtnRef}
                onClick={() => setProfileOpen(p => !p)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                aria-label={t('nav.profile')}
                className="flex items-center"
              >
                <ProfileAvatar size="sm" />
              </button>

              {profileOpen && (
                <div
                  ref={dropdownRef}
                  role="menu"
                  className="absolute right-0 top-[calc(100%+8px)] min-w-[160px] rounded-[0.75rem] py-1 z-50 bg-background border border-on-surface-variant/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                >
                  <Link
                    to="/profiel"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[0.82rem] font-medium hover:bg-on-surface-variant/5 transition-colors text-on-surface"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {t('nav.profile')}
                  </Link>
                  <div className="h-px mx-2 bg-on-surface-variant/10" />
                  <button
                    role="menuitem"
                    onClick={() => { signOut(); setProfileOpen(false); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); setProfileOpen(false); avatarBtnRef.current?.focus(); }
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[0.82rem] font-medium hover:bg-on-surface-variant/5 transition-colors text-left text-red-400"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    {t('nav.signOut')}
                  </button>
                </div>
              )}
            </div>
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
        <div className="md:hidden border-t border-on-surface-variant/10 bg-background/90 backdrop-blur-xl">
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                to={href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-semibold text-on-surface-variant hover:text-on-surface border-b border-on-surface-variant/5 transition-colors"
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
              {/* Mobile theme toggle */}
              <button
                onClick={() => { toggle(); setOpen(false); }}
                aria-label={theme === 'dark' ? t('nav.toggleThemeLight') : t('nav.toggleThemeDark')}
                className="flex items-center justify-center w-9 h-9 rounded-full
                           text-on-surface-variant hover:text-primary
                           hover:bg-primary/[0.08] transition-colors duration-200"
              >
                <motion.span
                  key={theme}
                  animate={prefersReduced ? {} : { rotate: 360 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="material-symbols-outlined"
                  style={{ fontSize: '20px', display: 'inline-block' }}
                >
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </motion.span>
              </button>
            </div>
            {user && (
              <>
                <Link
                  to="/profiel"
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm font-semibold text-on-surface-variant hover:text-on-surface border-b border-on-surface-variant/5 transition-colors"
                >
                  {t('nav.profile')}
                </Link>
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="py-3 text-sm font-semibold text-red-400 hover:text-red-300 border-b border-on-surface-variant/5 transition-colors text-left"
                >
                  {t('nav.signOut')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
