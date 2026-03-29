# Profile Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bouw een dashboard-stijl profielpagina met Supabase `profiles` tabel, per-veld inline editing, avatar upload, en een avatar-knop met dropdown in de navbar.

**Architecture:** `useProfile` hook als single source of truth voor profieldata; `ProfileAvatar` herbruikbaar component in navbar + pagina; `ProfilePage` lazy-loaded op `/profiel` met auth-guard; Navbar krijgt avatar-dropdown met a11y; SQL migration handmatig uit te voeren in Supabase dashboard.

**Tech Stack:** React 18, Supabase (Auth + Storage + RLS), Framer Motion, Tailwind CSS, React Router DOM v6

---

## File structure

```
supabase/
  migrations/
    20260325_create_profiles.sql     ← NIEUW — handmatig uitvoeren in Supabase SQL Editor
src/
  hooks/
    useProfile.js                    ← NIEUW — laadt/updatet profiel, avatar upload
  components/
    ProfileAvatar.jsx                ← NIEUW — herbruikbaar 32px/80px avatar component
    Navbar.jsx                       ← WIJZIGEN — avatar-dropdown vervangt logout-knop
  pages/
    ProfilePage.jsx                  ← NIEUW — dashboard profielpagina
  App.jsx                            ← WIJZIGEN — /profiel route toevoegen
  locales/
    nl.json                          ← WIJZIGEN — nav.profile + profile.* keys
    en.json                          ← WIJZIGEN — nav.profile + profile.* keys
```

---

## Task 1: SQL migration + Supabase Storage bucket

**Files:**
- Create: `supabase/migrations/20260325_create_profiles.sql`

- [ ] **Stap 1: Maak de migratiemap en het SQL-bestand aan**

```sql
-- supabase/migrations/20260325_create_profiles.sql

CREATE TABLE profiles (
  id               UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name        TEXT,
  phone            TEXT,
  address_street   TEXT,
  address_city     TEXT,
  address_zip      TEXT,
  address_country  TEXT,
  avatar_url       TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- Auto-update updated_at (table-scoped naam om conflicten te vermijden)
CREATE OR REPLACE FUNCTION profiles_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION profiles_update_updated_at();

-- Auto-insert rij bij nieuwe gebruiker
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Bestaande gebruikers backfill (veilig — ON CONFLICT doet niets als rij al bestaat)
INSERT INTO public.profiles (id, full_name, avatar_url)
SELECT
  id,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
```

- [ ] **Stap 2: Voer de SQL uit in het Supabase dashboard**

Ga naar: Supabase Dashboard → SQL Editor → New query → plak de volledige inhoud van het bestand → Run.

Verwacht: geen errors, tabel `profiles` aangemaakt.

- [ ] **Stap 3: Maak de `avatars` Storage bucket aan**

Supabase Dashboard → Storage → New bucket:
- Name: `avatars`
- Public bucket: ✅ aan
- File size limit: 2097152 (2 MB)
- Allowed MIME types: `image/jpeg, image/png, image/webp`

- [ ] **Stap 4: Voeg bestaande ingelogde gebruiker handmatig in als die al bestaat**

Controleer in Supabase → Table Editor → profiles of jouw gebruiker er al in staat. Zo niet, voer uit:

```sql
INSERT INTO public.profiles (id, full_name, avatar_url)
SELECT id,
       raw_user_meta_data->>'full_name',
       raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
```

- [ ] **Stap 5: Commit**

```bash
git add supabase/migrations/20260325_create_profiles.sql
git commit -m "feat: add profiles migration + avatars storage bucket"
```

---

## Task 2: i18n keys toevoegen

**Files:**
- Modify: `src/locales/nl.json`
- Modify: `src/locales/en.json`

- [ ] **Stap 1: Voeg `nav.profile` toe aan nl.json**

In `src/locales/nl.json`, voeg toe aan de bestaande `"nav"` sectie:
```json
"signOut": "Uitloggen",
"profile": "Mijn profiel"
```

