/**
 * @module ImportExport
 * @description Veri yedekleme/geri yükleme, JSON/Excel import-export
 */

import { save, load, listKeys } from './storage.js';

const PREFIX = 'maliyet_';
const APP_VERSION = '1.0.0';

/* ═══════════ Yardımcılar ═══════════ */

/** @param {Blob} blob  @param {string} filename */
export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** @param {File} file @returns {Promise<any>} */
export function readFileAsJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try { resolve(JSON.parse(reader.result)); }
      catch (e) { reject(new Error('Geçersiz JSON dosyası')); }
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı'));
    reader.readAsText(file);
  });
}

/** Gizli file input oluştur ve tıkla @param {string} accept @returns {Promise<File>} */
export function pickFile(accept = '.json') {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.style.display = 'none';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      document.body.removeChild(input);
      if (file) resolve(file);
      else reject(new Error('Dosya seçilmedi'));
    });
    document.body.appendChild(input);
    input.click();
  });
}

/* ═══════════ Tam Yedekleme (JSON) ═══════════ */

/** Tüm maliyet_* verilerini JSON olarak indir */
export function exportFullBackup() {
  const keys = listKeys();
  const data = {};
  for (const key of keys) {
    data[key] = load(key);
  }
  const backup = {
    appVersion: APP_VERSION,
    exportDate: new Date().toISOString(),
    keyCount: keys.length,
    data,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const date = new Date().toISOString().slice(0, 10);
  triggerDownload(blob, `maliyet-yedek-${date}.json`);
  return keys.length;
}

/** JSON yedek dosyasını geri yükle @param {File} file @returns {Promise<number>} restored key count */
export async function importFullBackup(file) {
  const backup = await readFileAsJSON(file);

  // Doğrulama
  if (!backup?.data || typeof backup.data !== 'object') {
    throw new Error('Geçersiz yedek dosyası formatı');
  }

  let count = 0;
  for (const [key, value] of Object.entries(backup.data)) {
    save(key, value);
    count++;
  }
  return count;
}

/* ═══════════ Reçete Import/Export (JSON) ═══════════ */

/** Tüm reçeteleri JSON olarak indir */
export function exportRecipesJSON() {
  const receteler = load('receteler', []);
  if (!receteler.length) throw new Error('Dışa aktarılacak reçete bulunamadı');

  const blob = new Blob([JSON.stringify(receteler, null, 2)], { type: 'application/json' });
  triggerDownload(blob, `receteler-${new Date().toISOString().slice(0, 10)}.json`);
  return receteler.length;
}

/** Reçeteleri JSON dosyasından içe aktar (mevcut reçetelere ekle) @param {File} file @returns {Promise<number>} */
export async function importRecipesJSON(file) {
  const imported = await readFileAsJSON(file);

  if (!Array.isArray(imported)) {
    throw new Error('Geçersiz reçete dosyası — dizi (array) bekleniyor');
  }

  const existing = load('receteler', []);
  const existingIds = new Set(existing.map((r) => r.id));
  let addedCount = 0;

  for (const recete of imported) {
    if (!recete?.id || !recete?.ad) continue; // geçersiz girdileri atla

    // ID çakışması varsa yeni ID oluştur
    if (existingIds.has(recete.id)) {
      recete.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }
    existing.push(recete);
    existingIds.add(recete.id);
    addedCount++;
  }

  save('receteler', existing);
  return addedCount;
}

/* ═══════════ Rapor JSON Export ═══════════ */

/**
 * Rapor verilerini .json olarak indir
 * @param {Object} sonuclar
 * @param {Object} girdiler
 */
export function exportReportJSON(sonuclar, girdiler) {
  const payload = {
    appVersion: APP_VERSION,
    exportDate: new Date().toISOString(),
    type: 'rapor',
    sonuclar,
    girdiler,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  triggerDownload(blob, `maliyet-rapor-${new Date().toISOString().slice(0, 10)}.json`);
}

/* ═══════════ Rapor CSV Export ═══════════ */

/** CSV hücresini escape et */
function csvCell(val) {
  if (val == null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Rapor verilerini .csv olarak indir
 * @param {Object} sonuclar
 * @param {Object} girdiler
 */
export function exportReportCSV(sonuclar, girdiler) {
  const s = sonuclar;
  const g = girdiler;
  const rows = [
    ['E-Ticaret Maliyet Raporu', new Date().toLocaleDateString('tr-TR')],
    [],
    ['Metrik', 'Değer'],
    ['Satış Fiyatı', s.satisFiyati],
    ['Efektif Fiyat', s.efektifFiyat],
    ['Alış Fiyatı', g.alis_fiyati],
    ['Brüt Kar', s.brutKar],
    ['Net Kar', s.netKar],
    ['Net Marj (%)', s.netMarj],
    ['ROI (%)', s.roi],
    ['Kar Oranı (%)', s.karOrani ?? ''],
    ['Toplam Maliyet', s.toplamMaliyet],
    ['Başabaş Fiyatı', s.basabasFiyati],
    [],
    ['Maliyet Kalemi', 'Tutar (₺)'],
    ['Komisyon', s.komisyonTutar],
    ['Kargo', g.kargo],
    ['KDV', s.kdvTutar],
    ['Stopaj', s.stopajTutar],
    ['Ödeme Komisyonu', s.odemeKomTutar ?? 0],
    ['Gelir Vergisi', s.gelirVergisi],
    ['Ambalaj', g.ambalaj],
    ['Reklam', g.reklam ?? 0],
    ['İade Maliyeti', s.iadeMaliyeti],
  ];

  const csv = rows.map((r) => r.map(csvCell).join(',')).join('\n');
  // UTF-8 BOM for Turkish characters
  const bom = '\uFEFF';
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' });
  triggerDownload(blob, `maliyet-rapor-${new Date().toISOString().slice(0, 10)}.csv`);
}

/* ═══════════ Rapor Import (JSON) ═══════════ */

/**
 * Daha önce dışa aktarılmış rapor JSON'ını içe aktar
 * @param {File} file
 * @returns {Promise<{sonuclar: Object, girdiler: Object}>}
 */
export async function importReportJSON(file) {
  const data = await readFileAsJSON(file);

  // Doğrudan { sonuclar, girdiler } veya { type:'rapor', sonuclar, girdiler }
  const sonuclar = data?.sonuclar;
  const girdiler = data?.girdiler;

  if (!sonuclar || typeof sonuclar !== 'object') {
    throw new Error('Geçersiz rapor dosyası — sonuclar bulunamadı');
  }

  // localStorage'a kaydet (rapor sayfasının okuyacağı format)
  save('rapor_veri', { sonuclar, girdiler: girdiler || {} });
  return { sonuclar, girdiler: girdiler || {} };
}

/* ═══════════ Excel Export (SheetJS) ═══════════ */

/**
 * Rapor verilerini .xlsx olarak indir
 * @param {Object} sonuclar - Hesaplama sonuçları
 * @param {Object} girdiler - Hesaplama girdileri
 */
export function exportReportExcel(sonuclar, girdiler) {
  /* global XLSX */
  if (typeof XLSX === 'undefined') {
    throw new Error('SheetJS kütüphanesi yüklenmemiş');
  }

  const s = sonuclar;
  const g = girdiler;
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Özet ──
  const ozet = [
    ['E-Ticaret Maliyet Raporu', '', new Date().toLocaleDateString('tr-TR')],
    [],
    ['Metrik', 'Değer'],
    ['Satış Fiyatı', s.satisFiyati],
    ['Efektif Fiyat', s.efektifFiyat],
    ['Alış Fiyatı', g.alis_fiyati],
    ['Brüt Kar', s.brutKar],
    ['Net Kar', s.netKar],
    ['Net Marj (%)', s.netMarj],
    ['ROI (%)', s.roi],
    ['Kar Oranı (%)', s.karOrani ?? ''],
    ['Toplam Maliyet', s.toplamMaliyet],
    ['Başabaş Fiyatı', s.basabasFiyati],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(ozet);
  ws1['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Özet');

  // ── Sheet 2: Maliyet Kırılımı ──
  const kirilim = [
    ['Kalem', 'Tutar (₺)', 'Oran (%)'],
    ['Komisyon', s.komisyonTutar, ''],
    ['Kargo', g.kargo, ''],
    ['KDV', s.kdvTutar, ''],
    ['Stopaj', s.stopajTutar, ''],
    ['Ödeme Komisyonu', s.odemeKomTutar ?? 0, ''],
    ['Gelir Vergisi', s.gelirVergisi, ''],
    ['Ambalaj', g.ambalaj, ''],
    ['Reklam', g.reklam ?? 0, ''],
    ['İade Maliyeti', s.iadeMaliyeti, ''],
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(kirilim);
  ws2['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Maliyet Kırılımı');

  // ── Sheet 3: Girdiler ──
  const girdiData = [
    ['Parametre', 'Değer'],
    ['Hesap Modu', g.hesapModu],
    ['Kategori', g.kategori],
    ['Pazar Yeri', g.ppiazar],
    ['Alış Fiyatı', g.alis_fiyati],
    ['Satış Fiyatı', g.satis_fiyati ?? s.satisFiyati],
    ['Komisyon (%)', g.komisyon],
    ['Kargo (₺)', g.kargo],
    ['Ambalaj (₺)', g.ambalaj],
    ['KDV (%)', g.kdv],
    ['İade Oranı (%)', g.iade_orani],
    ['Stopaj (%)', g.stopaj],
    ['Aylık Adet', g.aylik_satis ?? 100],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(girdiData);
  ws3['!cols'] = [{ wch: 18 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, ws3, 'Girdiler');

  // İndir
  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  triggerDownload(blob, `maliyet-rapor-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
