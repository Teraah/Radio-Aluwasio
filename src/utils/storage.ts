/** Accès localStorage tolérant aux navigateurs qui le bloquent (mode privé, WebView restreint). */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* stockage indisponible : fonctionnalité dégradée, pas de plantage */
  }
}

export function readNumber(key: string, fallback: number, min = 0, max = 1): number {
  const raw = readStorage(key);
  if (raw === null) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}
