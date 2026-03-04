/**
 * @module CostPie
 * @description Halka (doughnut) grafik: maliyet kalemlerinin yüzdesel dağılımı.
 * Merkez metinde toplam maliyet gösterilir. Rose tipi görsel çekicilik sağlar.
 */

import { initChart } from './chart-manager.js';
import { formatMoney } from '../services/formatter.js';

/**
 * @typedef {Object} MaliyetKalemi
 * @property {string} ad    - Kalem adı
 * @property {number} tutar - Kalem tutarı (TL)
 * @property {string} renk  - HEX renk kodu
 */

/**
 * Kalemlerin toplam tutarını hesaplar
 * @param {MaliyetKalemi[]} kalemler
 * @returns {number}
 */
function toplamTutar(kalemler) {
  return kalemler.reduce((sum, k) => sum + (Number(k.tutar) || 0), 0);
}

/**
 * Doughnut/rose grafik seçeneklerini oluşturur
 * @param {MaliyetKalemi[]} kalemler
 * @returns {Object} ECharts option nesnesi
 */
function isDark() {
  return document.documentElement.classList.contains('dark');
}

function buildOption(kalemler) {
  const toplam = toplamTutar(kalemler);
  const veriler = kalemler.map((k) => ({
    name: k.ad,
    value: Number(k.tutar) || 0,
    itemStyle: { color: k.renk },
  }));
  const dark = isDark();
  const txtColor = dark ? '#e5e7eb' : '#374151';
  const txtMuted = dark ? '#9ca3af' : '#6b7280';
  const haloColor = dark ? '#1e293b' : '#ffffff';

  return {
    tooltip: {
      trigger: 'item',
      formatter(p) {
        const pct = p.percent.toFixed(1);
        return `<strong>${p.name}</strong><br/>${formatMoney(p.value)} (${pct}%)`;
      },
    },
    legend: {
      orient: 'horizontal',
      bottom: '2%',
      left: 'center',
      type: 'scroll',
      textStyle: { fontSize: 11, color: txtMuted },
    },
    series: [
      {
        name: 'Maliyet',
        type: 'pie',
        roseType: 'area',
        radius: ['35%', '65%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: 'transparent',
          borderWidth: 2,
        },
        label: {
          show: true,
          color: txtColor,
          textBorderColor: haloColor,
          textBorderWidth: 2,
          formatter(p) {
            return `${p.name}\n${p.percent.toFixed(1)}%`;
          },
          fontSize: 11,
          lineHeight: 16,
        },
        labelLine: {
          length: 16,
          length2: 10,
          smooth: true,
        },
        emphasis: {
          label: { show: true, fontSize: 13, fontWeight: 'bold' },
          itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.2)' },
        },
        data: veriler,
      },
    ],
    /* Merkezde toplam maliyeti gösteren grafik elementi */
    graphic: [
      {
        type: 'group',
        left: 'center',
        top: 'middle',
        children: [
          {
            type: 'text',
            style: {
              text: 'Toplam',
              fontSize: 12,
              fill: txtMuted,
              textAlign: 'center',
            },
            left: 'center',
            top: -12,
          },
          {
            type: 'text',
            style: {
              text: formatMoney(toplam),
              fontSize: 16,
              fontWeight: 'bold',
              fill: txtColor,
              textAlign: 'center',
            },
            left: 'center',
            top: 6,
          },
        ],
      },
    ],
    animationDuration: 700,
    animationEasing: 'cubicOut',
  };
}

/**
 * Belirtilen kapsayıcıda maliyet pasta grafiğini çizer
 * @param {string} containerId - Hedef DOM elemanının kimliği
 * @param {MaliyetKalemi[]} kalemler - Maliyet kalemleri dizisi
 * @returns {echarts.ECharts|null} Grafik örneği veya null
 */
export function renderPieChart(containerId, kalemler) {
  if (!kalemler || kalemler.length === 0) {
    console.warn('[CostPie] Gösterilecek maliyet kalemi yok.');
    return null;
  }

  const chart = initChart(containerId);
  if (!chart) return null;

  chart.setOption(buildOption(kalemler));
  return chart;
}
