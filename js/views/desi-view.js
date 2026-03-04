/**
 * @module DesiView
 * @description Desi hesaplayici paneli — en/boy/yukseklik/agirlik girisi
 *              Accordion icinde 4 SpinBox, anlik desi sonucu gosterir.
 */

import { createSpinBox } from '../components/spin-box.js';
import { createAccordion } from '../components/accordion.js';
import { hesaplaDesi } from '../models/desi-calculator.js';
import { createElement } from '../utils/dom.js';
import { emit } from '../utils/event-bus.js';
import { formatNumber } from '../services/formatter.js';

/**
 * @typedef {Object} DesiViewAPI
 * @property {Function} getValues - { en, boy, yukseklik, agirlik } dondurur
 * @property {Function} getDesi   - Faturalanacak desi degerini dondurur
 */

/**
 * Sonuc metnini guncelle
 * @param {HTMLElement} resultEl - Sonuc elementi
 * @param {ReturnType<typeof hesaplaDesi>} result - Desi hesap sonucu
 * @param {boolean} hasInput - Girdi var mi
 */
function renderResult(resultEl, result, hasInput) {
  if (!hasInput) {
    resultEl.textContent = '';
    return;
  }

  const kaynakLabel = result.kaynak === 'hacimsel' ? 'hacimsel' : 'agirlik';
  const icon = result.kaynak === 'hacimsel' ? 'ti-dimensions' : 'ti-scale';

  resultEl.innerHTML = '';
  resultEl.append(
    createElement('i', { className: `ti ${icon} desi-result__icon` }),
    createElement('span', {}, [
      `Faturalanacak: ${formatNumber(result.faturalanacakDesi, 2)} desi (${kaynakLabel})`,
    ]),
  );
}

/**
 * Desi hesaplayici gorunumunu baslat
 * @param {string} containerId - Hedef container ID
 * @returns {DesiViewAPI}
 */
export function initDesiView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    return {
      getValues: () => ({ en: 0, boy: 0, yukseklik: 0, agirlik: 0 }),
      getDesi: () => 0,
    };
  }

  /* -- Sonuc Alani -- */
  const resultEl = createElement('div', {
    className: 'desi-result text-sm font-medium text-center py-2',
  });

  /** Ortak guncelleme fonksiyonu */
  const update = () => {
    const result = hesaplaDesi(
      enBox.getValue(), boyBox.getValue(),
      yukBox.getValue(), agrBox.getValue(),
    );
    const hasInput = enBox.getValue() > 0 || agrBox.getValue() > 0;
    renderResult(resultEl, result, hasInput);
    emit('desi:change', result);
  };

  /* -- SpinBox Bilesenleri -- */
  const enBox = createSpinBox({
    id: 'desi_en', label: 'En (cm)',
    min: 0, max: 300, step: 1, value: 0, decimals: 0, suffix: ' cm',
    onChange: update,
  });

  const boyBox = createSpinBox({
    id: 'desi_boy', label: 'Boy (cm)',
    min: 0, max: 300, step: 1, value: 0, decimals: 0, suffix: ' cm',
    onChange: update,
  });

  const yukBox = createSpinBox({
    id: 'desi_yuk', label: 'Yukseklik (cm)',
    min: 0, max: 300, step: 1, value: 0, decimals: 0, suffix: ' cm',
    onChange: update,
  });

  const agrBox = createSpinBox({
    id: 'desi_agr', label: 'Agirlik (kg)',
    min: 0, max: 150, step: 0.1, value: 0, decimals: 1, suffix: ' kg',
    onChange: update,
  });

  /* -- Grid Yapi -- */
  const fields = createElement('div', { className: 'grid grid-cols-2 gap-3' });

  /**
   * Label + SpinBox sarmalayicisi
   * @param {string} labelText
   * @param {string} iconClass
   * @param {{el: HTMLElement}} spinbox
   * @returns {HTMLElement}
   */
  const makeField = (labelText, iconClass, spinbox) => {
    const group = createElement('div', { className: 'field-group' });
    const label = createElement('label', { className: 'field-group__label' }, [
      createElement('i', { className: `ti ${iconClass} field-group__icon` }),
      createElement('span', {}, [labelText]),
    ]);
    group.append(label, spinbox.el);
    return group;
  };

  fields.append(
    makeField('En', 'ti-arrow-autofit-width', enBox),
    makeField('Boy', 'ti-arrow-autofit-height', boyBox),
    makeField('Yukseklik', 'ti-arrow-autofit-up', yukBox),
    makeField('Agirlik', 'ti-scale', agrBox),
  );

  /* -- Accordion -- */
  const inner = createElement('div', { className: 'desi-view__body' });
  inner.append(fields, resultEl);

  const acc = createAccordion({
    title: 'Desi Hesaplayici',
    ikon: 'ti-dimensions',
    content: inner,
    open: false,
  });

  container.appendChild(acc.el);

  /* -- Public API -- */
  return {
    /** @returns {{ en: number, boy: number, yukseklik: number, agirlik: number }} */
    getValues: () => ({
      en: enBox.getValue(),
      boy: boyBox.getValue(),
      yukseklik: yukBox.getValue(),
      agirlik: agrBox.getValue(),
    }),
    /** @returns {number} Faturalanacak desi degeri */
    getDesi: () => {
      const r = hesaplaDesi(
        enBox.getValue(), boyBox.getValue(),
        yukBox.getValue(), agrBox.getValue(),
      );
      return r.faturalanacakDesi;
    },
  };
}
