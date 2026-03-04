/**
 * @module Accordion
 * @description Açılır-kapanır panel bileşeni
 */

import { createElement } from '../utils/dom.js';

/**
 * Accordion bileşeni oluştur
 * @param {Object} opts
 * @param {string} opts.title - Başlık
 * @param {string} [opts.ikon] - Tabler ikon sınıfı
 * @param {boolean} [opts.open=false] - Başlangıçta açık mı
 * @param {HTMLElement|string} opts.content - İçerik
 * @returns {{el: HTMLElement, toggle: Function, isOpen: Function, setContent: Function}}
 */
export function createAccordion({ title, ikon, open = false, content }) {
  let isOpen = open;

  const wrapper = createElement('div', {
    className: 'accordion',
  });

  const header = createElement('button', {
    className: 'accordion__header',
    type: 'button',
    'aria-expanded': String(isOpen),
  }, [
    createElement('div', { className: 'accordion__title-group' }, [
      ikon ? createElement('i', { className: `ti ${ikon} accordion__icon` }) : null,
      createElement('span', { className: 'accordion__title' }, [title]),
    ].filter(Boolean)),
    createElement('i', { className: 'ti ti-chevron-down accordion__arrow' }),
  ]);

  const body = createElement('div', {
    className: `accordion__body ${isOpen ? 'accordion__body--open' : ''}`,
  });

  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }

  header.addEventListener('click', () => toggle());

  wrapper.append(header, body);

  function toggle(force) {
    isOpen = force !== undefined ? force : !isOpen;
    body.classList.toggle('accordion__body--open', isOpen);
    header.setAttribute('aria-expanded', String(isOpen));

    const arrow = header.querySelector('.accordion__arrow');
    if (arrow) {
      arrow.style.transform = isOpen ? 'rotate(180deg)' : '';
    }
  }

  if (isOpen) toggle(true);

  return {
    el: wrapper,
    toggle,
    isOpen: () => isOpen,
    setContent: (newContent) => {
      body.innerHTML = '';
      if (typeof newContent === 'string') body.innerHTML = newContent;
      else if (newContent instanceof HTMLElement) body.appendChild(newContent);
    },
  };
}
