import {t} from "./i18n.js";
import {applyPhoneMask, isValidPhone, applyCpfMask} from "../utils/masks.js";
import {toTitleCase} from "../utils/string-helpers.js";
import {addExtraPhone} from "../components/phone/phone.component.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** @returns {void} */
export function initStep1Validation() {
  const fields = {
    name: document.getElementById('name'),
    jobTitle: document.getElementById('job-title'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    linkedin: document.getElementById('linkedin'),
    instagram: document.getElementById('instagram'),
    cpf: document.getElementById('cpf'),
    nextBtn: document.getElementById('next-btn'),
  };

  const hints = {
    name: document.getElementById('name-hint'),
    jobTitle: document.getElementById('job-title-hint'),
    email: document.getElementById('email-hint'),
    phone: document.getElementById('phone-hint'),
  };

  const update = () => updateNextButton(fields);

  on(fields.name, () => {
    fields.name.value = toTitleCase(fields.name.value);
    validateRequired(fields.name, hints.name, t('field.name.error'));
    update();
  });

  on(fields.jobTitle, () => {
    fields.jobTitle.value = toTitleCase(fields.jobTitle.value);
    validateRequired(fields.jobTitle, hints.jobTitle, t('field.jobTitle.error'));
    update();
  });

  on(fields.email, () => {
    validateEmail(fields.email, hints.email);
    update();
  });

  on(fields.phone, () => {
    fields.phone.value = applyPhoneMask(fields.phone.value);
    validatePhone(fields.phone, hints.phone);
    update();
  });

  on(fields.cpf, () => { fields.cpf.value = applyCpfMask(fields.cpf.value); });

  // All three social fields behave the same way: the site part is filled in
  // for the user, who only types their own handle. No "https://" - on a
  // printed résumé nobody clicks the link, they retype it, so the shortest
  // form that still finds the profile is the useful one.
  prefillOnFocus(fields.linkedin, 'linkedin.com/in/');
  prefillOnFocus(fields.instagram, 'instagram.com/');

  document.getElementById('add-phone').addEventListener('click', () => addExtraPhone());

  update();
}

// --- private ---

/**
 * @private
 * @param {Object} fields
 */
function updateNextButton(fields) {
  fields.nextBtn.disabled = !(
    fields.name.value.trim() &&
    fields.jobTitle.value.trim() &&
    EMAIL_REGEX.test(fields.email.value.trim()) &&
    isValidPhone(fields.phone.value)
  );
}

/**
 * @private
 * @param {HTMLInputElement} input
 * @param {HTMLElement}      hint
 * @param message
 * @returns {boolean}
 */
function validateRequired(input, hint, message) {
  const valid = input.value.trim().length > 0;
  setValidity(input, valid);
  setHint(hint, valid, message);
  return valid;
}

/**
 * @private
 * @param {HTMLInputElement} input
 * @param {HTMLElement}      hint
 * @returns {boolean}
 */
function validateEmail(input, hint) {
  const value = input.value.trim();
  const empty = value.length === 0;
  const valid = EMAIL_REGEX.test(value);
  setValidity(input, valid, empty);
  setHint(hint, valid, empty ? t('field.email.error.required') : t('field.email.error.invalid'));
  return valid;
}

/**
 * @private
 * @param {HTMLInputElement} input
 * @param {HTMLElement}      hint
 * @returns {boolean}
 */
function validatePhone(input, hint) {
  const empty = input.value.replace(/\D/g, '').length === 0;
  const valid = isValidPhone(input.value);
  setValidity(input, valid, empty);
  setHint(hint, empty || valid, t('field.phone.error'));
  return valid;
}

/**
 * @private
 * @param {HTMLInputElement} input
 * @param {boolean}          valid
 * @param {boolean}          [empty=false]
 */
function setValidity(input, valid, empty = false) {
  input.classList.toggle('is-valid',   valid);
  input.classList.toggle('is-invalid', !empty && !valid);
}

/**
 * @private
 * @param {HTMLElement} hint
 * @param {boolean}     valid
 * @param {string}      message
 */
function setHint(hint, valid, message) {
  if (!hint) return;
  hint.innerHTML = valid ? '' : `<svg class="icon" aria-hidden="true"><use href="#icon-error"></use></svg> ${message}`;
  hint.className = valid ? 'field-hint' : 'field-hint error';
}

/**
 * @private
 * @param {HTMLInputElement} input
 * @param {Function}         handler
 */
function on(input, handler) {
  input.addEventListener('input', handler);
  input.addEventListener('blur', handler);
}

/**
 * Drops a site prefix into an empty field when it's focused, so the user
 * only types their handle - and clears it again on blur if they left
 * without typing anything, so an untouched field doesn't end up saved
 * holding just the prefix.
 *
 * @private
 * @param {HTMLInputElement|null} input
 * @param {string}                prefix
 */
function prefillOnFocus(input, prefix) {
  if (!input) return;
  input.addEventListener('focus', () => { if (!input.value) input.value = prefix; });
  input.addEventListener('blur', () => { if (input.value === prefix) input.value = ''; });
}
