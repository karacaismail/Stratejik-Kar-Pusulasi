/**
 * @fileoverview Pazar yeri secim gorunumu.
 * Yatay kaydirma destekli kartlar ile 5 pazar yerini listeler.
 * Secim yapildiktan sonra komisyon bilgisi gosterilir.
 * @module views/marketplace-picker
 */

import { createElement } from '../utils/dom.js';
import { setState, getState } from '../models/state.js';
import {
  PAZAR_ADLARI,
  PAZAR_IKONLARI,
  getKomisyon,
} from '../config/commissions.js';

/** @type {string|null} Secili pazar yeri anahtari */
let activePazar = null;

/** @type {HTMLElement|null} Komisyon bilgi cubugu referansi */
let infoBar = null;

/**
 * Tek bir pazar yeri kartini olusturur.
 * @param {string} id - Pazar yeri anahtari (orn. 'trendyol')
 * @param {string} name - Goruntuleme adi
 * @param {string} iconCls - Tabler ikon sinifi
 * @returns {HTMLElement}
 */
function buildMarketCard(id, name, iconCls) {
  const card = createElement('button', {
    className: 'marketplace-card',
    type: 'button',
    dataset: { pazar: id },
    ariaLabel: name,
  });

  const icon = createElement('i', {
    className: `ti ${iconCls} marketplace-card__icon`,
  });

  const label = createElement('span', {
    className: 'marketplace-card__label',
    textContent: name,
  });

  card.appendChild(icon);
  card.appendChild(label);
  return card;
}

/**
 * Tum kartlarin secim durumunu gunceller.
 * @param {HTMLElement} container
 * @param {string} selectedId
 */
function refreshSelection(container, selectedId) {
  const cards = container.querySelectorAll('.marketplace-card');
  cards.forEach((card) => {
    const isActive = card.dataset.pazar === selectedId;
    card.classList.toggle('marketplace-card--active', isActive);
    card.setAttribute('aria-pressed', String(isActive));
  });
}

/**
 * Komisyon bilgi cubugunun icerigini gunceller.
 * Kategori veya pazar yeri secimi henuz yapilmadiysa cubugu gizler.
 */
function refreshInfoBar() {
  if (!infoBar) return;

  const kategori = getState('kategori');
  const pazar = getState('pazar');

  if (!kategori || !pazar) {
    infoBar.classList.add('commission-info--hidden');
    infoBar.textContent = '';
    return;
  }

  const oran = getKomisyon(pazar, kategori);
  const pazarAdi = PAZAR_ADLARI[pazar] || pazar;

  infoBar.classList.remove('commission-info--hidden');
  infoBar.innerHTML = '';

  const icon = createElement('i', { className: 'ti ti-info-circle commission-info__icon' });
  const text = document.createTextNode(` ${pazarAdi} komisyonu: %${oran}`);
  infoBar.appendChild(icon);
  infoBar.appendChild(text);
}

/**
 * Pazar yeri secim panelini baslatir.
 * @param {string} containerId - Hedef kapsayici elementin id degeri
 * @returns {void}
 */
export function initMarketplacePicker(containerId) {
  const root = document.getElementById(containerId);
  if (!root) {
    console.error(`[marketplace-picker] "${containerId}" kapsayicisi bulunamadi.`);
    return;
  }

  /* Yatay kaydirma kapsayicisi (baslik HTML'de zaten mevcut) */
  const scroll = createElement('div', { className: 'marketplace-scroll' });

  const pazarIds = Object.keys(PAZAR_ADLARI);
  pazarIds.forEach((id) => {
    const card = buildMarketCard(id, PAZAR_ADLARI[id], PAZAR_IKONLARI[id]);

    card.addEventListener('click', () => {
      activePazar = id;
      setState('pazar', id);
      refreshSelection(scroll, id);
      refreshInfoBar();
    });

    scroll.appendChild(card);
  });

  root.appendChild(scroll);

  /* Komisyon bilgi cubugu */
  infoBar = createElement('div', {
    className: 'commission-info commission-info--hidden',
    role: 'status',
    ariaLive: 'polite',
  });
  root.appendChild(infoBar);
}
