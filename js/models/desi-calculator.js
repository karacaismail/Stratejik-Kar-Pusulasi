/**
 * @module DesiCalculator
 * @description Desi (hacimsel ağırlık) hesaplayıcı
 */

import { DESI_KATSAYISI, MIN_DESI } from '../config/constants.js';

/**
 * @typedef {Object} DesiSonuc
 * @property {number} hacimselDesi - Ölçülerden hesaplanan desi
 * @property {number} agirlikDesi - Fiziksel ağırlık (kg)
 * @property {number} faturalanacakDesi - Kargo faturasında kullanılacak desi
 * @property {string} kaynak - 'hacimsel' veya 'agirlik'
 */

/**
 * Desi hesapla — en/boy/yükseklik ve ağırlıktan
 * @param {number} en - En (cm)
 * @param {number} boy - Boy (cm)
 * @param {number} yukseklik - Yükseklik (cm)
 * @param {number} agirlik - Ağırlık (kg)
 * @returns {DesiSonuc}
 */
export function hesaplaDesi(en, boy, yukseklik, agirlik) {
  const hacimsel = (en * boy * yukseklik) / DESI_KATSAYISI;
  const hacimselDesi = Math.max(hacimsel, MIN_DESI);
  const agirlikDesi = Math.max(agirlik, MIN_DESI);

  const faturalanacak = Math.max(hacimselDesi, agirlikDesi);
  const kaynak = hacimselDesi >= agirlikDesi ? 'hacimsel' : 'agirlik';

  return {
    hacimselDesi: round2(hacimselDesi),
    agirlikDesi: round2(agirlikDesi),
    faturalanacakDesi: round2(faturalanacak),
    kaynak,
  };
}

/**
 * 2 ondalık basamağa yuvarla
 * @param {number} n
 * @returns {number}
 */
function round2(n) {
  return Math.round(n * 100) / 100;
}
