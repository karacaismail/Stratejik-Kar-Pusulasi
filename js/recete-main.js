/**
 * @module ReceteMain
 * @description recete.html giriş noktası — BOM/reçete arayüzünü yönetir
 */
import { createDynamicList } from './components/dynamic-list.js';
import { createSpinBox } from './components/spin-box.js';
import { createCustomSelect } from './components/custom-select.js';
import { showToast } from './components/toast.js';
import { formatMoney } from './services/formatter.js';
import { initDarkMode, toggleDarkMode } from './services/dark-mode.js';
import {
  createRecete, createMalzeme, hesaplaBirimMaliyet,
  kaydetRecete, kaydetReceteVersion, geriYukleVersiyon,
  yukleReceteler, silRecete, BIRIMLER, AMBALAJ_KATEGORILERI,
} from './models/bom-model.js';
import { RECETE_SABLONLARI, SABLON_LISTESI } from './config/recipe-templates.js';
import { searchMalzeme, syncReceteMalzemeleri } from './models/material-library.js';
import { exportRecipesJSON, importRecipesJSON, pickFile } from './services/import-export.js';

/** @type {import('./models/bom-model.js').Recete} */
let aktifRecete = createRecete();
let hammaddeList = null;
let ambalajList = null;
const spinBoxlar = {};
const seciliReceteler = new Set(); // karşılaştırma için seçilen reçete ID'leri

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initSablonSelector();
  initHammaddeList();
  initAmbalajList();
  initIscilikInputs();
  bindActions();
  renderSavedRecipes();
  updateSummary();
});

/* ═══════════ Şablon Seçici ═══════════ */
function initSablonSelector() {
  const sel = document.getElementById('sablon-sec');
  if (!sel) return;
  // Şablon seçeneklerini doldur
  for (const s of SABLON_LISTESI) {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.ad;
    sel.appendChild(opt);
  }
  sel.addEventListener('change', () => {
    if (!sel.value) return;
    const tpl = RECETE_SABLONLARI.find(s => s.id === sel.value);
    if (!tpl) return;
    loadTemplate(tpl);
    sel.value = '';
  });
}

function loadTemplate(tpl) {
  aktifRecete = createRecete(tpl.ad);
  // Deep clone frozen template data
  aktifRecete.hammaddeler = JSON.parse(JSON.stringify(tpl.hammaddeler));
  aktifRecete.ambalajlar = JSON.parse(JSON.stringify(tpl.ambalajlar));
  aktifRecete.iscilik = tpl.iscilik;
  aktifRecete.enerji = tpl.enerji;
  aktifRecete.depolama = tpl.depolama;
  aktifRecete.digerMasraf = tpl.digerMasraf;
  aktifRecete.ekstra = tpl.ekstra;
  // Her malzemeye yeni ID ver
  aktifRecete.hammaddeler.forEach(m => { m.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6); });
  aktifRecete.ambalajlar.forEach(m => { m.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6); });

  document.getElementById('recete-adi').value = aktifRecete.ad;
  hammaddeList?.setItems(aktifRecete.hammaddeler);
  ambalajList?.setItems(aktifRecete.ambalajlar);
  spinBoxlar.iscilik?.setValue(aktifRecete.iscilik || 0);
  spinBoxlar.enerji?.setValue(aktifRecete.enerji || 0);
  spinBoxlar.depolama?.setValue(aktifRecete.depolama || 0);
  spinBoxlar.digerMasraf?.setValue(aktifRecete.digerMasraf || 0);
  spinBoxlar.ekstra?.setValue(aktifRecete.ekstra || 0);
  updateSummary();
  showToast({ message: `"${tpl.ad}" şablonu yüklendi`, type: 'info' });
}

/* ═══════════ C. Hammadde ═══════════ */
function initHammaddeList() {
  const c = document.getElementById('hammadde-list');
  if (!c) return;
  hammaddeList = createDynamicList({
    id: 'dl-hammadde', addLabel: 'Hammadde Ekle', createItem: () => createMalzeme(),
    renderRow: renderMalzemeRow,
    onChange: items => { aktifRecete.hammaddeler = items; updateSummary(); },
  });
  c.appendChild(hammaddeList.el);
  hammaddeList.setItems(aktifRecete.hammaddeler);
}

