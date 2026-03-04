/**
 * @fileoverview Kategori secim gorunumu.
 * 5x2 grid icinde urun kategorilerini Tabler ikonlariyla gosterir.
 * Kullanici bir kategori sectikten sonra state guncellenir ve
 * event-bus uzerinden 'state:kategori' olayini yayar.
 * @module views/category-picker
 */

import { createElement } from '../utils/dom.js';
import { setState } from '../models/state.js';
import { KATEGORILER } from '../config/categories.js';

/** @type {string|null} Secili kategori anahtari */
let activeKey = null;

/**
 * Tek bir kategori kartini olusturur.
 * @param {string} key - Kategori anahtari (orn. 'giyim')
 * @param {{ ad: string, ikon: string, kdv: number, iade: number, ambalaj: number, kargo: number }} cat
 * @returns {HTMLElement}
 */
function buildCard(key, cat) {
  const card = createElement('button', {
    className: 'category-card',
    type: 'button',
    dataset: { kategori: key },
    ariaLabel: cat.ad,
  });

  const icon = createElement('i', {
    className: `ti ${cat.ikon} category-card__icon`,
  });

  const label = createElement('span', {
    className: 'category-card__label',
    textContent: cat.ad,
  });

  card.appendChild(icon);
  card.appendChild(label);
  return card;
}

/**
 * Tum kartlarin secim durumunu gunceller.
 * @param {HTMLElement} container
 * @param {string} selectedKey
 */
function refreshSelection(container, selectedKey) {
  const cards = container.querySelectorAll('.category-card');
  cards.forEach((card) => {
    const isActive = card.dataset.kategori === selectedKey;
    card.classList.toggle('category-card--active', isActive);
    card.setAttribute('aria-pressed', String(isActive));
  });
}

/**
 * Kategori secim panelini baslatir ve verilen kapsayiciya ekler.
 * @param {string} containerId - Hedef kapsayici elementin id degeri
 * @returns {void}
 */
export function initCategoryPicker(containerId) {
  const root = document.getElementById(containerId);
  if (!root) {
    console.error(`[category-picker] "${containerId}" kapsayicisi bulunamadi.`);
    return;
  }

  /* 5x2 grid kapsayici (baslik HTML'de zaten mevcut) */
  const grid = createElement('div', { className: 'category-grid' });

  const keys = Object.keys(KATEGORILER);
  keys.forEach((key) => {
    const card = buildCard(key, KATEGORILER[key]);

    card.addEventListener('click', () => {
      activeKey = key;
      setState('kategori', key);
      refreshSelection(grid, key);
    });

    grid.appendChild(card);
  });

  root.appendChild(grid);
}
