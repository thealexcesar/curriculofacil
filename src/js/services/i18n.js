// src/js/services/i18n.js

import ptBR from '../../locales/pt-BR.json' with { type: 'json' };
import en   from '../../locales/en.json'   with { type: 'json' };
import de   from '../../locales/de.json'   with { type: 'json' };

/** @typedef {'pt-BR' | 'en' | 'de'} Locale */

const STORAGE_KEY  = 'curriculofacil_locale';
const DEFAULT_LOCALE = 'pt-BR';

/** @type {Record<Locale, Object>} */
const LOCALES = { 'pt-BR': ptBR, en, de };

/** @type {Locale} */
let current = DEFAULT_LOCALE;

/**
 * Initializes locale from localStorage or HTML lang attribute.
 * Call once on app start before any other init.
 *
 * @returns {void}
 */
export function initLocale() {
  const saved   = localStorage.getItem(STORAGE_KEY);
  const fromHtml = document.documentElement.lang;
  setLocale(saved ?? fromHtml ?? DEFAULT_LOCALE);
}

/**
 * Sets the active locale, persists to localStorage
 * and updates the HTML lang attribute.
 *
 * @param {Locale} locale
 * @returns {void}
 */
export function setLocale(locale) {
  current = LOCALES[locale] ? locale : DEFAULT_LOCALE;
  localStorage.setItem(STORAGE_KEY, current);
  document.documentElement.lang = current;
}

/**
 * Returns the currently active locale key.
 *
 * @returns {Locale}
 */
export function getLocale() {
  return current;
}

/**
 * Translates a dot-notation key to the localized string.
 * Falls back to pt-BR if key is missing in active locale.
 * Returns the key itself if not found anywhere.
 *
 * @param {string} key - Dot-notation key e.g. 'field.email.label'
 * @returns {string}
 *
 * @example
 * t('field.email.label') // → 'E-mail'
 * t('btn.next')          // → 'Próximo'
 * t('missing.key')       // → 'missing.key'
 */
export function t(key) {
  const keys = key.split('.');
  const resolve = (obj) => keys.reduce((acc, k) => acc?.[k], obj);
  return resolve(LOCALES[current]) ?? resolve(LOCALES[DEFAULT_LOCALE]) ?? key;
}

/**
 * Translates all DOM elements that have data-i18n or data-i18n-placeholder attributes.
 * Call this once after initLocale() and whenever the locale changes.
 *
 * Supports:
 * - data-i18n="key"             → sets element.textContent
 * - data-i18n-placeholder="key" → sets element.placeholder
 *
 * @returns {void}
 */
export function translateDOM() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}