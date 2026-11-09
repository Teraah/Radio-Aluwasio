export type NewsItem = {
  id: string;
  category: string;
  title: string;
  detail: string;
  when: string;
  emoji: string;
  color: string;
};

/**
 * 6 encarts, classés du PLUS RÉCENT au PLUS ANCIEN.
 * Le diaporama les fait défiler dans cet ordre, puis recommence.
 */
export const NEWS: NewsItem[] = [
  {
    id: "n1",
    category: "Émission",
    title: "Le journal du matin, en direct de Lomé",
    detail: "L'actualité du pays, chaque matin sur votre antenne.",
    when: "Aujourd'hui",
    emoji: "📰",
    color: "from-amber-400 to-orange-600",
  },
  {
    id: "n2",
    category: "Nouvelle",
    title: "La radio indépendante a besoin de vous",
    detail: "Soutenez la diffusion 24h/24 grâce au bouton Faire un don.",
    when: "Hier",
    emoji: "💛",
    color: "from-rose-400 to-red-600",
  },
  {
    id: "n3",
    category: "Événement",
    title: "Les voix du Togo : rendez-vous culturel",
    detail: "Musiques, danses et traditions des cinq régions.",
    when: "Cette semaine",
    emoji: "🎭",
    color: "from-sky-400 to-blue-700",
  },
  {
    id: "n4",
    category: "Débat",
    title: "Jeunesse, emploi et initiatives locales",
    detail: "Une émission ouverte aux auditeurs et aux associations.",
    when: "La semaine dernière",
    emoji: "🎙️",
    color: "from-emerald-400 to-green-700",
  },
  {
    id: "n5",
    category: "Musique",
    title: "Le meilleur des artistes togolais",
    detail: "Une sélection de titres à découvrir en continu.",
    when: "Récemment",
    emoji: "🎶",
    color: "from-fuchsia-400 to-purple-700",
  },
  {
    id: "n6",
    category: "Communauté",
    title: "Retour sur nos émissions régionales",
    detail: "Kara, Sokodé, Atakpamé : les archives à réécouter.",
    when: "Archives",
    emoji: "🌍",
    color: "from-teal-400 to-cyan-700",
  },
];
