/**
 * @typedef {Object} LanguageData
 * @property {string} name - Language name, typed or picked from suggestions
 * @property {string} level - CEFR level or 'native'
 */

/**
 * @typedef {Object} LanguageComponent
 * @property {HTMLElement} element - Component DOM element
 * @property {() => LanguageData} getData - Reads current values
 * @property {() => void} destroy - Removes from DOM
 */

import {languageTemplate, LANGUAGE_SUGGESTIONS} from './language.template.js';
import {initCombobox} from '../../utils/combobox.js';
import {normalize} from '../../utils/string-helpers.js';

/** @type {LanguageComponent[]} */
const items = [];

/** @returns {void} */
export function initStep5Languages() {
  document.getElementById('add-language')
    .addEventListener('click', () => addLanguage());
}

/** @returns {LanguageData[]} */
export function getLanguagesData() {
  return items.map(item => item.getData()).filter(lang => lang.name);
}

/** @returns {void} */
export function clearLanguages() {
  items.length = 0;
}

/**
 * @param {Partial<LanguageData>} [prefill={}]
 * @returns {void}
 */
export function addLanguage(prefill = {}) {
  const container = document.getElementById('language-list');
  const item = createLanguage(prefill);
  items.push(item);
  container.appendChild(item.element);
}

/**
 * Factory - creates a self-contained language component.
 *
 * @param {Partial<LanguageData>} [initialData={}]
 * @returns {LanguageComponent}
 */
function createLanguage(initialData = {}) {
  const element = document.createElement('div');
  element.innerHTML = languageTemplate(initialData);

  const refs = {
    name: /** @type {HTMLInputElement} */ (element.querySelector('.lang-name')),
    nameSuggestions: /** @type {HTMLElement} */ (element.querySelector('.lang-name-suggestions')),
    level: /** @type {HTMLSelectElement} */ (element.querySelector('.lang-level')),
    removeBtn: /** @type {HTMLButtonElement} */ (element.querySelector('.btn-remove')),
  };

  initCombobox(refs.name, refs.nameSuggestions, query => {
    const normalized = normalize(query.trim());
    if (!normalized) return LANGUAGE_SUGGESTIONS;
    return LANGUAGE_SUGGESTIONS.filter(name => normalize(name).includes(normalized));
  });

  const destroy = () => {
    items.splice(items.indexOf(item), 1);
    element.remove();
  };

  refs.removeBtn.addEventListener('click', destroy);

  /** @returns {LanguageData} */
  const getData = () => ({
    name: refs.name.value.trim(),
    level: refs.level.value,
  });

  const item = { element, getData, destroy };
  return item;
}
