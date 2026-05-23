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

/** @type {EducationComponent[]} */
const items = [];

/** @returns {void} */
export function initStep4Education() {
  document.getElementById('add-education')
    .addEventListener('click', () => addEducation());
}

/** @returns {EducationData[]} */
export function getEducationData() {
  return items.map(item => item.getData());
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
 * @param {number}                 index
 * @param {Partial<EducationData>} [initialData={}]
 * @returns {EducationComponent}
 */
function createEducation(index, initialData = {}) {
  const element = document.createElement('div');
  element.className = 'dynamic-item';
  element.innerHTML = educationTemplate(index, initialData);

  const refs = {
    degree:      element.querySelector('.edu-degree'),
    institution: element.querySelector('.edu-institution'),
    start:       element.querySelector('.edu-start'),
    end:         element.querySelector('.edu-end'),
    description: element.querySelector('.edu-description'),
    removeBtn:   element.querySelector('.btn-remove'),
  };

  const destroy = () => {
    items.splice(items.indexOf(item), 1);
    element.remove();
  };

  refs.removeBtn.addEventListener('click', destroy);

  /** @returns {EducationData} */
  const getData = () => ({
    degree:      refs.degree.value.trim(),
    institution: refs.institution.value.trim(),
    startDate:   refs.start.value,
    endDate:     refs.end.value,
    description: refs.description.value.trim(),
  });

  const item = { element, getData, destroy };
  return item;
}
