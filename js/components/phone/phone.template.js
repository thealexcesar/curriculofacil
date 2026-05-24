import {t} from "../../services/i18n.js";

/**
 * Template for an extra phone entry row.
 * Renders a tel input, WhatsApp checkbox and a remove button.
 *
 * @returns {string} HTML string to inject via innerHTML
 */
export function phoneTemplate() {
  return `
    <div class="phone-extra-row">
      <input type="tel" class="extra-phone-input" placeholder="${t('field.phone.placeholder')}">
      <label class="checkbox-label" title="WhatsApp">
        <input type="checkbox" class="extra-phone-whatsapp">
        <img src="assets/icons/whatsapp.svg" class="whatsapp-icon" alt="WhatsApp">
      </label>
      <button type="button" class="phone-extra-remove" title="${t('btn.remove')}">
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </div>
    <input type="text" class="extra-phone-note" placeholder="${t('field.phone.note.placeholder')}">
  `;
}
