import {t} from "../../services/i18n.js";

/**
 * @typedef {Object} EducationData
 * @property {string} degree
 * @property {string} institution
 * @property {string} startDate
 * @property {string} [endDate]
 * @property {string} [description]
 */

/**
 * @param {number}                 index
 * @param {Partial<EducationData>} data
 * @returns {string}
 */
export function educationTemplate(index, data = {}) {
  return `
    <div class="dynamic-item-header">
      <span class="dynamic-item-title">${t('section.education')} ${index}</span>
      <button type="button" class="btn-remove" title="${t('btn.remove')}">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="field-row">
      <div class="field">
        <label>${t('field.degree.label')} *</label>
        <input
          type="text" class="edu-degree"
          placeholder="${t('field.degree.placeholder')}"
          value="${data.degree ?? ''}"
        >
      </div>
      <div class="field">
        <label>${t('field.institution.label')} *</label>
        <input
          type="text" class="edu-institution"
          placeholder="${t('field.institution.placeholder')}"
          value="${data.institution ?? ''}"
        >
      </div>
    </div>
    <div class="field-row">
      <div class="field">
        <label>${t('field.startDate.label')}</label>
        <input type="month" class="edu-start" value="${data.startDate ?? ''}">
      </div>
      <div class="field">
        <label>${t('field.endDate.label')}</label>
        <input type="month" class="edu-end" value="${data.endDate ?? ''}">
      </div>
    </div>
    <div class="field">
      <label>${t('field.eduDescription.label')}</label>
      <textarea class="edu-description" rows="2" placeholder="${t('field.eduDescription.placeholder')}">
        ${data.description ?? ''}
      </textarea>
    </div>
  `;
}
