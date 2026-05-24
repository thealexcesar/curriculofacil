/**
 * @typedef {Object} LanguageData
 * @property {string} name - Language name or custom text
 * @property {string} level - CEFR level or 'native'
 * @property {boolean} [custom] - True when user typed a custom language
 */

/**
 * @typedef {Object} LanguageComponent
 * @property {HTMLElement} element - Component DOM element
 * @property {() => LanguageData} getData - Reads current values
 * @property {() => void} destroy - Removes from DOM
 */

import {languageTemplate} from './language.template.js';

/** @type {LanguageComponent[]} */
const items = [];

/** @returns {void} */
export function initStep5Languages() {
  document.getElementById('add-language')
    .addEventListener('click', () => addLanguage());
}

/** @returns {LanguageData[]} */
export function getLanguagesData() {
  return items.map(item => item.getData());
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
    select: /** @type {HTMLSelectElement} */ (element.querySelector('.lang-name')),
    custom: /** @type {HTMLInputElement} */ (element.querySelector('.lang-name-custom')),
    level: /** @type {HTMLSelectElement} */ (element.querySelector('.lang-level')),
    removeBtn: /** @type {HTMLButtonElement} */ (element.querySelector('.btn-remove')),
  };

  refs.select.addEventListener('change', () => {
    const isOther = refs.select.value === 'other';
    refs.select.style.display = isOther ? 'none' : '';
    refs.custom.style.display = isOther ? '' : 'none';
    if (isOther) refs.custom.focus();
  });

  const destroy = () => {
    items.splice(items.indexOf(item), 1);
    element.remove();
  };

  refs.removeBtn.addEventListener('click', destroy);

  /** @returns {LanguageData} */
  const getData = () => {
    const isCustom = refs.select.style.display === 'none';
    return {
      name: isCustom ? refs.custom.value.trim() : refs.select.value,
      level: refs.level.value,
      custom: isCustom,
    };
  };

  const item = { element, getData, destroy };
  return item;
}
