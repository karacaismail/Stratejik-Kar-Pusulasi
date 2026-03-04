/**
 * @module ParametrelerMain
 * @description parametreler.html giriş noktası — kargo, komisyon, vergi ayarları
 */
import { initDarkMode, toggleDarkMode } from './services/dark-mode.js';
import {
  getKargoFirmalari, getKargoListesi,
  getKomisyonTablosu, getVergiParams,
  saveKargoOverrides, saveKomisyonOverrides, saveVergiOverrides,
  resetAllOverrides,
  KATEGORILER, KATEGORI_LISTESI,
  PAZAR_ADLARI, PAZAR_LISTESI,
} from './config/config-manager.js';
import { KARGO_FIRMALARI } from './config/cargo-companies.js';
import { KOMISYON_TABLOSU } from './config/commissions.js';
import { STOPAJ_ORANI, ODEME_KOMISYONU } from './config/constants.js';
import { exportFullBackup, importFullBackup, pickFile } from './services/import-export.js';

document.addEventListener('DOMContentLoaded', init);

/** Geçici state — kaydet butonuna basılınca persist edilir */
let kargoState = {};
let komisyonState = {};
let vergiState = {};

function init() {
  initDarkMode();
  document.getElementById('btn-dark-mode')?.addEventListener('click', toggleDarkMode);

  renderKargoSection();
  renderKomisyonSection();
  renderVergiSection();

  document.getElementById('btn-kaydet')?.addEventListener('click', handleSave);
  document.getElementById('btn-sifirla')?.addEventListener('click', handleReset);

  // Yedekleme butonları
  document.getElementById('btn-yedekle')?.addEventListener('click', handleBackup);
  document.getElementById('btn-geri-yukle')?.addEventListener('click', handleRestore);
}

/* ══════════════════════════════════════
 *  A. Kargo Fiyatları
 * ══════════════════════════════════════ */
function renderKargoSection() {
  const el = document.getElementById('kargo-params');
  if (!el) return;

  const firmalar = getKargoFirmalari();
  const defaults = KARGO_FIRMALARI; // Original frozen defaults

  el.innerHTML = `
    <div class="param-grid-header">
      <span class="param-grid-header__label">Firma</span>
      <span class="param-grid-header__col">Varsayılan Ücret (₺)</span>
      <span class="param-grid-header__col">Desi Ücreti (₺)</span>
    </div>
  `;

  getKargoListesi().forEach(id => {
    const firma = firmalar[id];
    const def = defaults[id];
    kargoState[id] = {
      varsayilanUcret: firma.varsayilanUcret,
      desiUcret: firma.desiUcret,
    };

    const row = document.createElement('div');
    row.className = 'param-row';
    row.innerHTML = `
      <div class="param-row__label">
        <i class="ti ${firma.ikon}"></i>
        <span>${firma.ad}</span>
      </div>
      <div class="param-row__inputs">
        <input type="number" class="komisyon-input ${firma.varsayilanUcret !== def.varsayilanUcret ? 'komisyon-input--modified' : ''}"
               data-kargo="${id}" data-field="varsayilanUcret"
               value="${firma.varsayilanUcret}" min="0" step="0.5">
        <input type="number" class="komisyon-input ${firma.desiUcret !== def.desiUcret ? 'komisyon-input--modified' : ''}"
               data-kargo="${id}" data-field="desiUcret"
               value="${firma.desiUcret}" min="0" step="0.5">
      </div>
    `;
    el.appendChild(row);
  });

  el.addEventListener('input', e => {
    const inp = e.target;
    if (!inp.dataset.kargo) return;
    const id = inp.dataset.kargo;
    const field = inp.dataset.field;
    const val = parseFloat(inp.value) || 0;
    kargoState[id][field] = val;
    const def = KARGO_FIRMALARI[id];
    inp.classList.toggle('komisyon-input--modified', val !== def[field]);
  });
}

/* ══════════════════════════════════════
 *  B. Komisyon Oranları
 * ══════════════════════════════════════ */
