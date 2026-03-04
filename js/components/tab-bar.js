/**
 * @module TabBar
 * @description Hesaplama modu tab seçici bileşeni
 */

import { createElement } from '../utils/dom.js';

/**
 * @typedef {Object} TabOption
 * @property {number|string} value - Tab değeri
 * @property {string} label - Görüntüleme metni
 * @property {string} [ikon] - Tabler ikon sınıfı
 */

/**
 * TabBar bileşeni oluştur
 * @param {Object} opts
 * @param {TabOption[]} opts.tabs - Tab seçenekleri
 * @param {number|string} [opts.active] - Aktif tab değeri
 * @param {Function} opts.onChange - Seçim değiştiğinde çağrılır
 * @returns {{el: HTMLElement, setActive: Function}}
 */
export function createTabBar({ tabs, active, onChange }) {
  let activeValue = active ?? tabs[0]?.value;

  const wrapper = createElement('div', {
    className: 'tab-bar',
    role: 'tablist',
  });

  const buttons = tabs.map(tab => {
    const btn = createElement('button', {
      className: `tab-bar__item ${tab.value === activeValue ? 'tab-bar__item--active' : ''}`,
      role: 'tab',
      'aria-selected': String(tab.value === activeValue),
      dataset: { value: tab.value },
    }, [
      tab.ikon ? createElement('i', { className: tab.ikon }) : null,
      createElement('span', {}, [tab.label]),
    ].filter(Boolean));

    btn.addEventListener('click', () => {
      setActive(tab.value);
      onChange(tab.value);
    });

    return btn;
  });

  buttons.forEach(b => wrapper.appendChild(b));

  function setActive(value) {
    activeValue = value;
    buttons.forEach(btn => {
      const isActive = btn.dataset.value == value;
      btn.classList.toggle('tab-bar__item--active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });
  }

  return { el: wrapper, setActive };
}