Voeg onderaan (vóór de laatste `}`) de nieuwe `"profile"` root-key toe:
```json
"profile": {
  "pageTitle": "Mijn profiel",
  "hero": {
    "memberSince": "Lid sinds",
    "editAvatar": "Foto wijzigen"
  },
  "personalInfo": {
    "title": "Persoonlijke gegevens",
    "name": "Naam",
    "phone": "Telefoonnummer"
  },
  "address": {
    "title": "Adres",
    "street": "Straat + huisnummer",
    "city": "Stad",
    "zip": "Postcode",
    "country": "Land"
  },
  "account": {
    "title": "Accountgegevens",
    "email": "E-mailadres",
    "provider": "Inlogmethode",
    "providerGoogle": "Google",
    "providerEmail": "Email",
    "createdAt": "Aangemaakt op",
    "lastLogin": "Laatste login"
  },
  "avatar": {
    "upload": "Foto uploaden",
    "errorSize": "Bestand mag maximaal 2 MB zijn",
    "errorType": "Alleen JPEG, PNG of WebP toegestaan"
  },
  "edit": {
    "save": "Opslaan",
    "cancel": "Annuleren",
    "success": "Opgeslagen",
    "error": "Opslaan mislukt, probeer opnieuw"
  }
}
```

- [ ] **Stap 2: Voeg dezelfde structuur toe aan en.json**

In `src/locales/en.json`, voeg toe aan `"nav"`:
```json
"signOut": "Sign out",
"profile": "My profile"
```

Voeg `"profile"` root-key toe:
```json
"profile": {
  "pageTitle": "My profile",
  "hero": {
    "memberSince": "Member since",
    "editAvatar": "Change photo"
  },
  "personalInfo": {
    "title": "Personal information",
    "name": "Name",
    "phone": "Phone number"
  },
  "address": {
    "title": "Address",
    "street": "Street + number",
    "city": "City",
    "zip": "Postal code",
    "country": "Country"
  },
  "account": {
    "title": "Account details",
    "email": "Email address",
    "provider": "Sign-in method",
    "providerGoogle": "Google",
    "providerEmail": "Email",
    "createdAt": "Created on",
    "lastLogin": "Last login"
  },
  "avatar": {
    "upload": "Upload photo",
    "errorSize": "File must be 2 MB or less",
    "errorType": "Only JPEG, PNG or WebP allowed"
  },
  "edit": {
    "save": "Save",
    "cancel": "Cancel",
    "success": "Saved",
    "error": "Save failed, please try again"
  }
}
```

- [ ] **Stap 3: Commit**

```bash
git add src/locales/nl.json src/locales/en.json
git commit -m "feat: add profile i18n keys (nl + en)"
```

---

## Task 3: useProfile hook

**Files:**
- Create: `src/hooks/useProfile.js`

- [ ] **Stap 1: Schrijf de hook**

Maak `src/hooks/useProfile.js` aan met de volgende inhoud:

```js
// src/hooks/useProfile.js
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 2 * 1024 * 1024 // 2 MB

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setProfile(data)
        setLoading(false)
      })
  }, [user])

  /**
   * Optimistic update: state direct bijwerken, dan Supabase call.
   * Bij fout: rollback naar de oude waarde en gooi een error.
   */
  const updateField = useCallback(async (key, value) => {
    if (!user) throw new Error('Not authenticated')

    const prev = profile?.[key] ?? null
    setProfile(p => ({ ...p, [key]: value }))

    const { error } = await supabase
      .from('profiles')
      .update({ [key]: value })
      .eq('id', user.id)

    if (error) {
      setProfile(p => ({ ...p, [key]: prev }))
      throw error
    }
  }, [user, profile])

  /**
   * Valideer, upload via upsert (geen aparte remove nodig), sla avatar_url op.
   * Gooit een Error met message 'size' of 'type' bij validatiefouten.
   */
  const uploadAvatar = useCallback(async (file) => {
    if (!user) throw new Error('Not authenticated')
    if (file.size > MAX_SIZE) throw new Error('size')
    if (!ALLOWED_TYPES.includes(file.type)) throw new Error('type')

    const path = `${user.id}/avatar`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { contentType: file.type, upsert: true })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    // Cache-bust zodat de browser de nieuwe foto laadt
    const avatarUrl = `${publicUrl}?t=${Date.now()}`
    await updateField('avatar_url', avatarUrl)
    return avatarUrl
  }, [user, updateField])

  return { profile, loading, updateField, uploadAvatar }
}
```

- [ ] **Stap 2: Controleer visueel**

Start de dev server: `npm run dev`
Open browser → log in → open React DevTools → check dat `useProfile` de profieldata laadt zonder errors in de console.

- [ ] **Stap 3: Commit**

