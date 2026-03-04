/**
 * @fileoverview Detayli finansal dokum tablosu gorunumu.
 * Tum maliyet kalemlerini satir satir gosterir, bold satirlar
 * ara toplamlari (brut kar, matrah, net kar) belirtir.
 * @module views/detail-table-view
 */

import { formatMoney } from '../services/formatter.js';
import { createElement } from '../utils/dom.js';

/**
 * @typedef {Object} SatirTanimi
 * @property {string} etiket - Satir etiketi
 * @property {string} alan - Sonuclar nesnesindeki alan adi
 * @property {boolean} [bold=false] - Kalin yazi mi?
 * @property {string} [prefix=''] - Etiketin oneki
 * @property {string} [ikon] - Tabler ikon sinifi
 */

/** @type {SatirTanimi[]} Tablo satir tanimlari */
const SATIRLAR = [
  { etiket: 'Satis Fiyati',      alan: 'satisFiyati',     prefix: '',    ikon: 'ti-tag' },
  { etiket: 'Efektif Fiyat',     alan: 'efektifFiyat',    prefix: '',    ikon: 'ti-receipt' },
  { etiket: 'Alis Maliyeti',     alan: '_alis',           prefix: '(-)', ikon: 'ti-shopping-cart' },
  { etiket: 'Brut Kar',          alan: 'brutKar',         prefix: '=',   ikon: 'ti-trending-up', bold: true },
  { etiket: 'Komisyon',          alan: 'komisyonTutar',   prefix: '(-)', ikon: 'ti-percentage' },
  { etiket: 'Kargo',             alan: '_kargo',          prefix: '(-)', ikon: 'ti-truck' },
  { etiket: 'Ambalaj',           alan: '_ambalaj',        prefix: '(-)', ikon: 'ti-package' },
  { etiket: 'Odeme Komisyonu',   alan: 'odemeTutar',      prefix: '(-)', ikon: 'ti-credit-card' },
  { etiket: 'Stopaj',            alan: 'stopajTutar',     prefix: '(-)', ikon: 'ti-building-bank' },
  { etiket: 'KDV',               alan: 'kdvTutar',        prefix: '(-)', ikon: 'ti-file-invoice' },
  { etiket: 'Reklam',            alan: '_reklam',         prefix: '(-)', ikon: 'ti-speakerphone' },
  { etiket: 'Depolama',          alan: '_depolama',       prefix: '(-)', ikon: 'ti-building-warehouse' },
  { etiket: 'Iscilik',           alan: '_iscilik',        prefix: '(-)', ikon: 'ti-users' },
  { etiket: 'Ekstra',            alan: '_ekstra',         prefix: '(-)', ikon: 'ti-dots' },
  { etiket: 'Matrah',            alan: 'matrah',          prefix: '=',   ikon: 'ti-calculator', bold: true },
  { etiket: 'Gelir Vergisi',     alan: 'gelirVergisi',    prefix: '(-)', ikon: 'ti-report-money' },
  { etiket: 'Net Kar',           alan: 'netKar',          prefix: '=',   ikon: 'ti-coin', bold: true },
  { etiket: 'Iade Maliyeti',     alan: 'iadeMaliyeti',    prefix: '(-)', ikon: 'ti-arrow-back' },
  { etiket: 'Net Kar (Iade Dahil)', alan: 'netKarIadeDahil', prefix: '=', ikon: 'ti-wallet', bold: true },
];

/**
 * Tek bir tablo satirini olusturur.
 * @param {SatirTanimi} tanim - Satir tanimi
 * @param {number} deger - Gosterilecek tutar
 * @returns {HTMLElement} <tr> elementi
 */
function buildRow(tanim, deger) {
  const isBold = tanim.bold === true;
  const rowClass = isBold ? 'detail-table__row detail-table__row--bold' : 'detail-table__row';

  const etiketMetni = tanim.prefix
    ? `${tanim.prefix} ${tanim.etiket}`
    : tanim.etiket;

  const degerClass = deger < -0.005
    ? 'detail-table__value detail-table__value--negative'
    : deger > 0.005
      ? 'detail-table__value detail-table__value--positive'
      : 'detail-table__value';

  const ikonEl = createElement('i', { className: `ti ${tanim.ikon} detail-table__icon` });
  const etiketSpan = createElement('span', {}, [etiketMetni]);
  const tdEtiket = createElement('td', { className: 'detail-table__label' }, [ikonEl, etiketSpan]);
  const tdDeger = createElement('td', { className: degerClass }, [formatMoney(deger)]);

  return createElement('tr', { className: rowClass }, [tdEtiket, tdDeger]);
}

/**
 * Tablonun tamamini render eder.
 * @param {HTMLElement} tbody - Hedef tbody
 * @param {Object} sonuclar - Hesaplama sonuclari
 * @param {Object} girdiler - Hesaplama girdileri
 */
function renderTable(tbody, sonuclar, girdiler) {
  tbody.textContent = '';

  for (const satir of SATIRLAR) {
    let deger;

    if (satir.alan === 'satisFiyati') {
      deger = girdiler?.satisFiyati ?? 0;
    } else {
      deger = sonuclar[satir.alan] ?? 0;
    }

    tbody.appendChild(buildRow(satir, deger));
  }
}

/**
 * Detay tablosu gorunumunu baslatir.
 * @param {string} containerId - Hedef kapsayici elementin id degeri
 * @returns {{ update: (sonuclar: Object, girdiler: Object) => void }}
 */
export function initDetailTableView(containerId) {
  const root = document.getElementById(containerId);

  if (!root) {
    console.error(`[detail-table-view] "${containerId}" kapsayicisi bulunamadi.`);
    return { update() {} };
  }

  /* Baslik */
  const heading = createElement('h3', { className: 'section-title' }, [
    createElement('i', { className: 'ti ti-list-details section-title__icon' }),
    createElement('span', {}, [' Finansal Dokum']),
  ]);

  /* Tablo iskeleti */
  const thead = createElement('thead', {}, [
    createElement('tr', {}, [
      createElement('th', {}, ['Kalem']),
      createElement('th', {}, ['Tutar']),
    ]),
  ]);

  const tbody = createElement('tbody', {});
  const table = createElement('table', { className: 'detail-table' }, [thead, tbody]);
  const wrapper = createElement('div', { className: 'detail-table__wrapper' }, [table]);

  root.appendChild(heading);
  root.appendChild(wrapper);

  /**
   * Tabloyu guncelle
   * @param {Object} sonuclar - Hesaplama sonuclari
   * @param {Object} girdiler - Hesaplama girdileri
   */
  function update(sonuclar, girdiler) {
    if (!sonuclar) return;
    renderTable(tbody, sonuclar, girdiler);
  }

  return { update };
}
