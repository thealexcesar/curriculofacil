import { t } from '../../services/i18n.js';

/**
 * @typedef {Object} PersonalData
 * @property {string} name
 * @property {string} jobTitle
 * @property {string} email
 * @property {string} phone
 * @property {boolean} [phoneWhatsapp]
 * @property {string} location
 * @property {string} linkedin
 * @property {string} [instagram]
 * @property {string} [website]
 * @property {string} [cnhCategory]
 * @property {string} [rg]
 * @property {string} [cpf]
 * @property {string} [professionalRegistry]
 * @property {string} [photo] - Optional, base64 data URL (see photo.service.js)
 */

/**
 * @typedef {Object} PreviewData
 * @property {PersonalData} personal
 * @property {string} profile
 * @property {import('../experience/experience.component.js').ExperienceData[]} experience
 * @property {import('../education/education.component.js').EducationData[]} education
 * @property {string[]} skills
 * @property {import('../language/language.component.js').LanguageData[]} languages
 * @property {import('../phone/phone.component.js').PhoneData[]} [extraPhones]
 */

/**
 * @param {PreviewData} data
 * @param {string} [template] - 'classic', 'modern' or 'sidebar'
 * @returns {string}
 */
export function previewTemplate({ personal, profile, experience, education, skills, languages, extraPhones = [] }, template = 'classic') {
  if (!personal.name && !personal.jobTitle) {
    return `<p class="preview-empty">${t('preview.empty')}</p>`;
  }

  const phones = [
    personal.phone ? { phone: personal.phone, whatsapp: personal.phoneWhatsapp } : null,
    ...extraPhones,
  ].filter(Boolean);

  // Split so the sidebar theme can place them in different columns (name
  // leads the main column, contact info opens the sidebar) - classic and
  // modern keep them together in one <header>, unchanged.
  const nameTitle = `
    ${personal.name ? `<h1 class="cv-name">${personal.name}</h1>` : ''}
    ${personal.jobTitle ? `<p class="cv-job-title">${personal.jobTitle}${personal.professionalRegistry ? ` <span class="cv-registry">(${personal.professionalRegistry})</span>` : ''}</p>` : ''}`;

  const contactBlock = `
    <div class="cv-contact">
      ${personal.email ? `<span>${personal.email}</span>` : ''}
      ${phones.map(p => `<span>${p.phone}${p.whatsapp ? ' (WhatsApp)' : ''}${p.note ? ` - ${p.note}` : ''}</span>`).join('')}
      ${personal.location ? `<span>${personal.location}</span>` : ''}
      ${personal.linkedin ? `<span>${personal.linkedin}</span>` : ''}
      ${personal.instagram ? `<span>${personal.instagram}</span>` : ''}
      ${personal.website ? `<span>${personal.website}</span>` : ''}
      ${personal.cnhCategory ? `<span>${t('field.cnhCategory.label')}: ${personal.cnhCategory}</span>` : ''}
    </div>`;

  // Optional - nothing is rendered (not even a placeholder) without one, so
  // every layout closes up instead of leaving a hole.
  const photo = personal.photo ? `<img class="cv-photo" src="${personal.photo}" alt="">` : '';

  // Classic/modern put the photo beside the name in the header; the sidebar
  // theme places it at the top of its own column instead (see below).
  const header = `
    <header class="cv-header${photo ? ' cv-header--with-photo' : ''}">
      <div class="cv-header-text">${nameTitle}${contactBlock}</div>
      ${photo}
    </header>`;

  const documents = hasDocuments(personal) ? `
    <section class="cv-section cv-section--documents">
      <h2 class="cv-section-title">${t('section.documents')}</h2>
      <dl class="cv-documents">
        ${personal.rg ? `<div><dt>${t('field.rg.label')}</dt><dd>${personal.rg}</dd></div>` : ''}
        ${personal.cpf ? `<div><dt>${t('field.cpf.label')}</dt><dd>${personal.cpf}</dd></div>` : ''}
      </dl>
    </section>` : '';

  const profileSection = profile ? `
    <section class="cv-section cv-section--profile">
      <h2 class="cv-section-title">${t('section.profile')}</h2>
      <p class="cv-profile">${profile}</p>
    </section>` : '';

  const experienceSection = experience.length ? `
    <section class="cv-section cv-section--experience">
      <h2 class="cv-section-title">${t('section.experience')}</h2>
      ${experience.map(exp => `
        <div class="cv-item">
          <strong class="cv-item-title">${exp.title}</strong>
          ${exp.company ? `<span class="cv-item-subtitle">${exp.company}</span>` : ''}
          <span class="cv-item-date">${formatDate(exp.startDate)} - ${exp.current ? t('field.experience.current') : formatDate(exp.endDate)}</span>
          ${exp.description ? `<p class="cv-item-desc">${exp.description}</p>` : ''}
        </div>
      `).join('')}
    </section>` : '';

  const educationSection = education.length ? `
    <section class="cv-section cv-section--education">
      <h2 class="cv-section-title">${t('section.education')}</h2>
      ${education.map(edu => `
        <div class="cv-item">
          <strong class="cv-item-title">${edu.degree}</strong>
          ${edu.institution ? `<span class="cv-item-subtitle">${edu.institution}</span>` : ''}
          <span class="cv-item-date">
            ${formatDate(edu.startDate)}${edu.inProgress
              ? ` - ${t('field.inProgress.label')}`
              : edu.endDate ? ` - ${formatDate(edu.endDate)}` : ''
            }
          </span>
          ${edu.description ? `<p class="cv-item-desc">${edu.description}</p>` : ''}
        </div>
      `).join('')}
    </section>` : '';

  const columns = (skills.length || languages.length) ? `
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
    </section>` : '';

  if (template === 'sidebar') {
    // A real two-column split (two flex children, each stacking its own
    // content independently) instead of CSS Grid column/row placement -
    // Grid's auto-placement cursor advances globally across all items
    // regardless of column, which left gaps whenever the sidebar and main
    // columns had a different number of sections.
    //
    // Name/title lead the main column and contact info opens the sidebar
    // (not grouped together in one header block) - matches how this style
    // of résumé is conventionally laid out: name reads as the main
    // column's own heading, contact details sit with the rest of the
    // at-a-glance sidebar info instead of floating above it.
    const hasContact = Boolean(personal.email || phones.length || personal.location || personal.linkedin
      || personal.instagram || personal.website || personal.cnhCategory);
    const contactWithTitle = hasContact ? `<h2 class="cv-section-title">${t('section.contact')}</h2>${contactBlock}` : '';
    return `
      <div class="cv-sidebar-group">${photo}${contactWithTitle}${documents}${columns}</div>
      <div class="cv-main-group"><header class="cv-header">${nameTitle}</header>${profileSection}${experienceSection}${educationSection}</div>
    `;
  }

  return `${header}${documents}${profileSection}${experienceSection}${educationSection}${columns}`;
}

/**
 * Formats YYYY-MM to "mmm/YYYY" using locale-aware month names.
 *
 * @param {string} [yyyyMm]
 * @returns {string}
 */
function formatDate(yyyyMm) {
  if (!yyyyMm) return '';
  const [year, month] = yyyyMm.split('-');
  const months = t('months');
  return `${months[parseInt(month, 10) - 1]}/${year}`;
}


/**
 * @param {PersonalData} personal
 * @returns {boolean}
 */
function hasDocuments(personal) {
  return Boolean(personal.rg || personal.cpf);
}
