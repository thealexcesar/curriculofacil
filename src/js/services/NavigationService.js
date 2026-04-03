/**
 * Step navigation
 */

const TOTAL_STEPS = 5;
let currentStep = 1;

function initNavigation() {
  document.getElementById('next-btn').onclick   = () => goToStep(currentStep + 1);
  document.getElementById('prev-btn').onclick   = () => goToStep(currentStep - 1);
  document.getElementById('finish-btn').onclick = () => showToast('Currículo finalizado!', 'success');
  document.getElementById('print-btn').onclick  = () => {
    const original = document.title;
    document.title = '';
    showToast('Desmarque "Cabeçalhos e rodapés" no diálogo de impressão', 'info');
    setTimeout(() => { window.print(); setTimeout(() => document.title = original, 500); }, 1500);
  };

  document.querySelectorAll('.step-item').forEach(el => {
    el.onclick = () => goToStep(parseInt(el.dataset.step));
  });

  renderStep(currentStep);
}

function goToStep(step) {
  if (step < 1 || step > TOTAL_STEPS) return;
  currentStep = step;
  renderStep(currentStep);
}

function renderStep(step) {
  document.querySelectorAll('.step-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.step-item').forEach(el => el.classList.remove('active'));

  document.getElementById(`step-${step}`).classList.add('active');
  document.querySelector(`[data-step="${step}"]`).classList.add('active');

  document.getElementById('prev-btn').disabled = step === 1;
  document.getElementById('next-btn').style.display   = step === TOTAL_STEPS ? 'none'         : 'inline-flex';
  document.getElementById('finish-btn').style.display = step === TOTAL_STEPS ? 'inline-flex'  : 'none';
}
