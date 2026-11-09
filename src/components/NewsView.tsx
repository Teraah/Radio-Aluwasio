import { NEWS } from "../data/news";
import { cn } from "../utils/cn";

const focus = "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

/** Les 6 annonces « À la une », lisibles intégralement, du plus récent au plus ancien. */
export function NewsView({ onDonate }: { onDonate: () => void }) {
  return (
    <section className="mx-auto w-full max-w-2xl" aria-labelledby="news-title">
      <div className="mb-5 px-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/80">Actualités du pays</p>
        <h1 id="news-title" className="mt-1.5 text-xl font-black tracking-tight sm:text-2xl">À la une · Togo</h1>
        <p className="mt-1 text-xs text-white/50 sm:text-sm">6 annonces, événements et émissions, du plus récent au plus ancien.</p>
      </div>

      <ol className="space-y-3">
        {NEWS.map((n, i) => (
          <li key={n.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition hover:bg-white/[0.06]">
            <div className="flex items-start gap-3">
              <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-md", n.color)} aria-hidden>{n.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-200">{n.category}</span>
                  <span className="text-[10px] text-white/40">{n.when}</span>
                  <span className="ml-auto text-[10px] tabular-nums text-white/30">{i + 1}/{NEWS.length}</span>
                </div>
                <h2 className="mt-1.5 text-sm font-bold leading-snug">{n.title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-white/55">{n.detail}</p>
                {n.id === "n2" && (
                  <button onClick={onDonate} className={cn("mt-2.5 rounded-full bg-amber-400 px-3.5 py-1.5 text-[11px] font-bold text-slate-900 transition hover:bg-amber-300", focus)}>
                    Faire un don →
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
