import {initNavigation} from './services/NavigationService.js';
import {initStep1Validation} from './services/ValidationService.js';
import {initStep2Profile} from './components/ProfileSection.js';
import {initStep3Experience} from './components/ExperienceItem.js';
import {initStep4Education} from './components/EducationItem.js';
import {initPreview} from './components/Preview.js';
import {initLocale, translateDOM} from './services/i18n.js';

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
});
