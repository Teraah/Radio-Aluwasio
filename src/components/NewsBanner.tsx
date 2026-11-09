import { useEffect, useState } from "react";
import { NEWS } from "../data/news";
import { cn } from "../utils/cn";

const focus = "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";
const DURATION = 4500;

/** Petite bannière diaporama : défile du plus récent au plus ancien, en boucle. */
export function NewsBanner({ onOpen }: { onOpen: () => void }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % NEWS.length), DURATION);
    return () => window.clearInterval(id);
  }, [paused, index]);

  const item = NEWS[index];
  const go = (delta: number) => setIndex((i) => (i + delta + NEWS.length) % NEWS.length);

  return (
    <section
      role="region"
      aria-label="Dernières nouvelles, événements et émissions du Togo"
      aria-roledescription="diaporama"
      aria-live="off"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="mx-auto mt-6 w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] shadow-lg shadow-black/20"
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] px-3.5 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">À la une · Togo</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[10px] text-white/35 sm:inline">Récent → Ancien</span>
          <span className="text-[10px] tabular-nums text-white/45">{index + 1}/{NEWS.length}</span>
          <button onClick={onOpen} aria-label="Ouvrir les 6 annonces À la une" className={cn("rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-amber-200 transition hover:bg-white/20", focus)}>
            Voir tout →
          </button>
        </div>
      </div>

      <div key={item.id} className="news-slide flex items-center gap-2 px-3 py-2.5">
        <button onClick={onOpen} aria-label={`Lire l'annonce : ${item.title}`} className={cn("flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1 text-left transition hover:bg-white/5", focus)}>
          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl shadow-md", item.color)} aria-hidden>
            {item.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-200">{item.category}</span>
              <span className="truncate text-[10px] text-white/40">{item.when}</span>
            </div>
            <h3 className="mt-1 truncate text-[13px] font-bold leading-tight">{item.title}</h3>
            <p className="mt-0.5 truncate text-[11px] text-white/50">{item.detail}</p>
          </div>
        </button>
        <div className="flex shrink-0 flex-col gap-1">
          <button onClick={() => go(-1)} aria-label="Actualité précédente" className={cn("flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[11px] text-white/70 transition hover:bg-white/20", focus)}>↑</button>
          <button onClick={() => go(1)} aria-label="Actualité suivante" className={cn("flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[11px] text-white/70 transition hover:bg-white/20", focus)}>↓</button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-3.5 pb-2.5" role="tablist" aria-label="Choisir une actualité">
        {NEWS.map((n, i) => (
          <button
            key={n.id}
            role="tab"
            aria-selected={i === index}
            aria-label={`${i + 1}. ${n.title}`}
            onClick={() => setIndex(i)}
            className={cn("h-1.5 flex-1 rounded-full transition", i === index ? "bg-amber-300" : "bg-white/15 hover:bg-white/30", focus)}
          />
        ))}
      </div>

      <div key={`bar-${index}`} className="h-0.5 bg-amber-300/70 news-progress" style={{ animationPlayState: paused ? "paused" : "running" }} />
    </section>
  );
}
