# Auth Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Voeg een Supabase auth modal toe aan de Vexxo website zodat bezoekers kunnen inloggen/registreren wanneer ze een CTA klikken, waarna de actie naadloos verdergaat.

**Architecture:** De site draait op **Vite + React** (`src/App.jsx`, niet Next.js). Een nieuwe `AuthContext` beheert de Supabase-sessie en `requireAuth(payload)` gate-t CTA's. `AuthModal` is een glassmorphism overlay met login/registreer tabs en Framer Motion animaties. Alle 5 bestaande `openModal()`-aanroepen worden vervangen door `requireAuth({ action: 'openServiceModal', data? })`.

**Tech Stack:** React 18, Vite, Supabase JS SDK v2 (`@supabase/supabase-js`), Framer Motion (al aanwezig), bestaande `useLanguage()` + `useReducedMotion()` hooks.

---

## Bestand-overzicht

| Bestand | Actie | Verantwoordelijkheid |
|---|---|---|
| `src/lib/supabase.js` | Maak aan | Supabase client singleton |
| `src/context/AuthContext.jsx` | Maak aan | Sessie state, `requireAuth`, `pendingAction` |
| `src/components/AuthModal.jsx` | Maak aan | Login/registreer modal UI (gebruikt ook `useModal` voor dual-modal) |
| `src/App.jsx` | Wijzig | Voeg `AuthProvider` + `<AuthModal />` toe |
| `src/locales/nl.json` | Wijzig | Auth i18n sleutels (NL) |
| `src/locales/en.json` | Wijzig | Auth i18n sleutels (EN) |
| `src/components/ServiceRequestModal.jsx` | Wijzig | Auto-fill `fullName` + `email` vanuit `useAuth()` |
| `src/components/Hero.jsx` | Wijzig | `openModal()` → `requireAuth(...)` |
| `src/components/Navbar.jsx` | Wijzig | `openModal()` → `requireAuth(...)` (×2) |
| `src/components/AboutCompany.jsx` | Wijzig | `openModal` prop → `requireAuth(...)` |
| `src/components/PricingCalculator.jsx` | Wijzig | `openModal({...})` → `requireAuth({...})` |

---

## Taak 1: Installeer Supabase + maak client aan

**Bestanden:**
- Maak aan: `src/lib/supabase.js`

- [ ] **Stap 1: Installeer Supabase SDK**

```bash
npm install @supabase/supabase-js
```

Verwacht: geen errors, `package.json` bevat `"@supabase/supabase-js"`.

- [ ] **Stap 2: Maak `src/lib/supabase.js` aan**

