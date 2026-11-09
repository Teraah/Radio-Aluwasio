/** Lance le smoke test React (rendu serveur) dans un environnement DOM minimal. */
import esbuild from "esbuild";
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";

const require = createRequire(import.meta.url);

// Globaux minimaux attendus par les initialiseurs d'état (les effets ne tournent pas en SSR)
const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, String(v)),
  },
  isSecureContext: true,
  location: { href: "https://radio.example/", protocol: "https:", hostname: "radio.example" },
};
globalThis.navigator = { clipboard: undefined, share: undefined };
globalThis.document = { querySelector: () => null, activeElement: null, body: { style: {} }, createElement: () => ({}) };

mkdirSync(".tmp-test", { recursive: true });
await esbuild.build({
  entryPoints: ["scripts/smoke.tsx"],
  bundle: true,
  platform: "node",
  format: "cjs",
  jsx: "automatic",
  outfile: ".tmp-test/smoke.cjs",
  logLevel: "silent",
  external: ["react", "react-dom", "react-dom/server"],
});
writeFileSync(".tmp-test/.gitkeep", "");
await import("../.tmp-test/smoke.cjs");
