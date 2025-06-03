import AppState from './app-state.js';
import StorageManager from './storage-manager';
import StepNavigation from './step-navigation.js';
import FormManager from './form-manager.js';
import PreviewManager from './preview-manager.js';

/**
 * Initializes the resume builder application
 */
document.addEventListener('DOMContentLoaded', () => {
    StepNavigation.init();
    FormManager.init();
    PreviewManager.init();

    document.getElementById('save-data').addEventListener('click', () => {
        FormManager.collectFormData();
        if (StorageManager.save(AppState.data)) console.log('Data saved successfully!');
    });

    document.getElementById('clear-data').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            StorageManager.clear();
            AppState.data = {
                personalInfo: {},
                profile: '',
                experience: [],
                education: [],
                skills: [],
                languages: []
            };
            location.reload();
        }
    });
});