import {collectResumeData} from "./resume-data.service.js";
import {showToast} from "../components/toast/toast.component.js";
import {t} from "./i18n.js";

/**
 * Shares the cover letter as plain text via the native Web Share sheet,
 * falling back to a wa.me deep link on browsers without navigator.share.
 * Either way the text lands in WhatsApp's compose box, where the user can
 * edit it before sending.
 *
 * The letter is what belongs in a message - it is addressed to someone and
 * reads as one. A bare dump of name/title/contact/profile, which is what
 * this used to send, reads like a database row pasted into a chat.
 *
 * The résumé summary stays as the fallback for when no letter has been
 * written yet, so the button never sends nothing.
 *
 * There is no backend and no PDF library here, so the PDF itself cannot be
 * attached - see notes on the print flow.
 *
 * @returns {void}
 */
export function initWhatsappShare() {
  document.getElementById('whatsapp-share-btn')?.addEventListener('click', share);
}

/** @returns {Promise<void>} */
async function share() {
  const data = collectResumeData();
  const text = buildLetterText(data) || buildShareText(data);

  if (!text) {
    showToast(t('toast.shareEmpty'), 'warning');
    return;
  }

  if (navigator.share) {
    try {
      await navigator.share({text});
    } catch {
      // User cancelled the native share sheet - nothing further to do.
    }
    return;
  }

  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}

/**
 * The cover letter, addressed and signed, ready to paste into a chat.
 * Mirrors what the "Copiar carta" button produces, so the two routes out of
 * the app carry the same text.
 *
 * @param {import('./storage.service.js').ResumeData} data
 * @returns {string} '' when no letter has been written
 */
function buildLetterText(data) {
  const body = data.coverLetter?.body?.trim();
  if (!body) return '';

  const company = data.coverLetter.company?.trim();
  return [company ? `${t('coverLetter.to')} ${company}` : '', body]
    .filter(Boolean)
    .join('\n\n');
}

/**
 * @param {import('./storage.service.js').ResumeData} data
 * @returns {string}
 */
function buildShareText(data) {
  const lines = [];

  if (data.personal.name) lines.push(data.personal.name);
  if (data.personal.jobTitle) lines.push(data.personal.jobTitle);

  const contact = [data.personal.email, data.personal.phone, data.personal.location]
    .filter(Boolean)
    .join(' | ');
  if (contact) lines.push(contact);

  if (data.profile) lines.push('', data.profile);

  return lines.join('\n');
}
