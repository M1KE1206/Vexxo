# Auth Modal — Vexxo Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an auth gate op de Vexxo marketingsite zodat bezoekers een account moeten aanmaken/inloggen voordat ze een CTA-actie kunnen voltooien, met automatische auto-fill van naam en e-mail in het aanvraagformulier.

**Architecture:** Een nieuwe `AuthContext` houdt de Supabase-sessie bij en biedt `requireAuth(actionKey)` aan. Alle CTAs roepen `requireAuth` aan in plaats van direct `openModal`. Als er geen sessie is, opent `AuthModal` (glassmorphism overlay met login/register tabs). Na succesvolle auth wordt de oorspronkelijke actie hervat via `sessionStorage` (nodig voor Google OAuth redirect-flow).

**Tech Stack:** React 18, Framer Motion, Supabase JS v2 (`@supabase/supabase-js`), Vite env vars (`VITE_` prefix)

---

## File Map

| Bestand | Actie | Verantwoordelijkheid |
|---------|-------|----------------------|
| `src/lib/supabase.js` | Aanmaken | Supabase client singleton |
| `src/context/AuthContext.jsx` | Aanmaken | Sessie state, `requireAuth`, OAuth callback handler |
| `src/components/AuthModal.jsx` | Aanmaken | Login/register glassmorphism modal UI |
| `src/App.jsx` | Wijzigen | `AuthProvider` + lazy `AuthModal` toevoegen |
| `src/components/Navbar.jsx` | Wijzigen | `openModal()` → `requireAuth('openServiceModal')` |
| `src/components/Hero.jsx` | Wijzigen | `openModal()` → `requireAuth('openServiceModal')` |
| `src/components/ServiceRequestModal.jsx` | Wijzigen | Auto-fill `fullName` en `email` via `useAuth()` |
| `src/locales/nl.json` | Wijzigen | Auth i18n sleutels toevoegen |
| `src/locales/en.json` | Wijzigen | Auth i18n sleutels toevoegen |
| `.env` | Aanmaken | Supabase credentials als `VITE_` env vars |

---

## Task 1: Installeer Supabase en maak `.env` aan

**Files:**
- Modify: `package.json` (via npm install)
- Create: `.env`

- [ ] **Stap 1: Installeer `@supabase/supabase-js`**

```bash
npm install @supabase/supabase-js
```

Verwacht: package.json bevat `"@supabase/supabase-js"` in dependencies.

- [ ] **Stap 2: Maak `.env` aan in de root**

```
VITE_SUPABASE_URL=https://drxumiwwiesjpbouboym.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyeHVtaXd3aWVzanBib3Vib3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5Mjg1MjgsImV4cCI6MjA4OTUwNDUyOH0._oyS2a8dDcrua8hF_BHtau1vqY7RbyxCw7TBvA8mByA
```

- [ ] **Stap 3: Voeg `.env` toe aan `.gitignore`**

Controleer dat `.gitignore` de regel `.env` bevat (niet `.env.local` — we gebruiken `.env`).
Als het er niet in staat, voeg toe:

```
.env
```

- [ ] **Stap 4: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "feat: add @supabase/supabase-js dependency"
```

---

## Task 2: Supabase client singleton

**Files:**
- Create: `src/lib/supabase.js`

- [ ] **Stap 1: Maak `src/lib/supabase.js` aan**

```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

- [ ] **Stap 2: Verifieer in browser — start dev server**

```bash
npm run dev
```

Open de console. Er mogen geen fouten zijn over `VITE_SUPABASE_URL` of `VITE_SUPABASE_ANON_KEY`.

- [ ] **Stap 3: Commit**

```bash
git add src/lib/supabase.js
git commit -m "feat: supabase client singleton"
```

---

## Task 3: i18n — auth sleutels toevoegen

**Files:**
- Modify: `src/locales/nl.json`
- Modify: `src/locales/en.json`

- [ ] **Stap 1: Voeg auth-sleutels toe aan `src/locales/nl.json`**

