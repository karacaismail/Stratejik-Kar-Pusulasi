/**
 * @module Sensitivity
 * @description Hassasiyet analizi — fiyat değişimlerinin net kara etkisi
 */

import { hesapla } from './calculation-engine.js';
import { HASSASIYET_ARALIK } from '../config/constants.js';

/**
 * @typedef {Object} HassasiyetSonucu
 * @property {string} parametre - Değiştirilen parametre adı
 * @property {number} asagiEtki - Düşüşte net kar değişimi
 * @property {number} yukariEtki - Artışta net kar değişimi
 */

/**
 * Hassasiyet analizi yap — her parametre için ±ARALIK% değişimde
 * net kar nasıl değişir
 * @param {Object} girdiler - Mevcut hesaplama girdileri
 * @returns {HassasiyetSonucu[]}
 */
export function analizEt(girdiler) {
  const baz = hesapla(girdiler);
  const aralik = HASSASIYET_ARALIK / 100;

  const parametreler = [
    { ad: 'Satış Fiyatı', alan: 'satisFiyati' },
    { ad: 'Alış Fiyatı', alan: 'alisFiyati' },
    { ad: 'Komisyon', alan: 'komisyonOrani' },
    { ad: 'Kargo', alan: 'kargoUcreti' },
    { ad: 'KDV', alan: 'kdvOrani' },
    { ad: 'İade Oranı', alan: 'iadeOrani' },
  ];

  return parametreler.map(p => {
    const deger = girdiler[p.alan] || 0;
    if (deger === 0) return null;

    const asagi = { ...girdiler, [p.alan]: deger * (1 - aralik) };
    const yukari = { ...girdiler, [p.alan]: deger * (1 + aralik) };

    return {
      parametre: p.ad,
      asagiEtki: hesapla(asagi).netKar - baz.netKar,
      yukariEtki: hesapla(yukari).netKar - baz.netKar,
    };
  }).filter(Boolean);
}

/**
 * Pazar karşılaştırma — aynı ürünü tüm pazarlarda hesapla
 * @param {Object} girdiler - Mevcut girdiler
 * @param {Object} komisyonTablosu - Pazar×kategori komisyon matrisi
 * @param {string} kategoriId - Kategori kimliği
 * @returns {Array<{pazar: string, netKar: number, netMarj: number}>}
 */
export function pazarKarsilastir(girdiler, komisyonTablosu, kategoriId) {
  return Object.entries(komisyonTablosu).map(([pazarId, komlar]) => {
    const test = {
      ...girdiler,
      komisyonOrani: komlar[kategoriId] ?? 0,
      odemeKomisyonu: pazarId === 'kendi_site' ? 3.49 : 0,
      stopajOrani: pazarId === 'kendi_site' ? 0 : 1,
    };

    const sonuc = hesapla(test);

    return {
      pazar: pazarId,
      netKar: sonuc.netKar,
      netMarj: sonuc.netMarj,
    };
  });
}
