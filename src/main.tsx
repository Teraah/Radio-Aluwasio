import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import "./index.css";
import App from "./App";

/**
 * PWA : en mode « fichier HTML unique » les fichiers /sw.js et /manifest.json
 * ne sont pas servis. On les détecte avant de les utiliser pour éviter les 404
 * et n'activer le mode hors-ligne que lorsqu'il est réellement disponible.
 */
async function setupPWA() {
  // Dans l'APK, le WebView possède déjà l'app : un SW risquerait de figer une ancienne version.
  if (Capacitor.isNativePlatform()) return;
  if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
  if (location.protocol !== "https:" && location.hostname !== "localhost") return;
  try {
    const [sw, manifest] = await Promise.all([
      fetch("/sw.js", { method: "HEAD" }).catch(() => null),
      fetch("/manifest.json", { method: "HEAD" }).catch(() => null),
    ]);
    const isJs = (r: Response | null) => r?.ok && (r.headers.get("content-type") || "").includes("javascript");
    if (isJs(sw)) await navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (manifest?.ok) {
      const link = document.createElement("link");
      link.rel = "manifest";
      link.href = "/manifest.json";
      document.head.appendChild(link);
    }
  } catch {
    /* mode dégradé : l'application fonctionne parfaitement sans PWA */
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

window.addEventListener("load", () => void setupPWA());
