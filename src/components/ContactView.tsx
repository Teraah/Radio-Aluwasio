import { PHONE_DISPLAY, PHONE_RAW, PHONE_WA } from "./DonateModal";
import { PhoneIcon, WhatsAppIcon } from "./Icons";
import { cn } from "../utils/cn";

const focus = "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";
const wa = `https://wa.me/${PHONE_WA}?text=${encodeURIComponent("Bonjour Radio Aluwasio !")}`;

export function ContactView() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-8">
        <h1 className="text-xl font-black">Restons en contact</h1>
        <p className="mt-2 text-sm text-white/55">Une question, une annonce, un partenariat ? Nous sommes à votre écoute.</p>
        <div className="mt-5 grid gap-3">
          <a href={`tel:${PHONE_RAW}`} className={cn("flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 transition hover:bg-white/[0.08]", focus)}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300"><PhoneIcon className="h-5 w-5" /></span>
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">Appelez-nous</span>
              <span className="block truncate text-base font-bold">{PHONE_DISPLAY}</span>
            </span>
          </a>
          <a href={wa} target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 transition hover:bg-white/[0.08]", focus)}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300"><WhatsAppIcon className="h-5 w-5" /></span>
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">WhatsApp</span>
              <span className="block truncate text-base font-bold">{PHONE_DISPLAY}</span>
            </span>
          </a>
        </div>
      </section>

      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-8">
        <h2 className="text-base font-bold">Publicité & partenariats</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          Vous représentez une radio ou une entreprise et souhaitez être mis en avant dans l'application ?
          Contactez-nous au <span className="font-semibold text-white/80">{PHONE_DISPLAY}</span>.
        </p>
      </section>
    </div>
  );
}
