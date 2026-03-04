/**
 * @module CargoCompanies
 * @description Türk kargo firmaları ve varsayılan ücretleri
 */

/**
 * @typedef {Object} KargoFirmasi
 * @property {string} ad - Firma adı
 * @property {string} ikon - Tabler ikon sınıfı
 * @property {number} varsayilanUcret - Varsayılan kargo ücreti (TL)
 * @property {number} desiUcret - Desi başına ücret (TL)
 * @property {number} minDesi - Minimum desi
 */

/** @type {Object<string, KargoFirmasi>} */
export const KARGO_FIRMALARI = Object.freeze({
  yurtici: {
    ad: 'Yurtiçi Kargo',
    ikon: 'ti-truck-delivery',
    varsayilanUcret: 30,
    desiUcret: 7.5,
    minDesi: 1,
  },
  aras: {
    ad: 'Aras Kargo',
    ikon: 'ti-truck',
    varsayilanUcret: 28,
    desiUcret: 7,
    minDesi: 1,
  },
  mng: {
    ad: 'MNG Kargo',
    ikon: 'ti-package',
    varsayilanUcret: 27,
    desiUcret: 6.5,
    minDesi: 1,
  },
  surat: {
    ad: 'Sürat Kargo',
    ikon: 'ti-bolt',
    varsayilanUcret: 29,
    desiUcret: 7,
    minDesi: 1,
  },
  ptt: {
    ad: 'PTT Kargo',
    ikon: 'ti-mail',
    varsayilanUcret: 25,
    desiUcret: 6,
    minDesi: 1,
  },
  dhl: {
    ad: 'DHL',
    ikon: 'ti-plane',
    varsayilanUcret: 45,
    desiUcret: 12,
    minDesi: 1,
  },
  ups: {
    ad: 'UPS',
    ikon: 'ti-box',
    varsayilanUcret: 40,
    desiUcret: 10,
    minDesi: 1,
  },
});

/** Kargo firma ID listesi */
export const KARGO_LISTESI = Object.keys(KARGO_FIRMALARI);

/**
 * Desi değerine göre kargo ücretini hesapla
 * @param {string} firmaId - Kargo firma kimliği
 * @param {number} desi - Desi değeri
 * @returns {number} Hesaplanan kargo ücreti (TL)
 */
export function hesaplaKargoUcreti(firmaId, desi) {
  const firma = KARGO_FIRMALARI[firmaId];
  if (!firma) return 0;

  const efektifDesi = Math.max(desi, firma.minDesi);
  return firma.varsayilanUcret + ((efektifDesi - 1) * firma.desiUcret);
}