Voeg onderaan het JSON-object (voor de laatste `}`) het volgende `"auth"`-blok toe:

```json
"auth": {
  "tab": {
    "login": "Inloggen",
    "register": "Registreren"
  },
  "login": {
    "title": "Welkom terug",
    "subtitle": "Log in om je aanvraag in te dienen.",
    "email": "E-mailadres",
    "password": "Wachtwoord",
    "submit": "Inloggen",
    "google": "Doorgaan met Google",
    "switchToRegister": "Nog geen account? Registreer hier"
  },
  "register": {
    "title": "Account aanmaken",
    "subtitle": "Eenmalig registreren — je gegevens worden daarna automatisch ingevuld.",
    "name": "Volledige naam",
    "email": "E-mailadres",
    "password": "Wachtwoord",
    "submit": "Account aanmaken",
    "google": "Doorgaan met Google",
    "switchToLogin": "Al een account? Log hier in"
  },
  "divider": "of",
  "modal": { "close": "Sluit modal" },
  "error": {
    "invalidCredentials": "E-mail of wachtwoord is onjuist.",
    "emailInUse": "Dit e-mailadres is al in gebruik.",
    "weakPassword": "Wachtwoord moet minimaal 8 tekens bevatten.",
    "network": "Verbindingsfout. Probeer opnieuw.",
    "oauthCancelled": "Inloggen met Google geannuleerd.",
    "unknown": "Er is iets misgegaan. Probeer opnieuw."
  }
}
```

- [ ] **Stap 2: Voeg auth-sleutels toe aan `src/locales/en.json`**

```json
"auth": {
  "tab": {
    "login": "Log in",
    "register": "Register"
  },
  "login": {
    "title": "Welcome back",
    "subtitle": "Log in to submit your request.",
    "email": "Email address",
    "password": "Password",
    "submit": "Log in",
    "google": "Continue with Google",
    "switchToRegister": "No account yet? Register here"
  },
  "register": {
    "title": "Create account",
    "subtitle": "Register once — your details will be filled in automatically.",
    "name": "Full name",
    "email": "Email address",
    "password": "Password",
    "submit": "Create account",
    "google": "Continue with Google",
    "switchToLogin": "Already have an account? Log in here"
  },
  "divider": "or",
  "modal": { "close": "Close modal" },
  "error": {
    "invalidCredentials": "Email or password is incorrect.",
    "emailInUse": "This email address is already in use.",
    "weakPassword": "Password must be at least 8 characters.",
    "network": "Connection error. Please try again.",
    "oauthCancelled": "Google sign-in was cancelled.",
    "unknown": "Something went wrong. Please try again."
  }
}
```

- [ ] **Stap 3: Commit**

```bash
git add src/locales/nl.json src/locales/en.json
git commit -m "feat: auth i18n sleutels nl + en"
```

---

## Task 4: AuthContext

**Files:**
- Create: `src/context/AuthContext.jsx`

- [ ] **Stap 1: Maak `src/context/AuthContext.jsx` aan**

```jsx
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Actie-dispatcher op basis van sleutel uit sessionStorage
function dispatchPendingAction(actionKey, openServiceModal) {
  if (actionKey === 'openServiceModal') {
    openServiceModal()
  }
}

export function AuthProvider({ children, openServiceModal }) {
  const [user,    setUser]    = useState(null)
  const [session, setSession] = useState(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  // openServiceModal kan nog niet beschikbaar zijn bij mount (ModalContext is kind)
  // sla het op via ref zodat de OAuth-callback altijd de laatste versie heeft
  const openServiceModalRef = useRef(openServiceModal)
  useEffect(() => { openServiceModalRef.current = openServiceModal }, [openServiceModal])

  useEffect(() => {
    // Initiële sessie ophalen
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    // Luister naar auth state changes (inclusief OAuth redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      // Na OAuth redirect: pending actie uitvoeren
      if (session) {
        const pending = sessionStorage.getItem('pendingAction')
        if (pending) {
          sessionStorage.removeItem('pendingAction')
          dispatchPendingAction(pending, openServiceModalRef.current)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const requireAuth = useCallback((actionKey) => {
    if (session) {
      // Sessie actief → direct uitvoeren
      dispatchPendingAction(actionKey, openServiceModalRef.current)
    } else {
      // Geen sessie → sla actie op, open AuthModal
      sessionStorage.setItem('pendingAction', actionKey)
      setAuthModalOpen(true)
    }
  }, [session])

  const signOut = useCallback(() => supabase.auth.signOut(), [])

  const closeAuthModal = useCallback(() => setAuthModalOpen(false), [])

  return (
    <AuthContext.Provider value={{ user, session, signOut, requireAuth, authModalOpen, closeAuthModal }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
```

