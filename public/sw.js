/* Service worker — activé uniquement si le serveur fournit réellement ce fichier. */
const CACHE = "aluwasio-v2";
const SHELL = ["/logo.png", "/logo-globe.png", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => Promise.allSettled(SHELL.map((u) => cache.add(u)))).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }
  // Jamais de mise en cache des flux audio, ni de requêtes externes : http(s) tiers = réseau direct.
  if (url.origin !== self.location.origin) return;
  if (/\.(mp3|aac|m3u8|ts|apk)(\?|$)/i.test(url.pathname + url.search)) return;
  if (url.hostname.includes("zeno.fm")) return;

  // HTML : réseau d'abord, cache en secours (évite de servir une version périmée).
  if (req.mode === "navigate" || url.pathname === "/" || url.pathname.endsWith(".html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone())).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || Response.error())),
    );
    return;
  }

  // Ressources statiques : cache d'abord.
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          if (res.ok && res.type === "basic") {
            caches.open(CACHE).then((c) => c.put(req, res.clone())).catch(() => {});
          }
          return res;
        }),
    ),
  );
});
