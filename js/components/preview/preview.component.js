import { previewTemplate } from './preview.template.js';
import { collectResumeData } from '../../services/resume-data.service.js';
import { debounce } from '../../utils/debounce.js';
import { paletteFromSlider, NEUTRAL_POSITION } from '../../utils/color.js';

const CV_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
// Thin gray margin around the page so it reads as a distinct sheet of
// paper sitting on the panel, not just "the rest of the white UI" - makes
// it obvious where the printable A4 page starts and ends. Kept small so it
// doesn't eat into the already-limited preview space.
const PAGE_MARGIN_PX = 10;
const TEMPLATE_STORAGE_KEY = 'curriculofacil_template';
const COLOR_STORAGE_KEY = 'curriculofacil_template_color';

/** @returns {void} */
export function initPreview() {
  initTemplateSwitcher();
  initColorSwatches();
  renderPreview();
  const debouncedRender = debounce(renderPreview, 150);
  document.addEventListener('input', debouncedRender);
  document.addEventListener('change', debouncedRender);
  window.addEventListener('resize', scaleCvPreview);
  requestAnimationFrame(scaleCvPreview);

  window.addEventListener('beforeprint', () => {
    document.querySelector('.cv-preview-wrapper').style.height = '';
    const cvPreview = document.getElementById('cv-preview');
    cvPreview.style.transform = '';
    cvPreview.style.top = '';
    cvPreview.style.left = '';
  });
  window.addEventListener('afterprint', scaleCvPreview);
}

/** @returns {void} */
function initTemplateSwitcher() {
  const buttons = document.querySelectorAll('.template-btn');
  if (!buttons.length) return;

  const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY) ?? 'modern';
  applyTemplate(saved, buttons);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => setTemplate(btn.dataset.template));
  });
}

/**
 * @param {string} template - 'classic', 'modern' or 'sidebar'
 * @returns {void}
 */
function setTemplate(template) {
  const buttons = document.querySelectorAll('.template-btn');
  localStorage.setItem(TEMPLATE_STORAGE_KEY, template);
  applyTemplate(template, buttons);
  /** Sidebar groups sections into different containers than classic/modern - needs a re-render, not just a class toggle. */
  renderPreview();
}

const THEMES = ['classic', 'modern', 'sidebar'];

/**
 * @param {string} template - 'classic', 'modern' or 'sidebar'
 * @param {NodeListOf<HTMLElement>} buttons
 * @returns {void}
 */
function applyTemplate(template, buttons) {
  const preview = document.getElementById('cv-preview');
  if (preview) {
    THEMES.forEach(theme => preview.classList.toggle(`theme-${theme}`, template === theme));
  }

  buttons.forEach(btn => {
    btn.classList.toggle('template-btn--active', btn.dataset.template === template);
  });
}

/**
 * Two hue sliders exist - one on the welcome screen, one in the preview
 * panel's template switcher - kept in sync the same way the template
 * buttons are: every instance found in the page reflects the one saved
 * value.
 *
 * @returns {void}
 */
function initColorSwatches() {
  const hueInputs = /** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll('.custom-hue-input'));
  if (!hueInputs.length) return;

  const saved = Number(localStorage.getItem(COLOR_STORAGE_KEY) ?? NEUTRAL_POSITION);
  hueInputs.forEach(input => { input.value = String(saved); });
  applyColor(saved);

  hueInputs.forEach(input => {
    input.addEventListener('input', () => {
      hueInputs.forEach(other => { other.value = input.value; });
      localStorage.setItem(COLOR_STORAGE_KEY, input.value);
      applyColor(Number(input.value));
    });
  });

  document.querySelectorAll('.color-reset').forEach(resetBtn => {
    resetBtn.addEventListener('click', () => {
      hueInputs.forEach(input => { input.value = String(NEUTRAL_POSITION); });
      localStorage.setItem(COLOR_STORAGE_KEY, String(NEUTRAL_POSITION));
      applyColor(NEUTRAL_POSITION);
    });
  });
}

/**
 * @param {number} position - Slider position: 0 = neutral gray, 1-360 = hues
 * @returns {void}
 */
function applyColor(position) {
  const palette = paletteFromSlider(position);

  const preview = document.getElementById('cv-preview');
  if (preview) {
    preview.style.setProperty('--cv-accent', palette.accent);
    preview.style.setProperty('--cv-accent-dark', palette.dark);
    preview.style.setProperty('--cv-accent-light', palette.light);
  }

  // The welcome screen's own primary color (Começar, checkmarks, active
  // template thumb) previews the same accent - scoped to #welcome-screen
  // only, so the rest of the app stays on the fixed brand blue. At the
  // neutral position the override is removed instead of set to the résumé's
  // neutral gray, or the welcome screen would turn gray by default before
  // anyone touches the slider.
  const welcomeScreen = document.getElementById('welcome-screen');
  if (welcomeScreen) {
    if (position === NEUTRAL_POSITION) {
      welcomeScreen.style.removeProperty('--color-primary');
      welcomeScreen.style.removeProperty('--color-primary-hover');
    } else {
      welcomeScreen.style.setProperty('--color-primary', palette.accent);
      welcomeScreen.style.setProperty('--color-primary-hover', palette.dark);
    }
  }

  // Shows the picked color in every slider's own thumb.
  document.querySelectorAll('.color-hue').forEach(el => { el.style.setProperty('--picked-color', palette.accent); });
  // Nothing to restore while it's already on the default.
  document.querySelectorAll('.color-reset').forEach(btn => { btn.hidden = position === NEUTRAL_POSITION; });
}

/** @returns {void} */
function renderPreview() {
  const preview = document.getElementById('cv-preview');
  if (!preview) return;
  const template = localStorage.getItem(TEMPLATE_STORAGE_KEY) ?? 'classic';
  const data = collectResumeData();
  console.log('[renderPreview] rodando com personal:', data.personal);
  preview.innerHTML = previewTemplate(data, template);
  scaleCvPreview();
}

/** @returns {void} */
function scaleCvPreview() {
  const wrapper = document.querySelector('.cv-preview-wrapper');
  const preview = document.getElementById('cv-preview');
  if (!wrapper || !preview) return;
  const scale = (wrapper.clientWidth - PAGE_MARGIN_PX * 2) / CV_WIDTH_PX;
  preview.style.transform = `scale(${scale})`;
  preview.style.transformOrigin = 'top left';
  preview.style.top = `${PAGE_MARGIN_PX}px`;
  preview.style.left = `${PAGE_MARGIN_PX}px`;
  // .cv-preview-wrapper clips its overflow, so a résumé that runs past one
  // page would be cut off on screen while still printing in full. Size the
  // wrapper from the rendered content, with one A4 page as the floor.
  const pageHeight = Math.max(preview.scrollHeight, A4_HEIGHT_PX);
  wrapper.style.height = `${Math.round(pageHeight * scale) + PAGE_MARGIN_PX * 2}px`;
}