> **Let op de provider-nesting:** `AuthProvider` ontvangt `openServiceModal` als prop uit `App.jsx`. Dit is nodig omdat `ModalContext` een kind is van `AuthProvider` — zie Task 6 voor de juiste nesting in `App.jsx`.

- [ ] **Stap 2: Commit**

```bash
git add src/context/AuthContext.jsx
git commit -m "feat: AuthContext met Supabase sessie + requireAuth"
```

---

## Task 5: AuthModal component

**Files:**
- Create: `src/components/AuthModal.jsx`

- [ ] **Stap 1: Maak `src/components/AuthModal.jsx` aan**

```jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'

// Focus trap: geeft alle focusbare elementen in de container terug
function getFocusable(el) {
  return Array.from(
    el.querySelectorAll('button, input, a[href], [tabindex]:not([tabindex="-1"])')
  ).filter(e => !e.disabled)
}

export default function AuthModal() {
  const { authModalOpen, closeAuthModal } = useAuth()
  const { t } = useLanguage()
  const prefersReduced = useReducedMotion()

  const [tab,      setTab]      = useState('login')   // 'login' | 'register'
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  const overlayRef = useRef(null)
  const modalRef   = useRef(null)

  // Scroll lock
  useEffect(() => {
    if (authModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [authModalOpen])

  // Reset form bij tab wissel of sluiten
  useEffect(() => {
    setError(null)
    setName('')
    setEmail('')
    setPassword('')
    setLoading(false)
  }, [tab, authModalOpen])

  // Escape-toets + focus trap
  useEffect(() => {
    if (!authModalOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAuthModal()
        return
      }
      if (e.key !== 'Tab') return
      const focusable = getFocusable(modalRef.current)
      if (!focusable.length) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    // Zet focus op eerste element bij open
    setTimeout(() => {
      const focusable = getFocusable(modalRef.current)
      if (focusable.length) focusable[0].focus()
    }, 50)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [authModalOpen, closeAuthModal])

  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) closeAuthModal()
  }, [closeAuthModal])

  // Supabase error → i18n sleutel
  function mapError(err) {
    if (!err) return null
    const msg = err.message?.toLowerCase() ?? ''
    if (msg.includes('invalid login') || msg.includes('invalid credentials')) return t('auth.error.invalidCredentials')
    if (msg.includes('already registered') || msg.includes('email already')) return t('auth.error.emailInUse')
    if (msg.includes('password') && msg.includes('characters')) return t('auth.error.weakPassword')
    if (msg.includes('fetch') || msg.includes('network')) return t('auth.error.network')
    return t('auth.error.unknown')
  }

  async function handleEmailLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError(mapError(error)); return }
    closeAuthModal()
  }

  async function handleEmailRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    setLoading(false)
    if (error) { setError(mapError(error)); return }
    closeAuthModal()
  }

  async function handleGoogle() {
    setLoading(true)
    setError(null)
    const redirectTo = import.meta.env.DEV
      ? 'http://localhost:5173/'
      : 'https://vexxo.be/'
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    setLoading(false)
    if (error) setError(mapError(error))
    // Bij succes: volledige redirect — geen extra actie nodig
  }

  const inputClass = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-[#f9f5fd] outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors placeholder:text-[#55545b]"
  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-[#acaab1] mb-1.5"

  return (
    <AnimatePresence>
      {authModalOpen && (
        <motion.div
          ref={overlayRef}
          onClick={handleOverlayClick}
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          style={{ background: 'rgba(10,10,15,0.55)', backdropFilter: 'blur(2px)' }}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            initial={prefersReduced ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-[380px]"
            style={{
              background: 'rgba(19,19,25,0.75)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '1.25rem',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
              padding: '2rem',
            }}
          >
            {/* Sluit-knop */}
            <button
              onClick={closeAuthModal}
              aria-label={t('auth.modal.close')}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#acaab1] hover:text-[#f9f5fd] hover:bg-white/10 transition-colors"
            >
              ✕
            </button>

            {/* Tab toggle */}
            <div className="flex rounded-xl overflow-hidden border border-white/8 mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {['login', 'register'].map((t_) => (
                <button
                  key={t_}
                  onClick={() => setTab(t_)}
                  className="flex-1 py-2.5 text-sm font-semibold transition-all"
                  style={tab === t_ ? {
                    background: 'rgba(124,58,237,0.22)',
                    border: '1px solid rgba(124,58,237,0.35)',
                    borderRadius: '0.625rem',
                    color: '#f9f5fd',
                    fontWeight: 600,
                  } : { color: '#acaab1' }}
                >
                  {t_ === 'login' ? t('auth.tab.login') : t('auth.tab.register')}
                </button>
              ))}
            </div>

            {/* Content — animeer bij tab wissel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {/* Titel */}
                <h2 id="auth-modal-title" className="text-xl font-bold text-[#f9f5fd] mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {tab === 'login' ? t('auth.login.title') : t('auth.register.title')}
                </h2>
                <p className="text-sm text-[#acaab1] mb-6">
                  {tab === 'login' ? t('auth.login.subtitle') : t('auth.register.subtitle')}
                </p>

                {/* Foutmelding */}
                {error && (
                  <div className="mb-4 rounded-lg px-4 py-2.5 text-sm text-[#f9f5fd] bg-red-500/15 border border-red-500/30">
                    {error}
                  </div>
                )}

                {/* Formulier */}
                <form onSubmit={tab === 'login' ? handleEmailLogin : handleEmailRegister} className="space-y-4">
                  {tab === 'register' && (
                    <div>
                      <label className={labelClass}>{t('auth.register.name')}</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Jan Janssen"
                        required
                        className={inputClass}
                      />
                    </div>
                  )}

                  <div>
                    <label className={labelClass}>{tab === 'login' ? t('auth.login.email') : t('auth.register.email')}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="jan@bedrijf.be"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>{tab === 'login' ? t('auth.login.password') : t('auth.register.password')}</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className={inputClass}
                    />
                  </div>

                  {/* Primaire submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #F97316)', boxShadow: '0 0 30px rgba(124,58,237,0.25)' }}
                  >
                    {loading ? '…' : (tab === 'login' ? t('auth.login.submit') : t('auth.register.submit'))}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-[#55545b]">{t('auth.divider')}</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Google OAuth */}
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full py-3 rounded-full text-sm font-bold border border-white/10 text-[#f9f5fd] hover:bg-white/5 hover:border-white/20 transition-all disabled:opacity-60"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {tab === 'login' ? t('auth.login.google') : t('auth.register.google')}
                  </span>
                </button>

                {/* Wissel tab link */}
                <p className="text-center text-xs text-[#acaab1] mt-4">
                  <button
                    type="button"
                    onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
                    className="underline hover:text-[#f9f5fd] transition-colors"
                  >
                    {tab === 'login' ? t('auth.login.switchToRegister') : t('auth.register.switchToLogin')}
                  </button>
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Stap 2: Start dev server en open localhost**

```bash
npm run dev
```

Controleer: geen console-errors bij import van `AuthModal`.

- [ ] **Stap 3: Commit**

```bash
git add src/components/AuthModal.jsx
git commit -m "feat: AuthModal component — login/register glassmorphism overlay"
```

---

## Task 6: App.jsx — providers herstructureren + AuthModal toevoegen

**Files:**
- Modify: `src/App.jsx`

De nesting wordt: `HelmetProvider → LanguageProvider → AuthProvider → ModalProvider`.
`AuthProvider` heeft `openServiceModal` nodig als prop. Daarvoor gebruiken we een bridge-component.

- [ ] **Stap 1: Vervang de inhoud van `src/App.jsx`**

```jsx
import { lazy, Suspense, useCallback } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { LanguageProvider } from "./context/LanguageContext";
import { ModalProvider, useModal } from "./context/ModalContext";
import { AuthProvider } from "./context/AuthContext";
import { useLanguage } from "./context/LanguageContext";
import { SEO } from "./config/seo";
import StructuredData from "./components/StructuredData";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import AboutMe from "./components/AboutMe";
import AboutCompany from "./components/AboutCompany";
import PricingCalculator from "./components/PricingCalculator";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CustomCursor from "./components/CustomCursor";

