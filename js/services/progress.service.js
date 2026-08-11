import {getExperienceData} from "../components/experience/experience.component.js";
import {getEducationData} from "../components/education/education.component.js";
import {getSkillsData} from "../components/skill/skill.component.js";
import {isValidPhone} from "../utils/masks.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOTAL_CHECKS = 6;

/** @returns {void} */
export function initProgress() {
  updateProgress();
  document.addEventListener('input', updateProgress);
  document.addEventListener('change', updateProgress);
}

/** @returns {void} */
function updateProgress() {
  const fill = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (!fill || !label) return;

  const name = document.getElementById('name')?.value.trim();
  const jobTitle = document.getElementById('job-title')?.value.trim();
  const email = document.getElementById('email')?.value.trim() ?? '';
  const phone = document.getElementById('phone')?.value.trim() ?? '';
  const profile = document.getElementById('profile')?.value.trim();

  const hasExpOrEdu = getExperienceData().some(hasContent) || getEducationData().some(hasContent);
  const hasSkill = getSkillsData().length > 0;

  const checks = [
    Boolean(name),
    Boolean(jobTitle),
    EMAIL_REGEX.test(email),
    isValidPhone(phone),
    Boolean(profile),
    hasExpOrEdu || hasSkill,
  ];

  const done = checks.filter(Boolean).length;
  const percent = Math.round((done / TOTAL_CHECKS) * 100);

  fill.style.width = `${percent}%`;
  label.textContent = `${percent}%`;
}

/**
 * @param {Object} item
 * @returns {boolean}
 */
function hasContent(item) {
  return Object.values(item).some(v => typeof v === 'string' && v.trim());
}
