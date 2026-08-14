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
        <svg class="icon" aria-hidden="true"><use href="#icon-close"></use></svg>
      </button>
    </div>
    <div class="field-row">
      <div class="field">
        <label>${t('field.degree.label')} *</label>
        <div class="autocomplete-wrap">
          <input type="text" class="edu-degree" placeholder="${t('field.degree.placeholder')}" value="${data.degree ?? ''}" spellcheck="true" autocorrect="on" autocomplete="off">
          <ul class="autocomplete-list edu-degree-suggestions" role="listbox" hidden></ul>
        </div>
      </div>
      <div class="field">
        <label>${t('field.institution.label')} *</label>
        <input type="text" class="edu-institution" placeholder="${t('field.institution.placeholder')}" value="${data.institution ?? ''}" spellcheck="true" autocorrect="on">
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
      <p class="field-tip">
        <svg class="icon" aria-hidden="true"><use href="#icon-info"></use></svg>
        <span>${t('tips.eduDescription')}</span>
      </p>
      <textarea class="edu-description" rows="2" placeholder="${t('field.eduDescription.placeholder')}" spellcheck="true" autocorrect="on">${data.description ?? ''}</textarea>
      <button type="button" class="btn-add-small edu-suggest-phrase">${t('btn.suggestPhrase')}</button>
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
  // Nothing past today: you can't have already worked or studied in a month
  // that hasn't happened yet. An in-progress job/course is expressed by the
  // "Trabalho atual" / "Cursando" toggles, not by a future end date.
  const years = Array.from({length: currentYear - 1950 + 1}, (_, i) => currentYear - i);

  const monthOptions = months.map((m, i) => {
    const val = String(i + 1).padStart(2, '0');
    const isFuture = Number(year) === currentYear && i > new Date().getMonth();
    return `<option value="${val}" ${month === val ? 'selected' : ''} ${isFuture ? 'disabled' : ''}>${m}</option>`;
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