/* ═══════════ D. Ambalaj ═══════════ */
function initAmbalajList() {
  const c = document.getElementById('ambalaj-list');
  if (!c) return;
  ambalajList = createDynamicList({
    id: 'dl-ambalaj', addLabel: 'Ambalaj Kalemi Ekle',
    createItem: () => createMalzeme(AMBALAJ_KATEGORILERI[0]),
    renderRow: renderMalzemeRow,
    onChange: items => { aktifRecete.ambalajlar = items; updateSummary(); },
  });
  c.appendChild(ambalajList.el);
  ambalajList.setItems(aktifRecete.ambalajlar);
}

/**
 * Malzeme satırı oluştur (autocomplete entegrasyonu ile)
 */
function renderMalzemeRow(item, _idx, act) {
  const row = document.createElement('div');
  row.className = 'flex flex-wrap items-center gap-2 py-2 border-b border-gray-100 dark:border-gray-800';

  // Ad input + datalist autocomplete
  const nameIn = Object.assign(document.createElement('input'), {
    type: 'text', placeholder: 'Malzeme adı', value: item.ad,
    className: 'flex-1 min-w-[120px] h-[44px] px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500',
  });
  nameIn.setAttribute('list', `dl-mal-${item.id}`);
  const datalist = document.createElement('datalist');
  datalist.id = `dl-mal-${item.id}`;

  nameIn.addEventListener('input', () => {
    act.onUpdate('ad', nameIn.value);
    // Autocomplete güncelle
    const results = searchMalzeme(nameIn.value);
    datalist.innerHTML = results.map(m =>
      `<option value="${esc(m.ad)}" label="${formatMoney(m.birimFiyat)}/${m.birim}">`
    ).join('');
  });

  // Kütüphaneden seçildiğinde birim ve fiyatı otomatik doldur
  nameIn.addEventListener('change', () => {
    const results = searchMalzeme(nameIn.value);
    const match = results.find(m => m.ad.toLowerCase() === nameIn.value.toLowerCase());
    if (match) {
      act.onUpdate('birim', match.birim);
      act.onUpdate('birimFiyat', match.birimFiyat);
      item.birim = match.birim;
      item.birimFiyat = match.birimFiyat;
      fSb.setValue(match.birimFiyat);
      totalEl.textContent = formatMoney(item.miktar * item.birimFiyat);
      updateSummary();
    }
  });

  const sel = createCustomSelect({
    options: BIRIMLER, value: item.birim,
    onChange: (v) => act.onUpdate('birim', v),
  });
  const totalEl = document.createElement('span');
  totalEl.className = 'text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[80px] text-right';
  totalEl.textContent = formatMoney(item.miktar * item.birimFiyat);
  const refresh = () => { totalEl.textContent = formatMoney(item.miktar * item.birimFiyat); updateSummary(); };
  const mSb = createSpinBox({ id: `m-${item.id}`, label: 'Miktar', min: 0, max: 99999, step: 0.1, value: item.miktar, decimals: 2,
    onChange: v => { act.onUpdate('miktar', v); item.miktar = v; refresh(); } });
  const fSb = createSpinBox({ id: `f-${item.id}`, label: 'Birim Fiyat', min: 0, max: 99999, step: 0.1, value: item.birimFiyat, decimals: 2, prefix: '₺',
    onChange: v => { act.onUpdate('birimFiyat', v); item.birimFiyat = v; refresh(); } });
  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'icon-btn text-red-400 hover:text-red-600';
  del.innerHTML = '<i class="ti ti-trash text-lg"></i>';
  del.addEventListener('click', () => act.onRemove());
  row.append(nameIn, datalist, sel.el, mSb.el, fSb.el, totalEl, del);
  return row;
}

