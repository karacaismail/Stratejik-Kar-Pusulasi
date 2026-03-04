/**
 * @module CostBreakdown
 * @description Yatay çubuk grafik: maliyet kalemlerini tutara göre sıralı gösterir.
 * Veriler sonuclar.maliyetKalemleri dizisinden gelir.
 */

import { initChart } from './chart-manager.js';
import { formatMoney } from '../services/formatter.js';

/**
 * @typedef {Object} MaliyetKalemi
 * @property {string} ad    - Kalemin adı (örn. "Komisyon", "Kargo")
 * @property {number} tutar - Kalemin tutarı (TL)
 * @property {string} renk  - HEX renk kodu
 */

/**
 * Maliyet kalemlerini tutara göre azalan sırada sıralar
 * @param {MaliyetKalemi[]} kalemler
 * @returns {MaliyetKalemi[]}
 */
function sortByTutarDesc(kalemler) {
  return [...kalemler].sort((a, b) => b.tutar - a.tutar);
}

/**
 * Yatay çubuk grafik seçeneklerini oluşturur
 * @param {MaliyetKalemi[]} kalemler - Sıralı maliyet kalemleri
 * @returns {Object} ECharts option nesnesi
 */
function isDark() {
  return document.documentElement.classList.contains('dark');
}

function buildOption(kalemler) {
  const adlar = kalemler.map((k) => k.ad);
  const tutarlar = kalemler.map((k) => k.tutar);
  const renkler = kalemler.map((k) => k.renk);
  const dark = isDark();
  const txtColor = dark ? '#e5e7eb' : '#374151';
  const txtMuted = dark ? '#9ca3af' : '#6b7280';
  const haloColor = dark ? '#1e293b' : '#ffffff';

  return {
    legend: { show: false },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter(params) {
        const p = params[0];
        return `<strong>${p.name}</strong><br/>${formatMoney(p.value)}`;
      },
    },
    grid: {
      left: '3%',
      right: '12%',
      bottom: '4%',
      top: '4%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: txtMuted,
        formatter(val) {
          return formatMoney(val);
        },
      },
      splitLine: { lineStyle: { type: 'dashed', opacity: 0.4 } },
    },
    yAxis: {
      type: 'category',
      data: adlar,
      inverse: true,
      axisLabel: {
        color: txtColor,
        fontSize: 12,
        width: 120,
        overflow: 'truncate',
      },
      axisTick: { show: false },
    },
    series: [
      {
        name: 'Tutar',
        type: 'bar',
        data: tutarlar.map((val, i) => ({
          value: val,
          itemStyle: { color: renkler[i] },
        })),
        barMaxWidth: 32,
        label: {
          show: true,
          position: 'right',
          fontSize: 11,
          fontWeight: 500,
          color: txtColor,
          textBorderColor: haloColor,
          textBorderWidth: 2,
          formatter(p) {
            return formatMoney(p.value);
          },
        },
        emphasis: {
          itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.25)' },
        },
      },
    ],
    animationDuration: 600,
    animationEasing: 'cubicOut',
  };
}

/**
 * Belirtilen kapsayıcıda maliyet kırılım grafiğini çizer
 * @param {string} containerId - Hedef DOM elemanının kimliği
 * @param {MaliyetKalemi[]} kalemler - Maliyet kalemleri dizisi
 * @returns {echarts.ECharts|null} Grafik örneği veya null
 */
export function renderBreakdownChart(containerId, kalemler) {
  if (!kalemler || kalemler.length === 0) {
    console.warn('[CostBreakdown] Gösterilecek maliyet kalemi yok.');
    return null;
  }

  const chart = initChart(containerId);
  if (!chart) return null;

  const sorted = sortByTutarDesc(kalemler);
  chart.setOption(buildOption(sorted));

  return chart;
}
