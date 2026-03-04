/**
 * @fileoverview Rapor sayfasi gorunum kontrolcusu (rapor.html).
 * localStorage'dan hesaplama verisini okuyarak hero metrikler, grafik,
 * detay tablosu, analiz, pazar karsilastirma ve uyarilar render eder.
 * @module views/report-view
 */

import { formatMoney, formatPercent } from '../services/formatter.js';
import { createElement } from '../utils/dom.js';
import { load } from '../services/storage.js';
import { analiz } from '../models/warning-engine.js';

/** @type {string} localStorage anahtari */
const RAPOR_KEY = 'rapor_veri';

/** @param {Object} s @returns {HTMLElement} */
function buildHeroStrip(s) {
  const items = [
    { e: 'Net Kar',  d: formatMoney(s.netKarIadeDahil), i: 'ti-coin',                  r: s.netKarIadeDahil >= 0 ? 'hero--positive' : 'hero--negative' },
    { e: 'Net Marj', d: formatPercent(s.netMarjIade),   i: 'ti-percentage',              r: s.netMarjIade >= 15 ? 'hero--positive' : s.netMarjIade >= 0 ? 'hero--neutral' : 'hero--negative' },
    { e: 'ROI',      d: formatPercent(s.roi),           i: 'ti-chart-arrows-vertical',   r: s.roi >= 20 ? 'hero--positive' : s.roi >= 0 ? 'hero--neutral' : 'hero--negative' },
    { e: 'Brut Kar', d: formatMoney(s.brutKar),         i: 'ti-trending-up',             r: s.brutKar >= 0 ? 'hero--positive' : 'hero--negative' },
  ];
  return createElement('section', { className: 'hero-strip' }, items.map(c =>
    createElement('div', { className: `hero-card ${c.r}` }, [
      createElement('i', { className: `ti ${c.i} hero-card__icon` }),
      createElement('div', { className: 'hero-card__body' }, [
        createElement('span', { className: 'hero-card__label' }, [c.e]),
        createElement('span', { className: 'hero-card__value' }, [c.d]),
      ]),
    ]),
  ));
}

/** @param {Object} s @returns {HTMLElement} */
function buildChartsSection(s) {
  return createElement('section', { className: 'report-section report-section--charts' }, [
    createElement('h2', { className: 'section-title' }, [
      createElement('i', { className: 'ti ti-chart-pie section-title__icon' }),
      createElement('span', {}, [' Maliyet Dagilimi']),
    ]),
    createElement('div', {
      className: 'report-chart', id: 'report-chart-container',
      dataset: { kalemler: JSON.stringify(s.maliyetKalemleri || []) },
    }),
  ]);
}

/** @param {Object} s @param {Object} g @returns {HTMLElement} */
function buildDetailSection(s, g) {
  const defs = [
    ['Satis Fiyati', g.satisFiyati ?? 0], ['Efektif Fiyat', s.efektifFiyat],
    ['(-) Alis Maliyeti', s._alis], ['= Brut Kar', s.brutKar, 1],
    ['(-) Komisyon', s.komisyonTutar], ['(-) Kargo', s._kargo],
    ['(-) Ambalaj', s._ambalaj], ['(-) Odeme Komisyonu', s.odemeTutar],
    ['(-) Stopaj', s.stopajTutar], ['(-) KDV', s.kdvTutar],
    ['(-) Reklam', s._reklam], ['(-) Depolama', s._depolama],
    ['(-) Iscilik', s._iscilik], ['(-) Ekstra', s._ekstra],
    ['= Matrah', s.matrah, 1], ['(-) Gelir Vergisi', s.gelirVergisi],
    ['= Net Kar', s.netKar, 1], ['(-) Iade Maliyeti', s.iadeMaliyeti],
    ['= Net Kar (Iade Dahil)', s.netKarIadeDahil, 1],
  ];
  const rows = defs.map(([e, d, b]) => {
    const rc = b ? 'detail-table__row detail-table__row--bold' : 'detail-table__row';
    const vc = (d ?? 0) < -0.005 ? 'detail-table__value detail-table__value--negative' : 'detail-table__value';
    return createElement('tr', { className: rc }, [
      createElement('td', { className: 'detail-table__label' }, [e]),
      createElement('td', { className: vc }, [formatMoney(d ?? 0)]),
    ]);
  });
  const hdr = createElement('tr', {}, [createElement('th', {}, ['Kalem']), createElement('th', {}, ['Tutar'])]);
  return createElement('section', { className: 'report-section' }, [
    createElement('h2', { className: 'section-title' }, [
      createElement('i', { className: 'ti ti-list-details section-title__icon' }),
      createElement('span', {}, [' Finansal Dokum']),
    ]),
    createElement('div', { className: 'detail-table__wrapper' }, [
      createElement('table', { className: 'detail-table' }, [
        createElement('thead', {}, [hdr]), createElement('tbody', {}, rows),
      ]),
    ]),
  ]);
}

