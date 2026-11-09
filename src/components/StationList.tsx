import { POPULAR_STATIONS, type Station } from "../data/stations";
import { PauseIcon, PlayIcon, SpinnerIcon } from "./Icons";
import { logoGlobe } from "../assets";
import { cn } from "../utils/cn";
import type { RadioStatus } from "../hooks/useRadio";

const focus = "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

/** Liste des 4 radios partenaires — affichée uniquement dans le menu. */
const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function StationList({
  current, status, onSelect, onToggle, filter = "",
}: {
  current: Station;
  status: RadioStatus;
  onSelect: (s: Station) => void;
  onToggle: () => void;
  filter?: string;
}) {
  const q = normalize(filter.trim());
  const stations = q
    ? POPULAR_STATIONS.filter((s) => normalize(`${s.name} ${s.city} ${s.freq ?? ""} ${s.genre}`).includes(q))
    : POPULAR_STATIONS;

  return (
    <div>
      <p className="text-sm leading-relaxed text-white/55">
        Quatre stations togolaises parmi les plus écoutées, en direct grâce à Radio Aluwasio.
        Touchez une radio pour l'écouter immédiatement.
      </p>

      {stations.length === 0 && (
        <p className="mt-5 rounded-xl bg-white/5 px-4 py-6 text-center text-sm text-white/50">Aucune station ne correspond à « {filter} ».</p>
      )}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {stations.map((s, index) => {
          const active = s.id === current.id;
          const playing = active && status === "playing";
          const loading = active && status === "loading";
          return (
            <button
              key={s.id}
              onClick={() => (active ? onToggle() : onSelect(s))}
              aria-label={`${playing ? "Mettre en pause" : "Écouter"} ${s.name}`}
              className={cn(
                "group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-all",
                active ? "border-white/30 bg-white/[0.11]" : "border-white/[0.08] bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.08]",
                focus,
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity", s.color, active ? "opacity-[0.14]" : "group-hover:opacity-[0.08]")} />
              <div className={cn("relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-md", s.color)}>
                {s.emoji}
              </div>
              <div className="relative min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-sm font-bold">{s.name}</h3>
                  {playing && <span className="shrink-0 rounded bg-emerald-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-300">Live</span>}
                </div>
                <p className="mt-0.5 truncate text-[11px] text-white/45">N°{index + 1} · {s.freq ? `${s.freq} · ` : ""}{s.city} · {s.genre}</p>
              </div>
              <span className={cn("relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition", active ? "bg-white text-slate-900" : "bg-white/10 text-white group-hover:bg-white/20")}>
                {loading ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : playing ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="ml-0.5 h-4 w-4" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3">
        <p className="text-xs text-white/45">Vous êtes une radio ? Soyez mis en avant ici.</p>
        <a href="tel:+22890340603" className={cn("text-xs font-semibold text-amber-300 hover:text-amber-200", focus)}>
          Publicité · +228 90 34 06 03 →
        </a>
      </div>
      <p className="mt-3 flex items-center justify-center gap-2 text-[11px] text-white/30">
        <img src={logoGlobe} alt="" className="h-4 w-4 rounded-full bg-white/90" /> Une sélection Radio Aluwasio
      </p>
    </div>
  );
}
