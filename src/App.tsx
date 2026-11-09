import { useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Player } from "./components/Player";
import { SearchBar } from "./components/SearchBar";
import { TabBar } from "./components/TabBar";
import { AboutView } from "./components/AboutView";
import { ContactView } from "./components/ContactView";
import { StationList } from "./components/StationList";
import { NewsBanner } from "./components/NewsBanner";
import { NewsView } from "./components/NewsView";
import { DonateModal, PHONE_DISPLAY } from "./components/DonateModal";
import { GiftIcon } from "./components/Icons";
import { useRadio } from "./hooks/useRadio";
import { logoGlobe } from "./assets";
import type { View } from "./views";
import { cn } from "./utils/cn";

const focus = "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

const NAV: { id: View; label: string }[] = [
  { id: "radios", label: "Radios du Togo" },
  { id: "alaune", label: "À la une" },
  { id: "apropos", label: "À propos" },
  { id: "contact", label: "Contact" },
];

export default function App() {
  const [donate, setDonate] = useState(false);
  const [view, setView] = useState<View>("ecouter");
  const [query, setQuery] = useState("");
  const radio = useRadio();
  const isNative = Capacitor.isNativePlatform();

  const go = (v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectStation = (s: Parameters<typeof radio.setStation>[0]) => {
    radio.setStation(s);
    setView("ecouter");
    setQuery("");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070b1a] text-white">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-900">
        Aller au contenu
      </a>

      {/* Fond sobre */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-amber-500/[0.10] blur-[120px]" />
        <div className="absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full bg-sky-600/[0.12] blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.016)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.016)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      </div>

      {/* Navbar : hauteur et paddings fixes */}
      <header className="sticky top-0 z-30 h-14 border-b border-white/[0.06] bg-[#070b1a]/90 backdrop-blur-xl sm:h-16">
        <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <button onClick={() => go("ecouter")} aria-label="Radio Aluwasio, accueil" className={cn("flex min-w-0 items-center gap-2.5 rounded-lg sm:gap-3", focus)}>
            <img src={logoGlobe} alt="" className="h-8 w-8 shrink-0 rounded-full bg-white object-cover ring-1 ring-white/20 sm:h-9 sm:w-9" />
            <span className="truncate text-sm font-extrabold tracking-tight sm:text-base">Radio Aluwasio</span>
          </button>
          <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                aria-current={view === n.id ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition",
                  view === n.id ? "bg-white/10 font-semibold text-white" : "text-white/60 hover:text-white",
                  focus,
                )}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setDonate(true)}
            className={cn("flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-2 text-xs font-bold text-slate-900 shadow-lg shadow-amber-500/20 transition hover:brightness-110 active:scale-95 sm:px-4", focus)}
          >
            <GiftIcon className="h-4 w-4" /> <span className="hidden sm:inline">Faire un don</span>
          </button>
        </div>
      </header>

      {/* Barre de recherche : juste après la navbar */}
      <div className="sticky top-14 z-20 -mb-1 bg-[#070b1a]/90 px-4 pb-2 pt-3 backdrop-blur-xl sm:top-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <SearchBar
            query={query}
            setQuery={setQuery}
            current={radio.station}
            status={radio.status}
            onSelect={selectStation}
            onToggle={radio.toggle}
          />
        </div>
      </div>

      {/* Contenu : marges/paddings explicites, dont la place de la tab bar */}
      <main id="contenu" className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-28 pt-2 sm:px-6 sm:pb-24 sm:pt-3 md:pb-16 lg:px-8">
        {/* Statut : suit immédiatement la recherche */}
        <div className="mb-5 mt-1 flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5 sm:mb-6">
          <div className="flex min-w-0 items-center gap-2" aria-live="polite">
            <span className="relative flex h-2 w-2 shrink-0">
              {radio.status === "playing" && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />}
              <span className={cn("relative inline-flex h-2 w-2 rounded-full", radio.status === "playing" ? "bg-emerald-400" : radio.status === "error" ? "bg-rose-400" : "bg-amber-300")} />
            </span>
            <span className="truncate text-[11px] font-black uppercase tracking-[0.16em] text-white/80 sm:text-xs">
              {radio.statusLabel.toLocaleUpperCase("fr-FR")}
            </span>
          </div>
          <span className="truncate text-[11px] text-white/40 sm:text-xs">{radio.station.name}</span>
        </div>

        {view === "ecouter" && (
          <div className="flex flex-col items-center">
            <Player radio={radio} onDonate={() => setDonate(true)} />
            {/* Juste au-dessus de la tab bar, à la place du copyright sur l'accueil */}
            <NewsBanner onOpen={() => go("alaune")} />
          </div>
        )}

        {view === "radios" && (
          <section className="mx-auto w-full max-w-3xl" aria-labelledby="radios-title">
            <div className="mb-5 px-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/80">Partenaires · Publicité</p>
              <h1 id="radios-title" className="mt-1.5 text-xl font-black tracking-tight sm:text-2xl">Radios du Togo</h1>
              <p className="mt-1 text-xs text-white/50 sm:text-sm">Les 4 stations les plus écoutées, en direct.</p>
            </div>
            <StationList
              current={radio.station}
              status={radio.status}
              onSelect={selectStation}
              onToggle={radio.toggle}
              filter={query}
            />
          </section>
        )}

        {view === "apropos" && <AboutView onDonate={() => setDonate(true)} isNative={isNative} />}
        {view === "alaune" && <NewsView onDonate={() => setDonate(true)} />}
        {view === "contact" && <ContactView />}
      </main>

      {/* Le copyright reste sur les autres vues ; sur l'accueil il est remplacé par le diaporama. */}
      {view !== "ecouter" && (
        <footer className="relative z-10 border-t border-white/[0.07] px-4 pb-28 pt-6 text-center text-[11px] text-white/35 sm:px-6 md:pb-6">
          <p>© {new Date().getFullYear()} Radio Aluwasio — Station indépendante · {PHONE_DISPLAY}</p>
          <p className="mt-1">Diffusion Zeno.FM</p>
        </footer>
      )}

      <TabBar view={view} onChange={go} />
      <DonateModal open={donate} onClose={() => setDonate(false)} />
    </div>
  );
}
