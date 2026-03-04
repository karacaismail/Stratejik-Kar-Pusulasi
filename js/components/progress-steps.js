/**
 * @module ProgressSteps
 * @description Multi-step form adım göstergesi
 */

import { createElement } from '../utils/dom.js';

/**
 * ProgressSteps bileşeni oluştur
 * @param {Object} opts
 * @param {string[]} opts.steps - Adım isimleri
 * @param {number} [opts.current=0] - Aktif adım (0-indexed)
 * @returns {{el: HTMLElement, setCurrent: Function}}
 */
export function createProgressSteps({ steps, current = 0 }) {
  let currentStep = current;

  const wrapper = createElement('nav', {
    className: 'progress-steps',
    'aria-label': 'Form adımları',
  });

  const items = steps.map((label, idx) => {
    const item = createElement('div', {
      className: getItemClass(idx),
      dataset: { step: idx },
    }, [
      createElement('div', { className: 'progress-steps__circle' }, [
        createElement('span', {}, [String(idx + 1)]),
      ]),
      createElement('span', { className: 'progress-steps__label' }, [label]),
    ]);

    return item;
  });

  items.forEach((item, idx) => {
    wrapper.appendChild(item);
    if (idx < items.length - 1) {
      wrapper.appendChild(createElement('div', {
        className: 'progress-steps__line',
      }));
    }
  });

  function getItemClass(idx) {
    const base = 'progress-steps__item';
    if (idx < currentStep) return `${base} progress-steps__item--completed`;
    if (idx === currentStep) return `${base} progress-steps__item--active`;
    return base;
  }

  function setCurrent(step) {
    currentStep = step;
    items.forEach((item, idx) => {
      item.className = getItemClass(idx);
    });

    /* Çizgi durumlarını güncelle */
    const lines = wrapper.querySelectorAll('.progress-steps__line');
    lines.forEach((line, idx) => {
      line.classList.toggle('progress-steps__line--active', idx < currentStep);
    });
  }

  setCurrent(currentStep);

  return { el: wrapper, setCurrent };
}
