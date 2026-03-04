/**
 * @module ChartManager
 * @description ECharts örnek yöneticisi: tema, boyutlandırma ve yaşam döngüsü.
 * ECharts CDN üzerinden global olarak yüklenir (window.echarts).
 */

/** @type {Set<echarts.ECharts>} Aktif grafik örneklerini takip eder */
const activeInstances = new Set();

/** @type {string} Mevcut tema adı */
let currentTheme = resolveTheme();

/* ------------------------------------------------------------------ */
/*  Tema Yardımcıları                                                  */
/* ------------------------------------------------------------------ */

/**
 * HTML elemanındaki dark sınıfını kontrol ederek temayı belirler
 * @returns {'dark' | 'light'}
 */
function resolveTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Koyu/açık tema için önceden tanımlı renk paletini döndürür
 * @param {'dark' | 'light'} theme
 * @returns {Object} ECharts tema ayarları
 */
function getThemeOverrides(theme) {
  const isDark = theme === 'dark';
  return {
    backgroundColor: 'transparent',
    textStyle: {
      color: isDark ? '#e5e7eb' : '#374151',
      fontFamily: '"Inter", system-ui, sans-serif',
    },
    title: {
      textStyle: { color: isDark ? '#f3f4f6' : '#111827' },
    },
    legend: {
      textStyle: { color: isDark ? '#d1d5db' : '#4b5563' },
    },
    tooltip: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: { color: isDark ? '#f9fafb' : '#111827' },
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Genel API                                                          */
/* ------------------------------------------------------------------ */

/**
 * Belirtilen kapsayıcıda yeni bir ECharts örneği oluşturur
 * @param {HTMLElement|string} container - DOM elemanı veya kimliği
 * @param {Object} [opts={}] - ECharts init seçenekleri (renderer vb.)
 * @returns {echarts.ECharts|null} Oluşturulan grafik örneği
 */
export function initChart(container, opts = {}) {
  const el = typeof container === 'string'
    ? document.getElementById(container)
    : container;

  if (!el) {
    console.warn(`[ChartManager] Kapsayıcı bulunamadı: ${container}`);
    return null;
  }

  /* Mevcut örnekleri sil (yeniden çizim senaryosu) */
  const existing = window.echarts.getInstanceByDom(el);
  if (existing) {
    disposeChart(existing);
  }

  const theme = resolveTheme();
  const instance = window.echarts.init(el, theme, {
    renderer: 'canvas',
    ...opts,
  });

  activeInstances.add(instance);
  return instance;
}

/**
 * Bir grafik örneğini yok eder ve takip listesinden çıkarır
 * @param {echarts.ECharts} instance
 */
export function disposeChart(instance) {
  if (!instance || instance.isDisposed()) return;
  instance.dispose();
  activeInstances.delete(instance);
}

/**
 * Tüm aktif grafik örneklerini yeniden boyutlandırır
 */
export function resizeAll() {
  activeInstances.forEach((inst) => {
    if (!inst.isDisposed()) {
      inst.resize({ animation: { duration: 250 } });
    }
  });
}

/**
 * Tüm aktif grafik örneklerini yok eder
 */
export function disposeAll() {
  activeInstances.forEach((inst) => {
    if (!inst.isDisposed()) inst.dispose();
  });
  activeInstances.clear();
}

/**
 * Tema değişikliğinde tüm grafikleri yeni tema ile yeniden oluşturur
 * @param {'dark' | 'light'} newTheme
 */
function applyThemeToAll(newTheme) {
  currentTheme = newTheme;
  activeInstances.forEach((inst) => {
    if (inst.isDisposed()) return;
    const overrides = getThemeOverrides(newTheme);
    inst.setOption(overrides, false);
  });
}

/* ------------------------------------------------------------------ */
/*  Olay Dinleyicileri                                                 */
/* ------------------------------------------------------------------ */

/** Pencere boyut değişikliğinde grafikleri yeniden boyutlandır */
let resizeTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(resizeAll, 150);
});

/**
 * MutationObserver ile html elemanındaki dark sınıf değişikliklerini izler.
 * Sınıf değiştiğinde tüm aktif grafiklere yeni tema uygulanır.
 */
const themeObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.attributeName === 'class') {
      const detected = resolveTheme();
      if (detected !== currentTheme) {
        applyThemeToAll(detected);
      }
      break;
    }
  }
});

themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class'],
});

/**
 * Aktif grafik örneği sayısını döndürür (test/debug amaçlı)
 * @returns {number}
 */
export function getActiveCount() {
  return activeInstances.size;
}

/**
 * Mevcut tema adını döndürür
 * @returns {'dark' | 'light'}
 */
export function getCurrentTheme() {
  return currentTheme;
}
