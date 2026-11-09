import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { APK_LOCAL, APK_URL } from "../data/app";

/**
 * Résout la meilleure URL de téléchargement direct :
 * le fichier APK local (même origine) s'il est réellement servi, sinon le lien direct externe.
 * Un serveur qui renvoie du HTML (SPA fallback/404) est traité comme indisponible.
 */
export function useApkUrl(): string {
  const [url, setUrl] = useState(APK_URL);

  useEffect(() => {
    // Dans l'APK, aucune section de téléchargement n'existe : inutile de sonder le réseau.
    if (Capacitor.isNativePlatform()) return;
    let alive = true;
    const controller = new AbortController();
    fetch(APK_LOCAL, { method: "HEAD", signal: controller.signal })
      .then((r) => {
        const type = r.headers.get("content-type") || "";
        if (alive && r.ok && !type.includes("text/html")) setUrl(APK_LOCAL);
      })
      .catch(() => {});
    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  return url;
}
