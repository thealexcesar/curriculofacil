import pt from '../../locales/pt-BR.json' with { type: 'json' };
import en from '../../locales/en.json' with { type: 'json' };
import de from '../../locales/de.json' with { type: 'json' };

/** @typedef {'pt-BR' | 'en' | 'de'} Locale */

const LOCALES = { 'pt-BR': pt, en, de };
const DEFAULT_LOCALE = 'pt-BR';

/** @type {Locale} */
let current = DEFAULT_LOCALE;

/**
 * Sets the active locale.
 *
 * @param {Locale} locale
 * @returns {void}
 */
export function setLocale(locale) {
  current = LOCALES[locale] ? locale : DEFAULT_LOCALE;
}

/**
 * Returns the active locale key.
 *
 * @returns {Locale}
 */
export function getLocale() {
  return current;
}

/**
 * Translates a dot-notation key to the localized string.
 * Falls back to pt if key is missing in active locale.
 *
 * @param {string} key - Dot-notation key e.g. 'field.email.label'
 * @returns {string}
 *
 * @example
 * t('field.email.label') // → 'E-mail'
 * t('btn.next')          // → 'Next'
 */
export function t(key) {
  const keys = key.split('.');
  const resolve = (obj) => keys.reduce((acc, k) => acc?.[k], obj);
  return resolve(LOCALES[current]) ?? resolve(LOCALES[DEFAULT_LOCALE]) ?? key;
}