/* ═══════════ E. İşçilik ═══════════ */
function initIscilikInputs() {
  const c = document.getElementById('iscilik-inputs');
  if (!c) return;
  [{ key: 'iscilik', label: 'İşçilik / Birim', icon: 'ti-user-dollar' },
   { key: 'enerji', label: 'Enerji / Birim', icon: 'ti-bolt' },
   { key: 'depolama', label: 'Depolama / Birim', icon: 'ti-building-warehouse' },
   { key: 'digerMasraf', label: 'Diğer Masraf / Birim', icon: 'ti-receipt' },
   { key: 'ekstra', label: 'Ekstra / Birim', icon: 'ti-dots' },
  ].forEach(f => {
    const g = document.createElement('div');
    g.className = 'flex items-center gap-3';
    const lbl = document.createElement('label');
    lbl.className = 'flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 min-w-[160px]';
    lbl.innerHTML = `<i class="ti ${f.icon}"></i>${f.label}`;
    spinBoxlar[f.key] = createSpinBox({ id: `isc-${f.key}`, label: f.label, min: 0, max: 99999,
      step: 0.5, value: aktifRecete[f.key] || 0, decimals: 2, prefix: '₺',
      onChange: v => { aktifRecete[f.key] = v; updateSummary(); } });
    g.append(lbl, spinBoxlar[f.key].el);
    c.appendChild(g);
  });
}

/* ═══════════ Özet ═══════════ */
function syncRecete() {
  if (hammaddeList) aktifRecete.hammaddeler = hammaddeList.getItems();
  if (ambalajList) aktifRecete.ambalajlar = ambalajList.getItems();
  aktifRecete.ad = document.getElementById('recete-adi')?.value || 'Yeni Reçete';
}
function updateSummary() {
  syncRecete();
  const m = hesaplaBirimMaliyet(aktifRecete);
  setText('subtotal-hammadde', formatMoney(m.hammadde));
  setText('subtotal-ambalaj', formatMoney(m.ambalaj));
  setText('subtotal-iscilik', formatMoney(m.iscilik));
  setText('subtotal-kdv', formatMoney(0));
  setText('toplam-maliyet', formatMoney(m.toplam));
}

/* ═══════════ G. Aksiyonlar ═══════════ */
function bindActions() {
  // Dark mode
  document.getElementById('btn-dark-mode')?.addEventListener('click', () => {
    showToast({ message: toggleDarkMode() ? 'Karanlık mod aktif' : 'Açık mod aktif', type: 'info' });
  });

  // Kaydet (versiyonlu)
  document.getElementById('btn-kaydet')?.addEventListener('click', () => {
    syncRecete();
    // Malzeme kütüphanesini güncelle
    syncReceteMalzemeleri(aktifRecete.hammaddeler, aktifRecete.ambalajlar);
    // Versiyonlu kaydet
    kaydetReceteVersion(aktifRecete);
    showToast({ message: `"${aktifRecete.ad}" kaydedildi`, type: 'success' });
    renderSavedRecipes();
  });

  // Hesaplayıcıda kullan
  document.getElementById('btn-kullan')?.addEventListener('click', () => {
    syncRecete();
    window.location.href = `index.html?alis=${encodeURIComponent(hesaplaBirimMaliyet(aktifRecete).toplam.toFixed(2))}`;
  });

  // Reçete dışa aktar
  document.getElementById('btn-recete-export')?.addEventListener('click', () => {
    try {
      const count = exportRecipesJSON();
      showToast({ message: `${count} reçete dışa aktarıldı`, type: 'success' });
    } catch (e) {
      showToast({ message: e.message, type: 'error' });
    }
  });

  // Reçete içe aktar
  document.getElementById('btn-recete-import')?.addEventListener('click', async () => {
    try {
      const file = await pickFile('.json');
      const count = await importRecipesJSON(file);
      showToast({ message: `${count} reçete içe aktarıldı`, type: 'success' });
      renderSavedRecipes();
    } catch (e) {
      showToast({ message: e.message, type: 'error' });
    }
  });

  // Karşılaştır butonu
  document.getElementById('btn-karsilastir')?.addEventListener('click', showComparison);

  // Version modal kapat
  document.getElementById('version-close')?.addEventListener('click', () => {
    document.getElementById('version-modal')?.classList.add('hidden');
    document.getElementById('version-modal')?.classList.remove('flex');
  });

  // Compare modal kapat
  document.getElementById('compare-close')?.addEventListener('click', () => {
    document.getElementById('compare-modal')?.classList.add('hidden');
    document.getElementById('compare-modal')?.classList.remove('flex');
  });
}

