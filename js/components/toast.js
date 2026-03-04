/**
 * @module Toast
 * @description Bildirim tost bileşeni
 */

const TOAST_DURATION = 3000;
const TOAST_CONTAINER_ID = 'toast-container';

/**
 * Tost bildirimi göster
 * @param {Object} opts
 * @param {string} opts.message - Bildirim mesajı
 * @param {'success'|'error'|'info'|'warning'} [opts.type='info'] - Bildirim tipi
 * @param {number} [opts.duration] - Görünme süresi (ms)
 */
export function showToast({ message, type = 'info', duration = TOAST_DURATION }) {
  const container = getOrCreateContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;

  const iconMap = {
    success: 'ti-circle-check',
    error: 'ti-alert-triangle',
    info: 'ti-info-circle',
    warning: 'ti-alert-circle',
  };

  toast.innerHTML = `
    <i class="${iconMap[type] || iconMap.info} toast__icon"></i>
    <span class="toast__message">${message}</span>
  `;

  container.appendChild(toast);

  /* Giriş animasyonu */
  requestAnimationFrame(() => toast.classList.add('toast--visible'));

  /* Otomatik kapanma */
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    toast.addEventListener('transitionend', () => toast.remove());
  }, duration);
}

/**
 * Tost container elementini getir veya oluştur
 * @returns {HTMLElement}
 */
function getOrCreateContainer() {
  let container = document.getElementById(TOAST_CONTAINER_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = TOAST_CONTAINER_ID;
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}
