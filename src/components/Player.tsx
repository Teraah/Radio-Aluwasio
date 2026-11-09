import { useEffect, useState } from "react";
import type { useRadio } from "../hooks/useRadio";
import { Visualizer } from "./Visualizer";
import { Logo } from "./Logo";
import { logoFull } from "../assets";
import { isSafeHttpUrl, shareOrCopy } from "../utils/safe";
import {
  GiftIcon, HeartIcon, LiveIcon, MinusIcon, MuteIcon, PauseIcon, PlayIcon,
  PlusIcon, ShareIcon, SpinnerIcon, StopIcon, VolumeIcon,
} from "./Icons";
import { cn } from "../utils/cn";

export type Radio = ReturnType<typeof useRadio>;

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

const focus = "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101631]";

function IconButton({ onClick, label, children, className, disabled }: {
  onClick: () => void; label: string; children: React.ReactNode; className?: string; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/75 transition hover:bg-white/15 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
        focus,
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Player({ radio, onDonate }: { radio: Radio; onDonate: () => void }) {
  const {
    status, statusLabel, station, toggle, play, stop, volume, setVolume,
    muted, toggleMute, elapsed, liked, toggleLike,
  } = radio;
  const [shareState, setShareState] = useState<"" | "copied" | "failed">("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const isPlaying = status === "playing";
  const isLoading = status === "loading";
  const isError = status === "error";
  const isAluwasio = station.id === "aluwasio";
  const vol = muted ? 0 : volume;

  const handleShare = async () => {
    const result = await shareOrCopy({
      title: "Radio Aluwasio",
      text: "Écoutez Radio Aluwasio en direct !",
      url: window.location.href,
    });
    setShareState(result === "shared" ? "" : result === "copied" ? "copied" : "failed");
    window.setTimeout(() => setShareState(""), 2500);
  };

  return (
    <section className="relative w-full max-w-[420px]" aria-label="Lecteur radio">
      <div className={cn(
        "absolute -inset-4 rounded-[2.2rem] bg-gradient-to-tr from-amber-400/40 via-rose-500/30 to-sky-600/40 blur-3xl transition-opacity duration-700",
        isPlaying ? "opacity-60" : "opacity-25",
      )} />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101631]/85 shadow-2xl shadow-black/50 backdrop-blur-xl">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
          <div className="flex items-center gap-2" aria-live="polite">
            <span className="relative flex h-2 w-2">
              {isPlaying && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />}
              <span className={cn("relative inline-flex h-2 w-2 rounded-full", isPlaying ? "bg-emerald-400" : isError ? "bg-rose-400" : "bg-white/35")} />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">{statusLabel}</span>
          </div>
          <time className="font-mono text-[11px] tabular-nums text-white/45">
            {now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </time>
        </div>

        <div className="px-5 pb-5 pt-5 sm:px-6">
          {/* Logo officiel */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/5">
                {isAluwasio ? (
                  <img src={logoFull} alt="Radio Aluwasio" className="block h-auto w-[232px] sm:w-[248px]" draggable={false} />
                ) : (
                  <div className={cn("flex h-[193px] w-[232px] flex-col items-center justify-center rounded-xl bg-gradient-to-br text-white sm:h-[206px] sm:w-[248px]", station.color)}>
                    <span className="text-6xl">{station.emoji}</span>
                    <span className="mt-3 px-3 text-center text-xl font-black leading-tight">{station.name}</span>
                    <span className="mt-1 text-xs text-white/80">{station.city}{station.freq ? ` · ${station.freq}` : ""}</span>
                    <span className="mt-3 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] uppercase tracking-widest">via Radio Aluwasio</span>
                  </div>
                )}
              </div>
              {isPlaying && <Logo spinning className="absolute -bottom-3 -right-3 h-12 w-12 rounded-full border-2 border-white shadow-lg" />}
            </div>
          </div>

          {/* Piste en cours */}
          <div className="mt-5 text-center">
            <h2 className="truncate text-lg font-bold">{station.name}</h2>
            <p className="mt-0.5 truncate text-xs text-white/50">
              {isAluwasio ? "Diffusion en continu · Togo 🇹🇬" : `${station.city} · ${station.genre}`}
            </p>
          </div>

          <div className="mt-3"><Visualizer active={isPlaying} bars={32} /></div>

          {/* Erreur de flux */}
          {isError && (
            <div role="alert" className="mt-3 rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2.5 text-center text-xs text-rose-100">
              Le flux est momentanément indisponible.{" "}
              <button onClick={play} className={cn("font-semibold underline underline-offset-2", focus)}>Réessayer</button>
              {isSafeHttpUrl(station.url) && (
                <>
                  {" · "}
                  <a href={station.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Ouvrir le flux</a>
                </>
              )}
            </div>
          )}

          {/* Transport */}
          <div className="mt-4 flex items-center justify-center gap-5">
            <IconButton onClick={play} label="Revenir au direct"><LiveIcon className="h-5 w-5" /></IconButton>
            <button
              onClick={toggle}
              aria-label={isPlaying ? "Mettre en pause" : "Lancer la lecture"}
              className={cn(
                "flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-rose-500 to-sky-600 text-white shadow-xl shadow-rose-500/25 transition hover:scale-105 active:scale-95",
                focus,
              )}
            >
              {isLoading ? <SpinnerIcon className="h-8 w-8 animate-spin" /> : isPlaying ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="ml-1 h-8 w-8" />}
            </button>
            <IconButton onClick={stop} label="Arrêter la lecture" disabled={status === "idle"}><StopIcon className="h-5 w-5" /></IconButton>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-center gap-2.5">
            <IconButton onClick={toggleLike} label={liked ? "Retirer des favoris" : "Ajouter aux favoris"} className={liked ? "text-rose-400" : ""}>
              <HeartIcon className="h-[18px] w-[18px]" filled={liked} />
            </IconButton>
            <button
              onClick={onDonate}
              className={cn("flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 text-sm font-bold text-slate-900 shadow-lg shadow-amber-500/20 transition hover:scale-[1.03] active:scale-95", focus)}
            >
              <GiftIcon className="h-[18px] w-[18px]" /> Faire un don
            </button>
            <div className="relative">
              <IconButton onClick={handleShare} label="Partager la radio"><ShareIcon className="h-[18px] w-[18px]" /></IconButton>
              {shareState && (
                <span role="status" className="absolute -top-9 left-1/2 z-10 w-max -translate-x-1/2 rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-900 shadow">
                  {shareState === "copied" ? "Lien copié !" : "Copiez l'adresse du site"}
                </span>
              )}
            </div>
          </div>

          {/* Volume */}
          <div className="mt-5 flex items-center gap-2 border-t border-white/[0.07] pt-4">
            <button onClick={toggleMute} aria-label={muted ? "Réactiver le son" : "Couper le son"} className={cn("p-1 text-white/65 transition hover:text-white", focus)}>
              {vol === 0 ? <MuteIcon className="h-[18px] w-[18px]" /> : <VolumeIcon className="h-[18px] w-[18px]" level={vol} />}
            </button>
            <button onClick={() => setVolume(volume - 0.1)} aria-label="Baisser le volume" className={cn("rounded-full bg-white/[0.08] p-1.5 text-white/75 transition hover:bg-white/20 active:scale-90", focus)}>
              <MinusIcon className="h-3 w-3" />
            </button>
            <input
              type="range" min={0} max={1} step={0.01} value={vol}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume" className="volume h-1.5 w-full cursor-pointer appearance-none rounded-full"
              style={{ background: `linear-gradient(to right, #fbbf24 0%, #f43f5e ${vol * 50}%, #38bdf8 ${vol * 100}%, rgba(255,255,255,0.12) ${vol * 100}%)` }}
            />
            <button onClick={() => setVolume(volume + 0.1)} aria-label="Augmenter le volume" className={cn("rounded-full bg-white/[0.08] p-1.5 text-white/75 transition hover:bg-white/20 active:scale-90", focus)}>
              <PlusIcon className="h-3 w-3" />
            </button>
            <span className="w-8 text-right font-mono text-[11px] tabular-nums text-white/50">{Math.round(vol * 100)}</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-white/40">
            <span>Durée d'écoute <span className="font-mono tabular-nums text-white/70">{formatTime(elapsed)}</span></span>
            <span>Espace · ↑ ↓ · M</span>
          </div>
        </div>
      </div>
    </section>
  );
}
