/**
 * Step 2 - Professional profile with char counter, plus a profession-based
 * résumé suggestion card (see professions.service.js for how the match is
 * found - specific profession first, its category as fallback).
 */

import {t} from "../../services/i18n.js";
import {findProfessionSuggestion} from "../../services/professions.service.js";

const PROFILE_MAX_CHARS = 400;

export function initStep2Profile() {
  const textarea = document.getElementById('profile');
  const counter = document.getElementById('profile-count');
  const hint = document.getElementById('profile-hint');

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    counter.textContent = String(len);

    if (len > PROFILE_MAX_CHARS) {
      counter.parentElement.classList.add('over');
      hint.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#icon-error"></use></svg> ${t('field.profile.error')}`;
      hint.className = 'field-hint error';
      textarea.value = textarea.value.slice(0, PROFILE_MAX_CHARS);
      counter.textContent = String(PROFILE_MAX_CHARS);
    } else {
      counter.parentElement.classList.remove('over');
      hint.innerHTML = '';
      hint.className = 'field-hint';
    }
  });

  initProfessionSuggestionCard(textarea);
}

/**
 * @param {HTMLTextAreaElement} textarea
 * @returns {void}
 */
function initProfessionSuggestionCard(textarea) {
  const jobTitleInput = document.getElementById('job-title');
  const card = document.getElementById('profession-suggestion');
  const label = document.getElementById('profession-suggestion-label');
  const preview = document.getElementById('profession-suggestion-preview');
  const useBtn = document.getElementById('profession-suggestion-use');
  const dismissBtn = document.getElementById('profession-suggestion-dismiss');
  if (!jobTitleInput || !card) return;

  /** @type {ReturnType<typeof findProfessionSuggestion>} */
  let current;
  /** Labels the user has explicitly closed, so it doesn't reappear right away. */
  const dismissed = new Set();

  const evaluate = () => {
    const match = findProfessionSuggestion(jobTitleInput.value);
    const shouldShow = match && !dismissed.has(match.label) && !textarea.value.trim();

    if (!shouldShow) {
      card.hidden = true;
      current = undefined;
      return;
    }

    current = match;
    label.textContent = t('professionSuggestion.label', { profession: match.label });
    preview.textContent = match.desc;
    useBtn.textContent = t('professionSuggestion.use');
    card.hidden = false;
  };

  jobTitleInput.addEventListener('input', evaluate);
  textarea.addEventListener('input', evaluate);

  useBtn.addEventListener('click', () => {
    if (!current) return;
    textarea.value = current.desc;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    card.hidden = true;
  });

  dismissBtn.addEventListener('click', () => {
    if (current) dismissed.add(current.label);
    card.hidden = true;
  });

  evaluate();
}
