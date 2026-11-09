import { cn } from "../utils/cn";
import { logoGlobe } from "../assets";

/** Logo officiel Radio Aluwasio (image réelle, avec texte intégré). */
export function Logo({ spinning = false, className }: { spinning?: boolean; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className={cn("overflow-hidden rounded-full bg-white shadow-xl", spinning && "animate-[spin_30s_linear_infinite]")}>
        <img src={logoGlobe} alt="" className="h-full w-full object-cover" draggable={false} />
      </div>
    </div>
  );
}
