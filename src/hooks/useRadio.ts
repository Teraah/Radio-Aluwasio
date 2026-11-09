import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ALUWASIO, STATIONS, type Station } from "../data/stations";
import { logoFull } from "../assets";
import { readNumber, readStorage, writeStorage } from "../utils/storage";
import { isSafeStreamUrl } from "../utils/safe";

export type RadioStatus = "idle" | "loading" | "playing" | "paused" | "error";

const STATUS_LABEL: Record<RadioStatus, string> = {
  idle: "Prêt à écouter",
  loading: "Connexion au flux…",
  playing: "En direct",
  paused: "En pause",
  error: "Flux indisponible",
};

export function useRadio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stationRef = useRef<Station>(ALUWASIO);
  /** Jeton anti-race : une lecture ancienne ne doit jamais écraser une lecture récente. */
  const requestRef = useRef(0);
  const [station, setStationState] = useState<Station>(ALUWASIO);
  const [status, setStatus] = useState<RadioStatus>("idle");
  const [volume, setVolumeState] = useState<number>(() => readNumber("aluwasio-volume", 0.8));
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [liked, setLiked] = useState(() => readStorage("aluwasio-liked") === "1");

  // Un seul élément audio pour toute l'application
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.volume = readNumber("aluwasio-volume", 0.8);
    audioRef.current = audio;

    const onPlaying = () => setStatus("playing");
    const onWaiting = () => setStatus((s) => (s === "idle" ? s : "loading"));
    const onPause = () => setStatus((s) => (s === "error" || s === "idle" ? s : "paused"));
    const onError = () => {
      if (audio.currentSrc || audio.getAttribute("src")) setStatus("error");
    };
    const onStalled = () => setStatus((s) => (s === "idle" ? s : "loading"));

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    audio.addEventListener("stalled", onStalled);

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("stalled", onStalled);
      requestRef.current += 1;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, [status]);

  const startStream = useCallback(async (s: Station) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!isSafeStreamUrl(s.url)) {
      setStatus("error");
      return;
    }
    const token = ++requestRef.current;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setStatus("loading");
    // Pas de paramètre « cache-buster » : certains serveurs Icecast/Zeno le refusent.
    audio.src = s.url;
    audio.load();
    try {
      await audio.play();
      if (token === requestRef.current) setStatus("playing");
    } catch {
      if (token === requestRef.current) setStatus("error");
    }
  }, []);

  const play = useCallback(() => startStream(stationRef.current), [startStream]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    requestRef.current += 1; // invalide toute lecture en cours
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setStatus("paused");
  }, []);

  const stop = useCallback(() => {
    pause();
    setElapsed(0);
    setStatus("idle");
  }, [pause]);

  const toggle = useCallback(() => {
    if (status === "playing" || status === "loading") pause();
    else play();
  }, [status, play, pause]);

  const setStation = useCallback(
    (s: Station) => {
      if (!STATIONS.some((x) => x.id === s.id)) return; // aucune station injectée
      stationRef.current = s;
      setStationState(s);
      setElapsed(0);
      void startStream(s);
    },
    [startStream],
  );

  const setVolume = useCallback((v: number) => {
    const clamped = Number.isFinite(v) ? Math.min(1, Math.max(0, Math.round(v * 100) / 100)) : 0.8;
    setVolumeState(clamped);
    writeStorage("aluwasio-volume", String(clamped));
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      if (clamped > 0) audioRef.current.muted = false; // corrige le son resté coupé
    }
    if (clamped > 0) setMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }, []);

  const toggleLike = useCallback(() => {
    setLiked((l) => {
      writeStorage("aluwasio-liked", l ? "0" : "1");
      return !l;
    });
  }, []);

  // Raccourcis clavier : jamais quand un champ/bouton est focusé, ni quand une modale est ouverte
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest?.("input, textarea, select, button, a, [contenteditable='true']")) return;
      if (document.querySelector('[role="dialog"]')) return;
      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setVolume(volume + 0.05);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setVolume(volume - 0.05);
      } else if (e.key.toLowerCase() === "m") {
        toggleMute();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, setVolume, volume, toggleMute]);

  // Contrôles de l'écran de verrouillage / notifications média
  useEffect(() => {
    if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: station.name,
        artist: station.id === "aluwasio" ? "En direct" : "En direct · via Radio Aluwasio",
        album: "Radio Aluwasio",
        artwork: [{ src: logoFull, sizes: "600x500", type: "image/jpeg" }],
      });
      navigator.mediaSession.playbackState = status === "playing" ? "playing" : "paused";
      navigator.mediaSession.setActionHandler("play", play);
      navigator.mediaSession.setActionHandler("pause", pause);
      navigator.mediaSession.setActionHandler("stop", stop);
    } catch {
      /* API non supportée : fonctionnalité optionnelle */
    }
  }, [play, pause, stop, station, status]);

  const statusLabel = useMemo(() => STATUS_LABEL[status], [status]);

  return {
    status, statusLabel, station, setStation, play, pause, stop, toggle,
    volume, setVolume, muted, toggleMute, elapsed, liked, toggleLike,
  };
}
