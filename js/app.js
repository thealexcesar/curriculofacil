import {initLocale, translateDOM} from "./services/i18n.js";
import {initNavigation, updateStepLocks} from "./services/navigation.service.js";
import {initStep1Validation} from "./services/validation.service.js";
import {initStep2Profile} from "./components/profile-section/profile-section.component.js";
import {initStep3Experience} from "./components/experience/experience.component.js";
import {initStep4Education} from "./components/education/education.component.js";
import {initPreview} from "./components/preview/preview.component.js";
import {initStep5Skills} from "./components/skill/skill.component.js";
import {initStep5Languages} from "./components/language/language.component.js";
import {saveResume, loadResume} from "./services/storage.service.js";
import {collectResumeData, applyResumeData} from "./services/resume-data.service.js";
import {initProgress} from "./services/progress.service.js";
import {initFontSizeToggle} from "./services/accessibility.service.js";
import {initDataTransfer} from "./services/data-transfer.service.js";
import {initWhatsappShare} from "./services/share.service.js";
import {initCoverLetter} from "./components/cover-letter/cover-letter.component.js";
import {initProfessionAutocomplete} from "./services/professions.service.js";
import {initClearableInputs} from "./services/clearable-inputs.service.js";
import {debounce} from "./utils/debounce.js";

/**
 * Application entry point.
 * Initializes all modules after DOM is ready.
 *
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
  initLocale();
  translateDOM();
  initFontSizeToggle();
  initViewToggle();
  initNavigation();
  initStep1Validation();
  initProfessionAutocomplete();
  initClearableInputs();
  updateStepLocks();
  initStep2Profile();
  initStep3Experience();
  initStep4Education();
  initPreview();
  initStep5Skills();
  initStep5Languages();
  initProgress();
  initDataTransfer();
  initWhatsappShare();
  initCoverLetter();

  restoreResume();
  // Dispatched on each field (not just document) so listeners bound directly
  // to a specific input - like the Step 1 "next" button validation - see the
  // restored values too. An event fired on document alone only bubbles up
  // from document, it never reaches child elements' own listeners.
  document.querySelectorAll('.form-panel input, .form-panel textarea, .form-panel select').forEach(field => {
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const debouncedSave = debounce(saveAll, 150);
  document.addEventListener('input',  debouncedSave);
  document.addEventListener('change', debouncedSave);
});

/** @returns {void} */
function saveAll() {
  saveResume(collectResumeData());
}

/** @returns {void} */
function restoreResume() {
  const data = loadResume();
  if (!Object.keys(data).length) return;
  applyResumeData(data);
}

/** @returns {void} */
function initViewToggle() {
  const layout = document.querySelector('.layout');
  const btnForm = document.getElementById('toggle-form');
  const btnPreview = document.getElementById('toggle-preview');

  if (!btnForm || !btnPreview) return;

  layout.classList.add('layout--show-form');

  btnForm.addEventListener('click', () => {
    layout.classList.replace('layout--show-preview', 'layout--show-form');
    btnForm.classList.add('view-btn--active');
    btnPreview.classList.remove('view-btn--active');
  });

  btnPreview.addEventListener('click', () => {
    layout.classList.replace('layout--show-form', 'layout--show-preview');
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    btnPreview.classList.add('view-btn--active');
    btnForm.classList.remove('view-btn--active');
  });
}