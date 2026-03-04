/**
 * @module DOM
 * @description DOM yardımcı fonksiyonları
 */

/**
 * Tek element seç (querySelector kısayolu)
 * @param {string} selector - CSS seçici
 * @param {Element} [parent=document] - Üst element
 * @returns {Element|null}
 */
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Çoklu element seç (querySelectorAll kısayolu)
 * @param {string} selector - CSS seçici
 * @param {Element} [parent=document] - Üst element
 * @returns {Element[]}
 */
export function $$(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

/** DOM property olarak atanmasi gereken anahtarlar */
const DOM_PROPS = new Set([
  'textContent', 'innerHTML', 'value', 'checked',
  'disabled', 'readOnly', 'tabIndex', 'htmlFor',
]);

/** camelCase ARIA → kebab-case donusumu (ariaLabel → aria-label) */
function ariaKey(key) {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Element oluştur (attribute, property ve children destekli)
 * @param {string} tag - HTML etiket adı
 * @param {Object} [attrs={}] - Nitelikler / ozellikler
 * @param {(string|Element)[]} [children=[]] - Alt elementler
 * @returns {Element}
 */
export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'dataset') {
      Object.assign(el.dataset, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (DOM_PROPS.has(key)) {
      el[key] = value;
    } else if (key.startsWith('aria')) {
      el.setAttribute(ariaKey(key), value);
    } else {
      el.setAttribute(key, value);
    }
  }

  for (const child of children) {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Element) {
      el.appendChild(child);
    }
  }

  return el;
}

/**
 * ID ile element getir (kısayol)
 * @param {string} id - Element ID
 * @returns {Element|null}
 */
export function byId(id) {
  return document.getElementById(id);
}

/**
 * Element göster/gizle
 * @param {Element} el - Hedef element
 * @param {boolean} visible - Görünürlük durumu
 */
export function toggleVisible(el, visible) {
  if (!el) return;
  el.classList.toggle('hidden', !visible);
}

/**
 * Elementin HTML içeriğini güvenli şekilde ayarla
 * @param {Element} el - Hedef element
 * @param {string} html - HTML içeriği
 */
export function setHTML(el, html) {
  if (!el) return;
  el.innerHTML = html;
}