const ServiceRequestModal = lazy(() => import("./components/ServiceRequestModal"));
const AuthModal           = lazy(() => import("./components/AuthModal"));

function SeoHead() {
  const { lang, t } = useLanguage();
  const isNL = lang === "nl";

  return (
    <Helmet>
      <html lang={isNL ? "nl-BE" : "en-GB"} />
      <title>{t("seo.title")}</title>
      <meta name="description"  content={t("seo.description")} />
      <meta name="keywords"     content={SEO.keywords} />
      <meta name="author"       content={SEO.siteName} />
      <link rel="canonical"     href={SEO.siteUrl} />
      <meta name="robots"       content="index, follow" />
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={SEO.siteUrl} />
      <meta property="og:title"       content={t("seo.title")} />
      <meta property="og:description" content={t("seo.description")} />
      <meta property="og:image"       content={`${SEO.siteUrl}/og-image.png`} />
      <meta property="og:locale"      content={isNL ? SEO.locale : SEO.localeAlt} />
      <meta property="og:site_name"   content={SEO.siteName} />
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={SEO.twitterHandle} />
      <meta name="twitter:title"       content={t("seo.title")} />
      <meta name="twitter:description" content={t("seo.description")} />
      <meta name="twitter:image"       content={`${SEO.siteUrl}/og-image.png`} />
      <link rel="alternate" hreflang="nl" href={`${SEO.siteUrl}/?lang=nl`} />
      <link rel="alternate" hreflang="en" href={`${SEO.siteUrl}/?lang=en`} />
      <link rel="alternate" hreflang="x-default" href={SEO.siteUrl} />
    </Helmet>
  );
}

