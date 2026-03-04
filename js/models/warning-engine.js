/**
 * @module WarningEngine
 * @description UyarıMotoru — 8+ uyarı kuralı, tip bazlı sınıflandırma
 */

import { formatMoney, formatPercent } from '../services/formatter.js';

/**
 * @typedef {'tehlike'|'uyari'|'bilgi'|'basari'} UyariTipi
 *
 * @typedef {Object} Uyari
 * @property {UyariTipi} tip
 * @property {string} mesaj
 * @property {string} oneri
 * @property {string} ikon - Tabler ikon sınıfı
 */

/** Uyarı tiplerine göre Tabler ikon eşlemeleri */
const TIP_IKONLARI = {
  tehlike: 'ti-alert-triangle',
  uyari: 'ti-alert-circle',
  bilgi: 'ti-info-circle',
  basari: 'ti-circle-check',
};

/**
 * Sonuç ve girdileri analiz ederek uyarı listesi oluştur
 * @param {Object} s - Hesaplama sonuçları
 * @param {Object} g - Hesaplama girdileri
 * @param {Object} [ctx] - Ek bağlam (pazar ID vb.)
 * @returns {Uyari[]}
 */
export function analiz(s, g, ctx = {}) {
  const uyarilar = [];

  if (g.satisFiyati <= 0 && g.alisFiyati <= 0) return uyarilar;

  kontrolZarar(s, uyarilar);
  kontrolIadeZarar(s, uyarilar);
  kontrolDusukMarj(s, g, uyarilar);
  kontrolYuksekIade(g, uyarilar);
  kontrolYuksekKomisyon(g, uyarilar);
  kontrolAylikKar(s, g, uyarilar);
  kontrolStopaj(ctx, uyarilar);
  kontrolSaglamMarj(s, uyarilar);

  return uyarilar;
}

/** TEHLİKE: Birim başına zarar */
function kontrolZarar(s, list) {
  if (s.netKar >= -0.01) return;
  const minF = s.basabasFiyat > 0 ? formatMoney(s.basabasFiyat) : '-';
  list.push({
    tip: 'tehlike',
    ikon: TIP_IKONLARI.tehlike,
    mesaj: `Birim başına ${formatMoney(Math.abs(s.netKar))} zarar ediyorsunuz!`,
    oneri: `Minimum satış fiyatı: ${minF}`,
  });
}

/** TEHLİKE: İade dahil zarar */
function kontrolIadeZarar(s, list) {
  if (s.netKar <= 0 || s.netKarIadeDahil >= -0.01) return;
  list.push({
    tip: 'tehlike',
    ikon: TIP_IKONLARI.tehlike,
    mesaj: 'İadeler dahil edildiğinde zarar!',
    oneri: `İade maliyeti: ${formatMoney(s.iadeMaliyeti)}/birim. İade oranını düşürmeyi hedefleyin.`,
  });
}

/** UYARI: Düşük marj (0-10%) */
function kontrolDusukMarj(s, g, list) {
  if (s.netMarj <= 0 || s.netMarj >= 10) return;

  const seviye = s.netMarj < 5 ? 'çok düşük' : 'düşük';
  const fiyat = fiyatOnerisi(g, 15);
  const oneri = fiyat > 0
    ? `%15 marj için fiyat önerisi: ${formatMoney(fiyat)}`
    : '';

  list.push({
    tip: 'uyari',
    ikon: TIP_IKONLARI.uyari,
    mesaj: `Marj ${seviye} (${formatPercent(s.netMarj)}), sürdürülemez.`,
    oneri,
  });
}

/** UYARI: Yüksek iade oranı */
function kontrolYuksekIade(g, list) {
  if (g.iadeOrani <= 25) return;
  list.push({
    tip: 'uyari',
    ikon: TIP_IKONLARI.uyari,
    mesaj: `İade oranı yüksek (%${g.iadeOrani}).`,
    oneri: 'Beden tablosu, detaylı fotoğraf ve video iade oranını düşürür.',
  });
}

/** BİLGİ: Yüksek komisyon */
function kontrolYuksekKomisyon(g, list) {
  if (g.komisyonOrani <= 20) return;
  list.push({
    tip: 'bilgi',
    ikon: TIP_IKONLARI.bilgi,
    mesaj: `Komisyon yüksek (%${g.komisyonOrani}).`,
    oneri: 'Kendi sitenizden satarak komisyonu sıfırlayabilirsiniz.',
  });
}

/** BİLGİ: Aylık kar */
function kontrolAylikKar(s, g, list) {
  if (g.aylikSatisAdedi <= 0 || Math.abs(s.aylikNetKar) <= 0.01) return;
  list.push({
    tip: 'bilgi',
    ikon: TIP_IKONLARI.bilgi,
    mesaj: `Tahmini aylık net kar: ${formatMoney(s.aylikNetKar)} (${g.aylikSatisAdedi} adet)`,
    oneri: '',
  });
}

/** BİLGİ: Stopaj hatırlatma */
function kontrolStopaj(ctx, list) {
  if (!ctx.pazar || ctx.pazar === 'kendi_site') return;
  list.push({
    tip: 'bilgi',
    ikon: TIP_IKONLARI.bilgi,
    mesaj: 'E-ticaret stopajı (%1) otomatik kesilmektedir (Ocak 2025).',
    oneri: '',
  });
}

/** BAŞARI: Sağlam marj */
function kontrolSaglamMarj(s, list) {
  if (s.netMarj < 15) return;
  list.push({
    tip: 'basari',
    ikon: TIP_IKONLARI.basari,
    mesaj: `Sağlam marj (${formatPercent(s.netMarj)}), sürdürülebilir fiyatlama.`,
    oneri: '',
  });
}

/**
 * Hedef marj için fiyat önerisi (binary search)
 * @param {Object} g - Girdiler
 * @param {number} hedef - Hedef marj (%)
 * @returns {number}
 */
function fiyatOnerisi(g, hedef) {
  /* Lazy import — döngüsel bağımlılık önleme */
  let lo = g.alisFiyati || 1;
  let hi = Math.max(lo * 10, 1000);

  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const test = { ...g, satisFiyati: mid };

    /* Basit marj hesabı (tam motor çağırmak yerine hafif versiyon) */
    const efCarpan = Math.max(0, 1 - (g.kampanyaOrani || 0) / 100 - (g.indirimOrani || 0) / 100);
    const ef = mid * efCarpan;
    const topOransal = ((g.komisyonOrani || 0) + (g.odemeKomisyonu || 0) + (g.stopajOrani || 0)) / 100;
    const kdvPay = ef * (g.kdvOrani || 0) / ((g.kdvOrani || 0) + 100);
    const sabit = (g.alisFiyati || 0) + (g.kargoUcreti || 0) + (g.ambalajGideri || 0);
    const maliyet = sabit + ef * topOransal + kdvPay;
    const net = ef - maliyet;
    const marj = ef > 0 ? (net / ef) * 100 : 0;

    if (marj < hedef) lo = mid;
    else hi = mid;
  }

  return Math.ceil((lo + hi) / 2);
}
