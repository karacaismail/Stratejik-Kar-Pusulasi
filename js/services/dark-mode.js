/**
 * @module DarkMode
 * @description Karanlık mod yönetimi (sistem tercihi + kullanıcı seçimi)
 */

import { save, load } from './storage.js';

const STORAGE_KEY = 'dark_mode';
const CLASS_NAME = 'dark';

/**
 * Karanlık modu başlat — kayıtlı tercih veya sistem tercihi uygula
 */
export function initDarkMode() {
  const stored = load(STORAGE_KEY, null);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = stored !== null ? stored : prefersDark;

  applyTheme(isDark);
  listenSystemChanges();
}

/**
 * Karanlık modu aç/kapat
 * @returns {boolean} Yeni durum (true = karanlık)
 */
export function toggleDarkMode() {
  const isDark = !document.documentElement.classList.contains(CLASS_NAME);
  applyTheme(isDark);
  save(STORAGE_KEY, isDark);
  return isDark;
}

/**
 * Mevcut karanlık mod durumunu döndür
 * @returns {boolean}
 */
export function isDark() {
  return document.documentElement.classList.contains(CLASS_NAME);
}

/**
 * Temayı uygula
 * @param {boolean} dark - Karanlık mod aktif mi
 */
function applyTheme(dark) {
  document.documentElement.classList.toggle(CLASS_NAME, dark);

  /* Tailwind CDN dark modu için meta etiket güncelle */
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) {
    meta.content = dark ? 'dark' : 'light';
  }
}

/**
 * Sistem tercihindeki değişiklikleri dinle
 * (Kullanıcı manuel seçim yapmadıysa otomatik takip)
 */
function listenSystemChanges() {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  mq.addEventListener('change', (e) => {
    const stored = load(STORAGE_KEY, null);
    if (stored === null) {
      applyTheme(e.matches);
    }
  });
}
