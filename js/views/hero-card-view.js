/**
 * @module HeroCardView
 * @description Ana kar/zarar gorunumu — buyuk sayi, renk kodlu, 5 metrik
 *              Net Kar, Net Marj, Iade Dahil Net Kar, Efektif Fiyat, Brut Kar
 */

import { createElement } from '../utils/dom.js';
import { formatMoney, formatPercent } from '../services/formatter.js';

/** Renk durumlari */
const COLOR_STATES = {
  profit: { className: 'hero-card--profit', label: 'Kar' },
  loss: { className: 'hero-card--loss', label: 'Zarar' },
  neutral: { className: 'hero-card--neutral', label: 'Notr' },
};

/**
 * Degere gore renk durumunu belirle
 * @param {number} value
 * @returns {'profit'|'loss'|'neutral'}
 */
function getColorState(value) {
  if (value > 0.01) return 'profit';
  if (value < -0.01) return 'loss';
  return 'neutral';
}

/**
 * Hero kart gorunumunu baslat
 * @param {string} containerId - Hedef container ID
 * @returns {{ update: (sonuclar: Object) => void }}
 */
export function initHeroCardView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    return { update: () => {} };
  }

  /* ── Ana Kar/Zarar Alani ── */
  const iconInner = createElement('i', { className: 'ti ti-minus text-3xl' });
  const iconWrap = createElement('div', { className: 'hero-card__icon' }, [iconInner]);

  const heroLabel = createElement('p', {
    className: 'text-sm text-gray-500 dark:text-gray-400',
    textContent: 'Net Kar',
  });
  const heroValue = createElement('p', {
    className: 'text-3xl font-bold',
    textContent: '--',
  });
  const heroSublabel = createElement('p', {
    className: 'text-sm text-gray-500 dark:text-gray-400 mt-1',
  });

  const textWrap = createElement('div', {}, [heroLabel, heroValue, heroSublabel]);
  const heroMain = createElement('div', { className: 'hero-card__main' }, [iconWrap, textWrap]);

  /* ── Metrik Satirlari ── */
  const netMarjVal = createElement('span', { className: 'font-semibold', textContent: '--' });
  const iadeDahilVal = createElement('span', { className: 'font-semibold', textContent: '--' });
  const efektifVal = createElement('span', { className: 'font-semibold', textContent: '--' });
  const brutKarVal = createElement('span', { className: 'font-semibold', textContent: '--' });

  function metricCol(iconClass, label, valueEl) {
    return createElement('div', { className: 'hero-metric' }, [
      createElement('i', { className: `ti ${iconClass}` }),
      createElement('span', { className: 'text-xs text-gray-500', textContent: label }),
      valueEl,
    ]);
  }

  const metricsGrid = createElement('div', { className: 'hero-card__metrics' }, [
    metricCol('ti-percentage', 'Net Marj', netMarjVal),
    metricCol('ti-receipt-refund', 'Iade Dahil Net Kar', iadeDahilVal),
    metricCol('ti-tag', 'Efektif Fiyat', efektifVal),
    metricCol('ti-chart-bar', 'Brut Kar', brutKarVal),
  ]);

  /* ── Kart Wrapper ── */
  const card = createElement('div', {
    className: 'hero-card hero-card--neutral',
    role: 'region',
    'aria-label': 'Kar/Zarar Ozeti',
  });
  card.append(heroMain, metricsGrid);
  container.innerHTML = '';
  container.appendChild(card);

  /**
   * Renk sinifini guncelle
   * @param {'profit'|'loss'|'neutral'} state
   */
  const applyColorState = (state) => {
    Object.values(COLOR_STATES).forEach((s) => card.classList.remove(s.className));
    card.classList.add(COLOR_STATES[state].className);
  };

  /**
   * Icon sinifini guncelle
   * @param {'profit'|'loss'|'neutral'} state
   */
  const updateIcon = (state) => {
    const iconName = state === 'profit'
      ? 'ti-trending-up'
      : state === 'loss'
        ? 'ti-trending-down'
        : 'ti-minus';
    iconInner.className = `ti ${iconName} text-3xl`;
  };

  /* ── Public API ── */
  return {
    /**
     * Sonuclari guncelleyerek hero karti yenile
     * @param {Object} sonuclar
     */
    update: (sonuclar) => {
      if (!sonuclar) return;

      const {
        netKar = 0,
        netMarj: marjVal = 0,
        netKarIadeDahil: iadeVal = 0,
        efektifFiyat: efVal = 0,
        brutKar: brutVal = 0,
      } = sonuclar;

      /* Ana deger */
      const state = getColorState(netKar);
      heroValue.textContent = formatMoney(netKar);
      heroSublabel.textContent = netKar >= 0
        ? `Birim basina ${formatMoney(netKar)} kar`
        : `Birim basina ${formatMoney(Math.abs(netKar))} zarar`;

      applyColorState(state);
      updateIcon(state);

      /* Metrik satirlari */
      netMarjVal.textContent = formatPercent(marjVal);
      iadeDahilVal.textContent = formatMoney(iadeVal);
      efektifVal.textContent = formatMoney(efVal);
      brutKarVal.textContent = formatMoney(brutVal);
    },
  };
}
