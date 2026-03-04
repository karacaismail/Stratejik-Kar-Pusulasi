/**
 * @fileoverview Finansal metrik kartlari gorunumu.
 * ROI, guvenlik marji, birim maliyet gibi kritik gostergeleri
 * renk kodlu kartlar halinde gorsellestirir.
 * @module views/metrics-view
 */

import { formatMoney, formatPercent } from '../services/formatter.js';
import { createElement } from '../utils/dom.js';

/**
 * @typedef {Object} MetrikTanimi
 * @property {string} id - Benzersiz metrik kimlik
 * @property {string} etiket - Gosterge etiketi
 * @property {string} ikon - Tabler ikon sinifi
 * @property {string} alan - Sonuclardaki alan adi
 * @property {'money'|'percent'} format - Gosterim formati
 * @property {function(number): string} renkBelirle - Renk sinifi donduren fonksiyon
 */

/** @param {number} v @returns {string} Yuzde icin renk (yuksek=iyi) */
function renkYuzdePositif(v) {
  if (v >= 20) return 'metric-card--success';
  if (v >= 10) return 'metric-card--info';
  if (v >= 0) return 'metric-card--warning';
  return 'metric-card--danger';
}

/** @param {number} v @returns {string} Para icin renk */
function renkParaPositif(v) {
  if (v > 0.01) return 'metric-card--success';
  if (v >= -0.01) return 'metric-card--warning';
  return 'metric-card--danger';
}

/** @param {number} v @returns {string} Maliyet icin renk (notr) */
function renkMaliyet(v) {
  return v > 0 ? 'metric-card--info' : 'metric-card--muted';
}

/** @type {MetrikTanimi[]} Gosterilecek metrik tanimlari */
const METRIKLER = [
  { id: 'roi',           etiket: 'ROI',                  ikon: 'ti-chart-arrows-vertical', alan: 'roi',           format: 'percent', renkBelirle: renkYuzdePositif },
  { id: 'guvenlikMarji', etiket: 'Guvenlik Marji (MoS)', ikon: 'ti-shield-check',          alan: 'guvenlikMarji', format: 'percent', renkBelirle: renkYuzdePositif },
  { id: 'birimMaliyet',  etiket: 'Birim Maliyet',        ikon: 'ti-box',                   alan: 'birimMaliyet',  format: 'money',   renkBelirle: renkMaliyet },
  { id: 'karMaliyet',    etiket: 'Kar/Maliyet Orani',    ikon: 'ti-scale',                 alan: 'karMaliyet',    format: 'percent', renkBelirle: renkYuzdePositif },
  { id: 'basabasFiyat',  etiket: 'Basabas Fiyati',       ikon: 'ti-arrows-horizontal',     alan: 'basabasFiyat',  format: 'money',   renkBelirle: renkMaliyet },
  { id: 'aylikNetKar',   etiket: 'Aylik Net Kar',        ikon: 'ti-calendar-dollar',       alan: 'aylikNetKar',   format: 'money',   renkBelirle: renkParaPositif },
];

/** CSS renk siniflarinin listesi (toggle icin) */
const RENK_SINIFLARI = [
  'metric-card--success', 'metric-card--info',
  'metric-card--warning', 'metric-card--danger', 'metric-card--muted',
];

/**
 * Metrik degerini formatlar.
 * @param {number} deger - Ham deger
 * @param {'money'|'percent'} format - Format tipi
 * @returns {string}
 */
function formatDeger(deger, format) {
  return format === 'percent' ? formatPercent(deger) : formatMoney(deger);
}

/**
 * Tek bir metrik karti olusturur.
 * @param {MetrikTanimi} tanim - Metrik tanimi
 * @returns {{ card: HTMLElement, guncelle: (deger: number) => void }}
 */
function buildCard(tanim) {
  const valueEl = createElement('span', { className: 'metric-card__value' }, ['--']);

  const card = createElement('div', {
    className: 'metric-card',
    dataset: { metric: tanim.id },
  }, [
    createElement('i', { className: `ti ${tanim.ikon} metric-card__icon` }),
    createElement('div', { className: 'metric-card__info' }, [
      createElement('span', { className: 'metric-card__label' }, [tanim.etiket]),
      valueEl,
    ]),
  ]);

  /** @param {number} deger */
  function guncelle(deger) {
    valueEl.textContent = formatDeger(deger, tanim.format);
    card.classList.remove(...RENK_SINIFLARI);
    card.classList.add(tanim.renkBelirle(deger));
  }

  return { card, guncelle };
}

/**
 * Metrik kartlari gorunumunu baslatir.
 * @param {string} containerId - Hedef kapsayici elementin id degeri
 * @returns {{ update: (sonuclar: Object) => void }}
 */
export function initMetricsView(containerId) {
  const root = document.getElementById(containerId);
  if (!root) {
    console.error(`[metrics-view] "${containerId}" kapsayicisi bulunamadi.`);
    return { update() {} };
  }

  const heading = createElement('h3', { className: 'section-title' }, [
    createElement('i', { className: 'ti ti-dashboard section-title__icon' }),
    createElement('span', {}, [' Temel Gostergeler']),
  ]);

  const grid = createElement('div', { className: 'metrics-grid' });

  /** @type {Map<string, function(number): void>} */
  const guncelleyiciler = new Map();

  for (const tanim of METRIKLER) {
    const { card, guncelle } = buildCard(tanim);
    guncelleyiciler.set(tanim.alan, guncelle);
    grid.appendChild(card);
  }

  root.appendChild(heading);
  root.appendChild(grid);

  /**
   * Tum metrik kartlarini guncelle.
   * @param {Object} sonuclar - Hesaplama sonuclari
   */
  function update(sonuclar) {
    if (!sonuclar) return;
    for (const tanim of METRIKLER) {
      const fn = guncelleyiciler.get(tanim.alan);
      if (fn) fn(sonuclar[tanim.alan] ?? 0);
    }
  }

  return { update };
}
