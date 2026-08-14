/**
 * @typedef {Object} EducationData
 * @property {string} degree      - Degree or title
 * @property {string} institution - Institution name
 * @property {string} startDate   - Format YYYY-MM
 * @property {string} [endDate]   - Format YYYY-MM
 * @property {string} [description]
 */

/**
 * @typedef {Object} EducationComponent
 * @property {HTMLElement}         element - Component DOM element
 * @property {() => EducationData} getData - Reads current field values
 * @property {() => void}          destroy - Removes component from DOM
 */

import {educationTemplate} from './education.template.js';
import {initCombobox} from '../../utils/combobox.js';
import {suggestCourseOptions, suggestEducationPhrase} from '../../services/professions.service.js';

/** @type {EducationComponent[]} */
const items = [];

/**
 * @param {string} month - MM
 * @param {string} year - YYYY
 * @returns {string}
 */
function toYearMonth(month, year) {
  return month && year ? `${year}-${month}` : '';
}

/** @returns {void} */
export function initStep4Education() {
  document.getElementById('add-education')
    .addEventListener('click', () => addEducation());
}

/** @returns {EducationData[]} */
export function getEducationData() {
  return items.map(item => item.getData());
}

/** @returns {void} */
export function clearEducation() {
  items.length = 0;
}

/**
 * @param {Partial<EducationData>} [prefill={}]
 * @returns {void}
 */
export function addEducation(prefill = {}) {
  const container = document.getElementById('education-list');
  const item = createEducation(items.length + 1, prefill);
  items.push(item);
  container.appendChild(item.element);
}

/**
 * Factory - creates a self-contained education component.
 *
 * @param {number} index
 * @param {Partial<EducationData>} [initialData={}]
 * @returns {EducationComponent}
 */
function createEducation(index, initialData = {}) {
  const element = document.createElement('div');
  element.className = 'dynamic-item';
  element.innerHTML = educationTemplate(index, initialData);

  const refs = {
    degree: element.querySelector('.edu-degree'),
    degreeSuggestions: element.querySelector('.edu-degree-suggestions'),
    institution: element.querySelector('.edu-institution'),
    start: {
      month: element.querySelector('.edu-start-month'),
      year: element.querySelector('.edu-start-year'),
    },
    end: {
      month: element.querySelector('.edu-end-month'),
      year: element.querySelector('.edu-end-year'),
    },
    description: element.querySelector('.edu-description'),
    suggestPhraseBtn: element.querySelector('.edu-suggest-phrase'),
    removeBtn: element.querySelector('.btn-remove'),
    inProgress: element.querySelector('.edu-inprogress'),
    badgeToggle: element.querySelector('.edu-inprogress + .badge-toggle'),
  };
  initCombobox(refs.degree, refs.degreeSuggestions, suggestCourseOptions);

  refs.suggestPhraseBtn.addEventListener('click', () => {
    const phrase = suggestEducationPhrase();
    if (!phrase) return;
    // Append rather than replace - the point is to help build the text up,
    // not to wipe out what the user already wrote.
    const existing = refs.description.value.trim();
    refs.description.value = existing ? `${existing}\n${phrase}` : phrase;
    refs.description.dispatchEvent(new Event('input', { bubbles: true }));
  });

  const destroy = () => {
    items.splice(items.indexOf(item), 1);
    element.remove();
  };

  refs.removeBtn.addEventListener('click', destroy);

  refs.inProgress.addEventListener('change', () => {
    const active = refs.inProgress.checked;
    refs.badgeToggle.classList.toggle('badge-toggle--active', active);
    refs.end.month.closest('.date-select').style.display = active ? 'none' : 'grid';
  }); 

  /** @returns {EducationData} */
  const getData = () => ({
    degree: refs.degree.value.trim(),
    institution: refs.institution.value.trim(),
    startDate: toYearMonth(refs.start.month.value, refs.start.year.value),
    endDate: toYearMonth(refs.end.month.value, refs.end.year.value),
    inProgress: refs.inProgress.checked,
    description: refs.description.value.trim(),
  });

  const item = { element, getData, destroy };
  return item;
}
