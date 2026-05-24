import ptBR from '../../locales/pt-BR.json' with { type: 'json' };
import en from '../../locales/en.json'   with { type: 'json' };
import de from '../../locales/de.json'   with { type: 'json' };

/** @typedef {'pt-BR' | 'en' | 'de'} Locale */

const STORAGE_KEY    = 'curriculofacil_locale';
const DEFAULT_LOCALE = 'pt-BR';

/** @type {Record<Locale, Object>} */
const LOCALES = { 'pt-BR': ptBR, en, de };

/** @type {Locale} */
let current = DEFAULT_LOCALE;

/** @returns {void} */
export function initLocale() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const fromHtml = document.documentElement.lang;
  setLocale(saved ?? fromHtml ?? DEFAULT_LOCALE);
}

/**
 * @param {Locale} locale
 * @returns {void}
 */
export function setLocale(locale) {
  current = LOCALES[locale] ? locale : DEFAULT_LOCALE;
  localStorage.setItem(STORAGE_KEY, current);
  document.documentElement.lang = current;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', t('meta.description'));
}

/** @returns {Locale} */
export function getLocale() {
  return current;
}

/**
 * Translates a dot-notation key to the localized string.
 * Falls back to pt-BR if key is missing in active locale.
 * Returns the key itself if not found anywhere.
 * Supports {{param}} interpolation via params object.
 *
 * @param {string}                 key       - Dot-notation key e.g. 'field.email.label'
 * @param {Record<string, string>} [params={}] - Values to interpolate e.g. { item: 'Educação' }
 * @returns {string}
 *
 * @example
 * t('field.email.label')                             // → 'E-mail'
 * t('btn.add', { item: t('section.education') })     // → 'Adicionar Educação'
 * t('missing.key')                                   // → 'missing.key'
 */
export function t(key, params = {}) {
  const keys = key.split('.');
  const resolve = (obj) => keys.reduce((acc, k) => acc?.[k], obj);
  const value = resolve(LOCALES[current]) ?? resolve(LOCALES[DEFAULT_LOCALE]) ?? key;
  return Object.entries(params).reduce((str, [k, v]) => str.replaceAll(`{{${k}}}`, v), value);
}

/**
 * Translates all DOM elements with data-i18n, data-i18n-placeholder or data-i18n-item.
 * Call once after initLocale() and whenever the locale changes.
 *
 * Supports:
 * - data-i18n="key"                          → sets element.textContent
 * - data-i18n-item="key"                     → resolves item param for data-i18n interpolation
 * - data-i18n-placeholder="key"              → sets element.placeholder
 *
 * @returns {void}
 */
export function translateDOM() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const item = el.dataset.i18nItem ? t(el.dataset.i18nItem) : undefined;
    el.textContent = item ? t(el.dataset.i18n, { item }) : t(el.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}
