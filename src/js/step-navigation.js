import AppState from './app-app-state.js';
import FormManager from './form-manager.js';
import StorageManager from './storage-manager.js';

/**
 * Manages navigation between steps in the resume builder wizard
 */
const StepNavigation = {
    init() {
        document.getElementById('next-btn').addEventListener('click', () => this.nextStep());
        document.getElementById('prev-btn').addEventListener('click', () => this.prevStep());
        document.getElementById('finish-btn').addEventListener('click', () => this.finish());
    },

    nextStep() {
        if (AppState.currentStep < AppState.maxStep) this.goToStep(AppState.currentStep + 1);
    },

    prevStep() {
        if (AppState.currentStep > 1) this.goToStep(AppState.currentStep - 1);
    },

    /**
     * Navigates to a specific step and updates UI accordingly
     * @param {number} step - The step number to navigate to
     */
    goToStep(step) {
        document.getElementById(`step-${AppState.currentStep}`).classList.remove('active');
        document.querySelector(`[data-step="${AppState.currentStep}"]`).classList.remove('active', 'bg-blue-600', 'text-white');
        document.querySelector(`[data-step="${AppState.currentStep}"]`).classList.add('bg-gray-300', 'text-gray-600');

        AppState.currentStep = step;
        document.getElementById(`step-${step}`).classList.add('active');
        document.querySelector(`[data-step="${step}"]`).classList.remove('bg-gray-300', 'text-gray-600');
        document.querySelector(`[data-step="${step}"]`).classList.add('active', 'bg-blue-600', 'text-white');

        const titles = {
            1: 'Informações Pessoais',
            2: 'Perfil Profissional',
            3: 'Experiência Profissional',
            4: 'Educação',
            5: 'Habilidades'
        };
        document.getElementById('step-title').textContent = titles[step];
        document.getElementById('prev-btn').disabled = step === 1;
        document.getElementById('next-btn').style.display = step === AppState.maxStep ? 'none' : 'block';
        document.getElementById('finish-btn').style.display = step === AppState.maxStep ? 'block' : 'none';

        this.saveCurrentData();
    },

    /**
     * Saves current form data to storage
     */
    saveCurrentData() {
        FormManager.collectFormData();
        StorageManager.save(AppState.data);
    },

    /**
     * Handles the finish action at the end of the wizard
     */
    finish() {
        this.saveCurrentData();
        alert('Currículo finalizado! Você pode baixar o PDF ou imprimir.');
    }
};

export default StepNavigation;