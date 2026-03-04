/**
 * @module RaporMain
 * @description rapor.html giriş noktası — hesaplama verilerini görselleştirir
 */
import { load } from './services/storage.js';
import { formatMoney, formatPercent } from './services/formatter.js';
import { initDarkMode, toggleDarkMode } from './services/dark-mode.js';
import { analiz } from './models/warning-engine.js';
import { analizEt, pazarKarsilastir } from './models/sensitivity.js';
import { getKomisyonTablosu, PAZAR_ADLARI } from './config/config-manager.js';
import { renderBreakdownChart } from './charts/cost-breakdown.js';
import { renderPieChart } from './charts/cost-pie.js';
import { initChart } from './charts/chart-manager.js';
import { exportReportExcel, exportReportCSV, exportReportJSON, importReportJSON, pickFile } from './services/import-export.js';

/** Tema renkleri — light/dark uyumlu */
function themeColors() {
  const dark = document.documentElement.classList.contains('dark');
  return {
    text:  dark ? '#e5e7eb' : '#374151',
    muted: dark ? '#9ca3af' : '#6b7280',
    halo:  dark ? '#1e293b' : '#ffffff',
    line:  dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
  };
}

document.addEventListener('DOMContentLoaded', init);

function init() {
  initDarkMode();
  document.getElementById('btn-dark-mode')?.addEventListener('click', toggleDarkMode);
  document.getElementById('btn-print')?.addEventListener('click', () => window.print());

  // Export dropdown
  initExportDropdown();
  // Import
  document.getElementById('btn-import')?.addEventListener('click', handleImport);

  const veri = load('rapor_veri');
  if (!veri?.sonuclar) { showNoData(); return; }
  const { sonuclar: s, girdiler: g } = veri;
  renderHeroStrip(s);
  renderBreakdownChart('cost-breakdown-chart', s.maliyetKalemleri || []);
  renderPieChart('cost-pie-chart', s.maliyetKalemleri || []);
  renderDetailTable(s, g);
  renderMetrics(s);
  renderComparison(g);
  renderSensitivity(g);
  renderBreakeven(s, g);
  renderWarnings(s, g);
}

function showNoData() {
  document.getElementById('no-data')?.classList.remove('hidden');
  document.getElementById('report-content')?.classList.add('hidden');
}

/* ── Export Dropdown ── */
function initExportDropdown() {
  const btn = document.getElementById('btn-export');
  const menu = document.getElementById('export-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('export-dropdown__menu--open');
  });

  // Dışarıya tıklayınca kapat
  document.addEventListener('click', () => {
    menu.classList.remove('export-dropdown__menu--open');
  });

  // Format butonları
  menu.addEventListener('click', (e) => {
    const item = e.target.closest('[data-format]');
    if (!item) return;
    menu.classList.remove('export-dropdown__menu--open');
    handleExport(item.dataset.format);
  });
}

function handleExport(format) {
  const veri = load('rapor_veri');
  if (!veri?.sonuclar) {
    alert('Dışa aktarılacak rapor verisi bulunamadı.');
    return;
  }
  try {
    switch (format) {
      case 'xlsx': exportReportExcel(veri.sonuclar, veri.girdiler); break;
      case 'csv':  exportReportCSV(veri.sonuclar, veri.girdiler);   break;
      case 'json': exportReportJSON(veri.sonuclar, veri.girdiler);  break;
      default: alert('Bilinmeyen format: ' + format);
    }
  } catch (err) {
    alert('Dışa aktarma hatası: ' + err.message);
  }
}

/* ── Import ── */
async function handleImport() {
  try {
    const file = await pickFile('.json');
    await importReportJSON(file);
    window.location.reload();
  } catch (err) {
    if (err.message !== 'Dosya seçilmedi') {
      alert('İçe aktarma hatası: ' + err.message);
    }
  }
}

/* ── B. Hero Strip ── */
/** @param {Object} s - Hesaplama sonuçları */
function renderHeroStrip(s) {
  const el = document.getElementById('report-hero');
  if (!el) return;
  const kc = (v, thr) => v >= thr ? 'text-green-600' : v >= 0 ? 'text-yellow-600' : 'text-red-600';
  const kpis = [
    { l: 'Net Kar', v: formatMoney(s.netKar), i: 'ti-trending-up', c: kc(s.netKar, 0.01) },
    { l: 'Net Marj', v: formatPercent(s.netMarj), i: 'ti-percentage', c: kc(s.netMarj, 15) },
    { l: 'Kar Oranı', v: formatPercent(s.karOrani ?? 0), i: 'ti-chart-dots-3', c: kc(s.karOrani ?? 0, 20) },
    { l: 'Brüt Kar', v: formatMoney(s.brutKar), i: 'ti-cash', c: 'text-blue-600' },
    { l: 'Efektif Fiyat', v: formatMoney(s.efektifFiyat), i: 'ti-tag', c: 'text-purple-600' },
    { l: 'ROI', v: formatPercent(s.roi), i: 'ti-chart-arrows-vertical', c: 'text-indigo-600' },
  ];
  el.innerHTML = kpis.map(k => `
    <div class="hero-kpi-card">
      <i class="ti ${k.i} text-2xl ${k.c}"></i>
      <span class="text-xs text-gray-500 dark:text-gray-400">${k.l}</span>
      <span class="text-xl font-bold ${k.c}">${k.v}</span>
    </div>`).join('');
}

