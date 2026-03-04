/**
 * @module Badge
 * @description Auto/Özel/Sabit badge bileşeni
 */

import { createElement } from '../utils/dom.js';

/** Badge tipleri ve stilleri */
const BADGE_STYLES = {
  auto: { class: 'badge--auto', text: 'Auto' },
  custom: { class: 'badge--custom', text: 'Özel' },
  fixed: { class: 'badge--fixed', text: 'Sabit' },
};

/**
 * Badge bileşeni oluştur
 * @param {Object} opts
 * @param {'auto'|'custom'|'fixed'} [opts.type='auto'] - Badge tipi
 * @returns {{el: HTMLElement, setType: Function}}
 */
export function createBadge({ type = 'auto' } = {}) {
  const el = createElement('span', {
    className: `badge ${BADGE_STYLES[type]?.class || BADGE_STYLES.auto.class}`,
  }, [BADGE_STYLES[type]?.text || 'Auto']);

  function setType(newType) {
    const style = BADGE_STYLES[newType] || BADGE_STYLES.auto;
    el.className = `badge ${style.class}`;
    el.textContent = style.text;
  }

  return { el, setType };
}
