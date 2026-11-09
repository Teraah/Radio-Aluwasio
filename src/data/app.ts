/**
 * Téléchargement de l'application Android (v1.5, signée).
 *
 * Stratégie « téléchargement direct » :
 * 1. APK_LOCAL : fichier servi à côté de index.html (dist/). Prioritaire, même origine,
 *    donc l'attribut `download` fonctionne et l'APK s'installe immédiatement sur mobile.
 * 2. APK_URL : lien DIRECT externe (Content-Disposition: attachment, type .apk).
 * 3. APK_BACKUP_URL : page de téléchargement permanente, en dernier recours.
 */
export const APK_LOCAL = "RadioAluwasio.apk";
export const APK_URL = "https://tmpfiles.org/dl/1794230373.55103c87c5525255/weAWW7cAhhZm/radioaluwasio-v1.5.apk";
export const APK_BACKUP_URL = "https://gofile.io/d/IMQb2wE3";
export const APK_VERSION = "1.5";
export const APK_SIZE = "5,4 Mo";
