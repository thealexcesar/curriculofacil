import {collectResumeData} from "./resume-data.service.js";
import {showToast} from "../components/toast/toast.component.js";
import {t} from "./i18n.js";

/**
 * Shares a plain-text summary of the resume (name, title, contact, profile)
 * via the native Web Share sheet, falling back to a wa.me deep link on
 * browsers without navigator.share. There is no backend and no PDF library
 * in this project, so the actual print/PDF file cannot be attached - this
 * shares the resume as text, which is exactly what most WhatsApp job
 * applications look like anyway.
 *
 * @returns {void}
 */
export function initWhatsappShare() {
  document.getElementById('whatsapp-share-btn')?.addEventListener('click', share);
}

/** @returns {Promise<void>} */
async function share() {
  const text = buildShareText(collectResumeData());

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
