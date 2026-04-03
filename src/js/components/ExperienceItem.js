import { t } from '../services/i18n.js';

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
 * @typedef {Object} ExperienceItemComponent
 * @property {HTMLElement}          element - Component DOM element
 * @property {() => ExperienceData} getData - Reads current field values
 * @property {() => void}           destroy - Removes component from DOM
 */

/** @type {ExperienceItemComponent[]} */
const items = [];

/**
 * Initializes the experience step.
 * Binds the add button and renders one empty item by default.
 *
 * @returns {void}
 */
export function initStep3Experience() {
  document.getElementById('add-experience')
    .addEventListener('click', () => addExperience());
}

/**
 * Creates and appends an experience item to the list.
 *
 * @param {Partial<ExperienceData>} [prefill={}]
 * @returns {void}
 */
function addExperience(prefill = {}) {
  const container = document.getElementById('experience-list');
  const item = createExperienceItem(prefill, items.length + 1);
  items.push(item);
  container.appendChild(item.element);
}

/**
 * Factory — creates a self-contained experience item component.
 *
 * @param {Partial<ExperienceData>} initialData
 * @param {number} index - Display index (1, 2, 3...)
 * @returns {ExperienceItemComponent}
 */
function createExperienceItem(initialData = {}, index) {
  // --- local state --------------------------------------
  let isCurrent = initialData.current ?? false;

  // --- template -----------------------------------------
  const element = document.createElement('div');
  element.className = 'dynamic-item';
  element.innerHTML = `
    <div class="dynamic-item-header">
      <span class="dynamic-item-title">Experiência ${index}</span>
      <button type="button" class="btn-remove" title="${t('btn.remove')}">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Cargo *</label>
        <input type="text" class="exp-title" placeholder="Ex: Desenvolvedor Web"
               value="${initialData.title ?? ''}">
      </div>
      <div class="field">
        <label>Empresa *</label>
        <input type="text" class="exp-company" placeholder="Ex: Google"
               value="${initialData.company ?? ''}">
      </div>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Data de Início</label>
        <input type="month" class="exp-start" value="${initialData.startDate ?? ''}">
      </div>
      <div class="field">
        <label>Data de Fim</label>
        <input type="month" class="exp-end"
               value="${initialData.endDate ?? ''}"
               ${isCurrent ? 'disabled' : ''}>
        <label class="checkbox-label" style="margin-top:8px">
          <input type="checkbox" class="exp-current" ${isCurrent ? 'checked' : ''}>
          <span>Trabalho atual</span>
        </label>
      </div>
    </div>
    <div class="field">
      <label>Descrição</label>
      <textarea class="exp-description" rows="3"
        placeholder="Descreva suas principais responsabilidades...">${initialData.description ?? ''}</textarea>
    </div>
  `;

  // -- refs - query once, never repeat -------------------
  const endInput     = element.querySelector('.exp-end');
  const currentCheck = element.querySelector('.exp-current');
  const removeBtn    = element.querySelector('.btn-remove');

  // -- behavior ------------------------------------------
  currentCheck.addEventListener('change', () => {
    isCurrent = currentCheck.checked;
    endInput.disabled = isCurrent;
    if (isCurrent) endInput.value = '';
  });

  // -- public API ----------------------------------------
  const destroy = () => {
    items.splice(items.indexOf(item), 1);
    element.remove();
  };

  removeBtn.addEventListener('click', destroy);

  /** @returns {ExperienceData} */
  const getData = () => ({
    title:       element.querySelector('.exp-title').value.trim(),
    company:     element.querySelector('.exp-company').value.trim(),
    startDate:   element.querySelector('.exp-start').value,
    endDate:     isCurrent ? undefined : endInput.value,
    current:     isCurrent,
    description: element.querySelector('.exp-description').value.trim(),
  });

  const item = { element, getData, destroy };
  return item;
}

/**
 * Returns data from all experience items.
 *
 * @returns {ExperienceData[]}
 */
export function getExperienceData() {
  return items.map(item => item.getData());
}
