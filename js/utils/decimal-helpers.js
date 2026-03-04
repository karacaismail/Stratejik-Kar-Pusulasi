/**
 * @module DecimalHelpers
 * @description Decimal.js sarmalayıcı — finansal hassasiyet
 * Decimal.js CDN üzerinden global olarak yüklenir
 */

/* global Decimal */

/**
 * Decimal nesnesi oluşturur (kısa yol)
 * @param {number|string|Decimal} value - Sayısal değer
 * @returns {Decimal}
 */
export function D(value) {
  return new Decimal(value || 0);
}

/**
 * İki Decimal değerini güvenli bölme
 * @param {Decimal} numerator - Pay
 * @param {Decimal} denominator - Payda
 * @param {Decimal} [fallback] - Sıfıra bölme durumunda dönen değer
 * @returns {Decimal}
 */
export function safeDivide(numerator, denominator, fallback) {
  const defaultVal = fallback || D(0);
  if (denominator.isZero()) return defaultVal;
  return numerator.div(denominator);
}

/**
 * Decimal değerini yüzdeye çevir (value * rate / 100)
 * @param {Decimal} value - Temel değer
 * @param {Decimal|number} rate - Yüzde oranı
 * @returns {Decimal}
 */
export function percent(value, rate) {
  return value.times(D(rate)).div(100);
}

/**
 * Decimal değerini Number'a çevir (2 ondalık)
 * @param {Decimal} value - Decimal değer
 * @param {number} [dp=2] - Ondalık hassasiyet
 * @returns {number}
 */
export function toNum(value, dp = 2) {
  return Number(value.toFixed(dp));
}

/**
 * Clamp — değeri min/max arasında sınırla
 * @param {Decimal} value - Sınırlanacak değer
 * @param {number} min - Alt sınır
 * @param {number} max - Üst sınır
 * @returns {Decimal}
 */
export function clamp(value, min, max) {
  if (value.lt(min)) return D(min);
  if (value.gt(max)) return D(max);
  return value;
}
