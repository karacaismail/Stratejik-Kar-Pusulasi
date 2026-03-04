/**
 * @module SpinBox
 * @description +/- butonlu sayı girişi — ARIA, touch, long-press, Safari fix
 *
 * Kullanım:
 *   import { createSpinBox } from './spin-box.js';
 *   const sb = createSpinBox({ id: 'alis', label: 'Alış Fiyatı', step: 1, min: 0, prefix: '₺' });
 *   container.appendChild(sb.el);
 *   sb.getValue();  // number döner
 *   sb.setValue(150);
 */

import { formatNumber, parseTRNumber } from '../services/formatter.js';

const LONG_PRESS_DELAY = 400;
const ACCEL_INTERVAL_START = 150;
const ACCEL_INTERVAL_MIN = 30;
const ACCEL_FACTOR = 0.85;

/**
 * @typedef {Object} SpinBoxOptions
 * @property {string} id - Element ID
 * @property {string} label - ARIA etiket
 * @property {number} [min=0] - Minimum değer
 * @property {number} [max=999999] - Maksimum değer
 * @property {number} [step=1] - Artırım miktarı
 * @property {number} [value=0] - Başlangıç değeri
 * @property {number} [decimals=2] - Ondalık hassasiyet
 * @property {string} [prefix=''] - Ön ek (₺)
 * @property {string} [suffix=''] - Son ek (%)
 * @property {Function} [onChange] - Değer değiştiğinde çağrılır
 */

/**
 * SpinBox bileşeni oluştur
 * @param {SpinBoxOptions} opts
 * @returns {{el: HTMLElement, getValue: Function, setValue: Function, setPrefix: Function, setSuffix: Function, destroy: Function}}
 */
export function createSpinBox(opts) {
  const {
    id, label, min = 0, max = 999999, step = 1,
    value = 0, decimals = 2, prefix = '', suffix = '',
    onChange = null, disabled = false,
  } = opts;

  let currentValue = clampVal(value, min, max);
  let currentPrefix = prefix;
  let currentSuffix = suffix;
  let longPressTimer = null;
  let repeatTimer = null;

  /* ── DOM Oluştur ── */
  const wrapper = document.createElement('div');
  wrapper.className = 'spinbox';
  wrapper.setAttribute('role', 'group');
  wrapper.setAttribute('aria-label', label);

  const btnMinus = createButton('ti-minus', 'Azalt', -1);
  const input = createInput();
  const btnPlus = createButton('ti-plus', 'Artır', 1);

  wrapper.append(btnMinus, input, btnPlus);
  updateDisplay();

  /* Disabled durumu */
  if (disabled) {
    wrapper.classList.add('spinbox--disabled');
    input.readOnly = true;
    btnMinus.disabled = true;
    btnPlus.disabled = true;
  }

  /* ── Input Oluştur ── */
  function createInput() {
    const el = document.createElement('input');
    el.type = 'text';
    el.inputMode = 'decimal';
    el.id = id;
    el.className = 'spinbox__input';
    el.setAttribute('role', 'spinbutton');
    el.setAttribute('aria-valuemin', min);
    el.setAttribute('aria-valuemax', max);
    el.setAttribute('aria-valuenow', currentValue);
    el.setAttribute('aria-label', label);

    el.addEventListener('focus', () => {
      el.value = currentValue;
      el.select();
    });

    el.addEventListener('blur', () => {
      const parsed = parseTRNumber(el.value);
      setVal(parsed);
    });

    el.addEventListener('keydown', handleKeydown);

    return el;
  }

  /* ── Buton Oluştur ── */
  function createButton(icon, ariaLabel, direction) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'spinbox__btn';
    btn.setAttribute('aria-label', ariaLabel);
    btn.setAttribute('tabindex', '-1');
    btn.innerHTML = `<i class="ti ${icon}"></i>`;

    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      stepBy(direction);
      startLongPress(direction);
    });

    btn.addEventListener('pointerup', stopLongPress);
    btn.addEventListener('pointerleave', stopLongPress);
    btn.addEventListener('pointercancel', stopLongPress);

    return btn;
  }

  /* ── Klavye ── */
  function handleKeydown(e) {
    if (e.key === 'ArrowUp') { e.preventDefault(); stepBy(1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); stepBy(-1); }
    else if (e.key === 'Enter') { input.blur(); }
  }

  /* ── Adım Fonksiyonları ── */
  function stepBy(dir) {
    setVal(currentValue + (step * dir));
  }

  function setVal(v) {
    const newVal = clampVal(Number(v) || 0, min, max);
    const changed = newVal !== currentValue;
    currentValue = newVal;
    updateDisplay();
    if (changed && onChange) onChange(currentValue);
  }

  function updateDisplay() {
    const formatted = currentPrefix + formatNumber(currentValue, decimals) + currentSuffix;
    if (document.activeElement !== input) {
      input.value = formatted;
    }
    input.setAttribute('aria-valuenow', currentValue);
  }

  /* ── Long Press (ivmelenmeli) ── */
  function startLongPress(dir) {
    longPressTimer = setTimeout(() => {
      let interval = ACCEL_INTERVAL_START;
      const tick = () => {
        stepBy(dir);
        interval = Math.max(interval * ACCEL_FACTOR, ACCEL_INTERVAL_MIN);
        repeatTimer = setTimeout(tick, interval);
      };
      tick();
    }, LONG_PRESS_DELAY);
  }

  function stopLongPress() {
    clearTimeout(longPressTimer);
    clearTimeout(repeatTimer);
    longPressTimer = null;
    repeatTimer = null;
  }

  /* ── Public API ── */
  return {
    el: wrapper,
    getValue: () => currentValue,
    setValue: (v) => setVal(v),
    /** @param {string} p - Yeni ön ek */
    setPrefix: (p) => { currentPrefix = p; updateDisplay(); },
    /** @param {string} s - Yeni son ek */
    setSuffix: (s) => { currentSuffix = s; updateDisplay(); },
    destroy: () => {
      stopLongPress();
      wrapper.remove();
    },
  };
}

/**
 * Değeri min/max arasında sınırla
 * @param {number} v
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clampVal(v, min, max) {
  return Math.round(Math.min(Math.max(v, min), max) * 100) / 100;
}
