import {t} from "../../services/i18n.js";

/**
 * Template for an extra phone entry row.
 * Renders a tel input, WhatsApp checkbox and a remove button.
 *
 * @param {import('./phone.component.js').PhoneData} data
 * @returns {string} HTML string to inject via innerHTML
 */
export function phoneTemplate(data = {}) {
  return `
    <div class="phone-extra-row">
      <input type="tel" class="extra-phone-input" placeholder="${t('field.phone.placeholder')}" value="${data.phone ?? ''}">
      <label class="checkbox-label" title="WhatsApp">
        <input type="checkbox" class="extra-phone-whatsapp" ${data.whatsapp ? 'checked' : ''}>
        <img src="assets/icons/whatsapp.svg" class="whatsapp-icon" alt="WhatsApp">
      </label>
      <button type="button" class="phone-extra-remove" title="${t('btn.remove')}">
        <svg class="icon" aria-hidden="true"><use href="#icon-close"></use></svg>
      </button>
    </div>
    <input type="text" class="extra-phone-note" placeholder="${t('field.phone.note.placeholder')}" value="${data.note ?? ''}" spellcheck="true" autocorrect="on">
  `;
}
