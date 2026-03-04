/**
 * @module Storage
 * @description localStorage facade — güvenli okuma/yazma
 */

const PREFIX = 'maliyet_';

/**
 * Değeri localStorage'a kaydet
 * @param {string} key - Anahtar
 * @param {*} value - Kaydedilecek değer (JSON serialize edilir)
 */
export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    console.warn(`[Storage] Kayıt başarısız: ${key}`);
  }
}

/**
 * localStorage'dan oku
 * @param {string} key - Anahtar
 * @param {*} [fallback=null] - Bulunamadığında dönen değer
 * @returns {*}
 */
export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * localStorage'dan sil
 * @param {string} key - Silinecek anahtar
 */
export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* yoksay */
  }
}

/**
 * Tüm uygulama verilerini temizle
 */
export function clearAll() {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  } catch {
    /* yoksay */
  }
}

/**
 * Tüm kayıtlı anahtarları listele
 * @returns {string[]}
 */
export function listKeys() {
  try {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .map(k => k.slice(PREFIX.length));
  } catch {
    return [];
  }
}
