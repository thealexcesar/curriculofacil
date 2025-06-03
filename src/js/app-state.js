/**
 * Application state store for the Resume Builder
 * Maintains the current step and all form data
 */
const AppState = {
    currentStep: 1,
    maxStep: 5,

    data: {
        personalInfo: {},
        profile: '',
        experience: [],
        education: [],
        skills: [],
        languages: []
    }
};

export default AppState;