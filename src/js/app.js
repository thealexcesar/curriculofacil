import {initLocale, translateDOM, t} from "./services/i18n.js";
import {initNavigation} from "./services/navigation.service.js";
import {initStep1Validation} from "./services/validation.service.js";
import {initStep2Profile} from "./components/profile-section/profile-section.component.js";
import {initStep3Experience} from "./components/experience/experience.component.js";
import {initStep4Education} from "./components/education/education.component.js";
import {initPreview} from "./components/preview/preview.component.js";
import {initStep5Skills} from "./components/skill/skill.component.js";
import {initStep5Languages} from "./components/language/language.component.js";

/**
 * Application entry point.
 * Initializes all modules after DOM is ready.
 *
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
  initLocale();
  translateDOM();

  initNavigation();
  initStep1Validation();
  initStep2Profile();
  initStep3Experience();
  initStep4Education();
  initPreview();
  initStep5Skills();
  initStep5Languages();
});