```bash
git add src/hooks/useProfile.js
git commit -m "feat: useProfile hook — load, updateField, uploadAvatar"
```

---

## Task 4: ProfileAvatar component

**Files:**
- Create: `src/components/ProfileAvatar.jsx`

- [ ] **Stap 1: Schrijf het component**

```jsx
// src/components/ProfileAvatar.jsx
import { useProfile } from '../hooks/useProfile'

const SIZES = {
  sm: { outer: 34, inner: 30, stroke: 13 },
  lg: { outer: 84, inner: 76, stroke: 28 },
}

// Gradient border via padding-box techniek (zelfde als .social-icon:hover in index.css)
function gradientBorderStyle(outerSize) {
  return {
    width: outerSize,
    height: outerSize,
    borderRadius: '9999px',
    background: 'linear-gradient(#0e0e13, #0e0e13) padding-box, linear-gradient(135deg, #7C3AED, #F97316) border-box',
    border: '2px solid transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  }
}

export default function ProfileAvatar({ size = 'sm' }) {
  const { profile, loading } = useProfile()
  const { outer, inner, stroke } = SIZES[size] ?? SIZES.sm

  // Loading skeleton — voorkomt layout shift in navbar
  if (loading) {
    return (
      <div
        className="rounded-full animate-pulse shrink-0"
        style={{ width: outer, height: outer, background: 'var(--surface-container, #19191f)' }}
      />
    )
  }

  if (profile?.avatar_url) {
    return (
      <div style={gradientBorderStyle(outer)}>
        <img
          src={profile.avatar_url}
          alt="Profielfoto"
          width={inner}
          height={inner}
          style={{ width: inner, height: inner, borderRadius: '9999px', objectFit: 'cover' }}
        />
      </div>
    )
  }

  // Standaard user-icon SVG
  return (
    <div style={gradientBorderStyle(outer)}>
      <svg
        width={stroke}
        height={stroke}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#acaab1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  )
}
```

- [ ] **Stap 2: Controleer**

`npm run dev` → importeer tijdelijk in App of een testpagina, verifieer dat de gradient border zichtbaar is en de user-icon correct.

- [ ] **Stap 3: Commit**

```bash
git add src/components/ProfileAvatar.jsx
git commit -m "feat: ProfileAvatar component — gradient border, loading skeleton, user icon"
```

---

## Task 5: Navbar — avatar-dropdown vervangt logout-knop

**Files:**
- Modify: `src/components/Navbar.jsx`

Huidige staat: `Navbar.jsx` importeert `useAuth` voor `{ user, signOut }` en toont een logout-knop als `user` niet null is. Er is geen dropdown.

- [ ] **Stap 1: Voeg imports en state toe**

Vervang de bovenste sectie van `Navbar.jsx`:

```jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useScrollSpy } from "../hooks/useScrollSpy";
import ProfileAvatar from "./ProfileAvatar";
```

Voeg in de `Navbar` functie toe, direct na de bestaande state-declaraties:

```jsx
const [profileOpen, setProfileOpen] = useState(false)
const avatarBtnRef = useRef(null)
const dropdownRef  = useRef(null)
const navigate     = useNavigate()
```

- [ ] **Stap 2: Voeg useEffect toe voor klik-buiten en Escape**

Voeg toe na de bestaande `useEffect` voor scroll:

```jsx
useEffect(() => {
  if (!profileOpen) return
  function handleOutside(e) {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        avatarBtnRef.current && !avatarBtnRef.current.contains(e.target)) {
      setProfileOpen(false)
    }
  }
  function handleKey(e) {
    if (e.key === 'Escape') {
      setProfileOpen(false)
      avatarBtnRef.current?.focus()
    }
  }
  document.addEventListener('mousedown', handleOutside)
  window.addEventListener('keydown', handleKey)
  return () => {
    document.removeEventListener('mousedown', handleOutside)
    window.removeEventListener('keydown', handleKey)
  }
}, [profileOpen])
```

- [ ] **Stap 3: Vervang de logout-knop (desktop) door avatar + dropdown**

Vervang in de "Right side" sectie:

