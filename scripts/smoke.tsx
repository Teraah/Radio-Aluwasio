import { renderToString } from "react-dom/server";
import App from "../src/App";
import { AboutView } from "../src/components/AboutView";
import { ContactView } from "../src/components/ContactView";
import { StationList } from "../src/components/StationList";
import { NewsView } from "../src/components/NewsView";
import { STATIONS, POPULAR_STATIONS, ALUWASIO } from "../src/data/stations";
import { NEWS } from "../src/data/news";
import { isSafeStreamUrl, isSafeHttpUrl } from "../src/utils/safe";

const failures: string[] = [];
const ok = (cond: boolean, label: string) => {
  if (cond) console.log("  ✓", label);
  else {
    console.error("  ✗", label);
    failures.push(label);
  }
};

const fakeRadio = { station: ALUWASIO, status: "idle", setStation: () => {}, toggle: () => {} } as never;

console.log("\n[1] Accueil (navbar → recherche → PRÊT À ÉCOUTER → lecteur)");
let home = "";
try {
  home = renderToString(<App />);
  ok(home.length > 3000, "l'application se rend sans exception");
} catch (e) {
  ok(false, `rendu sans exception (${(e as Error).message})`);
}
ok(home.includes("Radio Aluwasio"), "marque dans la navbar");
ok(home.includes("Rechercher une station"), "barre de recherche après la navbar");
ok(home.includes("PRÊT À ÉCOUTER"), "statut PRÊT À ÉCOUTER suit la recherche");
ok(home.includes('aria-label="Lecteur radio"'), "lecteur présent juste après le statut");
ok(home.includes('aria-label="Navigation mobile"'), "tab bar mobile présente");
ok(home.includes('aria-label="Radios du Togo"'), "onglet Radios du Togo");
ok(home.includes('aria-label="À propos de Radio Aluwasio"'), "onglet À propos");
ok(home.includes('aria-label="Nous contacter"'), "onglet Contact");
ok(home.includes('aria-current="page"'), "onglet actif signalé");
ok(home.includes('aria-label="À la une"'), "onglet À la une dans la tab bar");
ok(home.includes("rounded-[28px]") && home.includes("bg-white/95"), "dock flottant moderne présent");
ok(home.includes("from-amber-400 via-rose-500 to-sky-500"), "cercle actif aux couleurs du logo");
ok((home.match(/aria-current="page"/g) || []).length === 1, "un seul onglet actif");
ok(!home.includes("Comme vous le savez"), "le texte À propos n'est PAS sur l'accueil");
ok(!home.includes("La voix qui"), "le slogan n'est PAS sur l'accueil");
ok(!home.includes("Radio Maria Togo"), "les stations ne sont PAS sur l'accueil");
ok(!home.includes("Télécharger l"), "aucun bouton de téléchargement sur l'accueil");
ok(!home.includes("dangerouslySetInnerHTML"), "aucune injection HTML");

console.log("\n[1b] Diaporama d'actualités (juste au-dessus de la tab bar)");
ok(home.includes("À la une · Togo"), "bannière À la une présente sur l'accueil");
ok(home.includes("Le journal du matin"), "l'actualité la plus récente s'affiche en premier");
ok(home.includes("Récent → Ancien"), "ordre récent → ancien indiqué");
ok(home.includes('aria-roledescription="diaporama"'), "diaporama annoncé aux lecteurs d'écran");
ok(home.includes('aria-live="off"'), "le défilement automatique ne spamme pas les lecteurs d'écran");
ok(home.includes("Ouvrir les 6 annonces À la une"), "les annonces sont ouvrables");
ok(home.includes("Voir tout"), "accès direct à la liste complète");
ok(home.includes('aria-label="Actualité suivante"'), "contrôle de défilement accessible");
ok((home.match(/role="tab"/g) || []).length === 6, "6 encarts dans la bannière");
ok(!home.includes("©"), "copyright retiré de la page d'accueil");
ok(home.indexOf("Lecteur radio") < home.indexOf("À la une · Togo"), "bannière placée après le lecteur, avant la tab bar");
ok(home.includes('aria-label="Navigation mobile"'), "tab bar toujours en dernier");
ok(NEWS.length === 6, "exactement 6 actualités");
ok(NEWS[0].when === "Aujourd'hui" && NEWS[5].when === "Archives", "du plus récent au plus ancien");

