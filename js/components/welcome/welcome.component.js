import {loadResume} from "../../services/storage.service.js";

/**
 * The welcome screen always shows first - it's not just a first-visit
 * splash. A returning user (saved resume already in localStorage) sees
 * "Continuar" instead of "Começar" on the same button, so they're not
 * silently dropped into the form without a choice. The logo mirrors this:
 * it's the way back to this screen from anywhere in the app.
 *
 * @returns {void}
 */
export function initWelcomeScreen() {
  const welcomeScreen = document.getElementById('welcome-screen');
  const appContent = document.getElementById('app-content');
  const startBtn = document.getElementById('welcome-start-btn');
  const logoHomeBtn = document.getElementById('logo-home-btn');
  if (!welcomeScreen || !appContent) return;

  if (startBtn && Object.keys(loadResume()).length > 0) {
    startBtn.textContent = 'Continuar';
  }

  startBtn?.addEventListener('click', () => showApp(welcomeScreen, appContent));
  document.addEventListener('resume-imported', () => showApp(welcomeScreen, appContent));
  logoHomeBtn?.addEventListener('click', () => showWelcome(welcomeScreen, appContent));
}

/**
 * @param {HTMLElement} welcomeScreen
 * @param {HTMLElement} appContent
 * @returns {void}
 */
function showApp(welcomeScreen, appContent) {
  welcomeScreen.classList.remove('active');
  appContent.classList.add('active');
}

/**
 * @param {HTMLElement} welcomeScreen
 * @param {HTMLElement} appContent
 * @returns {void}
 */
function showWelcome(welcomeScreen, appContent) {
  appContent.classList.remove('active');
  welcomeScreen.classList.add('active');
}
