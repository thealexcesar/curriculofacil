/**
 * @typedef {Object} ExperienceData
 * @property {string}  title       - Job title
 * @property {string}  company     - Company name
 * @property {string}  startDate   - Format YYYY-MM
 * @property {string}  [endDate]   - Format YYYY-MM, undefined if current
 * @property {boolean} current     - Whether this is current job
 * @property {string}  [description]
 */

/**
 * @typedef {Object} ExperienceComponent
 * @property {HTMLElement}          element - Component DOM element
 * @property {() => ExperienceData} getData - Reads current field values
 * @property {() => void}           destroy - Removes component from DOM
 */

import {experienceTemplate} from './experience.template.js';

/** @type {ExperienceComponent[]} */
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
export function initStep3Experience() {
  document.getElementById('add-experience')
    .addEventListener('click', () => addExperience());
}

/** @returns {ExperienceData[]} */
export function getExperienceData() {
  return items.map(item => item.getData());
}

/** @returns {void} */
export function clearExperience() {
  items.length = 0;
}

/**
 * @param {Partial<ExperienceData>} [prefill={}]
 * @returns {void}
 */
export function addExperience(prefill = {}) {
  const container = document.getElementById('experience-list');
  const item = createExperience(items.length + 1, prefill);
  items.push(item);
  container.appendChild(item.element);
}

/**
 * Factory - creates a self-contained experience component.
 *
 * @param {number}                  index
 * @param {Partial<ExperienceData>} [initialData={}]
 * @returns {ExperienceComponent}
 */
function createExperience(index, initialData = {}) {
  let isCurrent = initialData.current ?? false;

  const element = document.createElement('div');
  element.className = 'dynamic-item';
  element.innerHTML = experienceTemplate(index, initialData, isCurrent);

  const refs = {
    title: element.querySelector('.exp-title'),
    company: element.querySelector('.exp-company'),
    start: {
      month: element.querySelector('.exp-start-month'),
      year: element.querySelector('.exp-start-year'),
    },
    end: {
      month: element.querySelector('.exp-end-month'),
      year: element.querySelector('.exp-end-year'),
    },
    current: element.querySelector('.exp-current'),
    description: element.querySelector('.exp-description'),
    removeBtn: element.querySelector('.btn-remove'),
    badgeToggle: element.querySelector('.exp-current + .badge-toggle'),
    endDateSelect: element.querySelector('.exp-end-month')?.closest('.date-select').parentElement,
  };

  refs.current.addEventListener('change', () => {
    isCurrent = refs.current.checked;
    refs.badgeToggle.classList.toggle('badge-toggle--active', isCurrent);
    refs.endDateSelect.style.display = isCurrent ? 'none' : '';
  });

  const destroy = () => {
    items.splice(items.indexOf(item), 1);
    element.remove();
  };

  refs.removeBtn.addEventListener('click', destroy);

  /** @returns {ExperienceData} */
  const getData = () => ({
    title: refs.title.value.trim(),
    company: refs.company.value.trim(),
    startDate: toYearMonth(refs.start.month.value, refs.start.year.value),
    endDate: isCurrent ? undefined : toYearMonth(refs.end.month.value, refs.end.year.value),
    current: isCurrent,
    description: refs.description.value.trim(),
  });

  const item = { element, getData, destroy };
  return item;
}
