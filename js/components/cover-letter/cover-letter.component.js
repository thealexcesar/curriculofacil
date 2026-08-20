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
    syncExtraButtons();
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
 * night or has small kids shouldn't send it without noticing.
 *
 * The order here is the order they appear in the letter. Two constraints on
 * the sentences in pt-BR.json: each opens with a different verb (five of the
 * six used to start with "Tenho", so picking three produced "Tenho a. Tenho
 * b. Tenho c."), and none may be a substring of another, because
 * presentExtras() detects them with String.includes().
 *
 * Shifts and weekends are separate entries rather than one "disponibilidade
 * de horário, inclusive para turnos e fins de semana": plenty of people can
 * do one and not the other, and this text is a promise to an employer. */
const EXTRA_SENTENCES = [
  'shifts', 'weekends', 'immediateStart', 'travel', 'relocation', 'learning', 'ownTransport',
];

const SIGN_OFF = '\n\nAtenciosamente,';

/**
 * @param {string} key - a member of EXTRA_SENTENCES
 * @returns {string}
 */
function extraSentence(key) {
  return t(`coverLetter.extras.${key}`);
}

/**
 * Which commitments the letter already contains, read back out of the
 * textarea instead of tracked in a variable. The letter outlives this
 * module's state: it comes back from localStorage on reload and can be
 * replaced wholesale by a JSON import, both after initExtras() has run. A
 * Set kept here would be empty while the sentences were still in the text,
 * and every button would re-insert what was already written.
 *
 * @param {string} text
 * @returns {string[]} keys, in EXTRA_SENTENCES order
 */
function presentExtras(text) {
  return EXTRA_SENTENCES.filter(key => text.includes(extraSentence(key)));
}

/**
 * @param {string[]} keys
 * @returns {string}
 */
function joinExtras(keys) {
  return keys.map(extraSentence).join(' ');
}

/** @returns {void} */
function initExtras() {
  const list = document.getElementById('cl-extras-list');
  if (!list) return;

  EXTRA_SENTENCES.forEach(key => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cl-extra-btn';
    btn.dataset.extra = key;
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = extraSentence(key);
    btn.addEventListener('click', () => toggleSentence(key));
    list.appendChild(btn);
  });
}

/** Marks the buttons whose sentence is already in the letter - the restored
 * or imported case, where no click ever passed through this module.
 *
 * @returns {void}
 */
function syncExtraButtons() {
  const body = /** @type {HTMLTextAreaElement} */ (document.getElementById('cl-body'));
  if (!body) return;

  const present = new Set(presentExtras(body.value));
  document.querySelectorAll('.cl-extra-btn').forEach(btn => {
    const added = present.has(btn.dataset.extra);
    btn.classList.toggle('cl-extra-btn--added', added);
    btn.setAttribute('aria-pressed', String(added));
  });
}

/**
 * Removes a block together with whatever separates it from its neighbours,
 * so dropping the last commitment doesn't leave an empty paragraph and
 * dropping one mid-sentence doesn't leave a double space.
 *
 * @param {string} text
 * @param {string} block
 * @returns {string}
 */
function removeBlock(text, block) {
  const candidates = [`${block}\n\n`, `\n\n${block}`, `${block} `, ` ${block}`, block];
  const match = candidates.find(candidate => text.includes(candidate));
  return match ? text.replace(match, '') : text;
}

/**
 * Turns a commitment on or off. The picked sentences live as a single
 * paragraph just before the closing line, rebuilt on every toggle - so four
 * commitments read as one paragraph of four sentences rather than four
 * stacked one-line paragraphs, and removing one closes the gap.
 *
 * @param {string} key - a member of EXTRA_SENTENCES
 * @returns {void}
 */
function toggleSentence(key) {
  const body = /** @type {HTMLTextAreaElement} */ (document.getElementById('cl-body'));
  if (!body) return;

  const present = presentExtras(body.value);
  const wasPresent = present.includes(key);
  const existing = joinExtras(present);
  const paragraph = joinExtras(wasPresent
    ? present.filter(k => k !== key)
    : EXTRA_SENTENCES.filter(k => k === key || present.includes(k)));

  if (existing && body.value.includes(existing)) {
    body.value = paragraph
      ? body.value.replace(existing, paragraph)
      : removeBlock(body.value, existing);
  } else if (wasPresent) {
    // Hand-edited: the run isn't contiguous any more, so only the sentence
    // that was actually clicked comes out.
    body.value = removeBlock(body.value, extraSentence(key));
  } else {
    // Either nothing was picked yet, or the sentences already in the letter
    // no longer sit together. Adding just the new one is the only safe move;
    // re-inserting the whole run would duplicate what is already there.
    body.value = insertBeforeClosing(body.value, extraSentence(key));
  }

  body.dispatchEvent(new Event('input', { bubbles: true }));
  syncExtraButtons();
}

/**
 * The draft's closing courtesy line ("Fico à disposição ..."), read back out
 * of the locale template so it can't drift from what the draft actually
 * writes. Commitments belong above it: a letter that thanks the reader and
 * then keeps talking reads as an afterthought.
 *
 * @returns {string} '' when the template has no recognisable closing
 */
function closingLine() {
  const draft = t('coverLetter.draft');
  const signOff = draft.lastIndexOf(SIGN_OFF);
  if (signOff === -1) return '';

  const paragraphs = draft.slice(0, signOff).split('\n\n');
  return paragraphs[paragraphs.length - 1].trim();
}

/**
 * @param {string} text - current letter body
 * @param {string} paragraph
 * @returns {string}
 */
function insertBeforeClosing(text, paragraph) {
  const closing = closingLine();
  const closingAt = closing ? text.indexOf(closing) : -1;
  if (closingAt !== -1) {
    return `${text.slice(0, closingAt)}${paragraph}\n\n${text.slice(closingAt)}`;
  }

  // The user removed the closing line - fall back to sitting above the
  // signature, then to plain append.
  const signOffAt = text.lastIndexOf(SIGN_OFF);
  return signOffAt === -1
    ? `${text.trimEnd()}\n\n${paragraph}`
    : `${text.slice(0, signOffAt)}\n\n${paragraph}${text.slice(signOffAt)}`;
}

/** @returns {string} */
function buildDraft() {
  const name = document.getElementById('name')?.value.trim() ?? '';
  const jobTitle = document.getElementById('job-title')?.value.trim() ?? '';
  const profile = document.getElementById('profile')?.value.trim() ?? '';
  const company = document.getElementById('cl-company')?.value.trim() ?? '';

  // An unfilled profile leaves '{{profile}}' empty between two blank lines,
  // which came out as an empty paragraph in the middle of the letter.
  return t('coverLetter.draft', {
    name,
    jobTitle: jobTitle || t('coverLetter.draftFallbackRole'),
    company: company || t('coverLetter.draftFallbackCompany'),
    profile,
  }).replace(/\n{3,}/g, '\n\n').trim();
}
