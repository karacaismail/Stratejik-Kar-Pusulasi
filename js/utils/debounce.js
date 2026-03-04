/**
 * @module Debounce
 * @description Debounce ve throttle yardımcıları
 */

/**
 * Fonksiyonu geciktirir — son çağrıdan itibaren belirtilen süre
 * geçtikten sonra çalıştırır
 * @param {Function} fn - Geciktirilecek fonksiyon
 * @param {number} [ms=150] - Gecikme süresi (ms)
 * @returns {Function} Debounce edilmiş fonksiyon
 */
export function debounce(fn, ms = 150) {
  let timer = null;

  const debounced = function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };

  debounced.cancel = () => clearTimeout(timer);

  return debounced;
}

/**
 * Fonksiyonu kısıtlar — belirtilen süre içinde en fazla bir kez
 * çalıştırılır
 * @param {Function} fn - Kısıtlanacak fonksiyon
 * @param {number} [ms=150] - Minimum aralık (ms)
 * @returns {Function} Throttle edilmiş fonksiyon
 */
export function throttle(fn, ms = 150) {
  let lastTime = 0;
  let timer = null;

  return function (...args) {
    const now = Date.now();
    const remaining = ms - (now - lastTime);

    if (remaining <= 0) {
      clearTimeout(timer);
      lastTime = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}
