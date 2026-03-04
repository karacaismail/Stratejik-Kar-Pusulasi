/**
 * @module Constants
 * @description Uygulama geneli sabit değerler
 */

/** E-ticaret stopaj oranı (%, Ocak 2025 itibariyle) */
export const STOPAJ_ORANI = 1;

/** Ödeme komisyonu varsayılanı (%, kendi site için) */
export const ODEME_KOMISYONU = 3.49;

/** Desi hesaplaması katsayısı */
export const DESI_KATSAYISI = 3000;

/** Minimum desi değeri */
export const MIN_DESI = 1;

/** Debounce gecikmesi (ms) */
export const DEBOUNCE_MS = 150;

/** Hassasiyet analizi aralığı (%) */
export const HASSASIYET_ARALIK = 10;

/** Hesaplama modları */
export const HESAP_MODLARI = Object.freeze({
  SATIS_TUTARINA_GORE: 1,
  KAR_MIKTARINA_GORE: 2,
  KAR_MARJINA_GORE: 3,
  KAR_ORANINA_GORE: 4,
});

/** Hesaplama modu etiketleri */
export const MOD_ETIKETLERI = Object.freeze({
  [HESAP_MODLARI.SATIS_TUTARINA_GORE]: 'Satış Tutarına Göre',
  [HESAP_MODLARI.KAR_MIKTARINA_GORE]: 'Kar Miktarına Göre',
  [HESAP_MODLARI.KAR_MARJINA_GORE]: 'Kar Marjına Göre',
  [HESAP_MODLARI.KAR_ORANINA_GORE]: 'Kar Oranına Göre',
});

/** Gelir vergisi dilimleri (2025) */
export const GELIR_VERGISI_DILIMLERI = Object.freeze([
  { limit: 110000,   oran: 15 },
  { limit: 230000,   oran: 20 },
  { limit: 580000,   oran: 27 },
  { limit: 3000000,  oran: 35 },
  { limit: Infinity, oran: 40 },
]);

/** KDV oranları */
export const KDV_ORANLARI = Object.freeze([1, 10, 20]);

/** Binary search iterasyon limiti (Mod 2 için) */
export const BINARY_SEARCH_LIMIT = 50;

/** Binary search hassasiyet eşiği */
export const BINARY_SEARCH_ESIK = 0.01;
