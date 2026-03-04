/**
 * @fileoverview Maliyet kalemleri gorunumu.
 * 13 maliyet kalemi icin SpinBox ve Badge bilesenleri ile satir olusturur.
 * Kategori/pazar degistiginde akilli varsayilan degerler uygulanir.
 * Kullanici elle degistirdigi alanlarda badge 'custom' olur.
 * @module views/cost-items-view
 */

import { createElement } from '../utils/dom.js';
import { on } from '../utils/event-bus.js';
import { getState, markCustom, isCustom } from '../models/state.js';
import { createSpinBox } from '../components/spin-box.js';
import { createBadge } from '../components/badge.js';
import { getDefaults } from '../models/smart-defaults.js';

/**
 * @typedef {Object} CostItemDef
 * @property {string} key    - State anahtari
 * @property {string} label  - Goruntuleme etiketi
 * @property {string} icon   - Tabler ikon sinifi
 * @property {number} min    - Minimum deger
 * @property {number} max    - Maksimum deger
 * @property {number} step   - Artis/azalis miktari
 * @property {string} suffix - Birim son eki
 * @property {boolean} fixed - Sabit deger mi (salt okunur)
 */

/** @type {CostItemDef[]} */
const COST_ITEMS = [
  { key: 'kargo',           label: 'Kargo',            icon: 'ti-truck',            min: 0, max: 500,  step: 1,   suffix: 'TL',  fixed: false },
  { key: 'ambalaj',         label: 'Ambalaj',          icon: 'ti-package',          min: 0, max: 200,  step: 0.5, suffix: 'TL',  fixed: false },
  { key: 'odeme_komisyonu', label: 'Odeme Komisyonu',  icon: 'ti-credit-card',      min: 0, max: 10,   step: 0.1, suffix: '%',   fixed: false },
  { key: 'stopaj',          label: 'Stopaj',           icon: 'ti-receipt-tax',      min: 0, max: 50,   step: 0.1, suffix: '%',   fixed: true  },
  { key: 'kdv',             label: 'KDV',              icon: 'ti-percentage',       min: 0, max: 50,   step: 1,   suffix: '%',   fixed: false },
  { key: 'gelir_vergisi',   label: 'Gelir Vergisi',    icon: 'ti-building-bank',    min: 0, max: 50,   step: 1,   suffix: '%',   fixed: false },
  { key: 'komisyon',        label: 'Komisyon',         icon: 'ti-coins',            min: 0, max: 60,   step: 0.5, suffix: '%',   fixed: false },
  { key: 'iade_orani',      label: 'Iade Orani',       icon: 'ti-arrow-back-up',    min: 0, max: 100,  step: 1,   suffix: '%',   fixed: false },
  { key: 'iade_kargo',      label: 'Iade Kargo',       icon: 'ti-truck-return',     min: 0, max: 500,  step: 1,   suffix: 'TL',  fixed: false },
  { key: 'reklam',          label: 'Reklam',           icon: 'ti-speakerphone',     min: 0, max: 50,   step: 0.5, suffix: '%',   fixed: false },
];

/**
 * @typedef {Object} SpinBoxRef
 * @property {function(): number} getValue
 * @property {function(number): void} setValue
 * @property {HTMLElement} el
 */

/** @type {Map<string, SpinBoxRef>} Anahtar bazinda SpinBox referanslari */
const spinBoxes = new Map();

/** @type {Map<string, HTMLElement>} Anahtar bazinda Badge referanslari */
const badges = new Map();

/**
 * Tek bir maliyet kalemi satirini olusturur.
 * @param {CostItemDef} item
 * @returns {HTMLElement}
 */
function buildRow(item) {
  const row = createElement('div', { className: 'cost-row', dataset: { costKey: item.key } });

  /* Ikon + etiket */
  const labelWrap = createElement('div', { className: 'cost-row__label' });
  const icon = createElement('i', { className: `ti ${item.icon} cost-row__icon` });
  const text = createElement('span', { className: 'cost-row__text', textContent: item.label });
  labelWrap.appendChild(icon);
  labelWrap.appendChild(text);

  /* SpinBox */
  const spinBox = createSpinBox({
    min: item.min,
    max: item.max,
    step: item.step,
    suffix: item.suffix,
    value: 0,
    disabled: item.fixed,
    onChange(val) {
      markCustom(item.key);
      updateBadge(item.key, true);
    },
  });
  spinBoxes.set(item.key, spinBox);

  /* Badge */
  const badge = createBadge({ type: 'auto' });
  badges.set(item.key, badge);

  /* Sabit alan icin badge */
  if (item.fixed) badge.setType('fixed');

  /* Birlestir */
  row.appendChild(labelWrap);
  row.appendChild(spinBox.el);
  row.appendChild(badge.el);
  return row;
}

/**
 * Belirli bir kalemin badge durumunu gunceller.
 * @param {string} key
 * @param {boolean} custom
 */
function updateBadge(key, custom) {
  const badge = badges.get(key);
  if (!badge) return;
  badge.setType(custom ? 'custom' : 'auto');
}

/**
 * Varsayilan degerleri tum SpinBox alanlarina uygular.
 * Kullanicinin elle degistirdigi alanlara dokunmaz.
 * @param {Record<string, number>} defaults
 */
function applyDefaults(defaults) {
  COST_ITEMS.forEach((item) => {
    if (isCustom(item.key)) return;
    const val = defaults[item.key];
    if (val == null) return;
    const sb = spinBoxes.get(item.key);
    if (sb) {
      sb.setValue(val);
      updateBadge(item.key, false);
    }
  });
}

/**
 * Kategori veya pazar yeri degistiginde akilli varsayilanlari yeniden uygular.
 */
function onStateChange() {
  const kategori = getState('kategori');
  const pazar = getState('pazar');
  if (!kategori || !pazar) return;

  const defaults = getDefaults(kategori, pazar);
  applyDefaults(defaults);
}

/**
 * Maliyet kalemleri panelini baslatir.
 * @param {string} containerId - Hedef kapsayici elementin id degeri
 * @returns {{ getValues: () => Record<string, number>, applyDefaults: (d: Record<string, number>) => void }}
 */
export function initCostItemsView(containerId) {
  const root = document.getElementById(containerId);
  if (!root) {
    console.error(`[cost-items-view] "${containerId}" kapsayicisi bulunamadi.`);
    return { getValues: () => ({}), applyDefaults };
  }

  /* Baslik */
  const heading = createElement('h2', { className: 'section-title' });
  const hIcon = createElement('i', { className: 'ti ti-list-details section-title__icon' });
  const hText = document.createTextNode(' Maliyet Kalemleri');
  heading.appendChild(hIcon);
  heading.appendChild(hText);
  root.appendChild(heading);

  /* Satirlari olustur */
  const list = createElement('div', { className: 'cost-items-list' });
  COST_ITEMS.forEach((item) => list.appendChild(buildRow(item)));
  root.appendChild(list);

  return {
    /** @returns {Record<string, number>} Tum maliyet degerlerini dondurur */
    getValues() {
      const values = {};
      spinBoxes.forEach((sb, key) => { values[key] = sb.getValue(); });
      return values;
    },
    applyDefaults,
  };
}