function renderKomisyonSection() {
  const el = document.getElementById('komisyon-params');
  if (!el) return;

  const komTablosu = getKomisyonTablosu();
  const defaults = KOMISYON_TABLOSU; // Original frozen defaults

  // Initialize state
  PAZAR_LISTESI.forEach(pazar => {
    komisyonState[pazar] = { ...komTablosu[pazar] };
  });

  // Filter out kendi_site from columns (always 0%)
  const pazarlar = PAZAR_LISTESI.filter(p => p !== 'kendi_site');

  let html = '<div class="komisyon-table-wrap"><table class="komisyon-table">';
  html += '<thead><tr><th>Kategori</th>';
  pazarlar.forEach(p => { html += `<th>${PAZAR_ADLARI[p]}</th>`; });
  html += '</tr></thead><tbody>';

  KATEGORI_LISTESI.forEach(kat => {
    const katAd = KATEGORILER[kat]?.ad || kat;
    html += `<tr><td>${katAd}</td>`;
    pazarlar.forEach(pazar => {
      const val = komTablosu[pazar]?.[kat] ?? 0;
      const defVal = defaults[pazar]?.[kat] ?? 0;
      const modified = val !== defVal ? 'komisyon-input--modified' : '';
      html += `<td><input type="number" class="komisyon-input ${modified}"
                data-pazar="${pazar}" data-kat="${kat}"
                value="${val}" min="0" max="100" step="0.1"></td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table></div>';
  el.innerHTML = html;

  el.addEventListener('input', e => {
    const inp = e.target;
    if (!inp.dataset.pazar) return;
    const pazar = inp.dataset.pazar;
    const kat = inp.dataset.kat;
    const val = parseFloat(inp.value) || 0;
    komisyonState[pazar][kat] = val;
    const defVal = KOMISYON_TABLOSU[pazar]?.[kat] ?? 0;
    inp.classList.toggle('komisyon-input--modified', val !== defVal);
  });
}

/* ══════════════════════════════════════
 *  C. Vergi & Kesinti
 * ══════════════════════════════════════ */
function renderVergiSection() {
  const el = document.getElementById('vergi-params');
  if (!el) return;

  const params = getVergiParams();
  vergiState = { ...params };

  const rows = [
    { id: 'stopajOrani', label: 'Stopaj Oranı (%)', ikon: 'ti-receipt', def: STOPAJ_ORANI },
    { id: 'odemeKomisyonu', label: 'Ödeme Komisyonu (%)', ikon: 'ti-credit-card', def: ODEME_KOMISYONU },
  ];

  el.innerHTML = rows.map(r => {
    const val = params[r.id];
    const modified = val !== r.def ? 'komisyon-input--modified' : '';
    return `
      <div class="param-row">
        <div class="param-row__label">
          <i class="ti ${r.ikon}"></i>
          <span>${r.label}</span>
        </div>
        <div class="param-row__inputs">
          <input type="number" class="komisyon-input ${modified}"
                 data-vergi="${r.id}" value="${val}" min="0" max="100" step="0.01">
        </div>
      </div>`;
  }).join('');

  el.addEventListener('input', e => {
    const inp = e.target;
    if (!inp.dataset.vergi) return;
    const field = inp.dataset.vergi;
    const val = parseFloat(inp.value) || 0;
    vergiState[field] = val;
    const defVal = field === 'stopajOrani' ? STOPAJ_ORANI : ODEME_KOMISYONU;
    inp.classList.toggle('komisyon-input--modified', val !== defVal);
  });
}

/* ══════════════════════════════════════
 *  Actions
 * ══════════════════════════════════════ */
function handleSave() {
  // Only save overrides that differ from defaults
  const kargoOverrides = {};
  for (const [id, state] of Object.entries(kargoState)) {
    const def = KARGO_FIRMALARI[id];
    const diff = {};
    if (state.varsayilanUcret !== def.varsayilanUcret) diff.varsayilanUcret = state.varsayilanUcret;
    if (state.desiUcret !== def.desiUcret) diff.desiUcret = state.desiUcret;
    if (Object.keys(diff).length) kargoOverrides[id] = diff;
  }

  const komisyonOverrides = {};
  for (const [pazar, kats] of Object.entries(komisyonState)) {
    const def = KOMISYON_TABLOSU[pazar];
    const diff = {};
    for (const [kat, val] of Object.entries(kats)) {
      if (val !== (def?.[kat] ?? 0)) diff[kat] = val;
    }
    if (Object.keys(diff).length) komisyonOverrides[pazar] = diff;
  }

  const vergiOverrides = {};
  if (vergiState.stopajOrani !== STOPAJ_ORANI) vergiOverrides.stopajOrani = vergiState.stopajOrani;
  if (vergiState.odemeKomisyonu !== ODEME_KOMISYONU) vergiOverrides.odemeKomisyonu = vergiState.odemeKomisyonu;

  saveKargoOverrides(Object.keys(kargoOverrides).length ? kargoOverrides : {});
  saveKomisyonOverrides(Object.keys(komisyonOverrides).length ? komisyonOverrides : {});
  saveVergiOverrides(Object.keys(vergiOverrides).length ? vergiOverrides : {});

  showToast('Parametreler kaydedildi', 'success');
}

function handleReset() {
  resetAllOverrides();
  showToast('Varsayılan değerlere dönüldü', 'info');
  setTimeout(() => location.reload(), 500);
}

/* ══════════════════════════════════════
 *  Yedekleme / Geri Yükleme
 * ══════════════════════════════════════ */
function handleBackup() {
  try {
    const count = exportFullBackup();
    showToast(`${count} anahtar yedeklendi`, 'success');
  } catch (err) {
    showToast('Yedekleme hatası: ' + err.message, 'error');
  }
}

async function handleRestore() {
  try {
    const file = await pickFile('.json');
    const count = await importFullBackup(file);
    showToast(`${count} anahtar geri yüklendi — sayfa yenileniyor…`, 'success');
    setTimeout(() => location.reload(), 1200);
  } catch (err) {
    if (err.message === 'Dosya seçilmedi') return;
    showToast('Geri yükleme hatası: ' + err.message, 'error');
  }
}

/** Basit toast bildirimi */
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const colors = {
    success: 'bg-green-600',
    info: 'bg-blue-600',
    error: 'bg-red-600',
  };
  const toast = document.createElement('div');
  toast.className = `${colors[type] || colors.info} text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2 animate-slide-in`;
  toast.innerHTML = `<i class="ti ${type === 'success' ? 'ti-check' : 'ti-info-circle'}"></i><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
