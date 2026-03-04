/**
 * @module ComparisonChart
 * @description Gruplandırılmış çubuk grafik: aynı ürünü 5 pazar yerinde
 * karşılaştırır. Net kâr ve net marj yan yana gösterilir.
 */

import { initChart } from './chart-manager.js';
import { formatMoney, formatPercent } from '../services/formatter.js';
import { PAZAR_ADLARI } from '../config/commissions.js';

/**
 * @typedef {Object} PazarKarsilastirma
 * @property {string} pazarId  - Pazar yeri anahtarı (örn. "trendyol")
 * @property {number} netKar   - Net kâr tutarı (TL)
 * @property {number} netMarj  - Net kâr marjı (%)
 */

/** @type {string[]} Grafik renk paleti (kâr ve marj için) */
const SERI_RENKLERI = ['#6366f1', '#f59e0b'];

/**
 * Pazar ID'sini görüntüleme adına çevirir
 * @param {string} pazarId
 * @returns {string}
 */
function pazarAdi(pazarId) {
  return PAZAR_ADLARI[pazarId] || pazarId;
}

/**
 * Gruplandırılmış çubuk grafik seçeneklerini oluşturur
 * @param {PazarKarsilastirma[]} data
 * @returns {Object} ECharts option nesnesi
 */
function buildOption(data) {
  const etiketler = data.map((d) => pazarAdi(d.pazarId || d.pazar));
  const karVerileri = data.map((d) => Number(d.netKar) || 0);
  const marjVerileri = data.map((d) => Number(d.netMarj) || 0);

  return {
    title: {
      text: 'Pazar Yeri Karşılaştırması',
      subtext: 'Aynı ürün, farklı pazar yerleri',
      left: 'center',
      textStyle: { fontSize: 15, fontWeight: 600 },
      subtextStyle: { fontSize: 12 },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter(params) {
        const name = params[0].name;
        const lines = params.map((p) => {
          const renk = p.color;
          const deger = p.seriesName === 'Net Kâr'
            ? formatMoney(p.value)
            : formatPercent(p.value);
          return `<span style="color:${renk}">\u25CF</span> ${p.seriesName}: ${deger}`;
        });
        return `<strong>${name}</strong><br/>${lines.join('<br/>')}`;
      },
    },
    legend: {
      data: ['Net Kâr', 'Net Marj (%)'],
      bottom: '2%',
      textStyle: { fontSize: 11 },
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '14%',
      top: '18%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: etiketler,
      axisLabel: { fontSize: 12, interval: 0 },
      axisTick: { alignWithLabel: true },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Net Kâr (₺)',
        nameTextStyle: { fontSize: 11 },
        axisLabel: {
          formatter(val) {
            return formatMoney(val);
          },
        },
        splitLine: { lineStyle: { type: 'dashed', opacity: 0.4 } },
      },
      {
        type: 'value',
        name: 'Net Marj (%)',
        nameTextStyle: { fontSize: 11 },
        axisLabel: {
          formatter(val) {
            return formatPercent(val, 0);
          },
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'Net Kâr',
        type: 'bar',
        yAxisIndex: 0,
        data: karVerileri.map((val) => ({
          value: val,
          itemStyle: {
            color: val >= 0 ? SERI_RENKLERI[0] : '#ef4444',
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barMaxWidth: 40,
        barGap: '20%',
        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          formatter(p) {
            return formatMoney(p.value);
          },
        },
        emphasis: {
          itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.2)' },
        },
      },
      {
        name: 'Net Marj (%)',
        type: 'bar',
        yAxisIndex: 1,
        data: marjVerileri.map((val) => ({
          value: val,
          itemStyle: {
            color: val >= 0 ? SERI_RENKLERI[1] : '#f87171',
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barMaxWidth: 40,
        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          formatter(p) {
            return formatPercent(p.value, 1);
          },
        },
        emphasis: {
          itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.2)' },
        },
      },
    ],
    animationDuration: 650,
    animationEasing: 'cubicOut',
  };
}

/**
 * Belirtilen kapsayıcıda pazar karşılaştırma grafiğini çizer
 * @param {string} containerId - Hedef DOM elemanının kimliği
 * @param {PazarKarsilastirma[]} data - Pazar karşılaştırma sonuçları
 * @returns {echarts.ECharts|null} Grafik örneği veya null
 */
export function renderComparisonChart(containerId, data) {
  if (!data || data.length === 0) {
    console.warn('[ComparisonChart] Gösterilecek karşılaştırma verisi yok.');
    return null;
  }

  const chart = initChart(containerId);
  if (!chart) return null;

  chart.setOption(buildOption(data));
  return chart;
}
