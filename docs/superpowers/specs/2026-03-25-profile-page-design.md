# Profile Page Implementation Design

> **For agentic workers:** Use `superpowers:writing-plans` to create the implementation plan from this spec.

**Goal:** Voeg een dashboard-stijl profielpagina toe bereikbaar via een avatar-knop in de navbar, met per-veld inline bewerken, avatar upload naar Supabase Storage, en een `profiles` tabel voor alle gebruikersdata.

**Architecture:** Nieuwe route `/profiel`, `profiles` tabel in Supabase met RLS + auto-insert trigger, herbruikbaar `ProfileAvatar` component, `useProfile` hook als single source of truth.

**Tech Stack:** React 18, Supabase (Auth + Storage + RLS), Framer Motion, Tailwind CSS, brand design system (CLAUDE.md)

---

## 1. Database — `profiles` tabel

```sql
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

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
```

**Storage bucket:** `avatars` — public bucket, per-user pad: `{user_id}/avatar.{ext}`

---

## 2. Nieuwe bestanden

### `supabase/migrations/20260325_create_profiles.sql`
Bevat bovenstaande SQL volledig.

### `src/hooks/useProfile.js`
Single source of truth voor profieldata.

```js
// Exporteert:
const { profile, loading, updateField, uploadAvatar } = useProfile()

// updateField(key, value) → UPDATE profiles SET key=value WHERE id=auth.uid()
// uploadAvatar(file) → validatie + upload + UPDATE avatar_url
```

**Avatar upload validatie in `uploadAvatar`:**
- Max bestandsgrootte: 2 MB (`file.size > 2 * 1024 * 1024` → error)
- Toegestane types: `image/jpeg`, `image/png`, `image/webp`
- Oude avatar verwijderen voor upload van nieuwe (Supabase Storage `remove()`)
- Pad: `{user_id}/avatar.{ext}` — overschrijft bij hergebruik zelfde extensie

### `src/components/ProfileAvatar.jsx`
Herbruikbaar component, gebruikt in Navbar én ProfilePage.

```jsx
<ProfileAvatar size="sm" />   // navbar: 32px
<ProfileAvatar size="lg" />   // profielpagina: 80px
```

- Toont `avatar_url` als die bestaat, anders initialen uit `full_name` of `email[0]`
- Altijd: gradient border (`#7C3AED` → `#F97316`) via padding-box techniek
- Default state: user-icon SVG met gradient border

### `src/pages/ProfilePage.jsx`
Lazy-loaded. Beschermd: redirect naar `/` als niet ingelogd.

---

## 3. Paginalayout

```
┌─────────────────────────────────────────────────────┐
│  HERO CARD (vol breedte)                            │
│  [Avatar 80px]  Naam · email · provider badge       │
│                 Lid sinds: datum                    │
└─────────────────────────────────────────────────────┘
┌──────────────────────┐  ┌──────────────────────────┐
│  PERSOONLIJKE INFO   │  │  ADRES                   │
│  Naam          ✏️   │  │  Straat           ✏️    │
│  Telefoon      ✏️   │  │  Stad             ✏️    │
│                      │  │  Postcode         ✏️    │
│                      │  │  Land             ✏️    │
└──────────────────────┘  └──────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  ACCOUNT INFO (read-only)                           │
│  Email · Provider · Aangemaakt · Laatste login      │
└─────────────────────────────────────────────────────┘
```

Alle kaarten: `glass-card` stijl conform CLAUDE.md design system.

---

## 4. Per-veld inline editing

- Elk veld toont tekst + potlood-icoon (zichtbaar op hover van de rij)
- Klik potlood → tekst vervangen door `<input>` met huidige waarde
- Twee iconen verschijnen: ✓ (opslaan) en ✗ (annuleren)
- Opslaan → `updateField(key, value)` → optimistic UI update
- Fout → veld terugzetten naar oude waarde + foutmelding
- Enter = opslaan, Escape = annuleren

---

## 5. Navbar wijzigingen

- Ingelogd: logout-knop vervangen door `<ProfileAvatar size="sm" />`
- Klik op avatar → klein dropdown-menu:
  - "Mijn profiel" → navigeert naar `/profiel`
  - "Uitloggen" → `signOut()`
- Dropdown sluit bij klik buiten of navigatie
- Mobile menu: zelfde twee opties als tekst-links

---

## 6. Routing

```jsx
// App.jsx
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
<Route path="/profiel" element={<Suspense fallback={null}><ProfilePage /></Suspense>} />
```

---

## 7. i18n keys (nl.json / en.json)

Nieuwe keys onder `profile.*`:
- `profile.title`, `profile.hero.*`
- `profile.personalInfo.*` (title, name, phone)
- `profile.address.*` (title, street, city, zip, country)
- `profile.account.*` (title, email, provider, createdAt, lastLogin)
- `profile.avatar.*` (upload, error.size, error.type)
- `profile.edit.*` (save, cancel, success, error)
- `nav.profile`

---

## 8. Geen wijzigingen aan

- `AuthContext.jsx` — profile data leeft in `useProfile` hook, niet in AuthContext
- `ServiceRequestModal`, `PricingCalculator`, overige componenten
