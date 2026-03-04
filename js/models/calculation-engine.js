/**
 * @module CalculationEngine
 * @description HesapMotoru — 4 mod, Decimal.js hassasiyet, başabaş analizi
 */

import { D, safeDivide, percent, toNum } from '../utils/decimal-helpers.js';
import {
  HESAP_MODLARI, BINARY_SEARCH_LIMIT, BINARY_SEARCH_ESIK,
} from '../config/constants.js';

/** @typedef {Object} HesapGirdileri - Hesaplama girdileri (alisFiyati, satisFiyati, hesapModu, hedefDeger vb.) */

/** Hesaplama moduna göre satış fiyatını belirle */
export function belirleSatisFiyati(g) {
  const mod = g.hesapModu || HESAP_MODLARI.SATIS_TUTARINA_GORE;
  const alis = D(g.alisFiyati);

  switch (mod) {
    case HESAP_MODLARI.SATIS_TUTARINA_GORE:
      return g.satisFiyati;

    case HESAP_MODLARI.KAR_MIKTARINA_GORE:
      return binarySearchSatis(g);

    case HESAP_MODLARI.KAR_MARJINA_GORE: {
      const marj = D(g.hedefDeger);
      return toNum(marj.times(alis).div(100).plus(alis));
    }

    case HESAP_MODLARI.KAR_ORANINA_GORE: {
      const oran = D(g.hedefDeger);
      if (oran.gte(100)) return toNum(alis.times(20));
      return toNum(D(100).times(alis).div(D(100).minus(oran)));
    }

    default:
      return g.satisFiyati;
  }
}

/**
 * Ana hesaplama fonksiyonu — tüm maliyetleri hesaplar
 * @param {HesapGirdileri} g - Girdiler
 * @returns {Object} Hesaplama sonuçları
 */
export function hesapla(g) {
  const alis = D(g.alisFiyati);
  const satis = D(g.satisFiyati);

  /* 1. Efektif fiyat (kampanya + indirim düşülmüş) */
  let efCarpan = D(1)
    .minus(D(g.kampanyaOrani).div(100))
    .minus(D(g.indirimOrani).div(100));
  if (efCarpan.isNegative()) efCarpan = D(0);
  const efektif = satis.times(efCarpan);

  /* 2-4. Oransal maliyetler */
  const komisyonT = percent(efektif, g.komisyonOrani);
  const odemeT = percent(efektif, g.odemeKomisyonu);
  const stopajT = percent(efektif, g.stopajOrani);

  /* 5. KDV (fiyata dahil — tersine hesaplama) */
  const kdvO = D(g.kdvOrani);
  const kdvT = efektif.times(kdvO).div(kdvO.plus(100));

  /* 6. Sabit maliyetler */
  const kargo = D(g.kargoUcreti);
  const ambalaj = D(g.ambalajGideri);
  const reklam = D(g.reklamGideri);
  const depo = D(g.depolamaGideri);
  const iscilik = D(g.iscilikGideri);
  const ekstra = D(g.ekstraMasraf);

  /* 7. Matrah (gelir vergisi matrahı) */
  const matrah = efektif
    .minus(kdvT).minus(alis).minus(komisyonT)
    .minus(kargo).minus(ambalaj).minus(odemeT)
    .minus(stopajT).minus(reklam).minus(depo)
    .minus(iscilik).minus(ekstra);

  /* 8. Gelir vergisi */
  const gvD = D(g.gelirVergisiDilimi);
  const gelirV = matrah.isPositive() ? matrah.times(gvD).div(100) : D(0);

  /* 9. İade maliyeti (birim başına amortize) */
  const iadeM = D(g.iadeOrani).div(100).times(D(g.iadeKargoUcreti));

  /* 10. Toplam maliyet */
  const toplam = alis.plus(komisyonT).plus(kargo).plus(ambalaj)
    .plus(odemeT).plus(stopajT).plus(kdvT).plus(gelirV)
    .plus(reklam).plus(depo).plus(iscilik).plus(ekstra);

  /* 11. Net kar */
  const netKar = efektif.minus(toplam);
  const netKarIade = netKar.minus(iadeM);
  const brutKar = efektif.minus(alis);

  /* 12. Marjlar */
  const z = D(0);
  const netMarj = safeDivide(netKar, efektif, z).times(100);
  const netMarjIade = safeDivide(netKarIade, efektif, z).times(100);
  const brutMarj = safeDivide(brutKar, efektif, z).times(100);
  const roi = safeDivide(netKar, toplam, z).times(100);

  /* 13. Başabaş fiyatı */
  const basabas = hesaplaBasabas(g, efCarpan, kdvO);

  /* 14. Aylık kar */
  const aylikAdet = D(g.aylikSatisAdedi);
  const aylikNet = aylikAdet.isPositive() ? netKarIade.times(aylikAdet) : z;

  /* 15. Güvenlik marjı */
  const guvenlik = (basabas.isPositive() && satis.isPositive())
    ? satis.minus(basabas).div(satis).times(100) : z;

  /* 16. Kar/maliyet oranı */
  const karMaliyet = safeDivide(netKar, toplam, z).times(100);

  /* 16b. Kar oranı (net kar / alış fiyatı) */
  const karOrani = alis.isPositive() ? netKar.div(alis).times(100) : z;

  /* 17. Maliyet kalemleri (grafik için) */
  const kalemler = buildKalemler({
    alis, komisyonT, kargo, kdvT, stopajT, odemeT,
    gelirV, ambalaj, iadeM, reklam, depo, iscilik, ekstra,
  });

  return {
    efektifFiyat: toNum(efektif), komisyonTutar: toNum(komisyonT),
    odemeTutar: toNum(odemeT), stopajTutar: toNum(stopajT),
    kdvTutar: toNum(kdvT), gelirVergisi: toNum(gelirV),
    iadeMaliyeti: toNum(iadeM), toplamMaliyet: toNum(toplam),
    netKar: toNum(netKar), netKarIadeDahil: toNum(netKarIade),
    brutKar: toNum(brutKar), netMarj: toNum(netMarj),
    netMarjIade: toNum(netMarjIade), brutMarj: toNum(brutMarj),
    roi: toNum(roi), basabasFiyat: toNum(basabas),
    aylikNetKar: toNum(aylikNet), birimMaliyet: toNum(toplam),
    guvenlikMarji: toNum(guvenlik), karMaliyet: toNum(karMaliyet), karOrani: toNum(karOrani),
    maliyetKalemleri: kalemler, matrah: toNum(matrah),
    _alis: toNum(alis), _kargo: toNum(kargo),
    _ambalaj: toNum(ambalaj), _reklam: toNum(reklam),
    _depolama: toNum(depo), _iscilik: toNum(iscilik),
    _ekstra: toNum(ekstra),
  };
}