/* ── D. Detaylı Tablo ── */
function renderDetailTable(s, g) {
  const el = document.getElementById('report-detail-table');
  if (!el) return;
  const rows = [
    ['Satış Fiyatı', formatMoney(g.satisFiyati), true, false],
    ['Kampanya/İndirim', formatMoney(g.satisFiyati - s.efektifFiyat), false, false],
    ['Efektif Fiyat', formatMoney(s.efektifFiyat), true, true],
    ['Alış Fiyatı', `- ${formatMoney(s._alis)}`],
    ['Komisyon', `- ${formatMoney(s.komisyonTutar)}`],
    ['Kargo', `- ${formatMoney(s._kargo)}`],
    ['KDV', `- ${formatMoney(s.kdvTutar)}`],
    ['Stopaj', `- ${formatMoney(s.stopajTutar)}`],
    ['Ödeme Komisyonu', `- ${formatMoney(s.odemeTutar)}`],
    ['Gelir Vergisi', `- ${formatMoney(s.gelirVergisi)}`],
    ['Ambalaj', `- ${formatMoney(s._ambalaj)}`],
    ['Reklam', `- ${formatMoney(s._reklam)}`],
    ['Depo / İşçilik / Ekstra', `- ${formatMoney(s._depolama + s._iscilik + s._ekstra)}`],
    ['Toplam Maliyet', formatMoney(s.toplamMaliyet), true, true],
    ['Net Kar (birim)', formatMoney(s.netKar), true, false],
    ['İade Maliyeti', `- ${formatMoney(s.iadeMaliyeti)}`],
    ['Net Kar (iade dahil)', formatMoney(s.netKarIadeDahil), true, true],
  ];
  el.innerHTML = `<table class="detail-table"><tbody>${rows.map(r =>
    `<tr class="${r[2] ? 'row--bold' : ''} ${r[3] ? 'row--subtotal' : ''}">
      <td class="pr-4">${r[0]}</td><td class="text-right font-mono">${r[1]}</td></tr>`
  ).join('')}</tbody></table>`;
}

/* ── E. Metrikler ── */
function renderMetrics(s) {
  const el = document.getElementById('report-metrics');
  if (!el) return;
  const m = [
    ['ti-percentage', 'Brüt Marj', formatPercent(s.brutMarj)],
    ['ti-shield-check', 'Güvenlik Marjı', formatPercent(s.guvenlikMarji)],
    ['ti-arrow-bounce', 'Başabaş Fiyatı', formatMoney(s.basabasFiyat)],
    ['ti-coin', 'Birim Maliyet', formatMoney(s.birimMaliyet)],
    ['ti-calendar-dollar', 'Aylık Net Kar', formatMoney(s.aylikNetKar)],
    ['ti-scale', 'Kar/Maliyet', formatPercent(s.karMaliyet)],
  ];
  el.innerHTML = m.map(([icon, label, val]) => `
    <div class="metric-card">
      <div class="metric-card__icon"><i class="ti ${icon}"></i></div>
      <div class="metric-card__info">
        <span class="metric-card__label">${label}</span>
        <span class="metric-card__value">${val}</span>
      </div>
    </div>`).join('');
}

