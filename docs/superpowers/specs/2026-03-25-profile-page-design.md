# Profile Page Implementation Design

> **For agentic workers:** Use `superpowers:writing-plans` to create the implementation plan from this spec.

**Goal:** Voeg een dashboard-stijl profielpagina toe bereikbaar via een avatar-knop in de navbar, met per-veld inline bewerken, avatar upload naar Supabase Storage, en een `profiles` tabel voor alle gebruikersdata.

**Architecture:** Nieuwe route `/profiel`, `profiles` tabel in Supabase met RLS + auto-insert trigger, herbruikbaar `ProfileAvatar` component, `useProfile` hook als single source of truth.

**Tech Stack:** React 18, Supabase (Auth + Storage + RLS), Framer Motion, Tailwind CSS, brand design system (CLAUDE.md)

---

## 1. Database — `profiles` tabel

Bestand: `supabase/migrations/20260325_create_profiles.sql`
Deze map bestaat nog niet — aanmaken als nieuwe directory in de project root en het bestand committen. De SQL wordt handmatig uitgevoerd in het Supabase dashboard (SQL Editor).

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
```

**Storage bucket:** `avatars` — public bucket.
Avatar pad: `{user_id}/avatar` (geen extensie, vaste bestandsnaam). Content-type wordt meegegeven bij upload via `contentType` option in Supabase Storage. Dit vermijdt extensie-tracking problemen bij het verwijderen van de oude avatar.

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
//   - optimistic update: state direct updaten, dan Supabase call
//   - bij fout: state terugzetten naar oude waarde
//   - tijdens save: veld is disabled, save-icoon toont spinner
//
// uploadAvatar(file) → validatie + verwijder oude + upload + UPDATE avatar_url
```

**Avatar upload validatie in `uploadAvatar`:**
- Max bestandsgrootte: 2 MB (`file.size > 2 * 1024 * 1024` → gooit fout)
- Toegestane MIME types: `['image/jpeg', 'image/png', 'image/webp']`
- Upload via upsert (overschrijft automatisch): `supabase.storage.from('avatars').upload('{user_id}/avatar', file, { contentType: file.type, upsert: true })`
- Geen aparte `remove()` nodig — upsert alleen is voldoende en vermijdt race conditions bij trage verbindingen
- Na upload: haal publieke URL op en sla op in `profiles.avatar_url`

### `src/components/ProfileAvatar.jsx`
Herbruikbaar component, gebruikt in Navbar én ProfilePage.

```jsx
<ProfileAvatar size="sm" />   // navbar: 32px
<ProfileAvatar size="lg" />   // profielpagina: 80px
```

**Weergave:**
- Toont `avatar_url` als die bestaat, anders: standaard user-icon SVG (geen initialen, conform brief)
- Altijd: gradient border `#7C3AED → #F97316` via bestaande padding-box techniek uit `index.css`:
  ```css
  background: linear-gradient(bg, bg) padding-box,
              linear-gradient(135deg, #7C3AED, #F97316) border-box;
  border: 1px solid transparent;
  ```
  Dit vereist geen extra wrapper — directe inline style op het `<div>` element.

**Loading state (Navbar):**
- Tijdens `loading === true` van `useProfile`: toon een 32px cirkel met `animate-pulse` in `surface-2` kleur
- Voorkomt layout shift in de navbar

### `src/pages/ProfilePage.jsx`
Lazy-loaded. Auth-bescherming:
- Wacht tot auth-sessie resolved is (`user` in `AuthContext` is niet meer undefined/initieel)
- Als `user === null` na resolve: redirect naar `/` én open AuthModal (`setAuthOpen(true)`) — consistent met het bestaande `requireAuth` patroon
- Geen flash van profielinhoud tijdens auth check (toon skeleton of null)

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
│  Email · Provider badge · Aangemaakt · Laatste login│
└─────────────────────────────────────────────────────┘
```

**Provider badge:**
- Google OAuth → paars badge met Google-logo + tekst "Google"
- Email/wachtwoord → grijs badge met mail-icoon + tekst "Email"

**Email in account info:** altijd read-only, ongeacht provider. Email aanpassen is buiten scope (vereist Supabase confirmation-email flow).

Alle kaarten: `glass-card` stijl conform CLAUDE.md design system.

---

## 4. Per-veld inline editing

- Elk veld toont tekst + potlood-icoon (zichtbaar op hover van de rij via `group/group-hover`)
- Klik potlood → tekst vervangen door `<input>` met huidige waarde, autofocus
- Twee iconen verschijnen: ✓ (opslaan) en ✗ (annuleren)

**Toetsenbord:**
- `Enter` = opslaan
- `Escape` = annuleren (waarde niet gewijzigd)

**Gelijktijdige bewerkingen:**
- Als veld A open is en gebruiker klikt potlood van veld B: veld A wordt automatisch geannuleerd (ongeslagen waarde weggegooid) vóór veld B opent

**Save states:**
1. `idle` — tekst + potlood-icoon op hover
2. `editing` — input actief, ✓ en ✗ knoppen zichtbaar
3. `saving` — input disabled, ✓ vervangen door spinner, ✗ verborgen
4. `error` — waarde terugzetten naar origineel, rood foutmelding onder het veld (1 seconde zichtbaar)

---

## 5. Navbar wijzigingen

**Desktop:** logout-knop vervangen door `<ProfileAvatar size="sm" />` (met loading state)
Klik op avatar → dropdown-menu:
- "Mijn profiel" → `<Link to="/profiel">`
- Scheidingslijn
- "Uitloggen" → `signOut()`

**Dropdown gedrag:**
- Opent op klik (toggle)
- Sluit bij: klik buiten dropdown (mousedown op document), navigatie, Escape-toets
- Na sluiten via Escape: focus terug naar avatar-knop (`avatarButtonRef.current?.focus()`)
- Tab uit het laatste item in de dropdown: dropdown sluit

**Accessibility:**
- Avatar-knop: `aria-haspopup="menu"`, `aria-expanded={open}`
- Dropdown: `role="menu"`, items: `role="menuitem"`

**Mobile menu:** De bestaande directe uitlog-knop (`user && <button onClick={signOut}>`) wordt vervangen door twee conditionele links (alleen zichtbaar wanneer `user !== null`):
- "Mijn profiel" → `<Link to="/profiel" onClick={() => setOpen(false)}>`
- "Uitloggen" → `<button onClick={() => { signOut(); setOpen(false); }}`

---

## 6. Routing

```jsx
// App.jsx
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

// Minimale skeleton als fallback — voorkomt dubbele blank bij eerste load
function PageSkeleton() {
  return <div className="min-h-screen bg-background" />
}

<Route path="/profiel" element={
  <Suspense fallback={<PageSkeleton />}><ProfilePage /></Suspense>
} />
```

---

## 7. i18n keys (nl.json / en.json)

Voeg `nav.profile` toe aan de **bestaande** `nav` sectie in beide locale-bestanden (`src/locales/nl.json` en `src/locales/en.json`). Alle overige keys zijn nieuw en worden als aparte `profile` root-key toegevoegd.

```json
{
  "nav": {
    "profile": "Mijn profiel"
  },
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
}
```

---

## 8. Niet gewijzigd

- `AuthContext.jsx` — profile data leeft in `useProfile` hook, niet in AuthContext
- `ServiceRequestModal`, `PricingCalculator`, overige componenten
