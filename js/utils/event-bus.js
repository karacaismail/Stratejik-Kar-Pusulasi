/**
 * @module EventBus
 * @description Pub/sub olay sistemi — modüller arası iletişim
 * @example
 *   import { bus } from './event-bus.js';
 *   bus.on('hesapla', (data) => console.log(data));
 *   bus.emit('hesapla', { netKar: 42 });
 */

/** @type {Map<string, Set<Function>>} */
const listeners = new Map();

/**
 * Olaya abone ol
 * @param {string} event - Olay adı
 * @param {Function} callback - Tetiklenecek fonksiyon
 * @returns {Function} Aboneliği iptal eden fonksiyon
 */
export function on(event, callback) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event).add(callback);

  return () => off(event, callback);
}

/**
 * Aboneliği iptal et
 * @param {string} event - Olay adı
 * @param {Function} callback - Kaldırılacak fonksiyon
 */
export function off(event, callback) {
  const subs = listeners.get(event);
  if (subs) {
    subs.delete(callback);
    if (subs.size === 0) listeners.delete(event);
  }
}

/**
 * Olay tetikle
 * @param {string} event - Olay adı
 * @param {*} [data] - Gönderilecek veri
 */
export function emit(event, data) {
  const subs = listeners.get(event);
  if (!subs) return;

  for (const cb of subs) {
    try {
      cb(data);
    } catch (err) {
      console.error(`[EventBus] "${event}" handler hatası:`, err);
    }
  }
}

/**
 * Bir kez dinle, sonra otomatik iptal
 * @param {string} event - Olay adı
 * @param {Function} callback - Tetiklenecek fonksiyon
 */
export function once(event, callback) {
  const wrapper = (data) => {
    off(event, wrapper);
    callback(data);
  };
  on(event, wrapper);
}

/** Tüm abonelikleri temizle (test amaçlı) */
export function clear() {
  listeners.clear();
}

export const bus = { on, off, emit, once, clear };
