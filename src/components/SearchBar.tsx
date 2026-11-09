import { useEffect, useRef, useState } from "react";
import { STATIONS, type Station } from "../data/stations";
import { PauseIcon, PlayIcon, CloseIcon } from "./Icons";
import { cn } from "../utils/cn";

const focus = "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Barre de recherche placée juste après la navbar. Les résultats se superposent au contenu. */
export function SearchBar({
  query, setQuery, current, status, onSelect, onToggle,
}: {
  query: string;
  setQuery: (q: string) => void;
  current: Station;
  status: string;
  onSelect: (s: Station) => void;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const q = normalize(query.trim());
  const results = q ? STATIONS.filter((s) => normalize(`${s.name} ${s.city} ${s.freq ?? ""} ${s.genre}`).includes(q)) : [];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (s: Station) => {
    if (s.id === current.id) onToggle();
    else onSelect(s);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={boxRef} className="relative z-20">
      <div role="search" className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 shadow-sm backdrop-blur-xl focus-within:border-amber-400/40">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden className="h-[18px] w-[18px] shrink-0 text-white/45">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => { if (e.key === "Escape") { setQuery(""); setOpen(false); } }}
          placeholder="Rechercher une station…"
          aria-label="Rechercher une station"
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }} aria-label="Effacer la recherche" className={cn("rounded-full p-1 text-white/50 hover:text-white", focus)}>
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && q && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-white/10 bg-[#101631] shadow-2xl shadow-black/50">
          {results.length ? (
            <ul role="listbox" aria-label="Résultats de recherche" className="max-h-72 overflow-y-auto p-1.5">
              {results.map((s) => {
                const active = s.id === current.id;
                const playing = active && status === "playing";
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => choose(s)}
                      role="option"
                      aria-selected={active}
                      className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/10", focus)}
                    >
                      {s.id === "aluwasio" ? (
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 via-rose-500 to-sky-600 text-base">🌍</span>
                      ) : (
                        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-base", s.color)}>{s.emoji}</span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{s.name}</span>
                        <span className="block truncate text-[11px] text-white/45">{s.city}{s.freq ? ` · ${s.freq}` : ""} · {s.genre}</span>
                      </span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                        {playing ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="ml-0.5 h-3.5 w-3.5" />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-4 py-5 text-center text-sm text-white/50">Aucune station trouvée pour « {query} »</p>
          )}
        </div>
      )}
    </div>
  );
}
