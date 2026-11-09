import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "tg.aluwasio.radio",
  appName: "Radio Aluwasio",
  webDir: "dist",
  backgroundColor: "#070b1a",
  android: {
    // Tous les flux sont en HTTPS : aucun contenu mixte autorisé.
    allowMixedContent: false,
    backgroundColor: "#070b1a",
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
