/**
 * @module SensitivityChart
 * @description Tornado (kelebek) grafik: her parametrenin ±%10 değişiminin
 * net kâra etkisini gösterir. Negatif etki kırmızı, pozitif etki yeşil.
 */

import { initChart } from './chart-manager.js';
import { formatMoney } from '../services/formatter.js';

/**
 * @typedef {Object} DuyarlilikSatiri
 * @property {string} parametre   - Parametre adı (örn. "Satış Fiyatı")
 * @property {number} asagiEtki   - -%10 uygulandığında net kâr değişimi (TL)
 * @property {number} yukariEtki  - +%10 uygulandığında net kâr değişimi (TL)
 */

/** @type {string} Negatif etki rengi */
const RENK_NEGATIF = '#ef4444';

/** @type {string} Pozitif etki rengi */
const RENK_POZITIF = '#22c55e';

/**
 * Etki büyüklüğüne göre satırları sıralar (en etkili üstte)
 * @param {DuyarlilikSatiri[]} data
 * @returns {DuyarlilikSatiri[]}
 */
function sortByImpact(data) {
  return [...data].sort((a, b) => {
    const spreadA = Math.abs(a.yukariEtki) + Math.abs(a.asagiEtki);
    const spreadB = Math.abs(b.yukariEtki) + Math.abs(b.asagiEtki);
    return spreadA - spreadB;
  });
}

/**
 * Tornado grafik seçeneklerini oluşturur
 * @param {DuyarlilikSatiri[]} data
 * @returns {Object} ECharts option nesnesi
 */
function buildOption(data) {
  const sorted = sortByImpact(data);
  const parametreler = sorted.map((d) => d.parametre);
  const asagiVeriler = sorted.map((d) => d.asagiEtki);
  const yukariVeriler = sorted.map((d) => d.yukariEtki);

  return {
    title: {
      text: 'Duyarlılık Analizi',
      subtext: 'Parametrelerin ±%10 değişiminin net kâra etkisi',
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
          const label = p.seriesName;
          const renk = p.color;
          const deger = formatMoney(p.value);
          return `<span style="color:${renk}">\u25CF</span> ${label}: ${deger}`;
        });
        return `<strong>${name}</strong><br/>${lines.join('<br/>')}`;
      },
    },
    legend: {
      data: ['-%10 Etki', '+%10 Etki'],
      bottom: '2%',
      textStyle: { fontSize: 11 },
    },
    grid: {
      left: '4%',
      right: '8%',
      bottom: '12%',
      top: '18%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter(val) {
          return formatMoney(val);
        },
      },
      splitLine: { lineStyle: { type: 'dashed', opacity: 0.4 } },
    },
    yAxis: {
      type: 'category',
      data: parametreler,
      axisLabel: {
        fontSize: 12,
        width: 130,
        overflow: 'truncate',
      },
      axisTick: { show: false },
    },
    series: [
      {
        name: '-%10 Etki',
        type: 'bar',
        stack: 'tornado',
        data: asagiVeriler.map((val) => ({
          value: val,
          itemStyle: {
            color: val < 0 ? RENK_NEGATIF : RENK_POZITIF,
            borderRadius: val < 0 ? [4, 0, 0, 4] : [0, 4, 4, 0],
          },
        })),
        barMaxWidth: 28,
        label: {
          show: true,
          position: 'left',
          fontSize: 10,
          formatter(p) {
            return p.value !== 0 ? formatMoney(p.value) : '';
          },
        },
        emphasis: {
          itemStyle: { shadowBlur: 6, shadowColor: 'rgba(0,0,0,0.2)' },
        },
      },
      {
        name: '+%10 Etki',
        type: 'bar',
        stack: 'tornado',
        data: yukariVeriler.map((val) => ({
          value: val,
          itemStyle: {
            color: val >= 0 ? RENK_POZITIF : RENK_NEGATIF,
            borderRadius: val >= 0 ? [0, 4, 4, 0] : [4, 0, 0, 4],
          },
        })),
        barMaxWidth: 28,
        label: {
          show: true,
          position: 'right',
          fontSize: 10,
          formatter(p) {
            return p.value !== 0 ? formatMoney(p.value) : '';
          },
        },
        emphasis: {
          itemStyle: { shadowBlur: 6, shadowColor: 'rgba(0,0,0,0.2)' },
        },
      },
    ],
    animationDuration: 650,
    animationEasing: 'cubicOut',
  };
}

/**
 * Belirtilen kapsayıcıda duyarlılık tornado grafiğini çizer
 * @param {string} containerId - Hedef DOM elemanının kimliği
 * @param {DuyarlilikSatiri[]} data - Duyarlılık analiz sonuçları
 * @returns {echarts.ECharts|null} Grafik örneği veya null
 */
export function renderSensitivityChart(containerId, data) {
  if (!data || data.length === 0) {
    console.warn('[SensitivityChart] Gösterilecek duyarlılık verisi yok.');
    return null;
  }

  const chart = initChart(containerId);
  if (!chart) return null;

  chart.setOption(buildOption(data));
  return chart;
}
