import { previewTemplate } from './preview.template.js';
import { collectResumeData } from '../../services/resume-data.service.js';
import { debounce } from '../../utils/debounce.js';

const CV_WIDTH_PX = 794;
// Thin gray margin around the page so it reads as a distinct sheet of
// paper sitting on the panel, not just "the rest of the white UI" - makes
// it obvious where the printable A4 page starts and ends. Kept small so it
// doesn't eat into the already-limited preview space.
const PAGE_MARGIN_PX = 10;
const TEMPLATE_STORAGE_KEY = 'curriculofacil_template';
const COLOR_STORAGE_KEY = 'curriculofacil_template_color';

/** @type {Record<string, {accent: string, dark: string, light: string}>} */
const COLOR_PALETTES = {
  blue:     { accent: '#1e3a8a', dark: '#16296b', light: '#eff6ff' },
  charcoal: { accent: '#1f2937', dark: '#111827', light: '#f9fafb' },
  navy:     { accent: '#0f172a', dark: '#020617', light: '#eff6ff' },
  indigo:   { accent: '#312e81', dark: '#1e1b4b', light: '#eef2ff' },
  plum:     { accent: '#6b21a8', dark: '#581c87', light: '#faf5ff' },
  wine:     { accent: '#7f1d1d', dark: '#661616', light: '#fef2f2' },
  rust:     { accent: '#7c2d12', dark: '#5c2109', light: '#fff7ed' },
  teal:     { accent: '#134e4a', dark: '#042f2e', light: '#f0fdfa' },
  green:    { accent: '#166534', dark: '#14532d', light: '#f0fdf4' },
};

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

  const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY) ?? 'classic';
  applyTemplate(saved, buttons);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const template = btn.dataset.template;
      localStorage.setItem(TEMPLATE_STORAGE_KEY, template);
      applyTemplate(template, buttons);
      // The sidebar theme groups sections into different HTML containers
      // than classic/modern (see preview.template.js) - a class toggle
      // alone isn't enough, the markup itself has to be regenerated.
      renderPreview();
    });
  });
}

const THEMES = ['modern', 'sidebar'];

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

/** @returns {void} */
function initColorSwatches() {
  const swatches = document.querySelectorAll('.color-swatch');
  if (!swatches.length) return;

  const saved = localStorage.getItem(COLOR_STORAGE_KEY) ?? 'blue';
  applyColor(saved, swatches);

  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      localStorage.setItem(COLOR_STORAGE_KEY, color);
      applyColor(color, swatches);
    });
  });
}

/**
 * @param {string} colorKey
 * @param {NodeListOf<HTMLElement>} swatches
 * @returns {void}
 */
function applyColor(colorKey, swatches) {
  const palette = COLOR_PALETTES[colorKey] ?? COLOR_PALETTES.blue;
  const preview = document.getElementById('cv-preview');

  if (preview) {
    preview.style.setProperty('--cv-accent', palette.accent);
    preview.style.setProperty('--cv-accent-dark', palette.dark);
    preview.style.setProperty('--cv-accent-light', palette.light);
  }

  swatches.forEach(btn => {
    btn.classList.toggle('color-swatch--active', btn.dataset.color === colorKey);
  });
}

/** @returns {void} */
function renderPreview() {
  const preview = document.getElementById('cv-preview');
  if (!preview) return;
  const template = localStorage.getItem(TEMPLATE_STORAGE_KEY) ?? 'classic';
  preview.innerHTML = previewTemplate(collectResumeData(), template);
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
  wrapper.style.height = `${Math.round(1123 * scale) + PAGE_MARGIN_PX * 2}px`;
}