/* ── F. Pazar Karşılaştırma ── */
function renderComparison(g) {
  const kat = detectKategori(g);
  const komTablosu = getKomisyonTablosu();
  const res = pazarKarsilastir(g, komTablosu, kat);
  const chart = initChart('comparison-chart');
  if (!chart) return;
  const t = themeColors();
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter(params) {
        const name = params[0].name;
        return `<strong>${name}</strong><br/>` + params.map(p => {
          const val = p.seriesName === 'Net Marj' ? formatPercent(p.value) : formatMoney(p.value);
          return `<span style="color:${p.color}">●</span> ${p.seriesName}: ${val}`;
        }).join('<br/>');
      },
    },
    legend: { bottom: 0, data: ['Net Kar', 'Net Marj'], textStyle: { color: t.muted } },
    grid: { left: '3%', right: '4%', bottom: '14%', top: '4%', containLabel: true },
    xAxis: { type: 'category', data: res.map(r => PAZAR_ADLARI[r.pazar] || r.pazar), axisLabel: { interval: 0, rotate: 25, fontSize: 11, color: t.muted } },
    yAxis: [
      { type: 'value', name: 'Net Kar (₺)', nameTextStyle: { fontSize: 11, color: t.muted }, axisLabel: { formatter: v => formatMoney(v), fontSize: 10, color: t.muted }, splitLine: { lineStyle: { color: t.line } } },
      { type: 'value', name: 'Marj (%)', nameTextStyle: { fontSize: 11, color: t.muted }, axisLabel: { formatter: v => `%${v.toFixed(0)}`, fontSize: 10, color: t.muted }, splitLine: { show: false } },
    ],
    series: [
      { name: 'Net Kar', type: 'bar', data: res.map(r => ({ value: r.netKar, itemStyle: { color: r.netKar >= 0 ? '#10b981' : '#ef4444' } })), barMaxWidth: 40 },
      { name: 'Net Marj', type: 'line', yAxisIndex: 1, data: res.map(r => r.netMarj), symbolSize: 8, itemStyle: { color: '#6366f1' } },
    ],
    animationDuration: 600,
  });
}

/** Girdilerden kategori tahmini */
function detectKategori(g) {
  const veri = load('rapor_veri');
  if (veri?.kategori) return veri.kategori;
  const komTablosu = getKomisyonTablosu();
  const komlar = komTablosu[Object.keys(komTablosu)[0]];
  let best = 'diger', minD = Infinity;
  for (const [k, o] of Object.entries(komlar)) {
    const d = Math.abs(o - (g.komisyonOrani || 0));
    if (d < minD) { minD = d; best = k; }
  }
  return best;
}

/* ── G. Hassasiyet (Tornado) ── */
function renderSensitivity(g) {
  const res = analizEt(g);
  if (!res?.length) return;
  const chart = initChart('sensitivity-chart');
  if (!chart) return;
  const ts = themeColors();
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter(params) {
        const name = params[0].name;
        return `<strong>${name}</strong><br/>` + params.map(p =>
          `<span style="color:${p.color}">●</span> ${p.seriesName}: ${formatMoney(p.value)}`
        ).join('<br/>');
      },
    },
    legend: { bottom: 0, data: ['Düşüş', 'Artış'], textStyle: { color: ts.muted } },
    grid: { left: '3%', right: '6%', bottom: '14%', top: '4%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { formatter: v => formatMoney(v), fontSize: 10, color: ts.muted }, splitLine: { lineStyle: { color: ts.line } } },
    yAxis: { type: 'category', data: res.map(r => r.parametre), inverse: true, axisLabel: { fontSize: 11, color: ts.text } },
    series: [
      { name: 'Düşüş', type: 'bar', stack: 't', data: res.map(r => r.asagiEtki), itemStyle: { color: '#ef4444' }, barMaxWidth: 28 },
      { name: 'Artış', type: 'bar', stack: 't', data: res.map(r => r.yukariEtki), itemStyle: { color: '#10b981' }, barMaxWidth: 28 },
    ],
    animationDuration: 600,
  });
}

