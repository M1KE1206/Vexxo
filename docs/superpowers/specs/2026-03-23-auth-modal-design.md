# Auth Modal — Vexxo Website

**Date:** 2026-03-23
**Status:** Approved by user

---

## Doel

Bezoekers van vexxo.be kunnen de hele site bekijken zonder account. Zodra een bezoeker op een CTA klikt (bijv. "Service aanvragen", "Neem contact op"), verschijnt er een auth modal. Na succesvol inloggen of registreren sluit de modal en wordt de oorspronkelijke actie hervat.

---

## Beslissingen

- **Zichtbaarheid site** — de volledige marketingsite is publiek toegankelijk; geen route guard op URL-niveau.
- **Auth gate** — alleen CTAs triggeren de modal; passief browsen vereist geen account.
- **Auth providers** — Supabase met twee methodes: e-mail/wachtwoord én Google OAuth.
- **Registratie velden** — volledige naam + e-mail + wachtwoord. Geen bedrijfsnaam bij registratie.
- **Auto-fill** — na login worden naam en e-mail automatisch ingevuld in aanvraagformulieren. Bedrijfsnaam blijft altijd handmatig.
- **Post-auth flow** — gebruiker blijft op dezelfde pagina; de actie die de modal triggerde gaat automatisch verder.
- **Sessie verloop** — bij verlopen of ongeldige sessie: volgende CTA-klik opent de modal opnieuw.
- **Framework** — Next.js app (`src/`). M1K3 app is volledig los.

---

## Auth flow

```
1. Bezoeker klikt op een CTA
2. AuthContext checkt: is er een actieve Supabase-sessie?
3. Actieve sessie → actie gaat direct door (modal niet nodig)
4. Geen sessie → sla actie-sleutel op in sessionStorage('pendingAction')
                 → AuthModal opent
5. In modal: tab "Inloggen" standaard actief
   - E-mail + wachtwoord form
   - "Doorgaan met Google" knop
   - Link naar "Registreren" tab
6. Tab "Registreren":
   - Naam + e-mail + wachtwoord
   - "Doorgaan met Google" knop
   - Link naar "Inloggen" tab
7. Succesvolle e-mail/wachtwoord auth:
   → modal sluit → pendingAction uit sessionStorage ophalen → uitvoeren → sessionStorage leegmaken
8. Google OAuth:
   → volledige pagina-reload (redirect)
   → na reload: onAuthStateChange fired met sessie
   → AuthContext leest pendingAction uit sessionStorage → voert actie uit → sessionStorage leegmaken
```

### OAuth pendingAction via sessionStorage

Omdat Google OAuth een volledige paginareload veroorzaakt, kan een in-memory callback niet overleven. Oplossing:

```js
// Voor OAuth redirect:
sessionStorage.setItem('pendingAction', 'openServiceModal') // string-sleutel, geen functie

// Na OAuth redirect, in onAuthStateChange:
const pending = sessionStorage.getItem('pendingAction')
if (pending) {
  sessionStorage.removeItem('pendingAction')
  dispatchPendingAction(pending) // voert actie uit op basis van sleutel
}
```

---

## Provider nesting in App.jsx

Huidige nesting: `HelmetProvider → LanguageProvider → ModalProvider`.

Nieuwe nesting: `HelmetProvider → LanguageProvider → AuthProvider → ModalProvider`.

`AuthProvider` zit **buiten** `ModalProvider` zodat `useAuth()` overal beschikbaar is (inclusief in `ServiceRequestModal`). `AuthModal` zit **binnen** `ModalProvider` zodat het via `useModal()` `closeModal()` kan aanroepen bij de dual-modal edge case.

```jsx
// App.jsx — nieuwe structuur
<HelmetProvider>
  <LanguageProvider>
    <AuthProvider>
      <ModalProvider>
        {/* ... page content, ServiceRequestModal ... */}
        <Suspense fallback={null}>
          <AuthModal />         {/* sibling van ServiceRequestModal, buiten page-content */}
        </Suspense>
      </ModalProvider>
    </AuthProvider>
  </LanguageProvider>
</HelmetProvider>
```

---

## Componenten

### `AuthContext` (`src/context/AuthContext.jsx`)
- Houdt Supabase-sessie bij via `onAuthStateChange`
- Exporteert: `user`, `session`, `signOut`, `requireAuth(actionKey)`
- `requireAuth(actionKey)`:
  - Actieve sessie → dispatch `actionKey` direct
  - Geen sessie → `sessionStorage.setItem('pendingAction', actionKey)` → open AuthModal
- Na OAuth reload: lees `sessionStorage('pendingAction')` in `onAuthStateChange` en dispatch

### `AuthModal` (`src/components/AuthModal.jsx`)
- Glassmorphism card, gecentreerd over overlay
- Toegang tot zowel `useAuth()` als `useModal()` (via bovenstaande nesting)
- Tab toggle: Inloggen / Registreren
- Animaties via Framer Motion:
  - Open/dicht: `AnimatePresence` met `opacity` + `scale` (0.3s ease-out)
  - Tab wissel: `opacity` + `translateY` (0.25s ease-out)
  - `useReducedMotion()` check — skip alle animaties als `prefers-reduced-motion: reduce`
- Sluit via: ✕ knop, klik op overlay, Escape-toets, succesvolle auth
- **Scroll lock**: bij mount `document.body.style.overflow = 'hidden'`, bij unmount `= ''`
  - Synchrone toewijzing vóór eventueel `closeModal()` aanroepen, zodat geen unlock-flash ontstaat
- Focus trap: via native `focus`-cycle met `tabIndex` op interactieve elementen + `keydown` listener die Tab/Shift+Tab binnen de modal houdt. Geen externe library.
- Alle UI-tekst via `useLanguage()` — geen hardcoded strings

