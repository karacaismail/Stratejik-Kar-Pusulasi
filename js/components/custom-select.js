/**
 * @module CustomSelect
 * @description Native <select> yerine çapraz platform tutarlı özel açılır menü.
 * Tüm cihaz ve tarayıcılarda aynı görünümü sağlar.
 */

/**
 * @param {Object} opts
 * @param {string[]} opts.options - Seçenek listesi
 * @param {string} [opts.value] - Başlangıç değeri
 * @param {string} [opts.placeholder] - Boş durumda gösterilecek metin
 * @param {Function} [opts.onChange] - Değer değiştiğinde çağrılır
 * @returns {{ el: HTMLElement, getValue: () => string, setValue: (v: string) => void }}
 */
export function createCustomSelect(opts) {
  const { options = [], value = '', placeholder = 'Seç', onChange = null } = opts;
  let currentValue = value || options[0] || '';
  let isOpen = false;

  /* ── Root ── */
  const root = document.createElement('div');
  root.className = 'custom-select';

  /* ── Trigger ── */
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'custom-select__trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');

  const triggerText = document.createElement('span');
  triggerText.textContent = currentValue || placeholder;

  const triggerIcon = document.createElement('i');
  triggerIcon.className = 'ti ti-chevron-down';

  trigger.append(triggerText, triggerIcon);

  /* ── Dropdown ── */
  const dropdown = document.createElement('div');
  dropdown.className = 'custom-select__dropdown';
  dropdown.setAttribute('role', 'listbox');

  function renderOptions() {
    dropdown.innerHTML = '';
    options.forEach(opt => {
      const item = document.createElement('div');
      item.className = 'custom-select__option';
      if (opt === currentValue) item.classList.add('custom-select__option--active');
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', opt === currentValue ? 'true' : 'false');
      item.textContent = opt;
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        selectValue(opt);
        close();
      });
      dropdown.appendChild(item);
    });
  }

  renderOptions();
  root.append(trigger, dropdown);

  /* ── Toggle ── */
  function open() {
    isOpen = true;
    root.classList.add('custom-select--open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function close() {
    isOpen = false;
    root.classList.remove('custom-select--open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  function toggle() {
    isOpen ? close() : open();
  }

  function selectValue(v) {
    const changed = v !== currentValue;
    currentValue = v;
    triggerText.textContent = v;
    renderOptions();
    if (changed && onChange) onChange(v);
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle();
  });

  /* Dışarı tıklayınca kapat */
  document.addEventListener('click', () => {
    if (isOpen) close();
  });

  root.addEventListener('click', (e) => e.stopPropagation());

  /* Klavye desteği */
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });

  return {
    el: root,
    getValue: () => currentValue,
    setValue: (v) => selectValue(v),
  };
}
