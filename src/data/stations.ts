import { isSafeStreamUrl } from "../utils/safe";

export type Station = {
  id: string;
  name: string;
  city: string;
  freq?: string;
  genre: string;
  url: string;
  color: string;
  emoji: string;
  featured?: boolean;
};

export const ALUWASIO: Station = {
  id: "aluwasio",
  name: "Radio Aluwasio",
  city: "Togo · Monde",
  genre: "Généraliste · Communauté",
  url: "https://stream.zeno.fm/vmvvyymvrhatv",
  color: "from-amber-400 via-rose-500 to-sky-600",
  emoji: "🌍",
  featured: true,
};

/**
 * Les 4 stations togolaises les plus populaires (classement radio-browser par votes,
 * flux officiels Zeno.FM en HTTPS). Aucune URL en clair (http) n'est acceptée.
 */
export const POPULAR_STATIONS: Station[] = [
  { id: "maria", name: "Radio Maria Togo", city: "Lomé · Dapaong", freq: "95.8 FM", genre: "Religieuse · Enseignement", url: "https://stream.zeno.fm/u4y3w5rzs4zuv", color: "from-sky-400 to-indigo-600", emoji: "⛪" },
  { id: "victoire", name: "Victoire FM", city: "Lomé", freq: "96.3 FM", genre: "Musique · Divertissement", url: "https://stream.zeno.fm/vkhv6gl43g5tv", color: "from-fuchsia-500 to-purple-700", emoji: "🏆" },
  { id: "gameli", name: "Radio Gameli", city: "Lomé", genre: "Culture · Musique", url: "https://stream.zeno.fm/qayu0y1zs4zuv", color: "from-teal-400 to-emerald-600", emoji: "🎶" },
  { id: "nana", name: "Nana FM", city: "Lomé", freq: "95.5 FM", genre: "Infos · Généraliste", url: "https://stream.zeno.fm/b2hikdx9ovdvv", color: "from-orange-400 to-amber-600", emoji: "📻" },
];

/** Toutes les stations jouables, validées à la construction. */
export const STATIONS: Station[] = [ALUWASIO, ...POPULAR_STATIONS].filter((s) => {
  if (isSafeStreamUrl(s.url)) return true;
  console.error(`[Radio Aluwasio] Flux rejeté (non HTTPS) : ${s.name}`);
  return false;
});
