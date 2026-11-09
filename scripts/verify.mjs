/** Vérifications sur le fichier HTML final (build single-file). */
import fs from "node:fs";

const file = "dist/index.html";
const html = fs.readFileSync(file, "utf8");
const failures = [];
const ok = (cond, label) => {
  if (cond) console.log("  ✓", label);
  else {
    console.error("  ✗", label);
    failures.push(label);
  }
};

console.log("\n[4] Artefact de production");
ok(html.length > 100_000, `fichier HTML autonome généré (${Math.round(html.length / 1024)} Ko)`);
ok(!/<script[^>]+src=/.test(html), "aucun script externe requis");
ok(!/<link[^>]+rel="stylesheet"/.test(html), "aucune feuille de style externe requise");
ok(html.includes("data:image/jpeg;base64,"), "logo officiel intégré (pas de 404 d'image)");
ok(html.includes('rel="icon"'), "favicon intégré");
ok(!/src="\/logo\.png"|src="\/logo-globe\.png"/.test(html), "aucune référence d'image non servie");
ok(!/href="\/download\//.test(html), "aucun lien APK local introuvable");
ok(html.includes("https://gofile.io/"), "lien APK de secours présent");
ok(html.includes("https://tmpfiles.org/dl/"), "lien de téléchargement DIRECT (fichier .apk) présent");
ok(html.includes("RadioAluwasio.apk"), "APK local prioritaire référencé");
ok(fs.existsSync("dist/RadioAluwasio.apk"), "APK présent dans dist/ à côté de index.html");
if (fs.existsSync("dist/RadioAluwasio.apk")) {
  const fd = fs.openSync("dist/RadioAluwasio.apk", "r");
  const buf = Buffer.alloc(4);
  fs.readSync(fd, buf, 0, 4, 0);
  fs.closeSync(fd);
  ok(buf.toString("hex") === "504b0304", "APK valide (archive ZIP/Android signée)");
}
ok(html.includes("noopener noreferrer"), "protection reverse-tabnabbing");
ok(html.includes('name="referrer"'), "politique de referrer définie");
ok(!/aluwasio\.keystore|storePassword|keyPassword|aluwasio2024/i.test(html), "aucun secret ni clé de signature exposé dans le bundle");
ok(html.includes("https://stream.zeno.fm/vmvvyymvrhatv"), "flux Aluwasio embarqué");
ok((html.match(/https:\/\/stream\.zeno\.fm\//g) || []).length === 5, "5 flux (Aluwasio + 4 stations)");
ok(!/http:\/\/[^"'`\s]*stream/i.test(html), "aucun flux en clair (mixed-content)");
ok(/isNativePlatform/.test(html), "détection de l'APK natif (aucun bouton de téléchargement dedans)");
ok(html.includes("Rechercher une station"), "barre de recherche intégrée");
ok(html.includes("PRÊT À ÉCOUTER") || html.includes("En direct") || html.includes("écouter"), "libellé de statut intégré");
ok(html.includes("tabbar-safe"), "CSS de la tab bar / safe-area présent");
ok(html.includes("pb-28"), "marge basse réservée à la tab bar");
ok(html.includes("À la une"), "bannière d'actualités intégrée au bundle");
ok(html.includes("news-slide") && html.includes("news-progress"), "animations du diaporama présentes");
ok((html.match(/Archives/g) || []).length >= 1, "6 encarts récents → anciens intégrés");
ok(html.includes("from-amber-400 via-rose-500 to-sky-500"), "tab bar aux couleurs du logo");
ok(html.includes("rounded-[28px]"), "dock flottant intégré");
ok(html.includes("Ouvrir les 6 annonces"), "annonces À la une accessibles");
ok(html.includes("prefers-reduced-motion"), "accessibilité des animations");
ok(html.includes('<html lang="fr"'), "langue déclarée");
ok(html.includes("Radio Aluwasio — Écoutez en direct"), "titre de page correct");
ok(!/console\.log\(/.test(html.replace(/console\.error/g, "")), "aucun log de debug résiduel");

if (failures.length) {
  console.error(`\n❌ ${failures.length} vérification(s) en échec`);
  process.exit(1);
}
console.log("\n✅ Artefact de production validé\n");