console.log("\n[2] Vue À propos (tous les textes déplacés)");
const about = renderToString(<AboutView onDonate={() => {}} isNative={false} />);
const aboutNative = renderToString(<AboutView onDonate={() => {}} isNative />);
ok(about.includes("La voix qui"), "slogan déplacé dans À propos");
ok(about.includes("Station indépendante · Togo"), "badge déplacé dans À propos");
ok(about.includes("Musique, information et émissions"), "description déplacée dans À propos");
ok(about.includes("24h/24") && about.includes("100 %"), "statistiques déplacées dans À propos");
ok(about.includes("Comme vous le savez, nous sommes une station"), "texte À propos exact et complet");
ok(about.includes("Faire un don"), "don accessible depuis À propos");
ok(about.includes("Télécharger l"), "téléchargement disponible sur le web (dans À propos)");
ok(!aboutNative.includes("Télécharger l"), "AUCUN téléchargement dans l'APK natif");
ok(!aboutNative.includes("Application Android"), "aucune section Application dans l'APK natif");

console.log("\n[2b] Annonces À la une accessibles");
const newsView = renderToString(<NewsView onDonate={() => {}} />);
ok(newsView.includes("6 annonces"), "vue dédiée avec les 6 annonces");
ok(NEWS.every((n) => newsView.includes(n.title)), "les 6 titres sont lisibles intégralement");
ok(newsView.includes("Aujourd") && newsView.includes("Archives"), "classement récent → ancien");
ok(newsView.indexOf("Aujourd") < newsView.indexOf("Archives"), "ordre chronologique respecté");
ok(newsView.includes("Faire un don"), "action de don accessible depuis l'annonce");
ok(newsView.includes("<ol"), "liste sémantique ordonnée");

console.log("\n[3] Vue Contact & liste des radios");
const contact = renderToString(<ContactView />);
const list = renderToString(<StationList current={fakeRadio.station} status={fakeRadio.status} onSelect={() => {}} onToggle={() => {}} />);
ok(contact.includes("+228 90 34 06 03"), "numéro de contact affiché");
ok(contact.includes("Publicité &amp; partenariats"), "section publicité présente");
ok(list.includes("Radio Maria Togo") && list.includes("Nana FM"), "4 stations rangées dans leur vue");
ok(list.includes('aria-label="Écouter Radio Maria Togo"'), "boutons de station accessibles");

console.log("\n[4] Stations & sécurité des URLs");
ok(POPULAR_STATIONS.length === 4, "exactement 4 stations togolaises");
ok(STATIONS.length === 5, "4 partenaires + Radio Aluwasio");
ok(STATIONS.every((s) => isSafeStreamUrl(s.url)), "tous les flux HTTPS valides");
ok(new Set(STATIONS.map((s) => s.id)).size === STATIONS.length, "identifiants uniques");
ok(STATIONS.every((s) => !/[<>"']/.test(s.name + s.url)), "aucun caractère injectable");
ok(isSafeHttpUrl(ALUWASIO.url), "flux officiel sûr");
ok(!isSafeStreamUrl("javascript:alert(1)"), "schéma javascript rejeté");
ok(!isSafeStreamUrl("http://example.com/stream"), "HTTP en clair rejeté");
ok(!isSafeStreamUrl("https://user:pass@evil.example/stream"), "identifiants embarqués rejetés");

console.log("\n[5] Accessibilité & mise en page");
ok(home.includes('aria-live="polite"'), "statut annoncé aux lecteurs d'écran");
ok(home.includes('aria-label="Volume"'), "volume nommé");
ok(home.includes("Aller au contenu"), "lien d'évitement");
ok(home.includes("tabbar-safe"), "tab bar avec zone de sécurité mobile");
ok(home.includes("px-4") && home.includes("pb-28"), "paddings/marges mobile définis");
ok(!/<a\b(?![^>]*rel=)[^>]*target="_blank"/.test(home + about + contact), "aucun target=_blank sans rel");

if (failures.length) {
  console.error(`\n❌ ${failures.length} test(s) en échec`);
  process.exit(1);
}
console.log("\n✅ Tous les tests de structure, de mise en page et de sécurité passent\n");
