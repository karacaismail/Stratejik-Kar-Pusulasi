/**
 * @module BomModel
 * @description BOM (Reçete) veri modeli — hammadde, ambalaj, işçilik
 */

import { save, load } from '../services/storage.js';

const STORAGE_KEY = 'receteler';

/**
 * @typedef {Object} Malzeme
 * @property {string} id - Benzersiz kimlik
 * @property {string} ad - Malzeme adı
 * @property {string} birim - Ölçü birimi (kg, gr, lt, adet, metre)
 * @property {number} miktar - Miktar
 * @property {number} birimFiyat - Birim fiyatı (TL)
 */

/**
 * @typedef {Object} Recete
 * @property {string} id - Benzersiz kimlik
 * @property {string} ad - Reçete adı
 * @property {Malzeme[]} hammaddeler
 * @property {Malzeme[]} ambalajlar
 * @property {number} iscilik - İşçilik/birim (TL)
 * @property {number} enerji - Enerji/birim (TL)
 * @property {number} depolama - Depolama/birim (TL)
 * @property {number} digerMasraf - Diğer masraflar (TL)
 * @property {number} ekstra - Ekstra masraflar (TL)
 * @property {number} olusturulma - Timestamp
 * @property {number} [guncelleme] - Son güncelleme timestamp
 * @property {Array} [versiyonlar] - Versiyon geçmişi
 */

/** Ölçü birimleri */
export const BIRIMLER = ['kg', 'gr', 'lt', 'ml', 'adet', 'metre', 'cm'];

/** Ön tanımlı ambalaj kategorileri */
export const AMBALAJ_KATEGORILERI = [
  'İç etiket', 'İç separatör', 'Dış kutu',
  'Streç film', 'Koli', 'Bant',
  'Şişe/Kavanoz', 'Özel ambalaj',
];

/**
 * Benzersiz kimlik oluştur
 * @returns {string}
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * Boş malzeme satırı oluştur
 * @param {string} [ad=''] - Varsayılan ad
 * @returns {Malzeme}
 */
export function createMalzeme(ad = '') {
  return { id: generateId(), ad, birim: 'adet', miktar: 1, birimFiyat: 0 };
}

/**
 * Boş reçete oluştur
 * @param {string} [ad='Yeni Reçete'] - Reçete adı
 * @returns {Recete}
 */
export function createRecete(ad = 'Yeni Reçete') {
  return {
    id: generateId(),
    ad,
    hammaddeler: [createMalzeme()],
    ambalajlar: [],
    iscilik: 0,
    enerji: 0,
    depolama: 0,
    digerMasraf: 0,
    ekstra: 0,
    olusturulma: Date.now(),
  };
}

/**
 * Malzeme toplam tutarını hesapla
 * @param {Malzeme} m
 * @returns {number}
 */
export function malzemeToplam(m) {
  return (m.miktar || 0) * (m.birimFiyat || 0);
}

/**
 * Reçetenin toplam birim maliyetini hesapla
 * @param {Recete} recete
 * @returns {{hammadde: number, ambalaj: number, iscilik: number, toplam: number}}
 */
export function hesaplaBirimMaliyet(recete) {
  const hammadde = recete.hammaddeler.reduce((t, m) => t + malzemeToplam(m), 0);
  const ambalaj = recete.ambalajlar.reduce((t, m) => t + malzemeToplam(m), 0);
  const iscilik = (recete.iscilik || 0) + (recete.enerji || 0) + (recete.depolama || 0) + (recete.digerMasraf || 0) + (recete.ekstra || 0);
  const toplam = hammadde + ambalaj + iscilik;

  return {
    hammadde: round2(hammadde),
    ambalaj: round2(ambalaj),
    iscilik: round2(iscilik),
    toplam: round2(toplam),
  };
}

/**
 * Reçeteyi localStorage'a kaydet
 * @param {Recete} recete
 */
export function kaydetRecete(recete) {
  const list = load(STORAGE_KEY, []);
  const idx = list.findIndex(r => r.id === recete.id);
  if (idx >= 0) {
    list[idx] = recete;
  } else {
    list.push(recete);
  }
  save(STORAGE_KEY, list);
}

/**
 * Tüm reçeteleri yükle
 * @returns {Recete[]}
 */
export function yukleReceteler() {
  return load(STORAGE_KEY, []);
}

/**
 * Reçete sil
 * @param {string} id - Reçete kimliği
 */
export function silRecete(id) {
  const list = load(STORAGE_KEY, []).filter(r => r.id !== id);
  save(STORAGE_KEY, list);
}

/**
 * Reçeteyi versiyonlu olarak kaydet — mevcut durumu versiyonlar dizisine ekle
 * @param {Recete} recete
 */
export function kaydetReceteVersion(recete) {
  if (!recete.versiyonlar) recete.versiyonlar = [];

  // Mevcut durumu snapshot olarak versiyonlara ekle
  recete.versiyonlar.push({
    tarih: Date.now(),
    hammaddeler: JSON.parse(JSON.stringify(recete.hammaddeler)),
    ambalajlar: JSON.parse(JSON.stringify(recete.ambalajlar)),
    iscilik: recete.iscilik,
    enerji: recete.enerji,
    depolama: recete.depolama,
    digerMasraf: recete.digerMasraf,
    ekstra: recete.ekstra,
    maliyet: hesaplaBirimMaliyet(recete).toplam,
  });

  // Maksimum 20 versiyon tut
  if (recete.versiyonlar.length > 20) {
    recete.versiyonlar = recete.versiyonlar.slice(-20);
  }

  recete.guncelleme = Date.now();
  kaydetRecete(recete);
}

/**
 * Belirli bir versiyonu geri yükle
 * @param {string} receteId
 * @param {number} versiyonIdx - versiyonlar dizisindeki index
 * @returns {Recete|null}
 */
export function geriYukleVersiyon(receteId, versiyonIdx) {
  const list = load(STORAGE_KEY, []);
  const recete = list.find(r => r.id === receteId);
  if (!recete || !recete.versiyonlar?.[versiyonIdx]) return null;

  const v = recete.versiyonlar[versiyonIdx];
  recete.hammaddeler = JSON.parse(JSON.stringify(v.hammaddeler));
  recete.ambalajlar = JSON.parse(JSON.stringify(v.ambalajlar));
  recete.iscilik = v.iscilik;
  recete.enerji = v.enerji;
  recete.depolama = v.depolama;
  recete.digerMasraf = v.digerMasraf;
  recete.ekstra = v.ekstra;
  recete.guncelleme = Date.now();

  const idx = list.findIndex(r => r.id === receteId);
  list[idx] = recete;
  save(STORAGE_KEY, list);
  return recete;
}

/**
 * 2 ondalığa yuvarla
 * @param {number} n
 * @returns {number}
 */
function round2(n) {
  return Math.round(n * 100) / 100;
}
