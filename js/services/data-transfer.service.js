import {collectResumeData, applyResumeData} from "./resume-data.service.js";
import {showToast} from "../components/toast/toast.component.js";
import {t} from "./i18n.js";

/** @returns {void} */
export function initDataTransfer() {
  document.getElementById('export-data')?.addEventListener('click', exportData);

  const fileInput = /** @type {HTMLInputElement} */ (document.getElementById('import-file-input'));
  document.getElementById('import-data')?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', handleImport);
}

/**
 * The photo is a base64 data URL - tens of kilobytes on one line. Kept in
 * the file, because the whole point of this button is restoring everything
 * on a machine that wipes its storage (a CRAS or library computer), and a
 * backup that silently drops the photo is worse than useless there. But it
 * is moved out of `personal` to the very end of the file, so opening the
 * export shows the name, the jobs and the skills first instead of a wall of
 * base64. applyResumeData() reads it from either place, so files exported
 * before this change still import.
 *
 * @returns {void}
 */
function exportData() {
  const data = collectResumeData();
  const {photo, ...personal} = data.personal ?? {};
  const ordered = {...data, personal, ...(photo ? {photo} : {})};
  const blob = new Blob([JSON.stringify(ordered, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = buildFilename();
  link.click();
  URL.revokeObjectURL(url);

  showToast(t('toast.exported'), 'success');
}

/**
 * @param {Event} event
 * @returns {void}
 */
function handleImport(event) {
  const input = /** @type {HTMLInputElement} */ (event.target);
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(/** @type {string} */ (reader.result));
      applyResumeData(data);
      document.dispatchEvent(new Event('input', {bubbles: true}));
      showToast(t('toast.imported'), 'success');
    } catch {
      showToast(t('toast.importError'), 'error');
    }
  };
  reader.readAsText(file);
}

/** @returns {string} */
function buildFilename() {
  const name = document.getElementById('name')?.value.trim().split(' ')[0].toLowerCase() ?? '';
  const base = t('document.filename');
  return `${name ? `${name}_${base}` : base}.json`;
}
