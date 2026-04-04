import {t} from "../../services/i18n.js";

/**
 * @param {number}                  index
 * @param {Partial<ExperienceData>} data
 * @param {boolean}                 isCurrent
 * @returns {string}
 */
export function experienceTemplate(index, data = {}, isCurrent = false) {
  return `
    <div class="dynamic-item-header">
      <span class="dynamic-item-title">${t('section.experience')} ${index}</span>
      <button type="button" class="btn-remove" title="${t('btn.remove')}">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="field-row">
      <div class="field">
        <label>${t('field.expTitle.label')} *</label>
        <input type="text" class="exp-title" placeholder="${t('field.expTitle.placeholder')}" value="${data.title ?? ''}">
      </div>
      <div class="field">
        <label>${t('field.expCompany.label')} *</label>
        <input type="text" class="exp-company" placeholder="${t('field.expCompany.placeholder')}" value="${data.company ?? ''}">
      </div>
    </div>
    <div class="field-row">
      <div class="field">
        <label>${t('field.startDate.label')}</label>
        <input type="month" class="exp-start" value="${data.startDate ?? ''}">
      </div>
      <div class="field">
        <label>${t('field.endDate.label')}</label>
        <input type="month" class="exp-end" value="${data.endDate ?? ''}" ${isCurrent ? 'disabled' : ''}>
        <label class="checkbox-label" style="margin-top:8px">
          <input type="checkbox" class="exp-current" ${isCurrent ? 'checked' : ''}>
          <span>${t('field.current.label')}</span>
        </label>
      </div>
    </div>
    <div class="field">
      <label>${t('field.description.label')}</label>
      <textarea class="exp-description" rows="3" placeholder="${t('field.expDescription.placeholder')}">
        ${data.description ?? ''}
      </textarea>
    </div>
  `;
}
