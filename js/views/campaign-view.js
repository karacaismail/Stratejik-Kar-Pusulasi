/**
 * @fileoverview Kampanya ve indirim paneli gorunumu.
 * Accordion icerisinde iki SpinBox ile kampanya ve indirim
 * oranlarini yuzde cinsinden ayarlamaya olanak tanir.
 * @module views/campaign-view
 */

import { createElement } from '../utils/dom.js';
import { createSpinBox } from '../components/spin-box.js';

/**
 * Accordion bilesenini olusturur.
 * @param {Object} opts
 * @param {string} opts.title - Accordion basligi
 * @param {string} opts.icon  - Tabler ikon sinifi
 * @returns {{ wrapper: HTMLElement, body: HTMLElement }}
 */
function buildAccordion({ title, icon }) {
  const wrapper = createElement('div', { className: 'accordion' });

  /* Baslik butonu */
  const header = createElement('button', {
    className: 'accordion__header',
    type: 'button',
    ariaExpanded: 'false',
  });

  const headerIcon = createElement('i', { className: `ti ${icon} accordion__icon` });
  const headerText = createElement('span', {
    className: 'accordion__title',
    textContent: title,
  });
  const chevron = createElement('i', { className: 'ti ti-chevron-down accordion__chevron' });

  header.appendChild(headerIcon);
  header.appendChild(headerText);
  header.appendChild(chevron);

  /* Set aria-expanded correctly using setAttribute */
  header.setAttribute('aria-expanded', 'false');

  /* Icerik alani */
  const body = createElement('div', { className: 'accordion__body' });

  /* Ac/kapa davranisi */
  header.addEventListener('click', () => {
    const expanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', String(!expanded));
    body.classList.toggle('accordion__body--open', !expanded);
    chevron.style.transform = !expanded ? 'rotate(180deg)' : '';
  });

  wrapper.appendChild(header);
  wrapper.appendChild(body);

  return { wrapper, body };
}

/**
 * Etiketli bir SpinBox satirini olusturur.
 * @param {Object} opts
 * @param {string} opts.label   - Alan etiketi
 * @param {string} opts.icon    - Tabler ikon sinifi
 * @param {number} opts.min     - Minimum deger
 * @param {number} opts.max     - Maksimum deger
 * @param {number} opts.step    - Artis/azalis miktari
 * @param {string} opts.suffix  - Birim son eki
 * @param {number} opts.value   - Baslangic degeri
 * @returns {{ row: HTMLElement, spinBox: { getValue: () => number, setValue: (v: number) => void, el: HTMLElement } }}
 */
function buildFieldRow({ label, icon, min, max, step, suffix, value }) {
  const row = createElement('div', { className: 'campaign-row' });

  const labelWrap = createElement('div', { className: 'campaign-row__label' });
  const labelIcon = createElement('i', { className: `ti ${icon} campaign-row__icon` });
  const labelText = createElement('span', {
    className: 'campaign-row__text',
    textContent: label,
  });
  labelWrap.appendChild(labelIcon);
  labelWrap.appendChild(labelText);

  const spinBox = createSpinBox({ min, max, step, suffix, value });

  row.appendChild(labelWrap);
  row.appendChild(spinBox.el);

  return { row, spinBox };
}

/**
 * Kampanya ve indirim panelini baslatir.
 * @param {string} containerId - Hedef kapsayici elementin id degeri
 * @returns {{ getValues: () => { kampanyaOrani: number, indirimOrani: number } }}
 */
export function initCampaignView(containerId) {
  const root = document.getElementById(containerId);
  if (!root) {
    console.error(`[campaign-view] "${containerId}" kapsayicisi bulunamadi.`);
    return { getValues: () => ({ kampanyaOrani: 0, indirimOrani: 0 }) };
  }

  /* Accordion olustur */
  const { wrapper, body } = buildAccordion({
    title: 'Kampanya & \u0130ndirim',
    icon: 'ti-discount-2',
  });

  /* Kampanya orani */
  const kampanya = buildFieldRow({
    label: 'Kampanya Oran\u0131',
    icon: 'ti-rosette-discount',
    min: 0,
    max: 100,
    step: 1,
    suffix: '%',
    value: 0,
  });

  /* Indirim orani */
  const indirim = buildFieldRow({
    label: '\u0130ndirim Oran\u0131',
    icon: 'ti-tag',
    min: 0,
    max: 100,
    step: 1,
    suffix: '%',
    value: 0,
  });

  body.appendChild(kampanya.row);
  body.appendChild(indirim.row);
  root.appendChild(wrapper);

  return {
    /**
     * Kampanya ve indirim degerlerini dondurur.
     * @returns {{ kampanyaOrani: number, indirimOrani: number }}
     */
    getValues() {
      return {
        kampanyaOrani: kampanya.spinBox.getValue(),
        indirimOrani: indirim.spinBox.getValue(),
      };
    },
  };
}
