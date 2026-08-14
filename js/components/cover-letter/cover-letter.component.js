import {coverLetterPreviewTemplate} from './cover-letter.template.js';
import {t} from "../../services/i18n.js";
import {collectResumeData} from "../../services/resume-data.service.js";
import {showToast} from "../toast/toast.component.js";

/** @returns {void} */
export function initCoverLetter() {
  const toggleBtn = document.getElementById('cover-letter-toggle');
  const panel = document.getElementById('cover-letter-panel');
  const printBtn = document.getElementById('cl-print-btn');
  if (!toggleBtn || !panel || !printBtn) return;

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

  document.getElementById('cl-copy-btn')?.addEventListener('click', copyLetter);
  initExtras();

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

  const data = collectResumeData();
  preview.innerHTML = coverLetterPreviewTemplate({
    company: data.coverLetter.company,
    body: data.coverLetter.body,
    personal: data.personal,
    extraPhones: data.extraPhones,
  });
}

/**
 * Copies the letter as plain text, ready to paste straight into WhatsApp,
 * an e-mail or a job form. Deliberately not a "send by e-mail" button:
 * mailto: cannot carry an attachment, so it could never send the résumé
 * along with it - copying works everywhere and never silently fails.
 *
 * @returns {Promise<void>}
 */
async function copyLetter() {
  const data = collectResumeData();
  const body = data.coverLetter.body.trim();

  if (!body) {
    showToast(t('coverLetter.copyEmpty'), 'warning');
    return;
  }

  const text = [data.coverLetter.company ? `${t('coverLetter.to')} ${data.coverLetter.company}` : '', body]
    .filter(Boolean)
    .join('\n\n');

  try {
    await navigator.clipboard.writeText(text);
    showToast(t('coverLetter.copied'), 'success');
  } catch {
    showToast(t('coverLetter.copyError'), 'error');
  }
}

/** Ready-made sentences the user can drop into the letter - availability
 * and similar commitments that matter a lot for shift/care/retail work but
 * don't belong on the résumé itself (they're negotiable, not credentials).
 *
 * Offered as opt-in buttons rather than being written into the draft:
 * "tenho total disponibilidade" is a promise, and someone who studies at
 * night or has small kids shouldn't send it without noticing. */
const EXTRA_SENTENCES = [
  'availability', 'immediateStart', 'travel', 'relocation', 'learning', 'ownTransport',
];

/** @returns {void} */
function initExtras() {
  const list = document.getElementById('cl-extras-list');
  if (!list) return;

  EXTRA_SENTENCES.forEach(key => {
    const sentence = t(`coverLetter.extras.${key}`);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cl-extra-btn';
    btn.textContent = sentence;
    btn.addEventListener('click', () => addSentence(sentence, btn));
    list.appendChild(btn);
  });
}

/**
 * Inserts the sentence just before the sign-off, where it reads naturally,
 * rather than appending after the signature.
 *
 * @param {string} sentence
 * @param {HTMLButtonElement} btn
 * @returns {void}
 */
function addSentence(sentence, btn) {
  const body = /** @type {HTMLTextAreaElement} */ (document.getElementById('cl-body'));
  if (!body) return;

  if (body.value.includes(sentence)) return;

  const signOff = body.value.lastIndexOf('\n\nAtenciosamente,');
  body.value = signOff === -1
    ? `${body.value.trimEnd()}\n\n${sentence}`
    : `${body.value.slice(0, signOff)}\n\n${sentence}${body.value.slice(signOff)}`;

  body.dispatchEvent(new Event('input', { bubbles: true }));
  btn.classList.add('cl-extra-btn--added');
  btn.disabled = true;
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
