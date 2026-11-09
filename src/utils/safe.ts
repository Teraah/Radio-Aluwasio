/** N'autorise que des flux HTTPS : évite le contenu mixte et les schémas dangereux. */
export function isSafeStreamUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && !u.username && !u.password;
  } catch {
    return false;
  }
}

/** Liens externes : HTTPS uniquement (ou schémas téléphone explicitly acceptés). */
export function isSafeHttpUrl(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

/** Copie dans le presse-papiers avec repli manuel si l'API est indisponible/refusée. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* on tente le repli ci-dessous */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** Partage natif avec repli copie du lien, sans jamais lever d'exception non gérée. */
export async function shareOrCopy(data: { title: string; text: string; url: string }): Promise<"shared" | "copied" | "failed"> {
  try {
    if (navigator.share) {
      await navigator.share(data);
      return "shared";
    }
  } catch {
    /* annulation ou indisponibilité : on copie */
  }
  return (await copyText(data.url)) ? "copied" : "failed";
}