### Dual-modal scenario (edge case)
Als `ServiceRequestModal` open is en de sessie verloopt (of de gebruiker logt uit):
1. `AuthModal.open()` roept eerst `closeModal()` aan via `useModal()` — dit zet `body.overflow = ''`
2. Daarna zet `AuthModal` onmiddellijk (synchroon, zelfde render) `body.overflow = 'hidden'` opnieuw
3. Resultaat: geen zichtbare flash; gebruiker ziet naadloze overgang

### Bestaande componenten
- `ModalContext` en `ServiceRequestModal` blijven ongewijzigd, behalve:
  - `ServiceRequestModal` vult naam en e-mail in via `useAuth()` (zie Auto-fill)

---

## Toegankelijkheid

- Escape-toets sluit modal (`keydown` listener, cleanup op unmount)
- Focus trap: Tab/Shift+Tab blijft binnen modal-elementen
- `aria-modal="true"`, `role="dialog"`, `aria-labelledby` verwijst naar modal title
- Kleur is nooit de enige statusindicator: actieve tab heeft zowel kleur- als `font-weight`-verschil

---

## i18n — nieuwe sleutels

Zowel `en.json` als `nl.json` krijgen deze sleutels:

```json
// nl.json
"auth.tab.login": "Inloggen",
"auth.tab.register": "Registreren",
"auth.login.title": "Welkom terug",
"auth.login.subtitle": "Log in om je aanvraag in te dienen.",
"auth.login.email": "E-mailadres",
"auth.login.password": "Wachtwoord",
"auth.login.submit": "Inloggen",
"auth.login.google": "Doorgaan met Google",
"auth.login.switchToRegister": "Nog geen account? Registreer hier",
"auth.register.title": "Account aanmaken",
"auth.register.subtitle": "Eenmalig registreren — je gegevens worden daarna automatisch ingevuld.",
"auth.register.name": "Volledige naam",
"auth.register.email": "E-mailadres",
"auth.register.password": "Wachtwoord",
"auth.register.submit": "Account aanmaken",
"auth.register.google": "Doorgaan met Google",
"auth.register.switchToLogin": "Al een account? Log hier in",
"auth.error.invalidCredentials": "E-mail of wachtwoord is onjuist.",
"auth.error.emailInUse": "Dit e-mailadres is al in gebruik.",
"auth.error.weakPassword": "Wachtwoord moet minimaal 8 tekens bevatten.",
"auth.error.network": "Verbindingsfout. Probeer opnieuw.",
"auth.error.oauthCancelled": "Inloggen met Google geannuleerd.",
"auth.error.unknown": "Er is iets misgegaan. Probeer opnieuw."

// en.json
"auth.tab.login": "Log in",
"auth.tab.register": "Register",
"auth.login.title": "Welcome back",
"auth.login.subtitle": "Log in to submit your request.",
"auth.login.email": "Email address",
"auth.login.password": "Password",
"auth.login.submit": "Log in",
"auth.login.google": "Continue with Google",
"auth.login.switchToRegister": "No account yet? Register here",
"auth.register.title": "Create account",
"auth.register.subtitle": "Register once — your details will be filled in automatically.",
"auth.register.name": "Full name",
"auth.register.email": "Email address",
"auth.register.password": "Password",
"auth.register.submit": "Create account",
"auth.register.google": "Continue with Google",
"auth.register.switchToLogin": "Already have an account? Log in here",
"auth.error.invalidCredentials": "Email or password is incorrect.",
"auth.error.emailInUse": "This email address is already in use.",
"auth.error.weakPassword": "Password must be at least 8 characters.",
"auth.error.network": "Connection error. Please try again.",
"auth.error.oauthCancelled": "Google sign-in was cancelled.",
"auth.error.unknown": "Something went wrong. Please try again."
```

---

## Design specs

- **Border-radius:** `1.25rem`
- **Background:** `rgba(19,19,25,0.75)` + `backdrop-filter: blur(24px) saturate(180%)`
- **Border:** `1px solid rgba(255,255,255,0.12)`
- **Box-shadow:** `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1), inset 0 1px 0 rgba(255,255,255,0.06)`
- **Overlay:** `rgba(10,10,15,0.55)` + `backdrop-filter: blur(2px)`
- **Tab actief:** `rgba(124,58,237,0.22)` bg + `rgba(124,58,237,0.35)` border + `font-weight: 600`
- **CTA button:** `linear-gradient(135deg, #7C3AED, #F97316)` — 1 van de 3 toegestane gradient-plekken
- **Breedte modal:** max `380px`, `90%` op kleine schermen

---

## Supabase integratie

- `@supabase/supabase-js` client in `src/lib/supabase.js` (nieuw bestand)
- Credentials: zelfde Supabase project-URL en anon key als M1K3
- Google OAuth redirect URL:
  - Dev: `http://localhost:3000/` (Next.js default poort)
  - Prod: `https://vexxo.be/`
- `onAuthStateChange` listener in `AuthContext` — vangt ook OAuth redirects op na paginareload

---

## Auto-fill in ServiceRequestModal

```jsx
// In ServiceRequestModal.jsx — enige wijziging
const { user } = useAuth()
// naam-veld:  defaultValue={user?.user_metadata?.full_name ?? ''}
// e-mail-veld: defaultValue={user?.email ?? ''}
// bedrijfsnaam: altijd leeg, handmatig in te vullen
// Na uitloggen: velden worden niet retroactief geleegd (controlled input),
//               volgende keer dat modal opent zijn ze opnieuw leeg
```

---

## Wat NIET verandert

- Alle bestaande pagina's en routes blijven publiek
- `ModalContext` logica blijft ongewijzigd
- M1K3 app is volledig los — geen gedeelde auth state
