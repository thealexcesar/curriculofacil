import {t} from "../../services/i18n.js";

/**
 * The letter is laid out as a second page of the same document: same name
 * header, accent rule and contact line as the résumé, so the two read as a
 * matching pair rather than a formatted CV plus a loose block of text.
 *
 * @param {Object} params
 * @param {string} params.company
 * @param {string} params.body
 * @param {import('../preview/preview.template.js').PersonalData} params.personal
 * @param {import('../phone/phone.component.js').PhoneData[]} [params.extraPhones]
 * @returns {string}
 */
export function coverLetterPreviewTemplate({ company, body, personal, extraPhones = [] }) {
  if (!body.trim()) {
    return `<p class="preview-empty">${t('coverLetter.empty')}</p>`;
  }

  const phones = [
    personal.phone ? { phone: personal.phone } : null,
    ...extraPhones,
  ].filter(Boolean);

  const contact = [
    personal.email,
    ...phones.map(p => p.phone),
    personal.location,
    personal.linkedin,
  ].filter(Boolean);

  return `
    <header class="cl-header">
      ${personal.name ? `<h1 class="cv-name">${personal.name}</h1>` : ''}
      ${personal.jobTitle ? `<p class="cv-job-title">${personal.jobTitle}</p>` : ''}
      ${contact.length ? `<div class="cv-contact">${contact.map(c => `<span>${c}</span>`).join('')}</div>` : ''}
    </header>

    ${personal.location || company ? `
    <p class="cl-meta">
      ${company ? `<span class="cl-recipient">${t('coverLetter.to')} ${company}</span>` : ''}
      <span class="cl-date">${formatToday(personal.location)}</span>
    </p>` : ''}

    <div class="cl-body">${body}</div>
  `;
}

/**
 * "Blumenau, 14 de agosto de 2026" - the city+date line that opens a formal
 * letter in Brazil. Falls back to the date alone when no location is set.
 *
 * @param {string} [location]
 * @returns {string}
 */
function formatToday(location) {
  const now = new Date();
  const date = `${now.getDate()} de ${t('monthsFull')[now.getMonth()]} de ${now.getFullYear()}`;
  return location ? `${location}, ${date}` : date;
}
