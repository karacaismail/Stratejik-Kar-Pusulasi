/**
 * @module MaterialLibrary
 * @description Malzeme kütüphanesi — sık kullanılan malzemeleri sakla ve autocomplete için sorgula
 */

import { save, load } from '../services/storage.js';

const STORAGE_KEY = 'malzeme_kutuphane';

/**
 * @typedef {Object} KutuphaneMalzeme
 * @property {string} id
 * @property {string} ad - Malzeme adı
 * @property {string} birim - kg, gr, lt, ml, adet, metre, cm
 * @property {number} birimFiyat - Son bilinen birim fiyat
 * @property {string} [kategori] - hammadde | ambalaj
 * @property {number} sonGuncelleme - timestamp
 */

/** Tüm malzemeleri getir @returns {KutuphaneMalzeme[]} */
export function getMalzemeKutuphanesi() {
  return load(STORAGE_KEY, []);
}

/** Malzeme kaydet/güncelle (ad bazlı eşleştirme) @param {KutuphaneMalzeme} malzeme */
export function saveMalzeme(malzeme) {
  const lib = getMalzemeKutuphanesi();
  const adNorm = malzeme.ad.trim().toLowerCase();

  // Aynı isimde varsa güncelle
  const idx = lib.findIndex((m) => m.ad.trim().toLowerCase() === adNorm);
  if (idx >= 0) {
    lib[idx] = { ...lib[idx], ...malzeme, sonGuncelleme: Date.now() };
  } else {
    lib.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ...malzeme,
      sonGuncelleme: Date.now(),
    });
  }
  save(STORAGE_KEY, lib);
}

/** Malzeme sil @param {string} id */
export function removeMalzeme(id) {
  const lib = getMalzemeKutuphanesi().filter((m) => m.id !== id);
  save(STORAGE_KEY, lib);
}

/**
 * Ada göre ara (autocomplete için)
 * @param {string} query - Arama metni
 * @param {number} [limit=8] - Maksimum sonuç
 * @returns {KutuphaneMalzeme[]}
 */
export function searchMalzeme(query, limit = 8) {
  if (!query || query.length < 2) return [];
  const q = query.trim().toLowerCase();
  return getMalzemeKutuphanesi()
    .filter((m) => m.ad.toLowerCase().includes(q))
    .sort((a, b) => {
      // Baştan eşleşenler önce
      const aStart = a.ad.toLowerCase().startsWith(q) ? 0 : 1;
      const bStart = b.ad.toLowerCase().startsWith(q) ? 0 : 1;
      return aStart - bStart || a.ad.localeCompare(b.ad, 'tr');
    })
    .slice(0, limit);
}

/**
 * Reçetedeki tüm malzemeleri kütüphaneye toplu ekle
 * @param {Array} hammaddeler
 * @param {Array} ambalajlar
 */
export function syncReceteMalzemeleri(hammaddeler = [], ambalajlar = []) {
  for (const m of hammaddeler) {
    if (m.ad && m.ad.trim()) {
      saveMalzeme({ ad: m.ad, birim: m.birim, birimFiyat: m.birimFiyat, kategori: 'hammadde' });
    }
  }
  for (const m of ambalajlar) {
    if (m.ad && m.ad.trim()) {
      saveMalzeme({ ad: m.ad, birim: m.birim, birimFiyat: m.birimFiyat, kategori: 'ambalaj' });
    }
  }
}

/** Kütüphaneyi tamamen temizle */
export function clearMalzemeKutuphanesi() {
  save(STORAGE_KEY, []);
}