/* ═══════════ H. Kayıtlı Reçeteler ═══════════ */
function renderSavedRecipes() {
  const c = document.getElementById('saved-recipes');
  if (!c) return;
  seciliReceteler.clear();
  updateCompareButton();

  const list = yukleReceteler();
  if (!list.length) { c.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">Henüz kayıtlı reçete yok</p>'; return; }

  c.innerHTML = list.map(r => {
    const m = hesaplaBirimMaliyet(r), d = new Date(r.olusturulma).toLocaleDateString('tr-TR');
    const vCount = r.versiyonlar?.length || 0;
    return `<div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center gap-3">
        <input type="checkbox" class="compare-chk rounded" data-cmp="${r.id}">
        <i class="ti ti-recipe text-lg text-blue-500"></i>
        <div><p class="text-sm font-semibold">${esc(r.ad)}</p>
          <p class="text-xs text-gray-400">${d} — ${formatMoney(m.toplam)}${vCount ? ` — ${vCount} versiyon` : ''}</p></div></div>
      <div class="flex items-center gap-1">
        ${vCount ? `<button class="icon-btn" data-ver="${r.id}" aria-label="Versiyon Geçmişi"><i class="ti ti-history text-lg"></i></button>` : ''}
        <button class="icon-btn" data-load="${r.id}" aria-label="Yükle"><i class="ti ti-upload text-lg"></i></button>
        <button class="icon-btn text-red-400 hover:text-red-600" data-del="${r.id}" aria-label="Sil"><i class="ti ti-trash text-lg"></i></button>
      </div></div>`;
  }).join('');

  // Event listeners
  c.querySelectorAll('[data-load]').forEach(b => b.addEventListener('click', () => loadRecipe(b.dataset.load)));
  c.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    silRecete(b.dataset.del); showToast({ message: 'Reçete silindi', type: 'warning' }); renderSavedRecipes();
  }));
  c.querySelectorAll('[data-ver]').forEach(b => b.addEventListener('click', () => showVersionHistory(b.dataset.ver)));
  c.querySelectorAll('.compare-chk').forEach(chk => chk.addEventListener('change', () => {
    if (chk.checked) seciliReceteler.add(chk.dataset.cmp);
    else seciliReceteler.delete(chk.dataset.cmp);
    updateCompareButton();
  }));
}

function updateCompareButton() {
  const btn = document.getElementById('btn-karsilastir');
  if (btn) btn.disabled = seciliReceteler.size !== 2;
}

/** @param {string} id */
function loadRecipe(id) {
  const r = yukleReceteler().find(x => x.id === id);
  if (!r) return;
  aktifRecete = r;
  document.getElementById('recete-adi').value = r.ad;
  hammaddeList?.setItems(r.hammaddeler);
  ambalajList?.setItems(r.ambalajlar);
  spinBoxlar.iscilik?.setValue(r.iscilik || 0);
  spinBoxlar.enerji?.setValue(r.enerji || 0);
  spinBoxlar.depolama?.setValue(r.depolama || 0);
  spinBoxlar.digerMasraf?.setValue(r.digerMasraf || 0);
  spinBoxlar.ekstra?.setValue(r.ekstra || 0);
  updateSummary();
  showToast({ message: `"${r.ad}" yüklendi`, type: 'info' });
}

