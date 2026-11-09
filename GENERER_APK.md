# Radio Aluwasio — Application Android v1.5

## 📱 Télécharger sur mobile (direct)

Le bouton **« ⬇️ Télécharger l'APK directement »** se trouve dans **Menu → Application**.
Il utilise, par ordre de priorité :

1. **`RadioAluwasio.apk`** servi à côté de `index.html` (dossier `dist/`) → même origine,
   téléchargement direct avec le bon type MIME `application/vnd.android.package-archive`.
2. **Lien direct externe** : https://tmpfiles.org/dl/1794230373.55103c87c5525255/weAWW7cAhhZm/radioaluwasio-v1.5.apk   (`Content-Disposition: attachment`). ⚠️ Expire au bout de 48 h.
3. **Lien alternatif permanent** : https://gofile.io/d/IMQb2wE3

Fichier compilé : `apk/RadioAluwasio-v1.5-release.apk` (5,4 Mo).

| Caractéristique | Valeur |
| --- | --- |
| Package | `tg.aluwasio.radio` |
| Version | **1.2** (versionCode 6) |
| Compatibilité | Android 6.0 (API 23) → Android 15 (API 35) |
| Signature | `CN=Radio Aluwasio, L=Lome, C=TG` · SHA-256 `bfdc251e…4d84ed` |
| Mise à jour | Même clé que les v1.0/v1.1 → installation par-dessus, sans désinstaller |

**Installation :** télécharger sur le téléphone → ouvrir le fichier → autoriser les « sources inconnues » → installer.

> 💡 Pour un lien permanent, hébergez `RadioAluwasio.apk` sur GitHub Releases, Google Drive ou votre site
> et modifiez `APK_URL` / `APK_BACKUP_URL` dans `src/data/app.ts`, puis `npm run build`.

🔐 **Clé de signature :** `android/aluwasio.keystore` (alias `aluwasio`, mot de passe `aluwasio2024`),
sauvegardée en texte dans `android/aluwasio.keystore.base64.txt`.
Restauration : `base64 -d android/aluwasio.keystore.base64.txt > android/aluwasio.keystore`.
Ces deux fichiers sont exclus du dépôt (`.gitignore`) : **ne les publiez jamais**.

## 🧩 Interface (v1.5)

- **Navbar** → **barre de recherche de stations** → ligne de statut **« PRÊT À ÉCOUTER »** → lecteur → bannière **À la une**.
- **Tab bar moderne (v1.5)** : dock flottant blanc arrondi, 5 icônes SVG, pastille active circulaire
  dégradée aux couleurs du logo (jaune · rouge · bleu), légèrement surélevée, anneau blanc,
  ombre douce, indicateur système et `safe-area` conservés. Sans surcharge visuelle.
  5 onglets : `Écouter`, `Radios du Togo`, `À la une`, `À propos`, `Contact`.
  Sur desktop, ces mêmes vues sont accessibles depuis la navbar.
- **À la une accessible** : onglet dédié listant les 6 annonces en entier (récent → ancien),
  bouton « Voir tout » sur la bannière, `aria-live="off"`, flèches, pastilles, libellés et navigation clavier.
- **Diaporama** : 6 encarts d'événements, nouvelles et émissions du pays, défilement automatique,
  pause au survol/focus et respect de `prefers-reduced-motion`. Il remplace le copyright sur l'accueil.
- **Tous les textes de présentation** (badge, slogan, description, statistiques, texte À propos)
  sont regroupés dans la vue **À propos** : l'accueil reste léger et professionnel.
- **Paddings/marges explicites** : `px-4 sm:px-6 lg:px-8`, `pt-2/3`, `pb-28` pour dégager la tab bar,
  cartes `p-5 sm:p-8`, espacements cohérents `gap-3 / space-y-4`, `scroll-padding-top`, `overflow-x-hidden`.
- **Dans l'APK** : aucun bouton/onglet de téléchargement, aucune section « Application ».
- **Recherche** : filtre les 5 stations (nom, ville, fréquence, genre), résultats en liste déroulante,
  sélection = lecture immédiate.

## 🧪 Tests

```bash
npm run build
npx tsc --noEmit -p tsconfig.json
node scripts/run-tests.mjs   # 32 tests : rendu, menu, absence de téléchargement en natif, URLs, a11y
node scripts/verify.mjs      # 21 contrôles : artefact HTML, APK valide, secrets, mixed-content
npm audit                   # 0 vulnérabilité
```

## 🔒 Sécurité

Flux HTTPS validés à l'exécution · aucune injection HTML · `noopener noreferrer` ·
stockage/presse-papiers/Media Session protégés · jeton anti-race audio ·
`allowBackup=false`, `dataExtractionRules`, trafic clair désactivé, `allowMixedContent=false`,
permissions limitées à `INTERNET / ACCESS_NETWORK_STATE / WAKE_LOCK` · aucun secret dans le bundle.

## 🔄 Recompiler

```bash
npm run build
npx cap sync android          # Capacitor CLI 8 : Node >= 22
cd android && ./gradlew assembleRelease -x lintVitalAnalyzeRelease -x lintVitalRelease
```

Incrémenter `versionCode` / `versionName` dans `android/app/build.gradle` à chaque version.
Ne pas remettre `dist/RadioAluwasio.apk` dans `public/` avant un `cap sync` (sinon l'APK s'auto-inclut).
