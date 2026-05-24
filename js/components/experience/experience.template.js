import {t} from "../../services/i18n.js";

/**
 * @param {number} index
 * @param {Partial<ExperienceData>} data
 * @param {boolean} isCurrent
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
        ${monthYearSelect('exp-start', data.startDate)}
      </div>
     <div class="field">
        <label>${t('field.endDate.label')}</label>
        <div ${isCurrent ? 'style="display:none"' : ''}>
          ${monthYearSelect('exp-end', data.endDate, isCurrent)}
        </div>
        <label class="checkbox-label toggle-badge" style="margin-top:8px">
          <input type="checkbox" class="exp-current" ${isCurrent ? 'checked' : ''}>
          <span class="badge-toggle ${isCurrent ? 'badge-toggle--active' : ''}">${t('field.currentJob.label')}</span>
        </label>
      </div>
    </div>
    <div class="field">
      <label>${t('field.description.label')}</label>
      <textarea class="exp-description" rows="3" placeholder="${t('field.expDescription.placeholder')}">${data.description ?? ''}</textarea>
    </div>
  `;
}

/**
 * Renders month + year selects for a date field.
 *
 * @param {string} className - Base class (e.g. 'exp-start')
 * @param {string} [value=''] - Date in YYYY-MM format
 * @param {boolean} [disabled=false]
 * @returns {string}
 */
function monthYearSelect(className, value = '', disabled = false) {
  const [year, month] = value ? value.split('-') : ['', ''];
  const months = t('months');
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: currentYear - 1950 + 6}, (_, i) => currentYear + 5 - i);

  const monthOptions = months.map((m, i) => {
    const val = String(i + 1).padStart(2, '0');
    return `<option value="${val}" ${month === val ? 'selected' : ''}>${m}</option>`;
  }).join('');

  const yearOptions = years.map(y =>
    `<option value="${y}" ${year === String(y) ? 'selected' : ''}>${y}</option>`
  ).join('');

  return `
    <div class="date-select ${disabled ? 'date-select--disabled' : ''}">
      <select class="${className}-month" ${disabled ? 'disabled' : ''}>
        <option value="" disabled ${!month ? 'selected' : ''}>${t('field.month.placeholder')}</option>
        ${monthOptions}
      </select>
      <select class="${className}-year" ${disabled ? 'disabled' : ''}>
        <option value="" disabled ${!year ? 'selected' : ''}>${t('field.year.placeholder')}</option>
        ${yearOptions}
      </select>
    </div>
  `;
}
