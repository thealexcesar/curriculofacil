import { previewTemplate }   from './preview.template.js';
import { getExperienceData } from '../experience/experience.component.js';
import { getEducationData }  from '../education/education.component.js';
import { getSkillsData }     from '../skill/skill.component.js';
import { getLanguagesData }  from '../language/language.component.js';

const CV_WIDTH_PX = 794;

/** @returns {void} */
export function initPreview() {
  renderPreview();
  document.addEventListener('input',  renderPreview);
  document.addEventListener('change', renderPreview);
  window.addEventListener('resize',   scaleCvPreview);
}

/** @returns {void} */
function renderPreview() {
  const preview = document.getElementById('cv-preview');
  if (!preview) return;
  preview.innerHTML = previewTemplate(collectData());
  scaleCvPreview();
}

/** @returns {import('./preview.template.js').PreviewData} */
function collectData() {
  return {
    personal: {
      name:     document.getElementById('name')?.value.trim()      ?? '',
      jobTitle: document.getElementById('job-title')?.value.trim() ?? '',
      email:    document.getElementById('email')?.value.trim()     ?? '',
      phone:    document.getElementById('phone')?.value.trim()     ?? '',
      location: document.getElementById('location')?.value.trim()  ?? '',
      linkedin: document.getElementById('linkedin')?.value.trim()  ?? '',
    },
    profile:    document.getElementById('profile')?.value.trim() ?? '',
    experience: getExperienceData(),
    education:  getEducationData(),
    skills:     getSkillsData(),
    languages:  getLanguagesData(),
  };
}

/** @returns {void} */
function scaleCvPreview() {
  const wrapper = document.querySelector('.cv-preview-wrapper');
  const preview = document.getElementById('cv-preview');
  if (!wrapper || !preview) return;
  const scale = wrapper.clientWidth / CV_WIDTH_PX;
  preview.style.transform       = `scale(${scale})`;
  preview.style.transformOrigin = 'top left';
  wrapper.style.height          = `${Math.round(1123 * scale)}px`;
}
