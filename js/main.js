/**
 * @module Main
 * @description index.html giriş noktası — tüm modülleri başlatır ve koordine eder
 */

import { on } from './utils/event-bus.js';
import { debounce } from './utils/debounce.js';
import { setState, getState, resetState } from './models/state.js';
import { hesapla, belirleSatisFiyati } from './models/calculation-engine.js';
import { analiz } from './models/warning-engine.js';
import { getDefaults } from './models/smart-defaults.js';
import { STOPAJ_ORANI } from './config/constants.js';
import { formatMoney } from './services/formatter.js';
import { initDarkMode, toggleDarkMode } from './services/dark-mode.js';
import { createShareURL, copyToClipboard, readShareParams } from './services/share.js';
import { save } from './services/storage.js';
import { showToast } from './components/toast.js';
import { initStepWizard } from './views/step-wizard.js';
import { initCategoryPicker } from './views/category-picker.js';
import { initMarketplacePicker } from './views/marketplace-picker.js';
import { initCostItemsView } from './views/cost-items-view.js';
import { initCampaignView } from './views/campaign-view.js';
import { initDesiView } from './views/desi-view.js';
import { initCargoPickerView } from './views/cargo-picker-view.js';
import { initHeroCardView } from './views/hero-card-view.js';
import { initAlertsView } from './views/alerts-view.js';
import { initDetailTableView } from './views/detail-table-view.js';
import { initMetricsView } from './views/metrics-view.js';
import { createTabBar } from './components/tab-bar.js';
import { createSpinBox } from './components/spin-box.js';
import { HESAP_MODLARI, MOD_ETIKETLERI } from './config/constants.js';

const views = {};
const priceInputs = {};

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initViews(); initPriceInputs(); initModeSelector();
  bindEvents(); checkShareParams(); setupActions();
});

function initViews() {
  const v = [
    ['wizard', initStepWizard, 'wizard-container'],
    ['category', initCategoryPicker, 'category-section'],
    ['marketplace', initMarketplacePicker, 'marketplace-section'],
    ['costItems', initCostItemsView, 'cost-items-container'],
    ['campaign', initCampaignView, 'campaign-container'],
    ['desi', initDesiView, 'desi-container'],
    ['cargo', initCargoPickerView, 'cargo-container'],
    ['hero', initHeroCardView, 'hero-container'],
    ['alerts', initAlertsView, 'alerts-container'],
    ['detail', initDetailTableView, 'detail-container'],
    ['metrics', initMetricsView, 'metrics-container'],
  ];
  v.forEach(([key, fn, id]) => { views[key] = fn(id); });
}

/** Fiyat ve miktar girdilerini oluştur */
function initPriceInputs() {
  if (!document.getElementById('price-inputs-container')) return;
  const sb = (id, label, opts = {}) => createSpinBox({ id, label, min: 0, max: 999999, step: 1, value: 0, onChange: debouncedCalc, ...opts });
  priceInputs.alis = sb('alis_fiyati', 'Alış Fiyatı', { prefix: '₺' });
  priceInputs.satis = sb('satis_fiyati', 'Satış Fiyatı', { prefix: '₺' });
  priceInputs.hedef = sb('hedef_deger', 'Hedef Değer', { prefix: '₺' });
  priceInputs.adet = sb('aylik_adet', 'Aylık Satış Adedi', { max: 99999, value: 100, decimals: 0 });
  updatePriceFieldsForMode(HESAP_MODLARI.SATIS_TUTARINA_GORE);
}

function initModeSelector() {
  const c = document.getElementById('mode-selector');
  if (!c) return;
  const tabs = Object.entries(MOD_ETIKETLERI).map(([v, l]) => ({ value: Number(v), label: l }));
  const tabBar = createTabBar({ tabs, active: 1, onChange: (v) => {
    setState('hesapModu', Number(v)); updatePriceFieldsForMode(Number(v)); debouncedCalc();
  }});
  c.appendChild(tabBar.el);
}

const MOD_LABELS = { 1: 'Satış Fiyatı', 2: 'Hedef Net Kar (₺)', 3: 'Hedef Marj (%)', 4: 'Hedef Oran (%)' };

