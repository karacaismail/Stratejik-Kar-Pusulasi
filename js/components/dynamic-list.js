/**
 * @module DynamicList
 * @description Satır ekle/çıkar listesi bileşeni (BOM için)
 */

import { createElement } from '../utils/dom.js';

/**
 * @typedef {Object} DynamicListOptions
 * @property {string} id - Liste kimliği
 * @property {string} addLabel - Ekle butonu metni
 * @property {Function} renderRow - Satır render fonksiyonu (item, index) => HTMLElement
 * @property {Function} createItem - Yeni boş öğe oluşturucu
 * @property {Function} [onChange] - Liste değiştiğinde çağrılır
 */

/**
 * DynamicList bileşeni oluştur
 * @param {DynamicListOptions} opts
 * @returns {{el: HTMLElement, getItems: Function, setItems: Function, addItem: Function}}
 */
export function createDynamicList(opts) {
  const { id, addLabel, renderRow, createItem, onChange } = opts;
  let items = [];

  const wrapper = createElement('div', {
    className: 'dynamic-list',
    id,
  });

  const listEl = createElement('div', { className: 'dynamic-list__items' });

  const addBtn = createElement('button', {
    className: 'dynamic-list__add-btn',
    type: 'button',
  }, [
    createElement('i', { className: 'ti ti-plus' }),
    createElement('span', {}, [addLabel]),
  ]);

  addBtn.addEventListener('click', () => addItem());

  wrapper.append(listEl, addBtn);

  function render() {
    listEl.innerHTML = '';
    items.forEach((item, idx) => {
      const row = renderRow(item, idx, {
        onUpdate: (field, value) => {
          items[idx][field] = value;
          notifyChange();
        },
        onRemove: () => removeItem(idx),
      });
      listEl.appendChild(row);
    });
  }

  function addItem(item) {
    items.push(item || createItem());
    render();
    notifyChange();
  }

  function removeItem(idx) {
    items.splice(idx, 1);
    render();
    notifyChange();
  }

  function notifyChange() {
    if (onChange) onChange([...items]);
  }

  function setItems(newItems) {
    items = [...newItems];
    render();
  }

  function getItems() {
    return [...items];
  }

  return { el: wrapper, getItems, setItems, addItem };
}