/* ═══════════ Versiyon Geçmişi ═══════════ */
function showVersionHistory(receteId) {
  const r = yukleReceteler().find(x => x.id === receteId);
  if (!r?.versiyonlar?.length) return;

  const modal = document.getElementById('version-modal');
  const list = document.getElementById('version-list');
  if (!modal || !list) return;

  list.innerHTML = r.versiyonlar.map((v, i) => {
    const d = new Date(v.tarih).toLocaleString('tr-TR');
    return `<div class="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
      <div>
        <p class="text-sm font-medium">v${i + 1} — ${formatMoney(v.maliyet ?? 0)}</p>
        <p class="text-xs text-gray-400">${d}</p>
      </div>
      <button class="btn btn--secondary btn--sm" data-restore="${i}">
        <i class="ti ti-rotate mr-1"></i>Geri Yükle
      </button>
    </div>`;
  }).reverse().join('');

  list.querySelectorAll('[data-restore]').forEach(b => b.addEventListener('click', () => {
    const restored = geriYukleVersiyon(receteId, parseInt(b.dataset.restore));
    if (restored) {
      loadRecipe(receteId);
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      showToast({ message: `Versiyon geri yüklendi`, type: 'success' });
    }
  }));

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

/* ═══════════ Reçete Karşılaştırma ═══════════ */
function showComparison() {
  if (seciliReceteler.size !== 2) return;
  const [id1, id2] = [...seciliReceteler];
  const all = yukleReceteler();
  const r1 = all.find(r => r.id === id1);
  const r2 = all.find(r => r.id === id2);
  if (!r1 || !r2) return;

  const m1 = hesaplaBirimMaliyet(r1);
  const m2 = hesaplaBirimMaliyet(r2);

  const modal = document.getElementById('compare-modal');
  const content = document.getElementById('compare-content');
  if (!modal || !content) return;

  // Hammadde karşılaştırma tablosu
  const allMaterials = new Set([
    ...r1.hammaddeler.map(m => m.ad),
    ...r2.hammaddeler.map(m => m.ad),
  ]);

  let rows = '';
  for (const ad of allMaterials) {
    const m1Item = r1.hammaddeler.find(m => m.ad === ad);
    const m2Item = r2.hammaddeler.find(m => m.ad === ad);
    const t1 = m1Item ? (m1Item.miktar * m1Item.birimFiyat) : 0;
    const t2 = m2Item ? (m2Item.miktar * m2Item.birimFiyat) : 0;
    const diff = t2 - t1;
    const diffClass = diff > 0 ? 'text-red-500' : diff < 0 ? 'text-green-500' : 'text-gray-400';
    rows += `<tr class="border-b border-gray-100 dark:border-gray-800">
      <td class="py-2 text-sm">${esc(ad || '—')}</td>
      <td class="py-2 text-sm text-right">${m1Item ? formatMoney(t1) : '—'}</td>
      <td class="py-2 text-sm text-right">${m2Item ? formatMoney(t2) : '—'}</td>
      <td class="py-2 text-sm text-right font-semibold ${diffClass}">${diff !== 0 ? (diff > 0 ? '+' : '') + formatMoney(diff) : '—'}</td>
    </tr>`;
  }

  content.innerHTML = `
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
        <p class="text-xs text-gray-500 mb-1">${esc(r1.ad)}</p>
        <p class="text-xl font-bold text-blue-600">${formatMoney(m1.toplam)}</p>
      </div>
      <div class="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-center">
        <p class="text-xs text-gray-500 mb-1">${esc(r2.ad)}</p>
        <p class="text-xl font-bold text-purple-600">${formatMoney(m2.toplam)}</p>
      </div>
    </div>
    <h4 class="text-sm font-semibold mb-2">Hammadde Karşılaştırma</h4>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead><tr class="border-b-2 border-gray-200 dark:border-gray-700">
          <th class="text-left py-2">Malzeme</th>
          <th class="text-right py-2">${esc(r1.ad)}</th>
          <th class="text-right py-2">${esc(r2.ad)}</th>
          <th class="text-right py-2">Fark</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
      <div><span class="text-xs text-gray-400 block">Hammadde Farkı</span>
        <span class="font-semibold ${m2.hammadde - m1.hammadde > 0 ? 'text-red-500' : 'text-green-500'}">${formatMoney(m2.hammadde - m1.hammadde)}</span></div>
      <div><span class="text-xs text-gray-400 block">Ambalaj Farkı</span>
        <span class="font-semibold ${m2.ambalaj - m1.ambalaj > 0 ? 'text-red-500' : 'text-green-500'}">${formatMoney(m2.ambalaj - m1.ambalaj)}</span></div>
      <div><span class="text-xs text-gray-400 block">İşçilik Farkı</span>
        <span class="font-semibold ${m2.iscilik - m1.iscilik > 0 ? 'text-red-500' : 'text-green-500'}">${formatMoney(m2.iscilik - m1.iscilik)}</span></div>
    </div>`;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

/* ═══════════ Yardımcılar ═══════════ */
function setText(id, t) { const e = document.getElementById(id); if (e) e.textContent = t; }
function esc(s) { const d = document.createElement('div'); d.appendChild(document.createTextNode(s)); return d.innerHTML; }
