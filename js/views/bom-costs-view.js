/**
 * @fileoverview BOM / Üretim Giderleri görünümü.
 * Depolama, İşçilik ve Ekstra masraf kalemlerini
 * ayrı bir BOM paneli olarak sunar.
 * @module views/bom-costs-view
 */

import { createElement } from '../utils/dom.js';
import { markCustom, isCustom } from '../models/state.js';
import { createSpinBox } from '../components/spin-box.js';
import { createBadge } from '../components/badge.js';

/** @type {import('./cost-items-view.js').CostItemDef[]} */
const BOM_ITEMS = [
  { key: 'depolama', label: 'Depolama',  icon: 'ti-building-warehouse', min: 0, max: 500,  step: 1, suffix: 'TL', fixed: false },
  { key: 'iscilik',  label: 'Iscilik',   icon: 'ti-users',              min: 0, max: 500,  step: 1, suffix: 'TL', fixed: false },
  { key: 'ekstra',   label: 'Ekstra',    icon: 'ti-dots',               min: 0, max: 1000, step: 1, suffix: 'TL', fixed: false },
];

/** @type {Map<string, {getValue: () => number, setValue: (v: number) => void, el: HTMLElement}>} */
const spinBoxes = new Map();

/** @type {Map<string, HTMLElement>} */
const badges = new Map();

/**
 * Tek bir BOM maliyet satırı oluşturur.
 * @param {Object} item
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
    onChange() {
      markCustom(item.key);
      const badge = badges.get(item.key);
      if (badge) badge.setType('custom');
    },
  });
  spinBoxes.set(item.key, spinBox);

  /* Badge */
  const badge = createBadge({ type: 'auto' });
  badges.set(item.key, badge);

  row.appendChild(labelWrap);
  row.appendChild(spinBox.el);
  row.appendChild(badge.el);
  return row;
}

/**
 * Varsayılan değerleri uygular (kullanıcı değiştirmediği alanlara).
 * @param {Record<string, number>} defaults
 */
function applyDefaults(defaults) {
  BOM_ITEMS.forEach((item) => {
    if (isCustom(item.key)) return;
    const val = defaults[item.key];
    if (val == null) return;
    const sb = spinBoxes.get(item.key);
    if (sb) {
      sb.setValue(val);
      const badge = badges.get(item.key);
      if (badge) badge.setType('auto');
    }
  });
}

/**
 * BOM giderleri panelini başlatır.
 * @param {string} containerId
 * @returns {{ getValues: () => Record<string, number>, applyDefaults: (d: Record<string, number>) => void }}
 */
export function initBomCostsView(containerId) {
  const root = document.getElementById(containerId);
  if (!root) {
    console.error(`[bom-costs-view] "${containerId}" kapsayıcısı bulunamadı.`);
    return { getValues: () => ({}), applyDefaults };
  }

  /* Başlık */
  const heading = createElement('h2', { className: 'section-title' });
  const hIcon = createElement('i', { className: 'ti ti-recipe section-title__icon' });
  const hText = document.createTextNode(' BOM / Üretim Giderleri');
  heading.appendChild(hIcon);
  heading.appendChild(hText);
  root.appendChild(heading);

  /* Satırları oluştur */
  const list = createElement('div', { className: 'cost-items-list' });
  BOM_ITEMS.forEach((item) => list.appendChild(buildRow(item)));
  root.appendChild(list);

  return {
    /** @returns {Record<string, number>} */
    getValues() {
      const values = {};
      spinBoxes.forEach((sb, key) => { values[key] = sb.getValue(); });
      return values;
    },
    applyDefaults,
  };
}