```jsx
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
        className="absolute right-0 top-[calc(100%+8px)] min-w-[160px] rounded-[0.75rem] py-1 z-50"
        style={{
          background: 'rgb(14,14,20)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        }}
      >
        <Link
          to="/profiel"
          role="menuitem"
          onClick={() => setProfileOpen(false)}
          className="flex items-center gap-2.5 px-4 py-2.5 text-[0.82rem] font-medium hover:bg-white/5 transition-colors"
          style={{ color: '#f9f5fd' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {t('nav.profile')}
        </Link>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '2px 0' }} />
        <button
          role="menuitem"
          onClick={() => { signOut(); setProfileOpen(false) }}
          onKeyDown={(e) => {
            if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); setProfileOpen(false); avatarBtnRef.current?.focus() }
          }}
          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[0.82rem] font-medium hover:bg-white/5 transition-colors text-left"
          style={{ color: '#ef4444' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          {t('nav.signOut')}
        </button>
      </div>
    )}
  </div>
)}
```

- [ ] **Stap 4: Update mobile menu**

Vervang de bestaande `{user && <button onClick={signOut}>...}` in het mobile menu door:

```jsx
{user && (
  <>
    <Link
      to="/profiel"
      onClick={() => setOpen(false)}
      className="py-3 text-sm font-semibold text-on-surface-variant hover:text-on-surface border-b border-white/5 transition-colors"
    >
      {t('nav.profile')}
    </Link>
    <button
      onClick={() => { signOut(); setOpen(false) }}
      className="py-3 text-sm font-semibold text-red-400 hover:text-red-300 border-b border-white/5 transition-colors text-left"
    >
      {t('nav.signOut')}
    </button>
  </>
)}
```

- [ ] **Stap 5: Verificeer dropdown**

`npm run dev` → log in → verifieer:
- Avatar zichtbaar in navbar (gradient border + user icon of foto)
- Klik → dropdown opent met "Mijn profiel" en "Uitloggen"
- Escape sluit dropdown, focus terug naar avatar-knop
- Klik buiten sluit dropdown
- Mobile hamburger toont beide opties

- [ ] **Stap 6: Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: navbar avatar dropdown — vervangt logout-knop"
```

---

## Task 6: ProfilePage

**Files:**
- Create: `src/pages/ProfilePage.jsx`

- [ ] **Stap 1: Schrijf het volledige ProfilePage component**

```jsx
// src/pages/ProfilePage.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useProfile } from '../hooks/useProfile'
import ProfileAvatar from '../components/ProfileAvatar'
import { fadeUp, staggerContainer } from '../lib/animations'

