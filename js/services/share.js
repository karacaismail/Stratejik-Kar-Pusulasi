/**
 * @module Share
 * @description URL parametre paylaşım servisi
 */

/**
 * State'i URL parametrelerine dönüştür
 * @param {Object} state - Paylaşılacak durum verisi
 * @returns {string} Paylaşım URL'i
 */
export function createShareURL(state) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(state)) {
    if (value !== null && value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }

  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

/**
 * URL parametrelerinden state oku
 * @returns {Object|null} Okunan durum verisi veya null
 */
export function readShareParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.size === 0) return null;

  const data = {};
  for (const [key, value] of params.entries()) {
    const num = Number(value);
    data[key] = isNaN(num) ? value : num;
  }

  return data;
}

/**
 * URL'i panoya kopyala
 * @param {string} url - Kopyalanacak URL
 * @returns {Promise<boolean>} Başarı durumu
 */
export async function copyToClipboard(url) {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    /* Fallback: eski yöntem */
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(input);
    return ok;
  }
}

/**
 * Paylaştıktan sonra URL parametrelerini temizle
 */
export function clearShareParams() {
  const url = `${window.location.origin}${window.location.pathname}`;
  window.history.replaceState({}, '', url);
}
