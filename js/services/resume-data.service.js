/**
 * Single source of truth for reading and writing the full resume state.
 * Shared by localStorage auto-save, the live preview and file export/import,
 * so all three always agree on the same shape.
 */

import {getExperienceData, addExperience, clearExperience} from "../components/experience/experience.component.js";
import {getEducationData, addEducation, clearEducation} from "../components/education/education.component.js";
import {getSkillsData, restoreSkills, clearSkills} from "../components/skill/skill.component.js";
import {getLanguagesData, addLanguage, clearLanguages} from "../components/language/language.component.js";
import {getExtraPhonesData, addExtraPhone, clearExtraPhones} from "../components/phone/phone.component.js";
import {getPhoto, setPhoto} from "./photo.service.js";

/**
 * Reads the full resume state from the live DOM and in-memory components.
 *
 * @returns {import('./storage.service.js').ResumeData}
 */
export function collectResumeData() {
  return {
    personal: {
      name: document.getElementById('name')?.value.trim() ?? '',
      jobTitle: document.getElementById('job-title')?.value.trim() ?? '',
      email: document.getElementById('email')?.value.trim() ?? '',
      phone: document.getElementById('phone')?.value.trim() ?? '',
      phoneWhatsapp: document.getElementById('phone-whatsapp')?.checked ?? false,
      location: document.getElementById('location')?.value.trim() ?? '',
      linkedin: document.getElementById('linkedin')?.value.trim() ?? '',
      instagram: document.getElementById('instagram')?.value.trim() ?? '',
      website: document.getElementById('website')?.value.trim() ?? '',
      cnhCategory: document.getElementById('cnh-category')?.value ?? '',
      rg: document.getElementById('rg')?.value.trim() ?? '',
      cpf: document.getElementById('cpf')?.value.trim() ?? '',
      professionalRegistry: document.getElementById('professional-registry')?.value.trim() ?? '',
      photo: getPhoto(),
    },
    profile: document.getElementById('profile')?.value.trim() ?? '',
    experience: getExperienceData(),
    education: getEducationData(),
    skills: getSkillsData(),
    languages: getLanguagesData(),
    extraPhones: getExtraPhonesData(),
    coverLetter: {
      company: document.getElementById('cl-company')?.value.trim() ?? '',
      body: document.getElementById('cl-body')?.value ?? '',
    },
  };
}

/**
 * Populates every field and dynamic component from a resume data object.
 * Clears existing dynamic items first so re-applying data never appends
 * duplicates on top of what is already on screen.
 *
 * @param {Partial<import('./storage.service.js').ResumeData>} data
 * @returns {void}
 */
export function applyResumeData(data) {
  if (!data || typeof data !== 'object') return;

  const {personal, profile, experience, education, skills, languages, extraPhones, coverLetter} = data;

  if (personal) {
    document.getElementById('name').value = personal.name ?? '';
    document.getElementById('job-title').value = personal.jobTitle ?? '';
    document.getElementById('email').value = personal.email ?? '';
    document.getElementById('phone').value = personal.phone ?? '';
    document.getElementById('phone-whatsapp').checked = Boolean(personal.phoneWhatsapp);
    document.getElementById('location').value = personal.location ?? '';
    document.getElementById('linkedin').value = personal.linkedin ?? '';
    document.getElementById('instagram').value = personal.instagram ?? '';
    document.getElementById('website').value = personal.website ?? '';
    document.getElementById('cnh-category').value = personal.cnhCategory ?? '';
    document.getElementById('rg').value = personal.rg ?? '';
    document.getElementById('cpf').value = personal.cpf ?? '';
    document.getElementById('professional-registry').value = personal.professionalRegistry ?? '';
    setPhoto(personal.photo ?? '');
  }

  document.getElementById('profile').value = profile ?? '';

  document.getElementById('cl-company').value = coverLetter?.company ?? '';
  document.getElementById('cl-body').value = coverLetter?.body ?? '';

  clearExperience();
  clearEducation();
  clearLanguages();
  clearExtraPhones();
  clearSkills();
  document.getElementById('experience-list').innerHTML = '';
  document.getElementById('education-list').innerHTML = '';
  document.getElementById('language-list').innerHTML = '';
  document.getElementById('extra-phones').innerHTML = '';

  experience?.forEach(exp => addExperience(exp));
  education?.forEach(edu => addEducation(edu));
  languages?.forEach(lang => addLanguage(lang));
  extraPhones?.forEach(phone => addExtraPhone(phone));
  if (skills?.length) restoreSkills(skills);
}
