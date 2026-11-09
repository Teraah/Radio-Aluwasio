import type { View } from "../views";
import { cn } from "../utils/cn";

type IconName = "play" | "radio" | "news" | "info" | "phone";

const focus = "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

const TABS: { id: View; icon: IconName; label: string }[] = [
  { id: "ecouter", icon: "play", label: "Écouter la radio" },
  { id: "radios", icon: "radio", label: "Radios du Togo" },
  { id: "alaune", icon: "news", label: "À la une" },
  { id: "apropos", icon: "info", label: "À propos de Radio Aluwasio" },
  { id: "contact", icon: "phone", label: "Nous contacter" },
];

function TabIcon({ name }: { name: IconName }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "h-[21px] w-[21px]", "aria-hidden": true };
  switch (name) {
    case "play":
      return <svg {...common} fill="currentColor" stroke="none"><path d="M8 5.2v13.6c0 .8.9 1.3 1.6.9l10.2-6.8a1 1 0 0 0 0-1.7L9.6 4.3A1 1 0 0 0 8 5.2z" /></svg>;
    case "radio":
      return <svg {...common}><rect x="2.5" y="8" width="19" height="12.5" rx="2.2" /><circle cx="8.5" cy="14.2" r="2.5" /><path d="M14 12.5h4M14 16h4M6.5 8 16 3.8" /></svg>;
    case "news":
      return <svg {...common}><rect x="3" y="5" width="18" height="15" rx="2" /><path d="M7 9h6M7 12.5h6M7 16h4M16 9h1.5M16 12.5h1.5M16 16h1.5" /></svg>;
    case "info":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.8h.01" /></svg>;
    case "phone":
      return <svg {...common}><path d="M21 16.8v2.7a2 2 0 0 1-2.2 2 19.6 19.6 0 0 1-8.5-3 19.3 19.3 0 0 1-6-6A19.6 19.6 0 0 1 1.3 4 2 2 0 0 1 3.3 1.8H6a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.4 2.1L7 9.4a15.8 15.8 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2z" /></svg>;
  }
}

/**
 * Dock flottant moderne : pastille blanche, icône active dans un cercle dégradé
 * aux couleurs du logo (jaune · rouge · bleu), surélevé, sans surcharge visuelle.
 */
export function TabBar({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  return (
    <nav aria-label="Navigation mobile" className="tabbar-safe fixed inset-x-0 bottom-0 z-30 px-4 pb-2 md:hidden">
      <div className="mx-auto flex w-full max-w-sm items-center justify-between gap-0.5 rounded-[28px] border border-white/70 bg-white/95 px-2 py-2 shadow-[0_12px_34px_rgba(2,6,23,0.55)] backdrop-blur-xl">
        {TABS.map((t) => {
          const active = view === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              aria-label={t.label}
              aria-current={active ? "page" : undefined}
              title={t.label}
              className={cn("relative flex h-12 flex-1 items-center justify-center rounded-full transition-colors", !active && "hover:bg-[#4b2a5e]/[0.06]", focus)}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
                  active
                    ? "-translate-y-1 h-11 w-11 bg-gradient-to-br from-amber-400 via-rose-500 to-sky-500 text-white shadow-lg shadow-rose-500/30 ring-[3px] ring-white"
                    : "text-[#4b2a5e]/55",
                )}
              >
                <TabIcon name={t.icon} />
              </span>
              {active && <span aria-hidden className="absolute bottom-0.5 h-1 w-1 rounded-full bg-rose-500" />}
            </button>
          );
        })}
      </div>
      {/* Indicateur système, comme sur le modèle */}
      <div aria-hidden className="mx-auto mt-2 h-1 w-24 rounded-full bg-white/35" />
    </nav>
  );
}
