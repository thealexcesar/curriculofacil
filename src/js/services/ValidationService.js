// src/js/services/ValidationService.js

import { t }                        from './i18n.js';
import { applyPhoneMask, isValidPhone } from '../utils/masks.js';
import { toTitleCase }              from '../utils/stringHelpers.js';
import { createPhoneItem }          from '../components/PhoneItem.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Initializes all validation listeners for step 1.
 *
 * @returns {void}
 */
export function initStep1Validation() {
  const nameInput     = document.getElementById('name');
  const jobTitleInput = document.getElementById('job-title');
  const emailInput    = document.getElementById('email');
  const phoneInput    = document.getElementById('phone');
  const linkedinInput = document.getElementById('linkedin');

  nameInput.addEventListener('input', () => {
    nameInput.value = toTitleCase(nameInput.value);
    validateRequired(nameInput, 'name-hint', t('field.name.error'));
    updateNextButton();
  });
  nameInput.addEventListener('blur', () => {
    validateRequired(nameInput, 'name-hint', t('field.name.error'));
    updateNextButton();
  });

  jobTitleInput.addEventListener('input', () => {
    jobTitleInput.value = toTitleCase(jobTitleInput.value);
    validateRequired(jobTitleInput, 'job-title-hint', t('field.jobTitle.error'));
    updateNextButton();
  });
  jobTitleInput.addEventListener('blur', () => {
    validateRequired(jobTitleInput, 'job-title-hint', t('field.jobTitle.error'));
    updateNextButton();
  });

  emailInput.addEventListener('input', () => { validateEmail(emailInput); updateNextButton(); });
  emailInput.addEventListener('blur',  () => { validateEmail(emailInput); updateNextButton(); });

  phoneInput.addEventListener('input', () => {
    phoneInput.value = applyPhoneMask(phoneInput.value);
    validatePhone(phoneInput);
    updateNextButton();
  });
  phoneInput.addEventListener('blur', () => { validatePhone(phoneInput); updateNextButton(); });

  linkedinInput.addEventListener('focus', () => {
    if (!linkedinInput.value) linkedinInput.value = 'https://linkedin.com/in/';
  });
  linkedinInput.addEventListener('blur', () => {
    if (linkedinInput.value === 'https://linkedin.com/in/') linkedinInput.value = '';
  });

  document.getElementById('add-phone').addEventListener('click', () => {
    const container = document.getElementById('extra-phones');
    const item = createPhoneItem();
    container.appendChild(item.element);
  });

  updateNextButton();
}

/**
 * Validates a required input field and shows/hides hint.
 *
 * @param {HTMLInputElement} input
 * @param {string}           hintId  - ID of the hint element
 * @param {string}           message - Error message to display
 * @returns {boolean}
 */
function validateRequired(input, hintId, message) {
  const hint  = document.getElementById(hintId);
  const valid = input.value.trim().length > 0;
  input.classList.toggle('is-valid',   valid);
  input.classList.toggle('is-invalid', !valid);
  if (hint) {
    hint.innerHTML = valid ? '' : `<span class="material-symbols-outlined">error</span> ${message}`;
    hint.className = valid ? 'field-hint' : 'field-hint error';
  }
  return valid;
}

/**
 * Validates the email input field.
 *
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function validateEmail(input) {
  const hint  = document.getElementById('email-hint');
  const value = input.value.trim();
  const valid = EMAIL_REGEX.test(value);
  const empty = value.length === 0;
  input.classList.toggle('is-valid',   valid);
  input.classList.toggle('is-invalid', !empty && !valid);
  if (hint) {
    if (empty) {
      hint.innerHTML = `<span class="material-symbols-outlined">error</span> ${t('field.email.error.required')}`;
      hint.className = 'field-hint error';
    } else if (!valid) {
      hint.innerHTML = `<span class="material-symbols-outlined">error</span> ${t('field.email.error.invalid')}`;
      hint.className = 'field-hint error';
    } else {
      hint.innerHTML = '';
      hint.className = 'field-hint';
    }
  }
  return valid;
}

/**
 * Validates the phone input field.
 *
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function validatePhone(input) {
  const hint   = document.getElementById('phone-hint');
  const digits = input.value.replace(/\D/g, '');
  const empty  = digits.length === 0;
  const valid  = isValidPhone(input.value);
  input.classList.toggle('is-valid',   valid);
  input.classList.toggle('is-invalid', !empty && !valid);
  if (hint) {
    if (!empty && !valid) {
      hint.innerHTML = `<span class="material-symbols-outlined">error</span> ${t('field.phone.error')}`;
      hint.className = 'field-hint error';
    } else {
      hint.innerHTML = '';
      hint.className = 'field-hint';
    }
  }
  return valid;
}

/**
 * Enables or disables the Next button based on step 1 validity.
 *
 * @returns {void}
 */
function updateNextButton() {
  const valid =
    document.getElementById('name').value.trim().length > 0 &&
    document.getElementById('job-title').value.trim().length > 0 &&
    EMAIL_REGEX.test(document.getElementById('email').value.trim()) &&
    isValidPhone(document.getElementById('phone').value);
  document.getElementById('next-btn').disabled = !valid;
}