// ─── Per-veld inline editing component ───────────────────────────────────────
function ProfileField({ label, fieldKey, value, activeField, setActiveField, onSave, placeholder = '—' }) {
  const [draft, setDraft]     = useState(value ?? '')
  const [status, setStatus]   = useState('idle') // idle | editing | saving | error
  const [errMsg, setErrMsg]   = useState('')
  const inputRef              = useRef(null)

  const isActive = activeField === fieldKey

  // Sync wanneer externe value verandert (na save)
  useEffect(() => {
    if (status === 'idle') setDraft(value ?? '')
  }, [value, status])

  // Auto-annuleer wanneer een ander veld geactiveerd wordt
  useEffect(() => {
    if (!isActive && status !== 'idle') {
      setStatus('idle')
      setDraft(value ?? '')
    }
  }, [isActive]) // eslint-disable-line react-hooks/exhaustive-deps

  function startEdit() {
    setActiveField(fieldKey)
    setStatus('editing')
    setDraft(value ?? '')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function cancel() {
    setStatus('idle')
    setDraft(value ?? '')
    setActiveField(null)
  }

  async function save() {
    if (draft.trim() === (value ?? '').trim()) { cancel(); return }
    setStatus('saving')
    try {
      await onSave(fieldKey, draft.trim())
      setStatus('idle')
      setActiveField(null)
    } catch {
      setStatus('error')
      setErrMsg('Opslaan mislukt')
      setDraft(value ?? '')
      setTimeout(() => { setStatus('idle'); setActiveField(null) }, 1500)
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter')  { e.preventDefault(); save() }
    if (e.key === 'Escape') cancel()
  }

  return (
    <div className="group/field flex items-start justify-between py-3.5 border-b border-white/5 last:border-0">
      <div className="flex-1 min-w-0 pr-2">
        <p className="text-[0.68rem] font-semibold uppercase tracking-wider mb-1" style={{ color: '#55545b' }}>
          {label}
        </p>
        {isActive && status !== 'idle' ? (
          <>
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={status === 'saving'}
              className="w-full bg-transparent text-sm outline-none border-b pb-0.5 transition-colors"
              style={{ borderColor: '#7C3AED', color: '#f9f5fd' }}
            />
            {status === 'error' && (
              <p className="text-[0.7rem] text-red-400 mt-1">{errMsg}</p>
            )}
          </>
        ) : (
          <p className="text-sm" style={{ color: value ? '#f9f5fd' : '#55545b' }}>
            {value || placeholder}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 pt-5 shrink-0">
        {isActive && status === 'editing' && (
          <>
            <button onClick={save} className="p-1 rounded text-green-400 hover:bg-green-400/10 transition-colors" aria-label="Opslaan">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            </button>
            <button onClick={cancel} className="p-1 rounded transition-colors hover:bg-white/5" aria-label="Annuleren" style={{ color: '#acaab1' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </>
        )}
        {isActive && status === 'saving' && (
          <div className="w-4 h-4 rounded-full border-2 border-t-[#7C3AED] border-[#7C3AED]/20 animate-spin" />
        )}
        {(!isActive || status === 'idle') && (
          <button
            onClick={startEdit}
            className="p-1 rounded opacity-0 group-hover/field:opacity-100 transition-opacity hover:bg-white/5"
            aria-label={`Bewerk ${label}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#acaab1" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Provider badge ───────────────────────────────────────────────────────────
function ProviderBadge({ provider }) {
  const isGoogle = provider === 'google'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-semibold"
      style={{
        background: isGoogle ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${isGoogle ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.1)'}`,
        color: isGoogle ? '#C084FC' : '#acaab1',
      }}
    >
      {isGoogle ? (
        <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      )}
      {isGoogle ? 'Google' : 'Email'}
    </span>
  )
}

// ─── Glassmorphism kaart wrapper ──────────────────────────────────────────────
function Card({ children, className = '' }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`glass-card p-6 md:p-8 ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ─── Datum formatter ──────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Hoofdcomponent ───────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, setAuthOpen }       = useAuth()
  const { t }                       = useLanguage()
  const { profile, loading, updateField, uploadAvatar } = useProfile()
  const navigate                    = useNavigate()
  const [activeField, setActiveField] = useState(null)
  const [avatarError, setAvatarError] = useState('')
  const fileInputRef                = useRef(null)

  // Auth guard — wacht op user resolve, redirect als niet ingelogd
  const [authChecked, setAuthChecked] = useState(false)
  useEffect(() => {
    // user is null vóór én ná resolve; use een kleine delay om hydration-flash te vermijden
    const t = setTimeout(() => setAuthChecked(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (authChecked && !user) {
      navigate('/', { replace: true })
      setAuthOpen(true)
    }
  }, [authChecked, user, navigate, setAuthOpen])

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarError('')
    try {
      await uploadAvatar(file)
    } catch (err) {
      if (err.message === 'size') setAvatarError(t('profile.avatar.errorSize'))
      else if (err.message === 'type') setAvatarError(t('profile.avatar.errorType'))
      else setAvatarError(t('profile.edit.error'))
    }
    // Reset file input zodat dezelfde file opnieuw gekozen kan worden
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (!authChecked || !user || loading) {
    return <div className="min-h-screen" style={{ background: 'var(--background)' }} />
  }

  const provider = user.app_metadata?.provider ?? 'email'

  return (
    <>
      <Helmet>
        <title>{t('profile.pageTitle')} — Vexxo Studio</title>
      </Helmet>

      <main className="relative z-10 pt-24 pb-20 px-6 md:px-8 max-w-5xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >

          {/* ── Hero card ── */}
          <Card>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar + upload */}
              <div className="relative shrink-0 group/avatar">
                <ProfileAvatar size="lg" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.55)' }}
                  aria-label={t('profile.hero.editAvatar')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="sr-only"
                  aria-label={t('profile.avatar.upload')}
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl font-headline font-extrabold mb-1" style={{ color: '#f9f5fd' }}>
                  {profile?.full_name || user.email}
                </h1>
                <p className="text-sm mb-3" style={{ color: '#acaab1' }}>{user.email}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <ProviderBadge provider={provider} />
                  <span className="text-[0.75rem]" style={{ color: '#55545b' }}>
                    {t('profile.hero.memberSince')} {formatDate(user.created_at)}
                  </span>
                </div>
                {avatarError && (
                  <p className="text-[0.75rem] text-red-400 mt-2">{avatarError}</p>
                )}
              </div>
            </div>
          </Card>

          {/* ── Midden grid: persoonlijke info + adres ── */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Persoonlijke gegevens */}
            <Card>
              <h2 className="text-sm font-headline font-bold mb-4 gradient-text">
                {t('profile.personalInfo.title')}
              </h2>
              <ProfileField
                label={t('profile.personalInfo.name')}
                fieldKey="full_name"
                value={profile?.full_name}
                activeField={activeField}
                setActiveField={setActiveField}
                onSave={updateField}
              />
              <ProfileField
                label={t('profile.personalInfo.phone')}
                fieldKey="phone"
                value={profile?.phone}
                activeField={activeField}
                setActiveField={setActiveField}
                onSave={updateField}
              />
            </Card>

            {/* Adres */}
            <Card>
              <h2 className="text-sm font-headline font-bold mb-4 gradient-text">
                {t('profile.address.title')}
              </h2>
              {[
                { key: 'address_street',  label: t('profile.address.street')  },
                { key: 'address_city',    label: t('profile.address.city')    },
                { key: 'address_zip',     label: t('profile.address.zip')     },
                { key: 'address_country', label: t('profile.address.country') },
              ].map(({ key, label }) => (
                <ProfileField
                  key={key}
                  label={label}
                  fieldKey={key}
                  value={profile?.[key]}
                  activeField={activeField}
                  setActiveField={setActiveField}
                  onSave={updateField}
                />
              ))}
            </Card>
          </div>

          {/* ── Account info (read-only) ── */}
          <Card>
            <h2 className="text-sm font-headline font-bold mb-4 gradient-text">
              {t('profile.account.title')}
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-8">
              {[
                { label: t('profile.account.email'),     value: user.email },
                { label: t('profile.account.provider'),  value: <ProviderBadge provider={provider} /> },
                { label: t('profile.account.createdAt'), value: formatDate(user.created_at) },
                { label: t('profile.account.lastLogin'), value: formatDate(user.last_sign_in_at) },
              ].map(({ label, value }) => (
                <div key={label} className="py-3.5 border-b border-white/5 last:border-0 sm:[&:nth-last-child(2)]:border-0">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-wider mb-1" style={{ color: '#55545b' }}>
                    {label}
                  </p>
                  {typeof value === 'string'
                    ? <p className="text-sm" style={{ color: '#f9f5fd' }}>{value}</p>
                    : value
                  }
                </div>
              ))}
            </div>
          </Card>

        </motion.div>
      </main>
    </>
  )
}
```

- [ ] **Stap 2: Commit**

```bash
git add src/pages/ProfilePage.jsx
git commit -m "feat: ProfilePage — dashboard layout, per-veld editing, avatar upload"
```

---

## Task 7: Route toevoegen in App.jsx + visuele verificatie

**Files:**
- Modify: `src/App.jsx`

- [ ] **Stap 1: Voeg de route toe**

In `src/App.jsx`, voeg toe na de bestaande `const PricingPage = lazy(...)`:

```jsx
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
```

Voeg toe in de `<Routes>`:

```jsx
<Route path="/profiel" element={
  <Suspense fallback={<div className="min-h-screen bg-background" />}>
    <ProfilePage />
  </Suspense>
} />
```

- [ ] **Stap 2: Build check**

```bash
npm run build
```

Verwacht: geen TypeScript/Rollup errors. Als er een fout is, lees de foutmelding en fix het importpad.

- [ ] **Stap 3: Visuele verificatie**

```bash
npm run dev
```

Controleer:
1. Log in → navbar toont avatar-knop met gradient border
2. Klik avatar → dropdown opent met "Mijn profiel" en "Uitloggen"
3. Klik "Mijn profiel" → navigeert naar `/profiel`
4. Profielpagina toont 4 kaarten in correct grid-layout
5. Hover over een veld → potlood-icoon verschijnt
6. Klik potlood → input verschijnt, Enter slaat op, Escape annuleert
7. Upload een profielfoto via hover op de grote avatar → foto verschijnt
8. Niet-ingelogd → ga direct naar `/profiel` → redirect naar `/` + AuthModal opent

- [ ] **Stap 4: Commit + push**

```bash
git add src/App.jsx
git commit -m "feat: add /profiel route"
git push
```
