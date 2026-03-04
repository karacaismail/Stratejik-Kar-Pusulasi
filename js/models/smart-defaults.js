/**
 * @module SmartDefaults
 * @description Akıllı varsayımlar — kategori+pazar seçimine göre otomatik değerler
 */

import { KATEGORILER } from '../config/categories.js';
import { getKomisyonTablosu, getVergiParams } from '../config/config-manager.js';

/**
 * @typedef {Object} VarsayilanDegerler
 * @property {number} kargo - Kargo ücreti (TL)
 * @property {number} ambalaj - Ambalaj gideri (TL)
 * @property {number} kdv - KDV oranı (%)
 * @property {number} iadeOran - İade oranı (%)
 * @property {number} iadeKargo - İade kargo ücreti (TL)
 * @property {number} komisyon - Komisyon oranı (%)
 * @property {number} odeme - Ödeme komisyonu (%)
 * @property {number} stopaj - Stopaj oranı (%)
 * @property {number} gelirVergisi - Gelir vergisi dilimi (%)
 */

/**
 * Kategori ve pazar yeri seçimine göre varsayılan değerleri hesapla
 * @param {string} kategoriId - Kategori kimliği
 * @param {string} [pazarId] - Pazar yeri kimliği
 * @returns {VarsayilanDegerler}
 */
export function getDefaults(kategoriId, pazarId) {
  const kat = KATEGORILER[kategoriId] || KATEGORILER.diger;
  const vergi = getVergiParams();

  /* Anahtarlar COST_ITEMS key'leri ile uyumlu (snake_case) */
  const defaults = {
    kargo: kat.kargo,
    ambalaj: kat.ambalaj,
    kdv: kat.kdv,
    iade_orani: kat.iade,
    iade_kargo: kat.kargo,
    komisyon: 0,
    odeme_komisyonu: 0,
    stopaj: vergi.stopajOrani,
    gelir_vergisi: 15,
  };

  if (!pazarId) return defaults;

  if (pazarId === 'kendi_site') {
    defaults.komisyon = 0;
    defaults.odeme_komisyonu = vergi.odemeKomisyonu;
    defaults.stopaj = 0;
  } else {
    const komTablosu = getKomisyonTablosu();
    const pazarKom = komTablosu[pazarId];
    defaults.komisyon = pazarKom?.[kategoriId] ?? 0;
    defaults.odeme_komisyonu = 0;
    defaults.stopaj = vergi.stopajOrani;
  }

  return defaults;
}

/**
 * Tüm maliyet kalemleri alanlarının listesini döndür
 * @returns {string[]}
 */
export function getDefaultFieldNames() {
  return [
    'kargo', 'ambalaj', 'kdv', 'iade_orani',
    'iade_kargo', 'komisyon', 'odeme_komisyonu',
  ];
}
