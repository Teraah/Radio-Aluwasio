import { logoGlobe } from "../assets";
import { APK_VERSION, APK_SIZE, APK_BACKUP_URL } from "../data/app";
import { useApkUrl } from "../hooks/useApkUrl";
import { GiftIcon, RadioIcon } from "./Icons";
import { isSafeHttpUrl } from "../utils/safe";
import { cn } from "../utils/cn";

const focus = "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

const STATS = [
  { value: "24h/24", label: "Diffusion continue" },
  { value: "4 + 1", label: "Radios disponibles" },
  { value: "100 %", label: "Gratuit & libre" },
];

/** Tous les textes de présentation sont regroupés ici (plus rien n'encombre l'accueil). */
export function AboutView({ onDonate, isNative }: { onDonate: () => void; isNative: boolean }) {
  const apkUrl = useApkUrl();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-8">
        <div className="flex items-start gap-4">
          <img src={logoGlobe} alt="" className="h-14 w-14 shrink-0 rounded-2xl bg-white object-cover shadow-lg" />
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Station indépendante · Togo 🇹🇬
            </span>
            <h1 className="mt-3 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
              La voix qui <span className="bg-gradient-to-r from-amber-300 via-rose-400 to-sky-400 bg-clip-text text-transparent">rassemble</span> le monde.
            </h1>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
          Musique, information et émissions communautaires, en direct depuis le Togo. Une radio libre, proche de vous, partout où vous êtes.
        </p>
        <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-5">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <div className="text-lg font-black sm:text-xl">{s.value}</div>
                <div className="mt-0.5 text-[10px] leading-tight text-white/45">{s.label}</div>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10">
          <RadioIcon className="h-5 w-5 text-amber-300" />
        </div>
        <h2 className="mt-4 text-lg font-bold">Notre histoire</h2>
        <p className="mt-3 text-sm leading-[1.85] text-white/65 sm:text-[15px]">
          Comme vous le savez, nous sommes une station de diffusion indépendante. Pour nous, il a toujours été
          difficile de maintenir notre diffusion sans votre soutien. Pour nous soutenir, veuillez cliquer sur le
          bouton <span className="font-semibold text-amber-300">Faire un don</span>, puis choisir l'application avec
          laquelle vous ferez un don. Merci beaucoup !
        </p>
        <p className="mt-3 text-xs text-white/40">Chaque contribution aide à garder l'antenne allumée, 24 heures sur 24.</p>
        <button onClick={onDonate} className={cn("mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:brightness-110 active:scale-95", focus)}>
          <GiftIcon className="h-4 w-4" /> Faire un don
        </button>
      </section>

      {/* Visible uniquement sur le web : dans l'APK, aucun bouton de téléchargement */}
      {!isNative && (
        <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-8">
          <h2 className="text-lg font-bold">Application Android</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Installez Radio Aluwasio en plein écran sur votre téléphone. Android 6.0 ou plus · version {APK_VERSION} · {APK_SIZE}.
          </p>
          <a
            href={apkUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={`RadioAluwasio-v${APK_VERSION}.apk`}
            className={cn("mt-4 flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-400 active:scale-95", focus)}
          >
            ⬇️ Télécharger l'APK directement
          </a>
          {isSafeHttpUrl(APK_BACKUP_URL) && (
            <a href={APK_BACKUP_URL} target="_blank" rel="noopener noreferrer" className={cn("mt-3 block text-center text-xs text-white/40 underline-offset-2 hover:text-white hover:underline", focus)}>
              Lien alternatif
            </a>
          )}
        </section>
      )}
    </div>
  );
}
