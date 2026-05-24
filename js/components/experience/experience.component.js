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

/** @returns {void} */
export function initStep3Experience() {
  document.getElementById('add-experience')
    .addEventListener('click', () => addExperience());
}

/** @returns {ExperienceData[]} */
export function getExperienceData() {
  return items.map(item => item.getData());
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
    start: element.querySelector('.exp-start'),
    end: element.querySelector('.exp-end'),
    current: element.querySelector('.exp-current'),
    description: element.querySelector('.exp-description'),
    removeBtn: element.querySelector('.btn-remove'),
  };

  refs.current.addEventListener('change', () => {
    isCurrent = refs.current.checked;
    refs.end.disabled = isCurrent;
    if (isCurrent) refs.end.value = '';
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
    startDate: refs.start.value,
    endDate: isCurrent ? undefined : refs.end.value,
    current: isCurrent,
    description: refs.description.value.trim(),
  });

  const item = { element, getData, destroy };
  return item;
}
