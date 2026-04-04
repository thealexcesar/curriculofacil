/**
 * @typedef {Object} LanguageData
 * @property {string} name  - Language name
 * @property {string} level - CEFR level or 'native'
 */

/**
 * @typedef {Object} LanguageComponent
 * @property {HTMLElement}           element - Component DOM element
 * @property {() => LanguageData}    getData - Reads current values
 * @property {() => void}            destroy - Removes from DOM
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

/**
 * @param {Partial<LanguageData>} [prefill={}]
 * @returns {void}
 */
function addLanguage(prefill = {}) {
  const container = document.getElementById('language-list');
  const item = createLanguage(prefill);
  items.push(item);
  container.appendChild(item.element);
}

/**
 * Factory — creates a self-contained language component.
 *
 * @param {Partial<LanguageData>} [initialData={}]
 * @returns {LanguageComponent}
 */
function createLanguage(initialData = {}) {
  const element = document.createElement('div');
  element.innerHTML = languageTemplate(initialData);

  const refs = {
    name:      /** @type {HTMLSelectElement} */ (element.querySelector('.lang-name')),
    level:     /** @type {HTMLSelectElement} */ (element.querySelector('.lang-level')),
    removeBtn: /** @type {HTMLButtonElement} */ (element.querySelector('.btn-remove')),
  };

  refs.level.addEventListener('change', () => updateBadge(refs.level));

  const destroy = () => {
    items.splice(items.indexOf(item), 1);
    element.remove();
  };

  refs.removeBtn.addEventListener('click', destroy);

  /** @returns {LanguageData} */
  const getData = () => ({
    name:  refs.name.value,
    level: refs.level.value,
  });

  const item = { element, getData, destroy };
  return item;
}

const LEVEL_BADGE_CLASS = {
  A1: 'badge-a1', A2: 'badge-a2',
  B1: 'badge-b1', B2: 'badge-b2',
  C1: 'badge-c1', C2: 'badge-c2',
  native: 'badge-native',
};

/**
 * Updates the badge color class on level change.
 *
 * @param {HTMLSelectElement} select
 * @returns {void}
 */
function updateBadge(select) {
  const badge = select.closest('.language-row')?.querySelector('.lang-level');
  if (!badge) return;
  badge.className = `lang-level badge ${LEVEL_BADGE_CLASS[select.value] ?? ''}`;
}
