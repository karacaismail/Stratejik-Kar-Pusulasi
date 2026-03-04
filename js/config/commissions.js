/**
 * @module Commissions
 * @description Pazar yeri komisyon tablosu (5 pazar × 24 kategori)
 */

/**
 * Komisyon oranları: pazarYeri × kategori → yüzde (%)
 * @type {Object<string, Object<string, number>>}
 */
export const KOMISYON_TABLOSU = Object.freeze({
  trendyol: {
    giyim: 21.5, elektronik: 12, kozmetik: 16, ev_yasam: 18, gida: 14,
    kitap: 15, spor: 18, oyuncak: 16, otomotiv: 14,
    aksesuar: 20, anne_bebek: 16, ayakkabi: 21, bilgisayar: 11,
    beyaz_esya: 10, canta: 21, cep_telefonu: 5.5, ev_tekstil: 18,
    hobi: 16, kisisel_bakim: 16, mobilya: 15, mucevher: 18,
    pet: 16, saat: 17, diger: 18,
  },
  hepsiburada: {
    giyim: 18, elektronik: 8, kozmetik: 15, ev_yasam: 16, gida: 12,
    kitap: 14, spor: 16, oyuncak: 14, otomotiv: 12,
    aksesuar: 17, anne_bebek: 14, ayakkabi: 18, bilgisayar: 7,
    beyaz_esya: 6, canta: 18, cep_telefonu: 4, ev_tekstil: 16,
    hobi: 14, kisisel_bakim: 15, mobilya: 12, mucevher: 16,
    pet: 14, saat: 15, diger: 15,
  },
  n11: {
    giyim: 16, elektronik: 8, kozmetik: 14, ev_yasam: 14, gida: 10,
    kitap: 12, spor: 14, oyuncak: 12, otomotiv: 10,
    aksesuar: 15, anne_bebek: 12, ayakkabi: 16, bilgisayar: 7,
    beyaz_esya: 6, canta: 16, cep_telefonu: 5, ev_tekstil: 14,
    hobi: 12, kisisel_bakim: 14, mobilya: 10, mucevher: 14,
    pet: 12, saat: 13, diger: 12,
  },
  amazon_tr: {
    giyim: 17, elektronik: 10, kozmetik: 15, ev_yasam: 15, gida: 10,
    kitap: 15, spor: 15, oyuncak: 15, otomotiv: 12,
    aksesuar: 16, anne_bebek: 13, ayakkabi: 17, bilgisayar: 8,
    beyaz_esya: 8, canta: 17, cep_telefonu: 7, ev_tekstil: 15,
    hobi: 15, kisisel_bakim: 15, mobilya: 13, mucevher: 15,
    pet: 15, saat: 15, diger: 15,
  },
  kendi_site: {
    giyim: 0, elektronik: 0, kozmetik: 0, ev_yasam: 0, gida: 0,
    kitap: 0, spor: 0, oyuncak: 0, otomotiv: 0,
    aksesuar: 0, anne_bebek: 0, ayakkabi: 0, bilgisayar: 0,
    beyaz_esya: 0, canta: 0, cep_telefonu: 0, ev_tekstil: 0,
    hobi: 0, kisisel_bakim: 0, mobilya: 0, mucevher: 0,
    pet: 0, saat: 0, diger: 0,
  },
});

/** Pazar yeri görüntüleme adları */
export const PAZAR_ADLARI = Object.freeze({
  trendyol: 'Trendyol',
  hepsiburada: 'Hepsiburada',
  n11: 'N11',
  amazon_tr: 'Amazon TR',
  kendi_site: 'Kendi Sitem',
});

/** Pazar yeri ikon sınıfları (Tabler) */
export const PAZAR_IKONLARI = Object.freeze({
  trendyol: 'ti-brand-tidal',
  hepsiburada: 'ti-basket',
  n11: 'ti-shopping-cart',
  amazon_tr: 'ti-brand-amazon',
  kendi_site: 'ti-world-www',
});

/** Pazar yeri ID listesi */
export const PAZAR_LISTESI = Object.keys(PAZAR_ADLARI);

/**
 * Belirli pazar+kategori için komisyon oranını getir
 * @param {string} pazarId - Pazar yeri kimliği
 * @param {string} kategoriId - Kategori kimliği
 * @returns {number} Komisyon oranı (%)
 */
export function getKomisyon(pazarId, kategoriId) {
  const pazar = KOMISYON_TABLOSU[pazarId];
  if (!pazar) return 0;
  return pazar[kategoriId] ?? 0;
}
