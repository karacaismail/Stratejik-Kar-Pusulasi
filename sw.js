/**
 * Service Worker — E-Ticaret Maliyet Hesaplayıcı
 * Cache-first for static assets, network-first for CDN with cache fallback
 */

const CACHE_NAME = 'maliyet-v4';

/* ── Pre-cache list ── */
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/recete.html',
  '/rapor.html',
  '/parametreler.html',
  '/manifest.json',
  '/css/tokens.css',
  '/css/base.css',
  '/css/components.css',
  '/css/pages.css',
  '/js/main.js',
  '/js/recete-main.js',
  '/js/rapor-main.js',
  '/js/parametreler-main.js',
  '/js/config/categories.js',
  '/js/config/commissions.js',
  '/js/config/cargo-companies.js',
  '/js/config/constants.js',
  '/js/config/config-manager.js',
  '/js/config/recipe-templates.js',
  '/js/models/calculation-engine.js',
  '/js/models/smart-defaults.js',
  '/js/models/sensitivity.js',
  '/js/models/desi-calculator.js',
  '/js/models/warning-engine.js',
  '/js/models/bom-model.js',
  '/js/models/material-library.js',
  '/js/models/state.js',
  '/js/services/storage.js',
  '/js/services/formatter.js',
  '/js/services/dark-mode.js',
  '/js/services/share.js',
  '/js/services/import-export.js',
  '/js/utils/event-bus.js',
  '/js/utils/debounce.js',
  '/js/utils/decimal-helpers.js',
  '/js/utils/dom.js',
  '/js/components/spin-box.js',
  '/js/components/tab-bar.js',
  '/js/components/progress-steps.js',
  '/js/components/accordion.js',
  '/js/components/dynamic-list.js',
  '/js/components/custom-select.js',
  '/js/components/badge.js',
  '/js/components/toast.js',
  '/js/views/step-wizard.js',
  '/js/views/category-picker.js',
  '/js/views/marketplace-picker.js',
  '/js/views/cost-items-view.js',
  '/js/views/campaign-view.js',
  '/js/views/desi-view.js',
  '/js/views/cargo-picker-view.js',
  '/js/views/hero-card-view.js',
  '/js/views/metrics-view.js',
  '/js/views/alerts-view.js',
  '/js/views/detail-table-view.js',
  '/js/views/bom-costs-view.js',
  '/js/views/report-view.js',
  '/js/charts/chart-manager.js',
  '/js/charts/cost-pie.js',
  '/js/charts/cost-breakdown.js',
  '/js/charts/comparison-chart.js',
  '/js/charts/sensitivity-chart.js',
];

const CDN_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/fonts/tabler-icons.woff2',
  'https://cdn.jsdelivr.net/npm/decimal.js@10.4.3/decimal.min.js',
  'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js',
  'https://cdn.jsdelivr.net/npm/simple-statistics@7.8.3/dist/simple-statistics.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
];

/* ── Install: pre-cache static assets ── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache static assets (fail silently for individual items)
      const staticPromises = STATIC_ASSETS.map((url) =>
        cache.add(url).catch(() => console.warn('SW: cache miss', url))
      );
      // Cache CDN assets (fail silently — network may be unavailable)
      const cdnPromises = CDN_ASSETS.map((url) =>
        cache.add(url).catch(() => console.warn('SW: CDN cache miss', url))
      );
      return Promise.all([...staticPromises, ...cdnPromises]);
    })
  );
  self.skipWaiting();
});

/* ── Activate: clean old caches ── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ── Fetch strategy ── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip non-http(s) schemes (chrome-extension://, etc.)
  if (!url.protocol.startsWith('http')) return;

  // Navigation requests (HTML pages) → network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Local static assets (JS/CSS/images) → network-first with cache fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // CDN assets → network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});

/* ── Message: handle skip-waiting from client ── */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
