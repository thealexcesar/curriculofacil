import {createState} from "./state.service.js";
import {showToast} from "../components/toast/toast.component.js";
import {t} from "./i18n.js";

const TOTAL_STEPS = 5;

/** @type {import('./state.service').State<number>} */
const currentStep = createState(1);

/**
 * Initializes step navigation buttons and step item clicks.
 *
 * @returns {void}
 */
export function initNavigation() {
  document.getElementById('next-btn').onclick   = () => goToStep(currentStep.get() + 1);
  document.getElementById('prev-btn').onclick   = () => goToStep(currentStep.get() - 1);
  document.getElementById('finish-btn').onclick = () => showToast(t('toast.finished'), 'success');
  document.getElementById('print-btn').onclick  = () => {
    const firstName = document.getElementById('name')?.value.trim().split(' ')[0].toLowerCase() ?? '';
    const filename  = t('document.filename');
    document.title  = firstName ? `${firstName}_${filename}` : filename;
    showToast(t('toast.print.hint'), 'info', '', 1000);
    setTimeout(() => { window.print(); document.title = t('app.title');}, 1000);
  };

  document.querySelectorAll('.step-item').forEach(el => {
    el.onclick = () => goToStep(parseInt(el.dataset.step));
  });

  // subscribe - renderStep runs automatically on every set()
  currentStep.subscribe(renderStep);
  renderStep(currentStep.get());
}

/**
 * Navigates to the given step if within bounds.
 *
 * @param {number} step
 * @returns {void}
 */
function goToStep(step) {
  if (step < 1 || step > TOTAL_STEPS) return;
  currentStep.set(step); // triggers renderStep via subscriber
}

/**
 * Renders the active step - updates sections, nav items and buttons.
 *
 * @param {number} step
 * @returns {void}
 */
function renderStep(step) {
  document.querySelectorAll('.step-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.step-item').forEach(el => el.classList.remove('active'));

  document.getElementById(`step-${step}`).classList.add('active');
  document.querySelector(`[data-step="${step}"]`).classList.add('active');

  document.getElementById('prev-btn').disabled = step === 1;
  document.getElementById('next-btn').style.display   = step === TOTAL_STEPS ? 'none' : 'inline-flex';
  document.getElementById('finish-btn').style.display = step === TOTAL_STEPS ? 'inline-flex' : 'none';
}
