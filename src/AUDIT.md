# Audit FlashQuality — post tâche 6

Date : 2026-04-15
Branche : main

## 1. TypeScript — OK

`npx tsc --noEmit` → **0 erreur, 0 warning bloquant**.

## 2. Navigation (inventaire)

### Écrans internes ClientApp (via `go()` / `nt()`)

| Fichier | Ligne | Type | Destination |
|---|---|---|---|
| `src/app/client/ClientApp.tsx` | 270 | onClick | `review` |
| | 271 | onClick | `offers` |
| | 272 | onClick | `contact` |
| | 273 | onClick nt | `depenses` |
| | 275 | onClick | `jeux` |
| | 284 | onClick | `offers` |
| | 295 | onClick | `contact` |
| | 307/336/369 | onBack | `home` |
| | 382 | href | `tel:...` (externe) |
| | 395 | onClick | `offers` |
| | 492 | onClick | `contact` |
| | 569 | onBack | `home` |
| | 571 | onClick | `tombola` |
| | 586 | onClick | `spin` |
| | 603/608/614/641/664 | onBack/onClick | `jeux` |
| | 685 | onClick nt | `home/carnet/depenses/abonnements/profile` |
| | 705/709 | onBack | `home` |
| | 720 | onClick | `home` |

### Liens vers routes Next.js

| Fichier | Ligne | Destination |
|---|---|---|
| `src/app/page.tsx` | 4 | redirect `/dashboard` |
| `src/app/scan/[slug]/ScanClient.tsx` | 34 | `/client` (emailRedirectTo) |
| | 85 | `/login` |
| | 166 | `/client` |
| | 167 | `/` |
| `src/app/dashboard/clients/page.tsx` | 12, 32 | `/dashboard` |
| `src/app/dashboard/offres/page.tsx` | 54 | `/dashboard` |
| `src/app/dashboard/page.tsx` | 47, 49, 63 | `/login` (router.push) |
| `src/app/admin/AdminClient.tsx` | 77 | `/dashboard` |
| | 156 | `/scan/{slug}` |
| `src/app/admin/AdminShell.tsx` | LINKS | `/admin`, `/admin/pros`, `/admin/stats`, `/admin/jeux`, `/admin/import-clients` |
| `src/app/admin/layout.tsx` | 20, 22 | redirect `/login`, `/dashboard` |
| `src/app/admin/page.tsx` | 24, 27 | redirect `/login`, `/dashboard` |
| `src/app/admin/stats/page.tsx` | 23, 26 | redirect `/login`, `/dashboard` |
| `src/app/admin/pros/ProsList.tsx` | 45 | `/admin/pros/{id}` |
| `src/app/admin/pros/[id]/ProEditor.tsx` | 20 | `/admin/pros` |
| | 27 | `/client?slug={slug}` |
| `src/app/admin/jeux/JeuxMatrix.tsx` | 52 | `/admin/pros/{id}` |

## 3. Routes Next.js (rendu associé)

| URL | Fichier | Statut |
|---|---|---|
| `/` | `src/app/page.tsx` | OK (redirect) |
| `/login` | `src/app/login/page.tsx` | OK |
| `/dashboard` | `src/app/dashboard/page.tsx` | OK |
| `/dashboard/clients` | `src/app/dashboard/clients/page.tsx` | OK |
| `/dashboard/offres` | `src/app/dashboard/offres/page.tsx` | OK |
| `/client` | `src/app/client/page.tsx` | OK |
| `/scan/[slug]` | `src/app/scan/[slug]/page.tsx` | OK |
| `/admin` | `src/app/admin/page.tsx` | OK |
| `/admin/pros` | `src/app/admin/pros/page.tsx` | OK |
| `/admin/pros/[id]` | `src/app/admin/pros/[id]/page.tsx` | OK |
| `/admin/stats` | `src/app/admin/stats/page.tsx` | OK |
| `/admin/jeux` | `src/app/admin/jeux/page.tsx` | OK |
| `/admin/import-clients` | `src/app/admin/import-clients/page.tsx` | OK |

**Cohérence liens ↔ routes : OK** — aucun lien ne pointe vers une route inexistante.

## 4. Screens internes ClientApp (rendu associé)

Type `Screen` (13 valeurs) :

| Valeur | Rendu | Statut |
|---|---|---|
| `home` | `<Home/>` | OK |
| `review` | `<Review/>` | OK |
| `offers` | `<Offers/>` | OK |
| `contact` | `<Contact/>` | OK |
| `depenses` | `<DepensesScreen/>` (module externe) | OK |
| `carnet` | `<Carnet/>` | OK |
| `profile` | `<Profile/>` | OK |
| `notifs` | `<Notifs/>` | OK |
| `abonnements` | `<AbonnementsScreen/>` (module externe) | OK |
| `jeux` | `Jeux()` | OK |
| `quizz` | `Quizz()` | OK |
| `spin` | `Spin()` | OK |
| `tombola` | `Tombola()` | OK |

Type `NavTab` (5 valeurs) : tous routés dans `BNav` via `nt()`. **OK**.

## 5. Imports — OK

Aucun import non résolu. `tsc --noEmit` propre.

## 6. Dead code

| Fichier | Ligne | Symbole | Raison | Statut |
|---|---|---|---|---|
| `src/app/client/ClientApp.tsx` | ~410 | `const Depenses` | Remplacé par `<DepensesScreen/>` (module client-autonome) au branchement tâche 4 | **WARNING** — à supprimer |
| `src/app/client/ClientApp.tsx` | ~542 | `const Abos` | Remplacé par `<AbonnementsScreen/>` (module client-autonome) au branchement tâche 4 | **WARNING** — à supprimer |

Ces deux fonctions définissent des UIs mockées (SUBS Netflix/Spotify, DEPS) qui ne sont plus jamais rendues. Environ 100 lignes de JSX + constantes (`SUBS`, `DEPS`) potentiellement orphelines — à vérifier avant suppression.

Aucun autre dead code détecté.

## Synthèse

| Item | Statut |
|---|---|
| TypeScript compilation | **OK** |
| Routes Next.js (13) | **OK** |
| Cohérence liens ↔ routes | **OK** |
| Screens ClientApp (13) | **OK** |
| NavTab (5) | **OK** |
| Imports | **OK** |
| Dead code | **WARNING** (2 fonctions stubs) |

**Risques bloquants : 0**. L&apos;app est déployable en l&apos;état. Les deux warnings sont purement cosmétiques (nettoyage ~100 lignes).
