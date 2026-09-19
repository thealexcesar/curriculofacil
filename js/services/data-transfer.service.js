import {collectResumeData, applyResumeData} from "./resume-data.service.js";
import {showToast} from "../components/toast/toast.component.js";
import {t} from "./i18n.js";
import {importFromPdf} from "./pdf-import.service.js";
import {extractResumeFromLines} from "./resume-text-extract.service.js";
import {isJsonResume, fromJsonResume} from "./json-resume-import.service.js";

/** @returns {void} */
export function initDataTransfer() {
  document.getElementById('export-data')?.addEventListener('click', exportData);

  const fileInput = /** @type {HTMLInputElement} */ (document.getElementById('import-file-input'));
  document.getElementById('import-data')?.addEventListener('click', () => fileInput?.click());
  document.getElementById('welcome-import-btn')?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    fileInput.value = '';
    if (file) processFile(file);
  });

  /** Drag-and-drop works page-wide - welcome and form are the same import. */
  document.addEventListener('dragover', event => {
    event.preventDefault();
    document.body.classList.add('drag-over-import');
  });
  document.addEventListener('dragleave', event => {
    if (event.relatedTarget === null) document.body.classList.remove('drag-over-import');
  });
  document.addEventListener('drop', event => {
    event.preventDefault();
    document.body.classList.remove('drag-over-import');
    const file = event.dataTransfer?.files?.[0];
    if (file) processFile(file);
  });
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

  showToast(t('toast.exported'), 'info');
}

/**
 * @param {File} file
 * @returns {void}
 */
function processFile(file) {
  const ext = file.name.toLowerCase().split('.').pop();
  if (ext === 'pdf') return void handlePdfImport(file);
  if (ext === 'txt' || ext === 'md') return void handleTextImport(file);
  return handleJsonImport(file);
}

/**
 * @param {File} file
 * @returns {void}
 */
function handleJsonImport(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(/** @type {string} */ (reader.result));
      /** JSON Resume (jsonresume.org) is structured already - no guessing needed. */
      applyResumeData(isJsonResume(data) ? fromJsonResume(data) : data);
      finishImport(t('toast.imported'), 'success');
    } catch {
      showToast(t('toast.importError'), 'error');
    }
  };
  reader.readAsText(file);
}

/**
 * @param {File} file
 * @returns {Promise<void>}
 */
async function handlePdfImport(file) {
  try {
    const {data} = await importFromPdf(file);
    applyGuess(data);
  } catch (error) {
    console.error('[pdf-import]', error);
    showToast(t('toast.pdfImportError'), 'error');
  }
}

/**
 * @param {File} file
 * @returns {Promise<void>}
 */
async function handleTextImport(file) {
  try {
    const lines = (await file.text()).split(/\r?\n/).map(l => l.trim().replace(/^#{1,6}\s+/, '')).filter(Boolean);
    applyGuess(extractResumeFromLines(lines));
  } catch (error) {
    console.error('[text-import]', error);
    showToast(t('toast.pdfImportError'), 'error');
  }
}

/**
 * Loads a best-effort guess as a full replace, same as importing our own
 * .json: a section this résumé doesn't have (no "Idiomas" found) means the
 * form's languages get cleared too, not left over from a previous import.
 *
 * @param {Partial<import('./storage.service.js').ResumeData>} guess
 * @returns {boolean} whether anything was found and applied
 */
function applyGuess(guess) {
  const found = Object.keys(guess).length > 0 && (
    guess.personal || guess.profile || guess.experience?.length ||
    guess.education?.length || guess.skills?.length || guess.languages?.length
  );
  if (!found) {
    showToast(t('toast.pdfImportEmpty'), 'error');
    return false;
  }

  /** personal must always be present, even empty, or applyResumeData() skips clearing it. */
  applyResumeData({personal: {}, ...guess});
  finishImport(t('toast.pdfImported'), 'success');
  return true;
}

/**
 * @param {string} message
 * @param {'success' | 'error'} kind
 * @returns {void}
 */
function finishImport(message, kind) {
  /** Per-field dispatch, not just document - see the same fix in app.js for restoreResume(). */
  document.querySelectorAll('.form-panel input, .form-panel textarea, .form-panel select').forEach(field => {
    field.dispatchEvent(new Event('input', {bubbles: true}));
  });
  document.dispatchEvent(new Event('resume-imported'));
  showToast(message, kind);
}

/** @returns {string} */
function buildFilename() {
  const name = document.getElementById('name')?.value.trim().split(' ')[0].toLowerCase() ?? '';
  const base = t('document.filename');
  return `${name ? `${name}_${base}` : base}.json`;
}
