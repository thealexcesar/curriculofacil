/**
 * Step 2 - Professional profile with char counter
 */

import {t} from "../../services/i18n.js";

const PROFILE_MAX_CHARS = 400;

export function initStep2Profile() {
  const textarea = document.getElementById('profile');
  const counter  = document.getElementById('profile-count');
  const hint     = document.getElementById('profile-hint');

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    counter.textContent = String(len);

    if (len > PROFILE_MAX_CHARS) {
      counter.parentElement.classList.add('over');
      hint.innerHTML = `<span class="material-symbols-outlined">error</span> ${t('field.profile.error')}`;
      hint.className  = 'field-hint error';
      textarea.value  = textarea.value.slice(0, PROFILE_MAX_CHARS);
      counter.textContent = String(PROFILE_MAX_CHARS);
    } else {
      counter.parentElement.classList.remove('over');
      hint.innerHTML = '';
      hint.className = 'field-hint';
    }
  });
}
