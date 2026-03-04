/**
 * @module CargoPickerView
 * @description Kargo firmasi secici — radio-tarzı kartlar ile 7 firma
 *              Secim state gunceller ve olay yayar.
 */

import { getKargoFirmalari, getKargoListesi, hesaplaKargoUcreti } from '../config/config-manager.js';
import { createElement } from '../utils/dom.js';
import { setState } from '../models/state.js';
import { emit } from '../utils/event-bus.js';
import { formatMoney } from '../services/formatter.js';

/** Secili kartin CSS sinifi */
const SELECTED_CLASS = 'cargo-card--selected';

/**
 * @typedef {Object} CargoPickerViewAPI
 * @property {Function} getSelectedCargo - Secili kargo firma ID dondurur
 * @property {Function} setDesi          - Desi degerini guncelleyerek fiyatlari yeniler
 */

/**
 * Tek bir kargo karti olustur
 * @param {string} firmaId - Firma kimlik anahtari
 * @param {import('../config/cargo-companies.js').KargoFirmasi} firma - Firma verisi
 * @param {Function} onSelect - Secim callback
 * @returns {HTMLElement}
 */
function createCargoCard(firmaId, firma, onSelect) {
  const card = createElement('div', {
    className: 'cargo-card',
    dataset: { firmaId },
    role: 'radio',
    'aria-checked': 'false',
    tabindex: '0',
  });

  const iconWrap = createElement('div', { className: 'cargo-card__icon' }, [
    createElement('i', { className: `ti ${firma.ikon}` }),
  ]);

  const name = createElement('div', { className: 'cargo-card__name' }, [firma.ad]);

  const price = createElement('div', {
    className: 'cargo-card__price text-sm text-muted',
  }, [formatMoney(firma.varsayilanUcret)]);

  const check = createElement('div', { className: 'cargo-card__check' }, [
    createElement('i', { className: 'ti ti-circle-check' }),
  ]);

  card.append(iconWrap, name, price, check);

  card.addEventListener('click', () => onSelect(firmaId, card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(firmaId, card);
    }
  });

  return card;
}

/**
 * Kargo secici gorunumunu baslat
 * @param {string} containerId - Hedef container ID
 * @returns {CargoPickerViewAPI}
 */
export function initCargoPickerView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    return { getSelectedCargo: () => null, setDesi: () => {} };
  }

  const KARGO_FIRMALARI = getKargoFirmalari();
  const KARGO_LISTESI = getKargoListesi();

  let selectedId = /** @type {string|null} */ (null);
  let currentDesi = 1;

  /** @type {Map<string, HTMLElement>} */
  const cardMap = new Map();

  /* -- Baslik -- */
  const header = createElement('div', { className: 'cargo-picker__header' }, [
    createElement('i', { className: 'ti ti-truck-delivery cargo-picker__icon' }),
    createElement('span', { className: 'cargo-picker__title' }, ['Kargo Firmasi']),
  ]);

  /* -- Kart Listesi -- */
  const grid = createElement('div', {
    className: 'cargo-picker__grid',
    role: 'radiogroup',
    'aria-label': 'Kargo firmasi secimi',
  });

  /**
   * Kart secim islemi
   * @param {string} firmaId
   * @param {HTMLElement} card
   */
  const handleSelect = (firmaId, card) => {
    /* Onceki secimi kaldir */
    if (selectedId) {
      const prev = cardMap.get(selectedId);
      if (prev) {
        prev.classList.remove(SELECTED_CLASS);
        prev.setAttribute('aria-checked', 'false');
      }
    }

    /* Yeni secimi uygula */
    selectedId = firmaId;
    card.classList.add(SELECTED_CLASS);
    card.setAttribute('aria-checked', 'true');

    setState('kargoFirmasi', firmaId);

    const ucret = hesaplaKargoUcreti(firmaId, currentDesi);
    emit('cargo:select', { firmaId, ucret, desi: currentDesi });
  };

  /* Kartlari olustur */
  KARGO_LISTESI.forEach((firmaId) => {
    const firma = KARGO_FIRMALARI[firmaId];
    const card = createCargoCard(firmaId, firma, handleSelect);
    cardMap.set(firmaId, card);
    grid.appendChild(card);
  });

  /* -- Secili Firma Bilgi Satiri -- */
  const infoBar = createElement('div', {
    className: 'cargo-picker__info text-sm text-muted text-center py-1',
  });

  /* -- DOM Birlestir -- */
  const wrapper = createElement('div', { className: 'cargo-picker' });
  wrapper.append(header, grid, infoBar);
  container.appendChild(wrapper);

  /**
   * Bilgi satirini guncelle
   * @param {string} firmaId
   */
  const updateInfoBar = (firmaId) => {
    if (!firmaId) {
      infoBar.textContent = '';
      return;
    }
    const firma = KARGO_FIRMALARI[firmaId];
    const ucret = hesaplaKargoUcreti(firmaId, currentDesi);
    infoBar.innerHTML = '';
    infoBar.append(
      createElement('i', { className: 'ti ti-info-circle' }),
      createElement('span', {}, [
        ` ${firma.ad}: ${formatMoney(ucret)} (${currentDesi} desi)`,
      ]),
    );
  };

  /* -- Public API -- */
  return {
    /** @returns {string|null} Secili kargo firma ID */
    getSelectedCargo: () => selectedId,

    /**
     * Desi degerini guncelleyerek fiyatlari yenile
     * @param {number} desi
     */
    setDesi: (desi) => {
      currentDesi = desi;

      /* Tum kartlardaki fiyatlari guncelle */
      KARGO_LISTESI.forEach((firmaId) => {
        const card = cardMap.get(firmaId);
        if (!card) return;
        const priceEl = card.querySelector('.cargo-card__price');
        if (priceEl) {
          priceEl.textContent = formatMoney(hesaplaKargoUcreti(firmaId, desi));
        }
      });

      updateInfoBar(selectedId);
    },
  };
}