```js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://drxumiwwiesjpbouboym.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyeHVtaXd3aWVzanBib3Vib3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5Mjg1MjgsImV4cCI6MjA4OTUwNDUyOH0._oyS2a8dDcrua8hF_BHtau1vqY7RbyxCw7TBvA8mByA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

- [ ] **Stap 3: Verifieer dat Vite dev server start zonder errors**

```bash
npm run dev
```

Verwacht: server start op http://localhost:5173, geen console errors.

- [ ] **Stap 4: Commit**

```bash
git add package.json package-lock.json src/lib/supabase.js
git commit -m "feat: add Supabase client singleton"
```

---

## Taak 2: AuthContext

**Bestanden:**
- Maak aan: `src/context/AuthContext.jsx`

- [ ] **Stap 1: Maak `src/context/AuthContext.jsx` aan**

```jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Module-level dispatch registratie (bridge naar ModalContext).
// AppDispatcher in App.jsx registreert de echte functie na mount.
// Bij HMR in dev kan de fn even null zijn — dit is een bekende edge case.
let _dispatchFn = null
export function _registerDispatch(fn) { _dispatchFn = fn }

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [session, setSession]   = useState(null)
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    // Initiële sessie check (synchroon, vóór OAuth redirect fragment verwerkt is)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    // Luistert naar alle auth state changes, inclusief OAuth redirect na paginareload
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session) {
        // Verwerk pending action — overleeft OAuth redirect via sessionStorage
        const raw = sessionStorage.getItem('pendingAction')
        if (raw) {
          sessionStorage.removeItem('pendingAction')
          try {
            const payload = JSON.parse(raw)
            setTimeout(() => _dispatchFn?.(payload), 0)
          } catch {
            // Ongeldige JSON — negeer
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  /**
   * Gate een CTA actie achter auth.
   * payload: { action: string, data?: any }
   * Actieve sessie → dispatch direct.
   * Geen sessie → sessionStorage + open AuthModal.
   */
  const requireAuth = useCallback((payload) => {
    if (session) {
      _dispatchFn?.(payload)
    } else {
      sessionStorage.setItem('pendingAction', JSON.stringify(payload))
      setAuthOpen(true)
    }
  }, [session])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, signOut, requireAuth, authOpen, setAuthOpen }}>
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

- [ ] **Stap 2: Verifieer dat de app nog steeds start**

```bash
npm run dev
```

- [ ] **Stap 3: Commit**

```bash
git add src/context/AuthContext.jsx
git commit -m "feat: add AuthContext with Supabase session + requireAuth"
```

---

## Taak 3: i18n sleutels

**Bestanden:**
- Wijzig: `src/locales/nl.json`
- Wijzig: `src/locales/en.json`

> **Noot:** De "switch tab" strings bevatten alleen de vraagzin — het woord voor de tab-knop zelf (`"Inloggen"` / `"Registreren"`) wordt apart via `auth.tab.*` gerenderd. Zo is er geen string-splitsen nodig.

- [ ] **Stap 1: Voeg auth-sleutels toe aan `src/locales/nl.json`**

Voeg dit object toe als nieuwe top-level key (vóór de laatste `}`):

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
    "switchPrompt": "Nog geen account?"
  },
  "register": {
    "title": "Account aanmaken",
    "subtitle": "Eenmalig registreren — je gegevens worden daarna automatisch ingevuld.",
    "name": "Volledige naam",
    "email": "E-mailadres",
    "password": "Wachtwoord",
    "submit": "Account aanmaken",
    "google": "Doorgaan met Google",
    "switchPrompt": "Al een account?"
  },
  "error": {
    "invalidCredentials": "E-mail of wachtwoord is onjuist.",
    "emailInUse": "Dit e-mailadres is al in gebruik.",
    "weakPassword": "Wachtwoord moet minimaal 8 tekens bevatten.",
    "network": "Verbindingsfout. Probeer opnieuw.",
    "oauthCancelled": "Inloggen met Google geannuleerd.",
    "unknown": "Er is iets misgegaan. Probeer opnieuw."
  },
  "close": "Sluiten",
  "divider": "of"
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
    "switchPrompt": "No account yet?"
  },
  "register": {
    "title": "Create account",
    "subtitle": "Register once — your details will be filled in automatically.",
    "name": "Full name",
    "email": "Email address",
    "password": "Password",
    "submit": "Create account",
    "google": "Continue with Google",
    "switchPrompt": "Already have an account?"
  },
  "error": {
    "invalidCredentials": "Email or password is incorrect.",
    "emailInUse": "This email address is already in use.",
    "weakPassword": "Password must be at least 8 characters.",
    "network": "Connection error. Please try again.",
    "oauthCancelled": "Google sign-in was cancelled.",
    "unknown": "Something went wrong. Please try again."
  },
  "close": "Close",
  "divider": "or"
}
```

- [ ] **Stap 3: Verifieer dat de app start zonder JSON-fouten**

```bash
npm run dev
```

- [ ] **Stap 4: Commit**

```bash
git add src/locales/nl.json src/locales/en.json
git commit -m "feat: add auth i18n keys (nl + en)"
```

---

## Taak 4: AuthModal component

**Bestanden:**
- Maak aan: `src/components/AuthModal.jsx`

`AuthModal` importeert zowel `useAuth` (voor `authOpen`/`setAuthOpen`) als `useModal` (voor `closeModal` in het dual-modal scenario). Dit werkt omdat `AuthModal` gerenderd wordt **binnen** `ModalProvider` (zie Taak 5).

- [ ] **Stap 1: Maak `src/components/AuthModal.jsx` aan**

```jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useModal } from '../context/ModalContext'
import { useLanguage } from '../context/LanguageContext'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Supabase error message → i18n sleutel
function mapError(err) {
  if (!err) return null
  const msg = err.message?.toLowerCase() ?? ''
  if (msg.includes('invalid login credentials'))                      return 'auth.error.invalidCredentials'
  if (msg.includes('user already registered') ||
      msg.includes('already been registered'))                        return 'auth.error.emailInUse'
  if (msg.includes('password should be at least'))                   return 'auth.error.weakPassword'
  if (msg.includes('fetch') || msg.includes('network'))              return 'auth.error.network'
  return 'auth.error.unknown'
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '0.55rem',
  padding: '0.55rem 0.8rem',
  fontSize: '0.8rem',
  color: '#f9f5fd',
  outline: 'none',
  fontFamily: 'inherit',
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export default function AuthModal() {
  const { authOpen, setAuthOpen }   = useAuth()
  const { isOpen: serviceOpen, closeModal } = useModal()
  const { t }                       = useLanguage()
  const reduced                     = useReducedMotion()

  const [activeTab, setActiveTab] = useState('login')  // 'login' | 'register'
  const [email, setEmail]         = useState('')
  const [password, setPass]       = useState('')
  const [name, setName]           = useState('')
  const [error, setError]         = useState(null)
  const [loading, setLoading]     = useState(false)

  const firstFocusRef = useRef(null)
  const modalRef      = useRef(null)

  // Scroll lock + optioneel sluiten van ServiceRequestModal (dual-modal edge case)
  useEffect(() => {
    if (authOpen) {
      // Als ServiceRequestModal ook open is: sluit die eerst (synchroon vóór overflow lock)
      if (serviceOpen) closeModal()
      document.body.style.overflow = 'hidden'
      setTimeout(() => firstFocusRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [authOpen, serviceOpen, closeModal])

  // Escape-toets + focus trap
  useEffect(() => {
    if (!authOpen) return

    function onKey(e) {
      if (e.key === 'Escape') { handleClose(); return }
      if (e.key !== 'Tab') return

      const focusable = modalRef.current?.querySelectorAll(
        'button, input, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [authOpen])

  const handleClose = useCallback(() => {
    setAuthOpen(false)
    setError(null)
    setEmail('')
    setPass('')
    setName('')
    setActiveTab('login')
  }, [setAuthOpen])

  const switchTab = useCallback((tab) => {
    setActiveTab(tab)
    setError(null)
  }, [])

  async function handleEmailAuth(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = activeTab === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })

      if (result.error) {
        setError(t(mapError(result.error)))
      } else {
        handleClose()
      }
    } catch {
      setError(t('auth.error.network'))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/' },
      })
      if (error) setError(t(mapError(error)))
    } catch {
      setError(t('auth.error.network'))
    } finally {
      setLoading(false)
    }
  }

  const overlayAnim = reduced ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
  const modalAnim   = reduced ? {} : { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 } }
  const transition  = { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }

  return (
    <AnimatePresence>
      {authOpen && (
        <motion.div
          {...overlayAnim}
          transition={transition}
          onClick={handleClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,10,15,0.55)',
            backdropFilter: 'blur(2px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <motion.div
            {...modalAnim}
            transition={transition}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(19,19,25,0.92)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '1.25rem',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
              padding: '1.75rem',
              width: '100%',
              maxWidth: '380px',
              position: 'relative',
            }}
          >
            {/* Sluit-knop */}
            <button
              onClick={handleClose}
              aria-label={t('auth.close')}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                width: 28, height: 28,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '0.7rem', color: '#acaab1',
              }}
            >✕</button>

            {/* Tab toggle */}
            <div style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '0.55rem', padding: '3px', gap: '3px',
              marginBottom: '1.5rem',
            }}>
              {(['login', 'register']).map((tabKey) => (
                <button
                  key={tabKey}
                  ref={tabKey === 'login' ? firstFocusRef : null}
                  onClick={() => switchTab(tabKey)}
                  style={{
                    flex: 1, textAlign: 'center',
                    fontSize: '0.78rem',
                    fontWeight: activeTab === tabKey ? 600 : 400,
                    padding: '0.42rem', borderRadius: '0.4rem', cursor: 'pointer',
                    color: activeTab === tabKey ? '#f9f5fd' : '#acaab1',
                    background: activeTab === tabKey ? 'rgba(124,58,237,0.22)' : 'transparent',
                    border: activeTab === tabKey ? '1px solid rgba(124,58,237,0.35)' : '1px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  {t(`auth.tab.${tabKey}`)}
                </button>
              ))}
            </div>

            {/* Titel + subtitel */}
            <p
              id="auth-modal-title"
              style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.3rem' }}
            >
              {t(`auth.${activeTab}.title`)}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#acaab1', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              {t(`auth.${activeTab}.subtitle`)}
            </p>

            {/* Formulier */}
            <form onSubmit={handleEmailAuth}>
              {/* Naam — alleen bij registreren */}
              {activeTab === 'register' && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 500, color: '#acaab1', marginBottom: '0.3rem' }}>
                    {t('auth.register.name')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Jan Janssen"
                    style={inputStyle}
                  />
                </div>
              )}

              {/* E-mail */}
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 500, color: '#acaab1', marginBottom: '0.3rem' }}>
                  {t(`auth.${activeTab}.email`)}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="naam@bedrijf.be"
                  style={inputStyle}
                />
              </div>

              {/* Wachtwoord */}
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 500, color: '#acaab1', marginBottom: '0.3rem' }}>
                  {t(`auth.${activeTab}.password`)}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>

              {/* Foutmelding */}
              {error && (
                <p style={{ fontSize: '0.75rem', color: '#f87171', marginBottom: '0.75rem' }} role="alert">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7C3AED, #F97316)',
                  color: 'white', border: 'none', borderRadius: '0.6rem',
                  padding: '0.7rem', fontSize: '0.82rem', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '0.85rem',
                  boxShadow: '0 0 20px rgba(124,58,237,0.3)',
                  transition: 'opacity 0.15s',
                }}
              >
                {loading ? '…' : t(`auth.${activeTab}.submit`)}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem', fontSize: '0.68rem', color: '#55545b' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              {t('auth.divider')}
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.6rem',
                padding: '0.62rem', fontSize: '0.78rem', fontWeight: 600, color: '#f9f5fd',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem',
              }}
            >
              <GoogleIcon />
              {t(`auth.${activeTab}.google`)}
            </button>

            {/* Switch tab */}
            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#acaab1', marginTop: '0.85rem' }}>
              {t(`auth.${activeTab}.switchPrompt`)}{' '}
              <button
                onClick={() => switchTab(activeTab === 'login' ? 'register' : 'login')}
                style={{ color: '#C084FC', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}
              >
                {t(`auth.tab.${activeTab === 'login' ? 'register' : 'login'}`)}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Stap 2: Verifieer dat de app start zonder errors**

```bash
npm run dev
```

- [ ] **Stap 3: Commit**

```bash
git add src/components/AuthModal.jsx
git commit -m "feat: add AuthModal component (glass, login/register, Supabase, dual-modal safe)"
```

---

## Taak 5: Wire App.jsx

**Bestanden:**
- Wijzig: `src/App.jsx`

`AppDispatcher` is een intern component dat de bridge legt tussen `AuthContext` (buiten `ModalProvider`) en `useModal` (binnen). Het heeft geen UI.

- [ ] **Stap 1: Voeg `AppDispatcher` toe aan `src/App.jsx` en update de provider tree**

Voeg toe aan de imports:

```jsx
import { AuthProvider, _registerDispatch } from './context/AuthContext'
import AuthModal from './components/AuthModal'
```

Voeg toe als intern component (in hetzelfde bestand, boven `App()`):

```jsx
function AppDispatcher() {
  const { openModal } = useModal()

  useEffect(() => {
    _registerDispatch((payload) => {
      if (payload?.action === 'openServiceModal') {
        openModal(payload.data ?? null)
      }
    })
    return () => _registerDispatch(null)
  }, [openModal])

  return null
}
```

Vervang de volledige `App()` return door:

```jsx
export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <ModalProvider>
            <AppDispatcher />
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

              {/* Modals — buiten page-content, AuthModal bovenaan de z-stack */}
              <Suspense fallback={null}>
                <ServiceRequestModal />
              </Suspense>
              <AuthModal />
            </div>
          </ModalProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  )
}
```

Voeg `useEffect` toe aan de React import als dat er nog niet in staat.

- [ ] **Stap 2: Verifieer dat app laadt, geen console errors**

```bash
npm run dev
```

Open de browser. Check dat de pagina normaal laadt. Open DevTools console — geen errors.

- [ ] **Stap 3: Verifieer dat AuthModal opent via console**

In de browser console:
```js
// Simuleer een requireAuth call via React state — niet mogelijk via console.
// Test in plaats daarvan door op een CTA te klikken (na Taak 6).
```

- [ ] **Stap 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire AuthProvider + AuthModal + AppDispatcher in App.jsx"
```

---

## Taak 6: Vervang openModal() door requireAuth() in alle CTA's

**Bestanden:**
- Wijzig: `src/components/Hero.jsx`
- Wijzig: `src/components/Navbar.jsx`
- Wijzig: `src/components/AboutCompany.jsx`
- Wijzig: `src/components/PricingCalculator.jsx`

> **Werkwijze per bestand:** zoek de aanroep via grep, lees de context, pas aan. Vertrouw niet op regelnummers.

- [ ] **Stap 1: `Hero.jsx`**

Zoek de aanroep:
```bash
grep -n "openModal" src/components/Hero.jsx
```

Vervang:
```jsx
// Oud
const { openModal, isOpen } = useModal()
// onClick={() => openModal()}

// Nieuw
import { useAuth } from '../context/AuthContext'
const { requireAuth } = useAuth()
// onClick={() => requireAuth({ action: 'openServiceModal' })}
```

Verwijder de `useModal` import als `isOpen` nergens anders gebruikt wordt in dit bestand.

- [ ] **Stap 2: `Navbar.jsx`**

```bash
grep -n "openModal" src/components/Navbar.jsx
```

Vervang beide aanroepen:
```jsx
// Oud
const { openModal } = useModal()
onClick={() => openModal()
onClick={() => { openModal(); setOpen(false) }

// Nieuw
import { useAuth } from '../context/AuthContext'
const { requireAuth } = useAuth()
onClick={() => requireAuth({ action: 'openServiceModal' })
onClick={() => { requireAuth({ action: 'openServiceModal' }); setOpen(false) }
```

- [ ] **Stap 3: `AboutCompany.jsx`**

```bash
grep -n "openModal" src/components/AboutCompany.jsx
```

Vervang:
```jsx
// Oud
const { openModal } = useModal()
onCta={openModal}  // of onClick={() => openModal()}

// Nieuw
import { useAuth } from '../context/AuthContext'
const { requireAuth } = useAuth()
onCta={() => requireAuth({ action: 'openServiceModal' })}
```

- [ ] **Stap 4: `PricingCalculator.jsx`**

```bash
grep -n "openModal" src/components/PricingCalculator.jsx
```

Vervang:
```jsx
// Oud
const { openModal } = useModal()
onClick={() => openModal({
  fromCalculator: true,
  serviceType: ...,
  pages: ...,
  // etc.
})}

// Nieuw
import { useAuth } from '../context/AuthContext'
const { requireAuth } = useAuth()
onClick={() => requireAuth({
  action: 'openServiceModal',
  data: {
    fromCalculator: true,
    serviceType: ...,
    pages: ...,
    // etc. — kopieer alle bestaande prefill-velden 1:1
  }
})}
```

- [ ] **Stap 5: Smoke test in browser**

1. Open http://localhost:5173
2. Klik op een CTA (zonder ingelogd te zijn) → AuthModal verschijnt
3. Sluit via ✕ → sluit
4. Sluit via Escape → sluit
5. Klik op overlay → sluit

- [ ] **Stap 6: Commit**

```bash
git add src/components/Hero.jsx src/components/Navbar.jsx src/components/AboutCompany.jsx src/components/PricingCalculator.jsx
git commit -m "feat: gate all CTAs behind requireAuth"
```

---

## Taak 7: Auto-fill ServiceRequestModal

**Bestanden:**
- Wijzig: `src/components/ServiceRequestModal.jsx`

- [ ] **Stap 1: Zoek de form state initialisatie**

```bash
grep -n "fullName\|form.*useState" src/components/ServiceRequestModal.jsx | head -5
```

- [ ] **Stap 2: Voeg `useAuth` toe en initialiseer form met user data**

Voeg toe aan imports:
```jsx
import { useAuth } from '../context/AuthContext'
```

Voeg toe in de component body (boven de `form` useState):
```jsx
const { user } = useAuth()
```

Vervang de form `useState` initialisatie:
```jsx
// Vóór:
const [form, setForm] = useState({
  fullName: "", company: "", email: "", phone: "", preferredContact: "email", deadline: "", notes: ""
})

// Na:
const [form, setForm] = useState(() => ({
  fullName: user?.user_metadata?.full_name ?? "",
  company:  "",
  email:    user?.email ?? "",
  phone:    "",
  preferredContact: "email",
  deadline: "",
  notes:    "",
}))
```

- [ ] **Stap 3: Update de reset-useEffect bij modal open**

Zoek de useEffect die de form reset:
```bash
grep -n "setForm.*fullName\|useEffect.*isOpen" src/components/ServiceRequestModal.jsx | head -5
```

Vervang de reset:
```jsx
useEffect(() => {
  if (isOpen) {
    setForm({
      fullName: user?.user_metadata?.full_name ?? "",
      company:  "",
      email:    user?.email ?? "",
      phone:    "",
      preferredContact: "email",
      deadline: "",
      notes:    "",
    })
  }
}, [isOpen, user])
```

- [ ] **Stap 4: Smoke test**

1. Log in via AuthModal
2. Klik CTA → ServiceRequestModal opent
3. Naam en e-mail zijn automatisch ingevuld
4. Bedrijfsnaam is leeg

- [ ] **Stap 5: Commit**

```bash
git add src/components/ServiceRequestModal.jsx
git commit -m "feat: auto-fill name + email in ServiceRequestModal from auth user"
```

---

## Taak 8: End-to-end smoke test

Geen code — volledig manueel testen.

- [ ] **Test 1: E-mail registratie**
  1. Open site (Incognito) → klik CTA
  2. Tab "Registreren" → vul naam + e-mail + wachtwoord in
  3. Submit → modal sluit → ServiceRequestModal opent met auto-fill

- [ ] **Test 2: E-mail login**
  1. Incognito → klik CTA → tab "Inloggen"
  2. Log in → modal sluit → ServiceRequestModal opent met auto-fill

- [ ] **Test 3: Google OAuth**
  1. Klik CTA → "Doorgaan met Google"
  2. Na auth: terug op site, ServiceRequestModal opent

- [ ] **Test 4: Sessie persist na refresh**
  1. Log in → ververs pagina
  2. Klik CTA → ServiceRequestModal opent **direct** (geen AuthModal)

- [ ] **Test 5: Sessie verloop (simuleer)**
  1. Log in → open ServiceRequestModal → typ in de console: `await supabase.auth.signOut()`
  2. Sluit ServiceRequestModal → klik opnieuw CTA → AuthModal verschijnt (niet ServiceRequestModal direct)

- [ ] **Test 6: Taalwissel**
  1. Wissel naar EN → AuthModal-teksten zijn in het Engels
  2. Wissel naar NL → teksten terug in Nederlands

- [ ] **Test 7: Toegankelijkheid**
  1. Open modal → druk Tab → focus gaat door alle interactieve elementen
  2. Druk Shift+Tab → focus gaat terug
  3. Focus bereikt nooit iets buiten de modal

- [ ] **Final commit**

```bash
git add src/components/ServiceRequestModal.jsx
git commit -m "test: auth modal e2e smoke test passed"
```

---

## Technische notities

### iOS Safari / ITP fallback
Als na Google OAuth redirect `sessionStorage` leeg is (ITP wiste het), is `pendingAction` null. In dat geval logt de gebruiker wel in maar de `ServiceRequestModal` opent niet automatisch — acceptabel gedrag. **Test expliciet op echte iPhone** (niet simulator) voor productie.

### Google OAuth redirect URL in Supabase dashboard
Voeg toe onder Authentication → URL Configuration:
- `http://localhost:5173/` (development — Vite default)
- `https://vexxo.be/` (productie)

### HMR edge case (dev only)
Bij hot module reload in Vite kan `_registerDispatch(null)` getriggerd worden door `AppDispatcher` unmount. Na de HMR-cyclus wordt de fn opnieuw geregistreerd. Dit heeft geen effect in productie.