/* ── Başabaş Analizi ── */
function renderBreakeven(s, g) {
  const chart = initChart('breakeven-chart');
  if (!chart) return;

  const basabas = s.basabasFiyat || 0;
  const satis = g.satisFiyati || s.satisFiyati || 0;
  if (!satis || !basabas) return;

  // Generate price points from 60% of break-even to 150% of sale price
  const minP = Math.max(0, Math.floor(basabas * 0.6));
  const maxP = Math.ceil(satis * 1.5);
  const step = Math.max(1, Math.round((maxP - minP) / 10));

  const prices = [];
  const profits = [];
  const costs = [];
  const revenues = [];

  // Birim maliyet (sabit maliyet kısmı — satış fiyatına bağlı olmayan)
  const birimMaliyet = s.toplamMaliyet || 0;
  // Satış fiyatına oranla değişen maliyetler: komisyon, stopaj, ödeme komisyonu, KDV
  const komisyonOrani = (g.komisyonOrani || g.komisyon || 0) / 100;
  const kdvOrani = (g.kdvOrani || g.kdv || 0) / 100;
  const stopajOrani = (g.stopajOrani || g.stopaj || 0) / 100;
  const odemeKomOrani = (g.odemeKomisyonu || 3.49) / 100;
  // Sabit maliyetler (fiyattan bağımsız)
  const sabitMaliyet = (s._alis || g.alis_fiyati || 0)
    + (s._kargo || g.kargo || 0)
    + (s._ambalaj || g.ambalaj || 0)
    + (s._reklam || g.reklam || 0)
    + (s._depolama || 0) + (s._iscilik || 0) + (s._ekstra || 0);

  for (let p = minP; p <= maxP; p += step) {
    prices.push(formatMoney(p));
    const gelir = p;
    const degiskenMaliyet = p * (komisyonOrani + kdvOrani + stopajOrani + odemeKomOrani);
    const toplamM = sabitMaliyet + degiskenMaliyet;
    const kar = gelir - toplamM;
    revenues.push(Math.round(gelir * 100) / 100);
    costs.push(Math.round(toplamM * 100) / 100);
    profits.push(Math.round(kar * 100) / 100);
  }

  const tb = themeColors();
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter(params) {
        const price = params[0].name;
        let html = `<strong>${price}</strong><br/>`;
        params.forEach(p => {
          html += `<span style="color:${p.color}">●</span> ${p.seriesName}: ${formatMoney(p.value)}<br/>`;
        });
        return html;
      },
    },
    legend: { bottom: 0, data: ['Net Kar', 'Toplam Gelir', 'Toplam Maliyet'], textStyle: { color: tb.muted } },
    grid: { left: '3%', right: '4%', bottom: '14%', top: '4%', containLabel: true },
    xAxis: {
      type: 'category',
      data: prices,
      name: 'Satış Fiyatı',
      nameLocation: 'center',
      nameGap: 30,
      nameTextStyle: { color: tb.muted },
      axisLabel: { fontSize: 10, rotate: 30, color: tb.muted },
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: v => formatMoney(v), fontSize: 10, color: tb.muted },
      splitLine: { lineStyle: { color: tb.line } },
    },
    series: [
      {
        name: 'Toplam Gelir',
        type: 'line',
        data: revenues,
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: '#6366f1' },
        symbol: 'none',
      },
      {
        name: 'Toplam Maliyet',
        type: 'line',
        data: costs,
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: '#f59e0b' },
        symbol: 'none',
      },
      {
        name: 'Net Kar',
        type: 'line',
        data: profits,
        smooth: true,
        lineStyle: { width: 3 },
        itemStyle: { color: '#10b981' },
        symbol: 'none',
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16,185,129,0.25)' },
              { offset: 0.5, color: 'rgba(16,185,129,0.05)' },
              { offset: 0.5, color: 'rgba(239,68,68,0.05)' },
              { offset: 1, color: 'rgba(239,68,68,0.2)' },
            ],
          },
        },
        markLine: {
          silent: true,
          data: [{ yAxis: 0, lineStyle: { color: '#94a3b8', type: 'dashed', width: 2 } }],
          label: { show: false },
          symbol: 'none',
        },
        markPoint: {
          data: [
            {
              name: 'Başabaş',
              coord: [formatMoney(Math.round(basabas)), 0],
              value: 'Başabaş\n' + formatMoney(basabas),
              symbolSize: 60,
              itemStyle: { color: '#ef4444' },
              label: { fontSize: 10, color: '#fff', lineHeight: 14 },
            },
            {
              name: 'Mevcut',
              coord: [formatMoney(Math.round(satis)), Math.round((satis - sabitMaliyet - satis * (komisyonOrani + kdvOrani + stopajOrani + odemeKomOrani)) * 100) / 100],
              value: 'Mevcut\n' + formatMoney(satis),
              symbolSize: 60,
              itemStyle: { color: '#10b981' },
              label: { fontSize: 10, color: '#fff', lineHeight: 14 },
            },
          ],
        },
      },
    ],
    animationDuration: 700,
  });
}

/* ── H. Uyarılar ── */
function renderWarnings(s, g) {
  const el = document.getElementById('report-alerts');
  if (!el) return;
  const uyarilar = analiz(s, g, {});
  if (!uyarilar.length) {
    el.innerHTML = '<div class="text-center py-8 text-gray-400"><i class="ti ti-circle-check text-3xl mb-2 block"></i><p>Herhangi bir uyarı bulunmuyor</p></div>';
    return;
  }
  el.innerHTML = uyarilar.map(u => `
    <div class="alert-card alert-card--${u.tip}">
      <i class="ti ${u.ikon} text-xl flex-shrink-0 mt-0.5"></i>
      <div>
        <p class="font-semibold text-sm">${u.mesaj}</p>
        ${u.oneri ? `<p class="text-xs mt-1 opacity-80">${u.oneri}</p>` : ''}
      </div>
    </div>`).join('');
}
