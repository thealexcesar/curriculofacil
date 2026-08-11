import {coverLetterPreviewTemplate} from './cover-letter.template.js';
import {t} from "../../services/i18n.js";
import {attachVoiceInput} from "../../services/voice-input.service.js";

/** @returns {void} */
export function initCoverLetter() {
  const toggleBtn = document.getElementById('cover-letter-toggle');
  const panel = document.getElementById('cover-letter-panel');
  const printBtn = document.getElementById('cl-print-btn');
  if (!toggleBtn || !panel || !printBtn) return;

  attachVoiceInput(/** @type {HTMLTextAreaElement} */ (document.getElementById('cl-body')));

  toggleBtn.addEventListener('click', () => {
    const opening = !panel.classList.contains('cover-letter-panel--open');
    panel.classList.toggle('cover-letter-panel--open', opening);

    const body = /** @type {HTMLTextAreaElement} */ (document.getElementById('cl-body'));
    if (opening && body && !body.value.trim()) {
      body.value = buildDraft();
    }
    renderCoverLetterPreview();
  });

  printBtn.addEventListener('click', () => {
    document.body.setAttribute('data-print-target', 'letter');
    window.print();
  });

  window.addEventListener('afterprint', () => {
    document.body.removeAttribute('data-print-target');
  });

  document.addEventListener('input', renderCoverLetterPreview);
  document.addEventListener('change', renderCoverLetterPreview);
  renderCoverLetterPreview();
}

/** @returns {void} */
function renderCoverLetterPreview() {
  const preview = document.getElementById('cl-preview');
  if (!preview) return;

  const company = /** @type {HTMLInputElement} */ (document.getElementById('cl-company'))?.value.trim() ?? '';
  const body = /** @type {HTMLTextAreaElement} */ (document.getElementById('cl-body'))?.value ?? '';

  preview.innerHTML = coverLetterPreviewTemplate(company, body);
}

/** @returns {string} */
function buildDraft() {
  const name = document.getElementById('name')?.value.trim() ?? '';
  const jobTitle = document.getElementById('job-title')?.value.trim() ?? '';
  const profile = document.getElementById('profile')?.value.trim() ?? '';
  const company = document.getElementById('cl-company')?.value.trim() ?? '';

  return t('coverLetter.draft', {
    name,
    jobTitle: jobTitle || t('coverLetter.draftFallbackRole'),
    company: company || t('coverLetter.draftFallbackCompany'),
    profile,
  });
}