function updatePriceFieldsForMode(mod) {
  const c = document.getElementById('price-inputs-container');
  if (!c) return;
  c.innerHTML = '';
  c.appendChild(wrapField('Alış Fiyatı', priceInputs.alis.el));
  const target = mod === 1 ? priceInputs.satis : priceInputs.hedef;
  /* Mod 3,4 yüzde; mod 1,2 TL */
  if (mod >= 3) {
    target.setPrefix('');
    target.setSuffix('%');
  } else {
    target.setPrefix('₺');
    target.setSuffix('');
  }
  c.appendChild(wrapField(MOD_LABELS[mod], target.el));
  c.appendChild(wrapField('Aylık Satış Adedi', priceInputs.adet.el));
}

function wrapField(label, el) {
  const g = document.createElement('div');
  g.className = 'field-group';
  g.innerHTML = `<label class="field-group__label">${label}</label>`;
  g.appendChild(el);
  return g;
}

/** Olay dinleyicilerini bağla */
function bindEvents() {
  on('state:kategori', () => applyDefaults());
  on('state:pazar', () => applyDefaults());
  on('state:change', debouncedCalc);
  on('wizard:complete', () => runCalculation());
}

/** Varsayılan değerleri uygula */
function applyDefaults() {
  const kat = getState('kategori');
  const paz = getState('pazar');
  if (!kat) return;

  const defaults = getDefaults(kat, paz);
  if (views.costItems) views.costItems.applyDefaults(defaults);
  debouncedCalc();
}

/** Hesaplama çalıştır */
const debouncedCalc = debounce(runCalculation, 150);

function collectGirdiler() {
  const mod = getState('hesapModu') || 1;
  const c = views.costItems?.getValues() || {};
  const m = views.campaign?.getValues() || {};
  return {
    alisFiyati: priceInputs.alis?.getValue() || 0, satisFiyati: priceInputs.satis?.getValue() || 0,
    hedefDeger: priceInputs.hedef?.getValue() || 0, hesapModu: mod,
    komisyonOrani: c.komisyon || 0, kargoUcreti: c.kargo || 0, ambalajGideri: c.ambalaj || 0,
    odemeKomisyonu: c.odeme_komisyonu || 0, stopajOrani: c.stopaj ?? STOPAJ_ORANI,
    kdvOrani: c.kdv || 0, gelirVergisiDilimi: c.gelir_vergisi || 15,
    iadeOrani: c.iade_orani || 0, iadeKargoUcreti: c.iade_kargo || 0,
    reklamGideri: c.reklam || 0, depolamaGideri: 0,
    iscilikGideri: 0, ekstraMasraf: 0,
    kampanyaOrani: m.kampanyaOrani || 0, indirimOrani: m.indirimOrani || 0,
    aylikSatisAdedi: priceInputs.adet?.getValue() || 0,
  };
}

function runCalculation() {
  const g = collectGirdiler();
  if (g.hesapModu !== 1) g.satisFiyati = belirleSatisFiyati(g);
  const s = hesapla(g);
  setState('sonuclar', s); setState('girdiler', g);
  views.hero?.update(s);
  views.alerts?.update(analiz(s, g, { pazar: getState('pazar') }));
  views.detail?.update(s, g); views.metrics?.update(s);
  updateMobileBar(s);
  save('rapor_veri', { sonuclar: s, girdiler: g, kategori: getState('kategori'), pazar: getState('pazar') });
}

function updateMobileBar(s) {
  const bar = document.getElementById('mobile-summary-bar');
  if (!bar) return;
  bar.querySelector('[data-net-kar]')?.replaceChildren(document.createTextNode(formatMoney(s.netKar)));
  bar.querySelector('[data-net-marj]')?.replaceChildren(document.createTextNode(`%${s.netMarj.toFixed(1)}`));
  bar.classList.toggle('mobile-bar--profit', s.netKar > 0.01);
  bar.classList.toggle('mobile-bar--loss', s.netKar < -0.01);
}

function checkShareParams() { readShareParams(); }

function setupActions() {
  const bind = (id, fn) => document.getElementById(id)?.addEventListener('click', fn);
  bind('btn-dark-mode', () => showToast({ message: toggleDarkMode() ? 'Karanlık mod' : 'Açık mod', type: 'info' }));
  bind('btn-share', async () => { const g = getState('girdiler'); if (g) { await copyToClipboard(createShareURL(g)); showToast({ message: 'Link kopyalandı!', type: 'success' }); } });
  bind('btn-reset', () => { resetState(); window.location.reload(); });
}
