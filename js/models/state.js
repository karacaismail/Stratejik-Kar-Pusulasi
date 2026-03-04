/**
 * @module State
 * @description Gözlemlenebilir uygulama durumu (EventBus ile reaktif)
 */

import { emit } from '../utils/event-bus.js';

/** @type {Object} Mevcut uygulama durumu */
const state = {
  /** @type {number} Hesaplama modu (1-4) */
  hesapModu: 1,

  /** @type {string|null} Seçili kategori ID */
  kategori: null,

  /** @type {string|null} Seçili pazar yeri ID */
  pazar: null,

  /** @type {Set<string>} Kullanıcının manuel değiştirdiği alanlar */
  customFields: new Set(),

  /** @type {number} Aktif wizard adımı (0-indexed) */
  aktifAdim: 0,

  /** @type {Object|null} Son hesaplama sonuçları */
  sonuclar: null,

  /** @type {Object|null} Son hesaplama girdileri */
  girdiler: null,

  /** @type {string|null} Seçili kargo firması ID */
  kargoFirmasi: null,
};

/**
 * State'in bir alanını güncelle ve ilgili olayı tetikle
 * @param {string} key - Alan adı
 * @param {*} value - Yeni değer
 */
export function setState(key, value) {
  if (!(key in state)) {
    console.warn(`[State] Bilinmeyen alan: ${key}`);
    return;
  }

  const oldValue = state[key];
  state[key] = value;

  emit(`state:${key}`, { value, oldValue });
  emit('state:change', { key, value, oldValue });
}

/**
 * State'ten bir alanı oku
 * @param {string} key - Alan adı
 * @returns {*}
 */
export function getState(key) {
  return state[key];
}

/**
 * Tüm state'in kopyasını döndür (readonly)
 * @returns {Object}
 */
export function getSnapshot() {
  return { ...state, customFields: new Set(state.customFields) };
}

/**
 * CustomFields'a alan ekle
 * @param {string} fieldName - Alan adı
 */
export function markCustom(fieldName) {
  state.customFields.add(fieldName);
}

/**
 * CustomFields'tan alan sil (varsayılana dön)
 * @param {string} fieldName - Alan adı
 */
export function unmarkCustom(fieldName) {
  state.customFields.delete(fieldName);
}

/**
 * Alan özel (custom) mi kontrol et
 * @param {string} fieldName - Alan adı
 * @returns {boolean}
 */
export function isCustom(fieldName) {
  return state.customFields.has(fieldName);
}

/**
 * State'i sıfırla
 */
export function resetState() {
  state.hesapModu = 1;
  state.kategori = null;
  state.pazar = null;
  state.customFields.clear();
  state.aktifAdim = 0;
  state.sonuclar = null;
  state.girdiler = null;
  state.kargoFirmasi = null;
  emit('state:reset', null);
}
