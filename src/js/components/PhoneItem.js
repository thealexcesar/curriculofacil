import { t }             from '../services/i18n.js';
import { applyPhoneMask } from '../utils/masks.js';

/**
 * @typedef {Object} PhoneItemComponent
 * @property {HTMLElement}            element - Component DOM element
 * @property {() => PhoneItemData}    getData - Reads current field values
 * @property {() => void}             destroy - Removes component from DOM
 */

/**
 * @typedef {Object} PhoneItemData
 * @property {string}  phone     - Masked phone value
 * @property {boolean} whatsapp  - Whether this number is WhatsApp
 * @property {string}  [note]    - Optional label (ex: Work, Messages)
 */

/**
 * Factory — creates a self-contained extra phone item component.
 * Fixes the duplicate event listener bug from the original implementation.
 *
 * @returns {PhoneItemComponent}
 */
export function createPhoneItem() {
  const element = document.createElement('div');
  element.className = 'phone-extra';
  element.innerHTML = `
    <div class="phone-extra-row">
      <input type="tel" class="extra-phone-input"
             placeholder="${t('field.phone.placeholder')}">
      <label class="checkbox-label" title="WhatsApp">
        <input type="checkbox" class="extra-phone-whatsapp">
        <img src="assets/icons/whatsapp.svg" class="whatsapp-icon" alt="WhatsApp">
      </label>
      <button type="button" class="phone-extra-remove" title="${t('btn.remove')}">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <input type="text" class="extra-phone-note"
           placeholder="${t('field.phone.note.placeholder')}">
  `;

  // -- refs — query once, never repeat -------------------
  const phoneInput  = element.querySelector('.extra-phone-input');
  const removeBtn   = element.querySelector('.phone-extra-remove');

  // -- behavior ------------------------------------------
  phoneInput.addEventListener('input', () => {
    phoneInput.value = applyPhoneMask(phoneInput.value);
  });

  // -- public API ----------------------------------------
  const destroy = () => element.remove();
  removeBtn.addEventListener('click', destroy);

  /** @returns {PhoneItemData} */
  const getData = () => ({
    phone:    phoneInput.value,
    whatsapp: element.querySelector('.extra-phone-whatsapp').checked,
    note:     element.querySelector('.extra-phone-note').value.trim(),
  });

  return { element, getData, destroy };
}
