/**
 * @fileoverview Cok adimli form wizard kontrolcusu.
 * Mevcut HTML step panellerini (step-1, step-2, step-3) yonetir.
 * Ilerleme gostergesi ve navigasyon butonlariyla entegre calisir.
 * @module views/step-wizard
 */

import { createProgressSteps } from '../components/progress-steps.js';
import { emit } from '../utils/event-bus.js';

/** @type {number} Toplam adim sayisi */
const TOPLAM_ADIM = 3;

/** Adim basliklari */
const ADIM_BASLIK = ['Ne & Nerede?', 'Fiyat & Miktar', 'Maliyet Detayları'];

/**
 * Cok adimli form wizard gorunumunu baslatir.
 * Mevcut HTML yapisini kullanir (#step-1, #step-2, #step-3, #btn-prev, #btn-next).
 * @param {string} containerId - Progress bar'in yerlestirilecegi kapsayici id
 * @returns {{ goToStep: (n: number) => void, getCurrentStep: () => number }}
 */
export function initStepWizard(containerId) {
  const root = document.getElementById(containerId);
  if (!root) return { goToStep() {}, getCurrentStep() { return 0; } };

  let mevcutAdim = 0;

  /* HTML'deki adim panellerini bul */
  const stepEls = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
  ];

  /* HTML'deki navigasyon butonlarini bul */
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  /* Progress bar */
  const progress = createProgressSteps({
    steps: ADIM_BASLIK,
    current: 0,
  });
  root.appendChild(progress.el);

  /* Navigasyon olaylari */
  btnPrev?.addEventListener('click', () => goToStep(mevcutAdim - 1));
  btnNext?.addEventListener('click', () => {
    if (mevcutAdim < TOPLAM_ADIM - 1) {
      goToStep(mevcutAdim + 1);
    } else {
      emit('wizard:complete');
      window.open('rapor.html', '_blank');
    }
  });

  /* Ilk gorunum */
  goToStep(0);

  /**
   * Belirtilen adima git.
   * @param {number} n - Hedef adim (0-indexed)
   */
  function goToStep(n) {
    if (n < 0 || n >= TOPLAM_ADIM) return;
    mevcutAdim = n;

    stepEls.forEach((el, i) => {
      if (!el) return;
      el.classList.toggle('hidden', i !== n);
    });

    progress.setCurrent(n);
    updateNavButtons(n);
    emit('wizard:step', { step: n });

    /* Adım geçişinde sayfanın üstüne yumuşak kaydır */
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Navigasyon butonlarini guncelle */
  function updateNavButtons(adim) {
    if (btnPrev) {
      btnPrev.classList.toggle('hidden', adim <= 0);
    }
    if (btnNext) {
      const isLast = adim >= TOPLAM_ADIM - 1;
      btnNext.innerHTML = isLast
        ? 'Hesapla <i class="ti ti-calculator ml-1"></i>'
        : 'İleri <i class="ti ti-arrow-right ml-1"></i>';
    }
  }

  return { goToStep, getCurrentStep: () => mevcutAdim };
}
