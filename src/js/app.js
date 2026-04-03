import {initNavigation} from './services/NavigationService.js';
import {initStep1Validation} from './services/ValidationService.js';
import {initStep2Profile} from './components/ProfileSection.js';
import {initStep3Experience} from './components/ExperienceItem.js';
import {initStep4Education} from './components/EducationItem.js';
import {initPreview} from './components/Preview.js';
import {showToast} from './components/Toast.js';

/**
 * Application entry point.
 * Initializes all modules after DOM is ready.
 *
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initStep1Validation();
  initStep2Profile();
  initStep3Experience();
  initStep4Education();
  initPreview();

  // TODO: remove — module test only
  showToast('Módulos funcionando!', 'success', "Success", 2000);
});