/**
 * Bridge: zit binnen ModalProvider zodat useModal() werkt,
 * en geeft openModal door aan AuthProvider.
 */
function AppWithAuth() {
  const { openModal } = useModal();
  const openServiceModal = useCallback(() => openModal(), [openModal]);

  return (
    <AuthProvider openServiceModal={openServiceModal}>
      <SeoHead />
      <StructuredData />

      <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary/30 dark">
        <CustomCursor />

        <div className="page-content">
          <Navbar />
          <main id="main-content" className="relative z-10 pt-20">
            <Hero />
            <Portfolio />
            <AboutMe />
            <AboutCompany />
            <PricingCalculator />
            <Contact />
          </main>
          <Footer />
          <ScrollToTop />
        </div>

        <Suspense fallback={null}>
          <ServiceRequestModal />
        </Suspense>

        <Suspense fallback={null}>
          <AuthModal />
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <ModalProvider>
          <AppWithAuth />
        </ModalProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}
```

> **Afwijking van de spec:** De spec schrijft `AuthProvider → ModalProvider` voor (AuthProvider omsluit ModalProvider). Dit plan draait de volgorde om: `ModalProvider` omsluit `AuthProvider`. Reden: `AuthProvider` heeft `openServiceModal` (uit `ModalContext`) nodig bij mount. Als `AuthProvider` buiten `ModalProvider` zit, kan `useModal()` er niet aangeroepen worden. Oplossing: de `AppWithAuth` bridge-component zit wél binnen `ModalProvider`, roept `useModal()` aan, en geeft `openServiceModal` als prop door aan `AuthProvider`. Functioneel equivalent aan de spec.

- [ ] **Stap 2: Controleer in browser**

Open `localhost:5173`. De pagina moet normaal laden zonder errors.
Open DevTools → Console: geen fouten.

- [ ] **Stap 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: App.jsx — AuthProvider + AuthModal toevoegen, bridge pattern"
```

---

## Task 7: Navbar — CTA naar `requireAuth`

**Files:**
- Modify: `src/components/Navbar.jsx`

- [ ] **Stap 1: Voeg `useAuth` import toe en vervang `openModal` calls**

Vervang bovenaan het bestand:
```jsx
// Oude import:
import { useModal } from "../context/ModalContext";
// Nieuwe import (naast de bestaande imports):
import { useAuth } from "../context/AuthContext";
```

Verwijder de `useModal` import-regel volledig (Navbar gebruikt `openModal` niet meer direct).

Vervang in de component body:
```jsx
// Oud:
const { openModal } = useModal();
// Nieuw:
const { requireAuth } = useAuth();
```

Vervang de twee `onClick={() => openModal()}` calls (desktop én mobile):
```jsx
// Oud (desktop):
<button onClick={() => openModal()} className="btn-primary text-sm px-6 py-2.5">

// Nieuw (desktop):
<button onClick={() => requireAuth('openServiceModal')} className="btn-primary text-sm px-6 py-2.5">
```

```jsx
// Oud (mobile):
<button onClick={() => { openModal(); setOpen(false); }} className="btn-primary text-sm px-6 py-2.5">

// Nieuw (mobile):
<button onClick={() => { requireAuth('openServiceModal'); setOpen(false); }} className="btn-primary text-sm px-6 py-2.5">
```

- [ ] **Stap 2: Verifieer in browser**

Klik op "Aan de slag →" in de navbar.
**Verwacht:** AuthModal opent (niet direct ServiceRequestModal).

- [ ] **Stap 3: Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: Navbar CTA — requireAuth gate ipv directe openModal"
```

---

## Task 8: Hero — CTA naar `requireAuth`

**Files:**
- Modify: `src/components/Hero.jsx`

- [ ] **Stap 1: Vervang `openModal` met `requireAuth` in Hero**

Voeg import toe:
```jsx
import { useAuth } from "../context/AuthContext";
```

Vervang in de component body:
```jsx
// Oud:
const { openModal, isOpen } = useModal();
// Nieuw (isOpen is niet meer nodig in Hero):
const { requireAuth } = useAuth();
```

Zoek alle `onClick` handlers in Hero die `openModal()` aanroepen en vervang met `requireAuth('openServiceModal')`.

Controleer of `useModal` nog ergens anders in Hero gebruikt wordt. Als dit niet het geval is, verwijder de `useModal` import.

- [ ] **Stap 2: Verifieer in browser**

Klik op de primaire CTA knop in de Hero ("Start een project").
**Verwacht:** AuthModal opent.

- [ ] **Stap 3: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "feat: Hero CTA — requireAuth gate"
```

---

## Task 9: ServiceRequestModal — auto-fill naam + e-mail

**Files:**
- Modify: `src/components/ServiceRequestModal.jsx`

- [ ] **Stap 1: Voeg `useAuth` import toe**

```jsx
import { useAuth } from "../context/AuthContext";
```

- [ ] **Stap 2: Haal user op in component body**

Voeg bovenaan de `ServiceRequestModal` functie toe (na bestaande hooks):
```jsx
const { user } = useAuth();
```

- [ ] **Stap 3: Laat `useState` voor `form` ongewijzigd**

De `useState` initializer blijft leeg. `useState` leest de beginwaarde slechts één keer bij mount — als `user` nog niet beschikbaar is (bijv. bij lazy loading), zou auto-fill stilzwijgend falen. Gebruik in plaats daarvan een `useEffect` (zie Stap 3b).

- [ ] **Stap 3b: Voeg een `useEffect` toe voor auto-fill sync**

Voeg dit blok toe direct ná de bestaande `useState`-declaratie voor `form`:
```jsx
// Auto-fill vanuit ingelogde gebruiker zodra user beschikbaar is
useEffect(() => {
  if (user) {
    setForm(prev => ({
      ...prev,
      fullName: prev.fullName || (user.user_metadata?.full_name ?? ""),
      email:    prev.email    || (user.email ?? ""),
    }))
  }
}, [user])
```

> De `prev.fullName || …` conditie zorgt dat handmatig ingevoerde waarden niet worden overschreven als de gebruiker al iets heeft ingetypt.

- [ ] **Stap 4: Pas ook de reset-aanroep aan**

Zoek deze exacte regel (staat vlak onder de `useState` die je net aanpaste):
```jsx
      setForm({ fullName: "", company: "", email: "", phone: "", preferredContact: "email", deadline: "", notes: "" });
```

Vervang met:
```jsx
      setForm({
        fullName: user?.user_metadata?.full_name ?? "",
        company:  "",
        email:    user?.email ?? "",
        phone:    "",
        preferredContact: "email",
        deadline: "",
        notes:    "",
      });
```

- [ ] **Stap 5: Verifieer flow end-to-end in browser**

1. Klik CTA → AuthModal opent
2. Registreer met naam "Test Gebruiker" + e-mail + wachtwoord
3. Na registratie: AuthModal sluit, ServiceRequestModal opent automatisch
4. Controleer: naam- en e-mailveld zijn ingevuld, bedrijfsnaam is leeg

- [ ] **Stap 6: Commit**

```bash
git add src/components/ServiceRequestModal.jsx
git commit -m "feat: ServiceRequestModal auto-fill naam + e-mail via useAuth"
```

---

## Task 10: Visuele check + eindverificatie

- [ ] **Stap 1: Neem screenshot van de AuthModal (login tab)**

Gebruik Playwright MCP om een screenshot te nemen:
- Navigeer naar `localhost:5173`
- Klik de navbar CTA
- Screenshot: controleer glassmorphism effect, gradient knop, tab toggle

Checklist:
- [ ] Gradients max 3 (logo + CTA knop + modal gradient-knop = 3 ✓)
- [ ] Modal achtergrond = glassmorphism (geen gradient background)
- [ ] Tab actief = lichte purple bg + border, niet filled gradient
- [ ] Typography: h2 titel correct, labels uppercase tracking

- [ ] **Stap 2: Neem screenshot van de register tab**

Wissel naar "Registreren" tab, screenshot:
- [ ] Naam-veld aanwezig
- [ ] Tab-animatie smooth (geen flash)

- [ ] **Stap 3: Test Escape-toets**

Open modal → druk Escape → modal sluit.

- [ ] **Stap 4: Test overlay klik**

Open modal → klik naast de card op de overlay → modal sluit.

- [ ] **Stap 5: Push alle commits naar origin**

```bash
git push
```

---

## Notities voor de implementeerder

- **Google OAuth op prod:** In het Supabase dashboard moet `https://vexxo.be/` als redirect URL toegevoegd zijn onder Authentication → URL Configuration. Voeg ook `http://localhost:5173/` toe voor dev.
- **iOS Safari:** Test Google OAuth op een echte iPhone — ITP kan `sessionStorage` legen bij cross-origin redirects. Fallback: als na OAuth reload `pendingAction` leeg is maar sessie actief, open ServiceRequestModal direct. (Zie spec voor details.)
- **Dev poort:** Vite draait standaard op poort 5173 (niet 3000). De `redirectTo` URL in `AuthModal.jsx` gebruikt al `localhost:5173`.
