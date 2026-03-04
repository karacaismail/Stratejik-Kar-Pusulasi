/**
 * @module ConfigManager
 * @description Hardcoded defaults + localStorage override birleştirme katmanı.
 * Parametreler sayfasından kaydedilen kullanıcı ayarlarını okur,
 * yoksa config dosyalarındaki varsayılanları döndürür.
 */

import { KARGO_FIRMALARI, KARGO_LISTESI, hesaplaKargoUcreti as _hesaplaKargo } from './cargo-companies.js';
import { KOMISYON_TABLOSU, PAZAR_ADLARI, PAZAR_LISTESI, PAZAR_IKONLARI } from './commissions.js';
import { KATEGORILER, KATEGORI_LISTESI } from './categories.js';
import { STOPAJ_ORANI, ODEME_KOMISYONU } from './constants.js';
import { load, save, remove } from '../services/storage.js';

/** localStorage anahtar sabitleri */
const KEYS = {
  kargo: 'param_kargo',
  komisyon: 'param_komisyon',
  vergi: 'param_vergi',
};

/* ════════════════════════════════════════
 *  GETTER — Effective config (default + override)
 * ════════════════════════════════════════ */

/**
 * Kargo firmalarını override'larla birleştir
 * @returns {Object<string, import('./cargo-companies.js').KargoFirmasi>}
 */
export function getKargoFirmalari() {
  const overrides = load(KEYS.kargo, {});
  const result = {};
  for (const [id, defaults] of Object.entries(KARGO_FIRMALARI)) {
    result[id] = { ...defaults, ...(overrides[id] || {}) };
  }
  return result;
}

/**
 * Kargo firma listesini döndür
 * @returns {string[]}
 */
export function getKargoListesi() {
  return KARGO_LISTESI;
}

/**
 * Override'lı fiyatla kargo ücretini hesapla
 * @param {string} firmaId
 * @param {number} desi
 * @returns {number}
 */
export function hesaplaKargoUcreti(firmaId, desi) {
  const firmalar = getKargoFirmalari();
  const firma = firmalar[firmaId];
  if (!firma) return 0;
  const efektifDesi = Math.max(desi, firma.minDesi || 1);
  return firma.varsayilanUcret + ((efektifDesi - 1) * firma.desiUcret);
}

/**
 * Komisyon tablosunu override'larla birleştir
 * @returns {Object<string, Object<string, number>>}
 */
export function getKomisyonTablosu() {
  const overrides = load(KEYS.komisyon, {});
  const result = {};
  for (const [pazarId, defaults] of Object.entries(KOMISYON_TABLOSU)) {
    result[pazarId] = { ...defaults, ...(overrides[pazarId] || {}) };
  }
  return result;
}

/**
 * Vergi/kesinti parametrelerini döndür
 * @returns {{ stopajOrani: number, odemeKomisyonu: number }}
 */
export function getVergiParams() {
  const overrides = load(KEYS.vergi, {});
  return {
    stopajOrani: overrides.stopajOrani ?? STOPAJ_ORANI,
    odemeKomisyonu: overrides.odemeKomisyonu ?? ODEME_KOMISYONU,
  };
}

/* Re-export unchanged configs */
export { KATEGORILER, KATEGORI_LISTESI, PAZAR_ADLARI, PAZAR_LISTESI, PAZAR_IKONLARI };

/* ════════════════════════════════════════
 *  SETTER — Parametreler sayfası kaydetme
 * ════════════════════════════════════════ */

/** @param {Object} data - { yurtici: { varsayilanUcret: 32, desiUcret: 8 }, ... } */
export function saveKargoOverrides(data) { save(KEYS.kargo, data); }

/** @param {Object} data - { trendyol: { giyim: 22, ... }, ... } */
export function saveKomisyonOverrides(data) { save(KEYS.komisyon, data); }

/** @param {Object} data - { stopajOrani: 1, odemeKomisyonu: 3.49 } */
export function saveVergiOverrides(data) { save(KEYS.vergi, data); }

/** Tüm override'ları sıfırla */
export function resetAllOverrides() {
  remove(KEYS.kargo);
  remove(KEYS.komisyon);
  remove(KEYS.vergi);
}
