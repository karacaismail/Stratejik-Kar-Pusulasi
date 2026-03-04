/**
 * @module AlertsView
 * @description Uyari/bildirim kartlari gorunumu
 *              Warning engine ciktisini tip bazli stillendirilmis kartlara donusturur.
 */

import { createElement } from '../utils/dom.js';

/**
 * @typedef {Object} AlertsViewAPI
 * @property {Function} update - Uyari listesini guncelleyerek gorunumu yeniler
 */

/**
 * @typedef {Object} Uyari
 * @property {'tehlike'|'uyari'|'bilgi'|'basari'} tip
 * @property {string} mesaj
 * @property {string} [oneri]
 * @property {string} [ikon]
 */

/** Tip bazli stil ve ikon eslestirmesi */
const TIP_CONFIG = {
  tehlike: {
    className: 'alert-card--tehlike',
    defaultIcon: 'ti-alert-triangle',
    ariaLabel: 'Tehlike',
  },
  uyari: {
    className: 'alert-card--uyari',
    defaultIcon: 'ti-alert-circle',
    ariaLabel: 'Uyari',
  },
  bilgi: {
    className: 'alert-card--bilgi',
    defaultIcon: 'ti-info-circle',
    ariaLabel: 'Bilgi',
  },
  basari: {
    className: 'alert-card--basari',
    defaultIcon: 'ti-circle-check',
    ariaLabel: 'Basari',
  },
};

/**
 * Tek bir uyari karti olustur
 * @param {Uyari} uyari
 * @returns {HTMLElement}
 */
function createAlertCard(uyari) {
  const config = TIP_CONFIG[uyari.tip] || TIP_CONFIG.bilgi;
  const iconClass = uyari.ikon || config.defaultIcon;

  const iconEl = createElement('div', { className: 'alert-card__icon' }, [
    createElement('i', { className: `ti ${iconClass}` }),
  ]);

  const mesajEl = createElement('div', { className: 'alert-card__mesaj' }, [uyari.mesaj]);

  const bodyChildren = [mesajEl];

  if (uyari.oneri) {
    const oneriEl = createElement('div', { className: 'alert-card__oneri text-sm' }, [
      createElement('i', { className: 'ti ti-bulb alert-card__oneri-icon' }),
      createElement('span', {}, [uyari.oneri]),
    ]);
    bodyChildren.push(oneriEl);
  }

  const body = createElement('div', { className: 'alert-card__body' }, bodyChildren);

  const card = createElement('div', {
    className: `alert-card ${config.className}`,
    role: 'alert',
    'aria-label': config.ariaLabel,
  }, [iconEl, body]);

  return card;
}

/**
 * Bos durum mesaji olustur
 * @returns {HTMLElement}
 */
function createEmptyState() {
  return createElement('div', { className: 'alerts-empty text-sm text-muted text-center py-4' }, [
    createElement('i', { className: 'ti ti-mood-smile alerts-empty__icon' }),
    createElement('span', {}, [' Herhangi bir uyari bulunmuyor.']),
  ]);
}

/**
 * Uyari basligini olustur
 * @param {number} count - Toplam uyari sayisi
 * @returns {HTMLElement}
 */
function createHeader(count) {
  const badge = count > 0
    ? createElement('span', { className: 'alerts-header__badge' }, [String(count)])
    : null;

  const children = [
    createElement('i', { className: 'ti ti-bell-ringing alerts-header__icon' }),
    createElement('span', {}, ['Uyarilar']),
  ];

  if (badge) children.push(badge);

  return createElement('div', { className: 'alerts-header' }, children);
}

/**
 * Uyarilari oncelik sirasina gore sirala
 * @param {Uyari[]} uyarilar
 * @returns {Uyari[]}
 */
function sortByPriority(uyarilar) {
  const order = { tehlike: 0, uyari: 1, bilgi: 2, basari: 3 };
  return [...uyarilar].sort((a, b) => {
    const oa = order[a.tip] ?? 99;
    const ob = order[b.tip] ?? 99;
    return oa - ob;
  });
}

/**
 * Uyari gorunumunu baslat
 * @param {string} containerId - Hedef container ID
 * @returns {AlertsViewAPI}
 */
export function initAlertsView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    return { update: () => {} };
  }

  const wrapper = createElement('div', {
    className: 'alerts-view',
    role: 'region',
    'aria-label': 'Uyari ve bildirimler',
  });

  container.innerHTML = '';
  container.appendChild(wrapper);

  /* -- Public API -- */
  return {
    /**
     * Uyari listesini guncelleyerek gorunumu yenile
     * @param {Uyari[]} uyarilar
     */
    update: (uyarilar) => {
      wrapper.innerHTML = '';

      const list = Array.isArray(uyarilar) ? uyarilar : [];
      const header = createHeader(list.length);
      wrapper.appendChild(header);

      if (list.length === 0) {
        wrapper.appendChild(createEmptyState());
        return;
      }

      const sorted = sortByPriority(list);
      const cardList = createElement('div', { className: 'alerts-view__list' });

      sorted.forEach((uyari) => {
        cardList.appendChild(createAlertCard(uyari));
      });

      wrapper.appendChild(cardList);
    },
  };
}
