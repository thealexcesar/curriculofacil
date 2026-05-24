import {t} from "../../services/i18n.js";

/**
 * @param {number} index
 * @param {Partial<EducationData>} data
 * @returns {string}
 */
export function educationTemplate(index, data = {}) {
  return `
    <div class="dynamic-item-header">
      <span class="dynamic-item-title">${t('section.education')} ${index}</span>
      <button type="button" class="btn-remove" title="${t('btn.remove')}">
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </div>
    <div class="field-row">
      <div class="field">
        <label>${t('field.degree.label')} *</label>
        <input type="text" class="edu-degree" placeholder="${t('field.degree.placeholder')}" value="${data.degree ?? ''}">
      </div>
      <div class="field">
        <label>${t('field.institution.label')} *</label>
        <input type="text" class="edu-institution" placeholder="${t('field.institution.placeholder')}" value="${data.institution ?? ''}">
      </div>
    </div>
    <div class="field-row">
      <div class="field">
        <label>${t('field.startDate.label')}</label>
        ${monthYearSelect({className: 'edu-start', value: data.startDate})}
      </div>
      <div class="field">
        <label>${t('field.endDate.label')}</label>
        ${monthYearSelect({className: 'edu-end', value: data.endDate})}
        <label class="checkbox-label toggle-badge" style="margin-top:8px">
          <input type="checkbox" class="edu-inprogress" ${data.inProgress ? 'checked' : ''}>
          <span class="badge-toggle ${data.inProgress ? 'badge-toggle--active' : ''}">${t('field.inProgress.label')}</span>
        </label>
      </div>
    </div>
    <div class="field">
      <label>${t('field.eduDescription.label')}</label>
      <textarea class="edu-description" rows="2" placeholder="${t('field.eduDescription.placeholder')}">${data.description ?? ''}</textarea>
    </div>
  `;
}

/**
 * Renders month + year selects for a date field.
 *
 * @param {string} className - Base class (e.g. 'edu-start')
 * @param {string} [value=''] - Date in YYYY-MM format
 * @param {boolean} [disabled=false]
 * @returns {string}
 */
function monthYearSelect({className, value = '', disabled = false}) {
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
