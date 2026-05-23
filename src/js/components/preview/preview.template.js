import { t } from '../../services/i18n.js';

/**
 * @typedef {Object} PersonalData
 * @property {string} name
 * @property {string} jobTitle
 * @property {string} email
 * @property {string} phone
 * @property {string} location
 * @property {string} linkedin
 */

/**
 * @typedef {Object} PreviewData
 * @property {PersonalData}                                    personal
 * @property {string}                                          profile
 * @property {import('../experience/experience.component.js').ExperienceData[]} experience
 * @property {import('../education/education.component.js').EducationData[]}    education
 * @property {string[]}                                        skills
 * @property {import('../language/language.component.js').LanguageData[]}       languages
 */

/**
 * @param {PreviewData} data
 * @returns {string}
 */
export function previewTemplate({ personal, profile, experience, education, skills, languages }) {
  if (!personal.name && !personal.jobTitle) {
    return `<p class="preview-empty">${t('preview.empty')}</p>`;
  }

  return `
    <header class="cv-header">
      ${personal.name     ? `<h1 class="cv-name">${personal.name}</h1>` : ''}
      ${personal.jobTitle ? `<p class="cv-job-title">${personal.jobTitle}</p>` : ''}
      <div class="cv-contact">
        ${personal.email    ? `<span>${personal.email}</span>`    : ''}
        ${personal.phone    ? `<span>${personal.phone}</span>`    : ''}
        ${personal.location ? `<span>${personal.location}</span>` : ''}
        ${personal.linkedin ? `<span>${personal.linkedin}</span>` : ''}
      </div>
    </header>

    ${profile ? `
    <section class="cv-section">
      <h2 class="cv-section-title">${t('section.profile')}</h2>
      <p class="cv-profile">${profile}</p>
    </section>` : ''}

    ${experience.length ? `
    <section class="cv-section">
      <h2 class="cv-section-title">${t('section.experience')}</h2>
      ${experience.map(exp => `
        <div class="cv-item">
          <div class="cv-item-header">
            <strong class="cv-item-title">${exp.title}</strong>
            <span class="cv-item-date">${formatDate(exp.startDate)} — ${exp.current ? t('field.experience.current') : formatDate(exp.endDate)}</span>
          </div>
          ${exp.company     ? `<span class="cv-item-subtitle">${exp.company}</span>` : ''}
          ${exp.description ? `<p class="cv-item-desc">${exp.description}</p>`       : ''}
        </div>
      `).join('')}
    </section>` : ''}

    ${education.length ? `
    <section class="cv-section">
      <h2 class="cv-section-title">${t('section.education')}</h2>
      ${education.map(edu => `
        <div class="cv-item">
          <div class="cv-item-header">
            <strong class="cv-item-title">${edu.degree}</strong>
            <span class="cv-item-date">${formatDate(edu.startDate)}${edu.endDate ? ` — ${formatDate(edu.endDate)}` : ''}</span>
          </div>
          ${edu.institution ? `<span class="cv-item-subtitle">${edu.institution}</span>` : ''}
          ${edu.description ? `<p class="cv-item-desc">${edu.description}</p>`           : ''}
        </div>
      `).join('')}
    </section>` : ''}

    ${(skills.length || languages.length) ? `
    <section class="cv-section cv-section--columns">
      ${skills.length ? `
      <div>
        <h2 class="cv-section-title">${t('section.skill')}</h2>
        <div class="cv-skills">
          ${skills.map(s => `<span class="cv-skill">${s}</span>`).join('')}
        </div>
      </div>` : ''}
      ${languages.length ? `
      <div>
        <h2 class="cv-section-title">${t('section.language')}</h2>
        <ul class="cv-languages">
          ${languages.map(l => `
            <li>
              <span class="cv-lang-name">${l.name}</span>
              <span class="cv-lang-level">${l.level}</span>
            </li>
          `).join('')}
        </ul>
      </div>` : ''}
    </section>` : ''}
  `;
}

/**
 * Formats YYYY-MM to "mmm/YYYY" (e.g. "mar/2022").
 *
 * @param {string} [yyyyMm]
 * @returns {string}
 */
function formatDate(yyyyMm) {
  if (!yyyyMm) return '';
  const [year, month] = yyyyMm.split('-');
  const MONTHS = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  return `${MONTHS[parseInt(month, 10) - 1]}/${year}`;
}
