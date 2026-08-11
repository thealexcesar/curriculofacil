const STORAGE_KEY = 'curriculofacil_text_large';

/** @returns {void} */
export function initFontSizeToggle() {
  const btn = document.getElementById('font-size-toggle');
  if (!btn) return;

  const active = localStorage.getItem(STORAGE_KEY) === '1';
  applyFontSize(active, btn);

  btn.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('text-large');
    applyFontSize(!next, btn);
    localStorage.setItem(STORAGE_KEY, !next ? '1' : '0');
  });
}

/**
 * @param {boolean} large
 * @param {HTMLButtonElement} btn
 * @returns {void}
 */
function applyFontSize(large, btn) {
  document.documentElement.classList.toggle('text-large', large);
  btn.setAttribute('aria-pressed', String(large));
}