/** @param {Object} s @returns {HTMLElement} */
function buildAnalysisCards(s) {
  const defs = [
    ['ROI', formatPercent(s.roi), 'ti-chart-arrows-vertical'],
    ['Guvenlik Marji', formatPercent(s.guvenlikMarji), 'ti-shield-check'],
    ['Birim Maliyet', formatMoney(s.birimMaliyet), 'ti-box'],
    ['Kar/Maliyet', formatPercent(s.karMaliyet), 'ti-scale'],
    ['Basabas Fiyati', formatMoney(s.basabasFiyat), 'ti-arrows-horizontal'],
    ['Aylik Net Kar', formatMoney(s.aylikNetKar), 'ti-calendar-dollar'],
  ];
  const cards = defs.map(([e, d, i]) => createElement('div', { className: 'analysis-card' }, [
    createElement('i', { className: `ti ${i} analysis-card__icon` }),
    createElement('span', { className: 'analysis-card__label' }, [e]),
    createElement('span', { className: 'analysis-card__value' }, [d]),
  ]));
  return createElement('section', { className: 'report-section' }, [
    createElement('h2', { className: 'section-title' }, [
      createElement('i', { className: 'ti ti-analyze section-title__icon' }),
      createElement('span', {}, [' Analiz Gostergeleri']),
    ]),
    createElement('div', { className: 'analysis-grid' }, cards),
  ]);
}

/**
 * @param {Array<{pazar: string, netKar: number, netMarj: number}>} [data]
 * @returns {HTMLElement|null}
 */
function buildMarketplaceComparison(data) {
  if (!data || data.length === 0) return null;
  const rows = data.map(p => createElement('tr', { className: 'detail-table__row' }, [
    createElement('td', {}, [p.pazar]),
    createElement('td', { className: p.netKar >= 0 ? 'detail-table__value--positive' : 'detail-table__value--negative' }, [formatMoney(p.netKar)]),
    createElement('td', {}, [formatPercent(p.netMarj)]),
  ]));
  const hdr = createElement('tr', {}, [createElement('th', {}, ['Pazar Yeri']), createElement('th', {}, ['Net Kar']), createElement('th', {}, ['Net Marj'])]);
  return createElement('section', { className: 'report-section' }, [
    createElement('h2', { className: 'section-title' }, [
      createElement('i', { className: 'ti ti-building-store section-title__icon' }),
      createElement('span', {}, [' Pazar Yeri Karsilastirma']),
    ]),
    createElement('div', { className: 'detail-table__wrapper' }, [
      createElement('table', { className: 'detail-table' }, [
        createElement('thead', {}, [hdr]), createElement('tbody', {}, rows),
      ]),
    ]),
  ]);
}

/**
 * @param {import('../models/warning-engine.js').Uyari[]} uyarilar
 * @returns {HTMLElement|null}
 */
function buildWarnings(uyarilar) {
  if (!uyarilar || uyarilar.length === 0) return null;
  const items = uyarilar.map(u => createElement('div', { className: `warning-card warning-card--${u.tip}` }, [
    createElement('i', { className: `ti ${u.ikon} warning-card__icon` }),
    createElement('div', { className: 'warning-card__body' }, [
      createElement('p', { className: 'warning-card__message' }, [u.mesaj]),
      ...(u.oneri ? [createElement('p', { className: 'warning-card__suggestion' }, [u.oneri])] : []),
    ]),
  ]));
  return createElement('section', { className: 'report-section' }, [
    createElement('h2', { className: 'section-title' }, [
      createElement('i', { className: 'ti ti-alert-circle section-title__icon' }),
      createElement('span', {}, [' Uyarilar ve Oneriler']),
    ]),
    createElement('div', { className: 'warnings-list' }, items),
  ]);
}

/**
 * Rapor gorunumunu baslatir. localStorage'dan veri okur, render eder.
 */
export function initReportView() {
  const root = document.getElementById('report-root');
  if (!root) { console.error('[report-view] #report-root bulunamadi.'); return; }

  const veri = load(RAPOR_KEY, null);
  if (!veri || !veri.sonuclar) {
    root.appendChild(createElement('div', { className: 'report-empty' }, [
      createElement('i', { className: 'ti ti-file-off report-empty__icon' }),
      createElement('h2', {}, ['Rapor Verisi Bulunamadi']),
      createElement('p', {}, ['Hesaplama yapildiktan sonra rapor sayfasina yonlendirilirsiniz.']),
      createElement('a', { className: 'btn btn--primary', href: 'index.html' }, [
        createElement('i', { className: 'ti ti-arrow-left' }),
        createElement('span', {}, [' Hesaplayiciya Don']),
      ]),
    ]));
    return;
  }

  const { sonuclar: s, girdiler: g, pazarKarsilastirma, pazar } = veri;
  const uyarilar = analiz(s, g, { pazar });

  root.appendChild(buildHeroStrip(s));
  root.appendChild(buildChartsSection(s));
  root.appendChild(buildDetailSection(s, g));
  root.appendChild(buildAnalysisCards(s));
  const mkt = buildMarketplaceComparison(pazarKarsilastirma);
  if (mkt) root.appendChild(mkt);
  const wrn = buildWarnings(uyarilar);
  if (wrn) root.appendChild(wrn);
}

/* rapor.html icin otomatik baslat */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReportView);
} else {
  initReportView();
}
