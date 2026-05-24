import {initLocale, t, translateDOM, setLocale, getLocale} from "./services/i18n.js";
import {initNavigation, updateStepLocks} from "./services/navigation.service.js";
import {initStep1Validation} from "./services/validation.service.js";
import {initStep2Profile} from "./components/profile-section/profile-section.component.js";
import {initStep3Experience, addExperience, getExperienceData} from "./components/experience/experience.component.js";
import {initStep4Education, addEducation, getEducationData} from "./components/education/education.component.js";
import {initPreview} from "./components/preview/preview.component.js";
import {initStep5Skills, restoreSkills, getSkillsData} from "./components/skill/skill.component.js";
import {initStep5Languages, addLanguage, getLanguagesData} from "./components/language/language.component.js";
import {saveResume, loadResume} from "./services/storage.service.js";
/**
 * Application entry point.
 * Initializes all modules after DOM is ready.
 *
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
  initLocale();
  translateDOM();
  initLangSwitcher();

  initNavigation();
  initStep1Validation();
  updateStepLocks();
  initStep2Profile();
  initStep3Experience();
  initStep4Education();
  initPreview();
  initStep5Skills();
  initStep5Languages();

  restoreResume();
  document.addEventListener('input',  saveAll);
  document.addEventListener('change', saveAll);
});

function initLangSwitcher() {
  const buttons = document.querySelectorAll('.lang-btn');

  const update = () => {
    const current = getLocale();
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === current);
      const full = btn.querySelector('.lang-full');
      if (full) full.textContent = t(btn.getAttribute('data-i18n-lang'));
    });
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      setLocale(btn.dataset.lang);
      translateDOM();
      update();
    });
  });

  update();
}

/** @returns {void} */
function saveAll() {
  saveResume({
    personal: {
      name: document.getElementById('name')?.value.trim()      ?? '',
      jobTitle: document.getElementById('job-title')?.value.trim() ?? '',
      email: document.getElementById('email')?.value.trim()     ?? '',
      phone: document.getElementById('phone')?.value.trim()     ?? '',
      location: document.getElementById('location')?.value.trim()  ?? '',
      linkedin: document.getElementById('linkedin')?.value.trim()  ?? '',
    },
    profile: document.getElementById('profile')?.value.trim() ?? '',
    experience: getExperienceData(),
    education: getEducationData(),
    skills: getSkillsData(),
    languages: getLanguagesData(),
  });
}

/** @returns {void} */
function restoreResume() {
  const data = loadResume();
  if (!Object.keys(data).length) return;

  const { personal, profile, experience, education, skills, languages } = data;

  if (personal) {
    if (personal.name) document.getElementById('name').value = personal.name;
    if (personal.jobTitle) document.getElementById('job-title').value = personal.jobTitle;
    if (personal.email) document.getElementById('email').value = personal.email;
    if (personal.phone) document.getElementById('phone').value = personal.phone;
    if (personal.location) document.getElementById('location').value = personal.location;
    if (personal.linkedin) document.getElementById('linkedin').value = personal.linkedin;
  }

  if (profile) document.getElementById('profile').value = profile;

  experience?.forEach(exp => addExperience(exp));
  education?.forEach(edu => addEducation(edu));
  languages?.forEach(lang => addLanguage(lang));
  if (skills?.length) restoreSkills(skills);
}
