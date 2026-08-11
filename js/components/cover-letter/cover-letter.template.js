import {t} from "../../services/i18n.js";

/**
 * @param {string} company
 * @param {string} body
 * @returns {string}
 */
export function coverLetterPreviewTemplate(company, body) {
  if (!body.trim()) {
    return `<p class="preview-empty">${t('coverLetter.empty')}</p>`;
  }

  return `
    ${company ? `<p class="cv-item-subtitle" style="margin-bottom:16px">${company}</p>` : ''}
    <p class="cv-profile" style="white-space:pre-wrap">${body}</p>
  `;
}
