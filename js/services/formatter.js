/**
 * @module Formatter
 * @description Türkçe para ve yüzde formatlama servisi (tr-TR)
 */

/** @type {Intl.NumberFormat} */
const moneyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** @type {Intl.NumberFormat} */
const compactFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Tutarı Türk Lirası olarak formatla
 * @param {number} amount - Tutar
 * @returns {string} Örn: "₺1.250,75"
 */
export function formatMoney(amount) {
  const n = Number(amount) || 0;
  return moneyFormatter.format(n);
}

/**
 * Tutarı kısa para formatında göster (kuruşsuz)
 * @param {number} amount - Tutar
 * @returns {string} Örn: "₺1.251"
 */
export function formatMoneyCompact(amount) {
  const n = Number(amount) || 0;
  return compactFormatter.format(n);
}

/**
 * Yüzde olarak formatla
 * @param {number} value - Yüzde değeri
 * @param {number} [digits=2] - Ondalık hassasiyet
 * @returns {string} Örn: "%21,50"
 */
export function formatPercent(value, digits = 2) {
  const n = Number(value) || 0;
  return '%' + n.toLocaleString('tr-TR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/**
 * Sayıyı Türkçe formatta göster (para birimi olmadan)
 * @param {number} value - Sayı
 * @param {number} [digits=2] - Ondalık hassasiyet
 * @returns {string} Örn: "1.250,75"
 */
export function formatNumber(value, digits = 2) {
  const n = Number(value) || 0;
  return n.toLocaleString('tr-TR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/**
 * Girdi değerini parse et (Türkçe formatı destekler)
 * @param {string} str - Giriş metni (örn: "1.250,75")
 * @returns {number}
 */
export function parseTRNumber(str) {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  const cleaned = String(str)
    .replace(/[₺%\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  return parseFloat(cleaned) || 0;
}
