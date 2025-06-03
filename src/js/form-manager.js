import AppState from './app-app-state.js';
import StorageManager from './storage-manager.js';
import PreviewManager from './preview-manager.js';

/**
 * Manages form operations, data collection, and dynamic form fields
 */
const FormManager = {
    init() {
        this.setupPersonalInfoListeners();
        this.setupProfileListeners();
        this.setupDynamicSections();
        this.setupSkillsAndLanguages();
        this.loadSavedData();
    },

    /**
     * Sets up event listeners for personal information fields
     */
    setupPersonalInfoListeners() {
        const fields = ['name', 'title', 'email', 'phone', 'location', 'linkedin'];
        fields.forEach(field => {
            document.getElementById(`personal-${field}`).addEventListener('input', () => {
                this.collectFormData();
                PreviewManager.updatePreview();
            });
        });
    },

    /**
     * Sets up event listeners for professional profile section
     */
    setupProfileListeners() {
        const profileText = document.getElementById('profile-text');
        const counter = document.getElementById('profile-counter');

        profileText.addEventListener('input', () => {
            const length = profileText.value.length;
            counter.textContent = length;
            counter.parentElement.style.color = length > 400 ? '#ef4444' : '#6b7280';

            this.collectFormData();
            PreviewManager.updatePreview();
        });
    },

    /**
     * Sets up event listeners for dynamic form sections (experience and education)
     */
    setupDynamicSections() {
        document.getElementById('add-experience').addEventListener('click', () => {
            this.addExperienceItem();
        });

        document.getElementById('add-education').addEventListener('click', () => {
            this.addEducationItem();
        });
    },

    /**
     * Adds a new experience form item to the experience section
     */
    addExperienceItem() {
        const container = document.getElementById('experience-container');
        const index = AppState.data.experience.length;

        const experienceHTML = `
                <div class="experience-item border rounded-lg p-4 relative" data-index="${index}">
                    <button type="button" class="remove-item absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">×</button>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                            <input type="text" class="exp-title w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Ex: Desenvolvedor Frontend">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                            <input type="text" class="exp-company w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Nome da empresa">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                            <input type="month" class="exp-start w-full px-3 py-2 border border-gray-300 rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Data de Fim</label>
                            <input type="month" class="exp-end w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <div class="mt-2">
                                <label class="flex items-center">
                                    <input type="checkbox" class="exp-current mr-2">
                                    <span class="text-sm">Trabalho atual</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea class="exp-description w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" placeholder="Descreva suas responsabilidades e conquistas..."></textarea>
                    </div>
                </div>
            `;

        container.insertAdjacentHTML('beforeend', experienceHTML);
        const newItem = container.lastElementChild;
        this.setupExperienceItemListeners(newItem);
        AppState.data.experience.push({
            title: '',
            company: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        });
    },

    /**
     * Sets up event listeners for a specific experience item
     * @param {HTMLElement} item - The experience item DOM element
     */
    setupExperienceItemListeners(item) {
        const index = parseInt(item.dataset.index);
        item.querySelector('.remove-item').addEventListener('click', () => {
            item.remove();
            AppState.data.experience.splice(index, 1);
            this.reindexExperienceItems();
            PreviewManager.updatePreview();
        });

        const inputs = item.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.collectFormData();
                PreviewManager.updatePreview();
            });
        });

        const currentCheckbox = item.querySelector('.exp-current');
        const endDateInput = item.querySelector('.exp-end');

        currentCheckbox.addEventListener('change', () => {
            endDateInput.disabled = currentCheckbox.checked;
            if (currentCheckbox.checked) {
                endDateInput.value = '';
            }
            this.collectFormData();
            PreviewManager.updatePreview();
        });
    },

    /**
     * Updates data-index attributes after removing experience items
     */
    reindexExperienceItems() {
        document.querySelectorAll('.experience-item').forEach((item, index) => {
            item.dataset.index = index;
        });
    },

    /**
     * Adds a new education form item to the education section
     */
    addEducationItem() {
        const container = document.getElementById('education-container');
        const index = AppState.data.education.length;

        const educationHTML = `
                <div class="education-item border rounded-lg p-4 relative" data-index="${index}">
                    <button type="button" class="remove-item absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">×</button>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Curso/Título</label>
                            <input type="text" class="edu-degree w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Ex: Bacharel em Ciência da Computação">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Instituição</label>
                            <input type="text" class="edu-institution w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Nome da instituição">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                            <input type="month" class="edu-start w-full px-3 py-2 border border-gray-300 rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Data de Conclusão</label>
                            <input type="month" class="edu-end w-full px-3 py-2 border border-gray-300 rounded-lg">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
                        <textarea class="edu-description w-full px-3 py-2 border border-gray-300 rounded-lg" rows="2" placeholder="Informações adicionais sobre o curso..."></textarea>
                    </div>
                </div>
            `;

        container.insertAdjacentHTML('beforeend', educationHTML);
        const newItem = container.lastElementChild;
        this.setupEducationItemListeners(newItem);
        AppState.data.education.push({
            degree: '',
            institution: '',
            startDate: '',
            endDate: '',
            description: ''
        });
    },

    /**
     * Sets up event listeners for a specific education item
     * @param {HTMLElement} item - The education item DOM element
     */
    setupEducationItemListeners(item) {
        const index = parseInt(item.dataset.index);
        item.querySelector('.remove-item').addEventListener('click', () => {
            item.remove();
            AppState.data.education.splice(index, 1);
            this.reindexEducationItems();
            PreviewManager.updatePreview();
        });

        const inputs = item.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.collectFormData();
                PreviewManager.updatePreview();
            });
        });
    },

    /**
     * Updates data-index attributes after removing education items
     */
    reindexEducationItems() {
        document.querySelectorAll('.education-item').forEach((item, index) => {
            item.dataset.index = index;
        });
    },

    /**
     * Sets up event listeners for skills and languages sections
     */
    setupSkillsAndLanguages() {
        document.getElementById('add-skill').addEventListener('click', () => {
            const input = document.getElementById('skill-input');
            const skill = input.value.trim();

            if (skill && !AppState.data.skills.includes(skill)) {
                AppState.data.skills.push(skill);
                this.renderSkills();
                PreviewManager.updatePreview();
                input.value = '';
            }
        });

        document.getElementById('add-language').addEventListener('click', () => {
            const input = document.getElementById('language-input');
            const level = document.getElementById('language-level');
            const language = input.value.trim();

            if (language) {
                const exists = AppState.data.languages.some(lang => lang.name === language);
                if (!exists) {
                    AppState.data.languages.push({
                        name: language,
                        level: level.value
                    });
                    this.renderLanguages();
                    PreviewManager.updatePreview();
                    input.value = '';
                }
            }
        });

        document.getElementById('skill-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('add-skill').click();
            }
        });

        document.getElementById('language-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('add-language').click();
            }
        });
    },

    /**
     * Renders the list of skills in the UI
     */
    renderSkills() {
        const container = document.getElementById('skills-list');
        container.innerHTML = '';

        AppState.data.skills.forEach((skill, index) => {
            const skillElement = document.createElement('div');
            skillElement.className = 'skill-item px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center';
            skillElement.innerHTML = `
                <span>${skill}</span>
                <button type="button" class="remove-skill ml-2 text-blue-600 hover:text-blue-800" data-index="${index}">×</button>
            `;
            container.appendChild(skillElement);
        });

        document.querySelectorAll('.remove-skill').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                AppState.data.skills.splice(index, 1);
                this.renderSkills();
                PreviewManager.updatePreview();
            });
        });
    },

    /**
     * Renders the list of languages in the UI
     */
    renderLanguages() {
        const container = document.getElementById('languages-list');
        container.innerHTML = '';

        AppState.data.languages.forEach((language, index) => {
            const langElement = document.createElement('div');
            langElement.className = 'language-item px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center';
            langElement.innerHTML = `
                <span>${language.name} - ${language.level}</span>
                <button type="button" class="remove-language ml-2 text-green-600 hover:text-green-800" data-index="${index}">×</button>
            `;
            container.appendChild(langElement);
        });

        document.querySelectorAll('.remove-language').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                AppState.data.languages.splice(index, 1);
                this.renderLanguages();
                PreviewManager.updatePreview();
            });
        });
    },

    /**
     * Collects all form data and updates the application state
     */
    collectFormData() {
        AppState.data.personalInfo = {
            name: document.getElementById('personal-name').value,
            title: document.getElementById('personal-title').value,
            email: document.getElementById('personal-email').value,
            phone: document.getElementById('personal-phone').value,
            location: document.getElementById('personal-location').value,
            linkedin: document.getElementById('personal-linkedin').value
        };

        AppState.data.profile = document.getElementById('profile-text').value;

        document.querySelectorAll('.experience-item').forEach((item, index) => {
            if (index < AppState.data.experience.length) {
                AppState.data.experience[index] = {
                    title: item.querySelector('.exp-title').value,
                    company: item.querySelector('.exp-company').value,
                    startDate: item.querySelector('.exp-start').value,
                    endDate: item.querySelector('.exp-current').checked ? 'Atual' : item.querySelector('.exp-end').value,
                    current: item.querySelector('.exp-current').checked,
                    description: item.querySelector('.exp-description').value
                };
            }
        });

        document.querySelectorAll('.education-item').forEach((item, index) => {
            if (index < AppState.data.education.length) {
                AppState.data.education[index] = {
                    degree: item.querySelector('.edu-degree').value,
                    institution: item.querySelector('.edu-institution').value,
                    startDate: item.querySelector('.edu-start').value,
                    endDate: item.querySelector('.edu-end').value,
                    description: item.querySelector('.edu-description').value
                };
            }
        });
    },

    /**
     * Loads saved data from storage and populates form fields
     */
    loadSavedData() {
        const savedData = StorageManager.load();
        if (savedData) {
            AppState.data = savedData;
            this.populateFormFields();
            PreviewManager.updatePreview();
        }
    },

    /**
     * Populates form fields with data from the application state
     */
    populateFormFields() {
        const { personalInfo, profile, experience, education, skills, languages } = AppState.data;

        if (personalInfo) {
            document.getElementById('personal-name').value = personalInfo.name || '';
            document.getElementById('personal-title').value = personalInfo.title || '';
            document.getElementById('personal-email').value = personalInfo.email || '';
            document.getElementById('personal-phone').value = personalInfo.phone || '';
            document.getElementById('personal-location').value = personalInfo.location || '';
            document.getElementById('personal-linkedin').value = personalInfo.linkedin || '';
        }

        if (profile) {
            document.getElementById('profile-text').value = profile;
            document.getElementById('profile-counter').textContent = profile.length;
        }

        if (experience && experience.length > 0) {
            document.getElementById('experience-container').innerHTML = '';
            experience.forEach(() => this.addExperienceItem());
            experience.forEach((exp, index) => {
                const item = document.querySelector(`.experience-item[data-index="${index}"]`);
                if (item) {
                    item.querySelector('.exp-title').value = exp.title || '';
                    item.querySelector('.exp-company').value = exp.company || '';
                    item.querySelector('.exp-start').value = exp.startDate || '';
                    if (exp.current) {
                        item.querySelector('.exp-current').checked = true;
                        item.querySelector('.exp-end').disabled = true;
                    } else {
                        item.querySelector('.exp-end').value = exp.endDate || '';
                    }
                    item.querySelector('.exp-description').value = exp.description || '';
                }
            });
        }

        if (education && education.length > 0) {
            document.getElementById('education-container').innerHTML = '';
            education.forEach(() => this.addEducationItem());
            education.forEach((edu, index) => {
                const item = document.querySelector(`.education-item[data-index="${index}"]`);
                if (item) {
                    item.querySelector('.edu-degree').value = edu.degree || '';
                    item.querySelector('.edu-institution').value = edu.institution || '';
                    item.querySelector('.edu-start').value = edu.startDate || '';
                    item.querySelector('.edu-end').value = edu.endDate || '';
                    item.querySelector('.edu-description').value = edu.description || '';
                }
            });
        }

        if (skills && skills.length > 0) {
            this.renderSkills();
        }

        if (languages && languages.length > 0) {
            this.renderLanguages();
        }
    }
};

export default FormManager;