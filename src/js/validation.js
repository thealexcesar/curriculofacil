/**
 * Form validation — Step 1: Personal Info
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function initStep1Validation() {
  const nameInput = document.getElementById('name');
  const jobTitleInput = document.getElementById('job-title');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const linkedinInput = document.getElementById('linkedin');

  nameInput.addEventListener('input', () => {
    nameInput.value = toTitleCase(nameInput.value);
    validateRequired(nameInput, 'name-hint', 'Nome é obrigatório');
    updateNextButton();
  });
  nameInput.addEventListener('blur', () => {
    validateRequired(nameInput, 'name-hint', 'Nome é obrigatório');
    updateNextButton();
  });

  jobTitleInput.addEventListener('input', () => {
    jobTitleInput.value = toTitleCase(jobTitleInput.value);
    validateRequired(jobTitleInput, 'job-title-hint', 'Título é obrigatório');
    updateNextButton();
  });
  jobTitleInput.addEventListener('blur', () => {
    validateRequired(jobTitleInput, 'job-title-hint', 'Título é obrigatório');
    updateNextButton();
  });

  emailInput.addEventListener('input', () => {
    validateEmail(emailInput);
    updateNextButton();
  });
  emailInput.addEventListener('blur', () => {
    validateEmail(emailInput);
    updateNextButton();
  });

  phoneInput.addEventListener('input', () => {
    phoneInput.value = applyPhoneMask(phoneInput.value);
    validatePhone(phoneInput);
    updateNextButton();
  });
  phoneInput.addEventListener('blur', () => {
    validatePhone(phoneInput);
    updateNextButton();
  });

  linkedinInput.addEventListener('focus', () => {
    if (!linkedinInput.value) linkedinInput.value = 'https://linkedin.com/in/';
  });
  linkedinInput.addEventListener('blur', () => {
    if (linkedinInput.value === 'https://linkedin.com/in/') linkedinInput.value = '';
  });

  updateNextButton();
}

function validateRequired(input, hintId, message) {
  const hint = document.getElementById(hintId);
  const valid = input.value.trim().length > 0;
  input.classList.toggle('is-valid', valid);
  input.classList.toggle('is-invalid', !valid);
  if (hint) {
    hint.innerHTML = valid ? '' : `<span class="material-symbols-outlined">error</span> ${message}`;
    hint.className = valid ? 'field-hint' : 'field-hint error';
  }
  return valid;
}

function validateEmail(input) {
  const hint = document.getElementById('email-hint');
  const value = input.value.trim();
  const valid = EMAIL_REGEX.test(value);
  const empty = value.length === 0;
  input.classList.toggle('is-valid', valid);
  input.classList.toggle('is-invalid', !empty && !valid);
  if (hint) {
    if (empty) {
      hint.innerHTML = '<span class="material-symbols-outlined">error</span> Email é obrigatório';
      hint.className = 'field-hint error';
    } else if (!valid) {
      hint.innerHTML = '<span class="material-symbols-outlined">error</span> Email inválido';
      hint.className = 'field-hint error';
    } else {
      hint.innerHTML = '';
      hint.className = 'field-hint';
    }
  }
  return valid;
}

function validatePhone(input) {
  const hint = document.getElementById('phone-hint');
  const digits = input.value.replace(/\D/g, '');
  const empty = digits.length === 0;
  const valid = digits.length === 10 || digits.length === 11;
  input.classList.toggle('is-valid', valid);
  input.classList.toggle('is-invalid', !empty && !valid);
  if (hint) {
    if (empty) {
      hint.innerHTML = '';
      hint.className = 'field-hint';
    } else if (!valid) {
      hint.innerHTML = '<span class="material-symbols-outlined">error</span> Telefone inválido (fixo ou celular)';
      hint.className = 'field-hint error';
    } else {
      hint.innerHTML = '';
      hint.className = 'field-hint';
    }
  }
  return valid;
}

function updateNextButton() {
  const valid =
    document.getElementById('name').value.trim().length > 0 &&
    document.getElementById('job-title').value.trim().length > 0 &&
    EMAIL_REGEX.test(document.getElementById('email').value.trim()) &&
    isValidPhone(document.getElementById('phone').value);
  document.getElementById('next-btn').disabled = !valid;
}

function applyPhoneMask(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}
