/**
 * @typedef {Object} PhoneData
 * @property {string}  phone    - Masked phone value
 * @property {boolean} whatsapp - Whether this number is WhatsApp
 * @property {string}  [note]   - Optional label (ex: Work, Messages)
 */

/**
 * @typedef {Object} PhoneComponent
 * @property {HTMLElement}        element - Component DOM element
 * @property {() => PhoneData}    getData - Reads current field values
 * @property {() => void}         destroy - Removes component from DOM
 */

import {phoneTemplate}   from './phone.template.js';
import {applyPhoneMask}  from '../../utils/masks.js';

/** @type {PhoneComponent[]} */
const items = [];

/** @returns {PhoneData[]} */
export function getExtraPhonesData() {
  return items.map(item => item.getData()).filter(p => p.phone);
}

/** @returns {void} */
export function clearExtraPhones() {
  items.length = 0;
}

/**
 * @param {Partial<PhoneData>} [prefill={}]
 * @returns {void}
 */
export function addExtraPhone(prefill = {}) {
  const container = document.getElementById('extra-phones');
  const item = createPhone(prefill);
  items.push(item);
  container.appendChild(item.element);
}

/**
 * @param {Partial<PhoneData>} [prefill={}]
 * @returns {PhoneComponent}
 */
function createPhone(prefill = {}) {
  const element = document.createElement('div');
  element.className = 'phone-extra';
  element.innerHTML = phoneTemplate(prefill);

  const refs = {
    phone: element.querySelector('.extra-phone-input'),
    whatsapp: element.querySelector('.extra-phone-whatsapp'),
    note: element.querySelector('.extra-phone-note'),
    removeBtn: element.querySelector('.phone-extra-remove'),
  };

  refs.phone.addEventListener('input', () => {
    refs.phone.value = applyPhoneMask(refs.phone.value);
  });

  const destroy = () => {
    items.splice(items.indexOf(item), 1);
    element.remove();
  };
  refs.removeBtn.addEventListener('click', destroy);

  /** @returns {PhoneData} */
  const getData = () => ({
    phone: refs.phone.value,
    whatsapp: refs.whatsapp.checked,
    note: refs.note.value.trim(),
  });

  const item = { element, getData, destroy };
  return item;
}