/** Başabaş fiyatı (cebirsel çözüm) */
function hesaplaBasabas(g, efCarpan, kdvO) {
  const oranTop = D(g.komisyonOrani).plus(D(g.odemeKomisyonu)).plus(D(g.stopajOrani))
    .div(100).plus(kdvO.div(kdvO.plus(100)));
  const sabitTop = D(g.alisFiyati).plus(D(g.kargoUcreti)).plus(D(g.ambalajGideri))
    .plus(D(g.reklamGideri)).plus(D(g.depolamaGideri)).plus(D(g.iscilikGideri)).plus(D(g.ekstraMasraf));
  const netCarp = D(1).minus(oranTop);
  return (netCarp.isPositive() && efCarpan.isPositive()) ? sabitTop.div(netCarp).div(efCarpan) : D(0);
}

/** Mod 2: Binary search — hedef net kara ulaşan satış fiyatı */
function binarySearchSatis(g) {
  const hedef = D(g.hedefDeger);
  let lo = D(g.alisFiyati), hi = lo.times(20);
  for (let i = 0; i < BINARY_SEARCH_LIMIT; i++) {
    const mid = lo.plus(hi).div(2);
    const s = hesapla({ ...g, satisFiyati: toNum(mid), hesapModu: 1 });
    if (D(s.netKar).minus(hedef).abs().lte(BINARY_SEARCH_ESIK)) return toNum(mid);
    if (D(s.netKar).lt(hedef)) lo = mid; else hi = mid;
  }
  return toNum(lo.plus(hi).div(2));
}

/** Maliyet kalemlerini grafik dizisine dönüştür */
function buildKalemler(c) {
  return [
    ['Alış', c.alis, '#6366f1'], ['Komisyon', c.komisyonT, '#f59e0b'],
    ['Kargo', c.kargo, '#3b82f6'], ['KDV', c.kdvT, '#ef4444'],
    ['Stopaj', c.stopajT, '#8b5cf6'], ['Ödeme K.', c.odemeT, '#ec4899'],
    ['G.Vergisi', c.gelirV, '#f97316'], ['Ambalaj', c.ambalaj, '#14b8a6'],
    ['İade', c.iadeM, '#a855f7'], ['Reklam', c.reklam, '#06b6d4'],
    ['Depo', c.depo, '#84cc16'], ['İşçilik', c.iscilik, '#eab308'],
    ['Ekstra', c.ekstra, '#64748b'],
  ].map(([ad, tutar, renk]) => ({ ad, tutar: toNum(tutar), renk }))
   .filter(k => k.tutar > 0.005);
}
