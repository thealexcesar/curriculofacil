import { t } from '../services/i18n.js';

/**
 * @typedef {Object} EducationData
 * @property {string} degree      - Degree or title
 * @property {string} institution - Institution name
 * @property {string} startDate   - Format YYYY-MM
 * @property {string} [endDate]   - Format YYYY-MM
 * @property {string} [description]
 */

/**
 * @typedef {Object} EducationItemComponent
 * @property {HTMLElement}         element - Component DOM element
 * @property {() => EducationData} getData - Reads current field values
 * @property {() => void}          destroy - Removes component from DOM
 */

/** @type {EducationItemComponent[]} */
const items = [];

/**
 * Initializes the education step.
 *
 * @returns {void}
 */
export function initStep4Education() {
  document.getElementById('add-education')
    .addEventListener('click', () => addEducation());
}

/**
 * Creates and appends an education item to the list.
 *
 * @param {Partial<EducationData>} [prefill={}]
 * @returns {void}
 */
function addEducation(prefill = {}) {
  const container = document.getElementById('education-list');
  const item = createEducationItem(prefill, items.length + 1);
  items.push(item);
  container.appendChild(item.element);
}

/**
 * Factory — creates a self-contained education item component.
 *
 * @param {Partial<EducationData>} initialData
 * @param {number} index - Display index (1, 2, 3...)
 * @returns {EducationItemComponent}
 */
function createEducationItem(initialData = {}, index) {
  const element = document.createElement('div');
  element.className = 'dynamic-item';
  element.innerHTML = `
    <div class="dynamic-item-header">
      <span class="dynamic-item-title">${t('section.education')} ${index}</span>
      <button type="button" class="btn-remove" title="${t('btn.remove')}">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="field-row">
      <div class="field">
        <label>${t('field.degree.label')}</label>
        <input type="text" class="edu-degree"
               placeholder="${t('field.degree.placeholder')}"
               value="${initialData.degree ?? ''}">
      </div>
      <div class="field">
        <label>${t('field.institution.label')}</label>
        <input type="text" class="edu-institution"
               placeholder="${t('field.institution.placeholder')}"
               value="${initialData.institution ?? ''}">
      </div>
    </div>
    <div class="field-row">
      <div class="field">
        <label>${t('field.startDate.label')}</label>
        <input type="month" class="edu-start" value="${initialData.startDate ?? ''}">
      </div>
      <div class="field">
        <label>${t('field.endDate.label')}</label>
        <input type="month" class="edu-end" value="${initialData.endDate ?? ''}">
      </div>
    </div>
    <div class="field">
      <label>${t('field.eduDescription.label')}</label>
      <textarea class="edu-description" rows="2"
        placeholder="${t('field.eduDescription.placeholder')}">${initialData.description ?? ''}</textarea>
    </div>
  `;

  const removeBtn = element.querySelector('.btn-remove');

  const destroy = () => {
    items.splice(items.indexOf(item), 1);
    element.remove();
  };

  removeBtn.addEventListener('click', destroy);

  /** @returns {EducationData} */
  const getData = () => ({
    degree:      element.querySelector('.edu-degree').value.trim(),
    institution: element.querySelector('.edu-institution').value.trim(),
    startDate:   element.querySelector('.edu-start').value,
    endDate:     element.querySelector('.edu-end').value,
    description: element.querySelector('.edu-description').value.trim(),
  });

  const item = { element, getData, destroy };
  return item;
}

/**
 * Returns data from all education items.
 *
 * @returns {EducationData[]}
 */
export function getEducationData() {
  return items.map(item => item.getData());
}
