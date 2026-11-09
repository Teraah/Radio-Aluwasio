import { useEffect, useRef, useState } from "react";
import { CloseIcon, CopyIcon, PhoneIcon, WhatsAppIcon } from "./Icons";
import { cn } from "../utils/cn";
import { copyText } from "../utils/safe";

export const PHONE_DISPLAY = "+228 90 34 06 03";
export const PHONE_RAW = "+22890340603";
export const PHONE_WA = "22890340603";

type DonationApp = {
  id: string;
  name: string;
  short: string;
  color: string;
  ussd?: string;
  steps: string[];
};

const APPS: DonationApp[] = [
  {
    id: "flooz",
    name: "Flooz · Moov Africa",
    short: "Flooz",
    color: "from-sky-500 to-blue-700",
    ussd: "*155#",
    steps: ["Composez *155# ou ouvrez l'application Flooz", "Choisissez « Transfert d'argent »", `Entrez le numéro ${PHONE_DISPLAY}`, "Saisissez le montant, puis validez avec votre code secret"],
  },
  {
    id: "tmoney",
    name: "T-Money · Mixx by Yas",
    short: "T-Money",
    color: "from-amber-400 to-orange-600",
    ussd: "*145#",
    steps: ["Composez *145# ou ouvrez l'application Mixx by Yas", "Choisissez « Transfert d'argent »", `Entrez le numéro ${PHONE_DISPLAY}`, "Saisissez le montant, puis validez avec votre code secret"],
  },
  {
    id: "wave",
    name: "Wave",
    short: "Wave",
    color: "from-cyan-400 to-sky-600",
    steps: ["Ouvrez l'application Wave", "Appuyez sur « Envoyer de l'argent »", `Entrez le numéro ${PHONE_DISPLAY}`, "Saisissez le montant et confirmez l'envoi"],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    short: "WhatsApp",
    color: "from-green-400 to-emerald-600",
    steps: ["Écrivez-nous directement sur WhatsApp", "Nous vous indiquerons le moyen de don le plus pratique pour vous"],
  },
];

export function DonateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<DonationApp | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "ok" | "fail">("idle");
  const closeRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setCopyState("idle");
    }
  }, [open]);

  // Verrouille le défilement, gère Échap et place le focus dans la modale
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const focusId = window.setTimeout(() => closeRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusId);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  if (!open) return null;

  const handleCopy = async () => {
    const ok = await copyText(PHONE_DISPLAY);
    setCopyState(ok ? "ok" : "fail");
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopyState("idle"), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#04060f]/80 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="don-title"
        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0d1230] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 id="don-title" className="text-lg font-bold">Soutenir la station</h2>
            <p className="text-xs text-white/50">Choisissez votre moyen de paiement</p>
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Fermer la fenêtre" className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[68vh] overflow-y-auto p-5">
          {!selected ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {APPS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelected(a)}
                    className={cn(
                      "rounded-2xl bg-gradient-to-br p-4 text-left font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                      a.color,
                    )}
                  >
                    <div className="text-lg">{a.short}</div>
                    <div className="mt-1 text-xs font-normal text-white/85">{a.name}</div>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-center">
                <div className="text-[10px] uppercase tracking-[0.2em] text-amber-300/70">Numéro unique pour les dons</div>
                <div className="mt-1 text-2xl font-black tracking-wide">{PHONE_DISPLAY}</div>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => setSelected(null)} className="text-xs font-medium text-white/60 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
                ← Toutes les applications
              </button>
              <div className={cn("mt-3 rounded-2xl bg-gradient-to-br p-4", selected.color)}>
                <div className="text-xl font-black">{selected.name}</div>
                <div className="text-xs text-white/80">Suivez les étapes ci-dessous</div>
              </div>
              <ol className="mt-4 space-y-3">
                {selected.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white/80">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-5 flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/50">Numéro du don</div>
                  <div className="text-lg font-black">{PHONE_DISPLAY}</div>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
                  <CopyIcon className="h-4 w-4" /> {copyState === "ok" ? "Copié !" : copyState === "fail" ? "Copiez manuellement" : "Copier"}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {selected.ussd && (
                  <a
                    href={`tel:${selected.ussd.replace("#", "%23")}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-sm font-bold text-slate-900 transition hover:bg-white/90"
                  >
                    <PhoneIcon className="h-4 w-4" /> Composer {selected.ussd}
                  </a>
                )}
                <a
                  href={`https://wa.me/${PHONE_WA}?text=${encodeURIComponent("Bonjour Radio Aluwasio, je souhaite faire un don.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl bg-green-500 px-3 py-3 text-sm font-bold text-white transition hover:bg-green-400",
                    !selected.ussd && "col-span-2",
                  )}
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </>
          )}
          <p className="mt-5 text-center text-xs text-white/40">Merci beaucoup pour votre soutien 🙏</p>
        </div>
      </div>
    </div>
  );
}
