/**
 * Resume Builder Application
 * Manages form state, validation, preview generation, and PDF export
 */

const STEP_TITLES = {
  1: 'Informações Pessoais',
  2: 'Perfil Profissional',
  3: 'Experiência Profissional',
  4: 'Educação',
  5: 'Habilidades e Idiomas'
};

const EXP_TEMPLATE = `
  <div class="experience-item border rounded-lg p-4 relative" data-index="{index}">
    <button type="button" class="remove-item absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 flex items-center justify-center">×</button>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div class="form-group">
        <label>Cargo</label>
        <input type="text" class="exp-title" placeholder="Ex: Desenvolvedor Web">
      </div>
      <div class="form-group">
        <label>Empresa</label>
        <input type="text" class="exp-company" placeholder="Nome da empresa">
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div class="form-group">
        <label>Data de Início</label>
        <input type="month" class="exp-start">
      </div>
      <div class="form-group">
        <label>Data de Fim</label>
        <input type="month" class="exp-end">
        <div class="mt-2">
          <label class="inline-flex items-center">
            <input type="checkbox" class="exp-current mr-2">
            <span class="text-sm">Trabalho atual</span>
          </label>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>Descrição</label>
      <textarea class="exp-description" rows="3" placeholder="Descreva suas responsabilidades..."></textarea>
    </div>
  </div>
`;

const EDU_TEMPLATE = `
  <div class="education-item border rounded-lg p-4 relative" data-index="{index}">
    <button type="button" class="remove-item absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 flex items-center justify-center">×</button>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div class="form-group">
        <label>Curso/Título</label>
        <input type="text" class="edu-degree" placeholder="Ex: Bacharel em Ciência da Computação">
      </div>
      <div class="form-group">
        <label>Instituição</label>
        <input type="text" class="edu-institution" placeholder="Nome da instituição">
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div class="form-group">
        <label>Data de Início</label>
        <input type="month" class="edu-start">
      </div>
      <div class="form-group">
        <label>Data de Conclusão</label>
        <input type="month" class="edu-end">
      </div>
    </div>
    <div class="form-group">
      <label>Descrição (opcional)</label>
      <textarea class="edu-description" rows="2" placeholder="Informações adicionais..."></textarea>
    </div>
  </div>
`;

const state = {
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

const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);

/**
 * Initialize application on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  loadData();
});

/**
 * Setup all event listeners
 */
function initEventListeners() {
  $('next-btn').onclick = () => state.currentStep < state.maxStep && goToStep(state.currentStep + 1);
  $('prev-btn').onclick = () => state.currentStep > 1 && goToStep(state.currentStep - 1);
  $('finish-btn').onclick = () => {
    collectData();
    saveData();
    showNotification('Currículo finalizado!');
  };

  $$('.step-indicator').forEach(el => el.onclick = () => goToStep(parseInt(el.dataset.step)));
  $$('#step-1 input').forEach(el => el.oninput = () => { collectData(); updatePreview(); });

  $('profile').oninput = (e) => {
    const len = e.target.value.length;
    $('profile-counter').textContent = len;
    $('profile-counter').parentElement.style.color = len > 400 ? '#ef4444' : '#6b7280';
    collectData();
    updatePreview();
  };

  $('add-experience').onclick = addExperience;
  $('add-education').onclick = addEducation;
  $('add-skill').onclick = addSkill;
  $('add-language').onclick = addLanguage;
  $('skill-input').onkeypress = (e) => e.key === 'Enter' && (e.preventDefault(), addSkill());
  $('language-input').onkeypress = (e) => e.key === 'Enter' && (e.preventDefault(), addLanguage());
  $('export-pdf').onclick = exportPDF;
  $('print-resume').onclick = printResume;
}

/**
 * Navigate to specific step
 */
function goToStep(step) {
  if (step < 1 || step > state.maxStep) return;

  collectData();
  saveData();

  $$('.form-section').forEach(el => el.classList.remove('active'));
  $$('.step-indicator').forEach(el => {
    el.classList.remove('active', 'bg-blue-600', 'text-white');
    el.classList.add('bg-gray-300', 'text-gray-600');
  });

  state.currentStep = step;
  $(`step-${step}`).classList.add('active');
  document.querySelector(`[data-step="${step}"]`).classList.add('active', 'bg-blue-600', 'text-white');
  $('step-title').textContent = STEP_TITLES[step];
  $('prev-btn').disabled = step === 1;
  $('next-btn').style.display = step === state.maxStep ? 'none' : 'flex';
  $('finish-btn').style.display = step === state.maxStep ? 'flex' : 'none';
}

/**
 * Add experience entry
 */
function addExperience() {
  const container = $('experience-container');
  const idx = state.data.experience.length;
  container.insertAdjacentHTML('beforeend', EXP_TEMPLATE.replace('{index}', idx));

  const item = container.lastElementChild;
  item.querySelector('.remove-item').onclick = () => {
    item.remove();
    state.data.experience.splice(idx, 1);
    reindex('experience-item');
    updatePreview();
  };

  item.querySelectorAll('input, textarea').forEach(el => el.oninput = () => { collectData(); updatePreview(); });

  const current = item.querySelector('.exp-current');
  const endDate = item.querySelector('.exp-end');
  current.onchange = () => {
    endDate.disabled = current.checked;
    if (current.checked) endDate.value = '';
    collectData();
    updatePreview();
  };

  state.data.experience.push({ title: '', company: '', startDate: '', endDate: '', current: false, description: '' });
  updatePreview();
}

/**
 * Add education entry
 */
function addEducation() {
  const container = $('education-container');
  const idx = state.data.education.length;
  container.insertAdjacentHTML('beforeend', EDU_TEMPLATE.replace('{index}', idx));

  const item = container.lastElementChild;
  item.querySelector('.remove-item').onclick = () => {
    item.remove();
    state.data.education.splice(idx, 1);
    reindex('education-item');
    updatePreview();
  };

  item.querySelectorAll('input, textarea').forEach(el => el.oninput = () => { collectData(); updatePreview(); });

  state.data.education.push({ degree: '', institution: '', startDate: '', endDate: '', description: '' });
  updatePreview();
}

/**
 * Add skill tag
 */
function addSkill() {
  const input = $('skill-input');
  const skill = input.value.trim();
  if (skill && !state.data.skills.includes(skill)) {
    state.data.skills.push(skill);
    renderSkills();
    updatePreview();
    input.value = '';
  }
}

/**
 * Add language entry
 */
function addLanguage() {
  const input = $('language-input');
  const level = $('language-level');
  const lang = input.value.trim();

  if (!Array.isArray(state.data.languages)) state.data.languages = [];
  if (!lang || state.data.languages.some(l => l.name.toLowerCase() === lang.toLowerCase())) return;

  state.data.languages.push({ name: lang, level: level.value });
  renderLanguages();
  updatePreview();
  input.value = '';
  level.selectedIndex = 0;
  input.focus();
}

/**
 * Render skills list
 */
function renderSkills() {
  const container = $('skills-list');
  container.innerHTML = state.data.skills.map((skill, i) => `
    <div class="skill-item px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center">
      <span>${skill}</span>
      <button type="button" class="remove-skill ml-2 text-blue-600 hover:text-blue-800" data-index="${i}">×</button>
    </div>
  `).join('');

  $$('.remove-skill').forEach(btn => btn.onclick = () => {
    state.data.skills.splice(parseInt(btn.dataset.index), 1);
    renderSkills();
    updatePreview();
  });
}

/**
 * Render languages list
 */
function renderLanguages() {
  const container = $('languages-list');
  container.innerHTML = state.data.languages.map((lang, i) => `
    <div class="language-item px-3 py-2 bg-green-100 text-green-800 rounded-lg flex items-center justify-between mb-2">
      <span>${lang.name} - ${lang.level}</span>
      <button type="button" class="remove-language text-green-600 hover:text-green-800" data-index="${i}">×</button>
    </div>
  `).join('');

  $$('.remove-language').forEach(btn => btn.onclick = () => {
    state.data.languages.splice(parseInt(btn.dataset.index), 1);
    renderLanguages();
    updatePreview();
  });
}

/**
 * Reindex dynamic items after removal
 */
function reindex(className) {
  $$(`.${className}`).forEach((el, i) => el.dataset.index = i);
}

/**
 * Collect form data into state
 */
function collectData() {
  state.data.personalInfo = {
    name: $('name').value,
    title: $('title').value,
    email: $('email').value,
    phone: $('phone').value,
    location: $('location').value,
    linkedin: $('linkedin').value
  };

  state.data.profile = $('profile').value;

  $$('.experience-item').forEach((item, i) => {
    if (i < state.data.experience.length) {
      const current = item.querySelector('.exp-current').checked;
      state.data.experience[i] = {
        title: item.querySelector('.exp-title').value,
        company: item.querySelector('.exp-company').value,
        startDate: item.querySelector('.exp-start').value,
        endDate: current ? 'Atual' : item.querySelector('.exp-end').value,
        current,
        description: item.querySelector('.exp-description').value
      };
    }
  });

  $$('.education-item').forEach((item, i) => {
    if (i < state.data.education.length) {
      state.data.education[i] = {
        degree: item.querySelector('.edu-degree').value,
        institution: item.querySelector('.edu-institution').value,
        startDate: item.querySelector('.edu-start').value,
        endDate: item.querySelector('.edu-end').value,
        description: item.querySelector('.edu-description').value
      };
    }
  });
}

/**
 * Update CV preview
 */
function updatePreview() {
  const preview = $('cv-preview');
  const { personalInfo: p, profile, experience: exp, education: edu, skills, languages: langs } = state.data;

  if (!p.name) {
    preview.innerHTML = '<div class="text-center text-gray-500 py-20">Preencha as informações para ver a visualização</div>';
    return;
  }

  let html = `
    <div class="cv-header">
      <h1>${p.name}</h1>
      <h2>${p.title}</h2>
      <div class="cv-contact">
        ${p.email ? `<div><strong>Email:</strong> ${p.email}</div>` : ''}
        ${p.phone ? `<div><strong>Telefone:</strong> ${p.phone}</div>` : ''}
        ${p.location ? `<div><strong>Localização:</strong> ${p.location}</div>` : ''}
        ${p.linkedin ? `<div><strong>LinkedIn:</strong> <a href="${p.linkedin}" class="text-blue-600">${p.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a></div>` : ''}
      </div>
    </div>
  `;

  if (profile) html += `<div class="cv-section"><h3 class="cv-section-title">Perfil</h3><p>${profile}</p></div>`;

  if (exp.length > 0 && exp[0].title) {
    html += '<div class="cv-section"><h3 class="cv-section-title">Experiência Profissional</h3>';
    exp.forEach(e => {
      if (e.title || e.company) {
        html += `
          <div class="cv-item">
            <div class="cv-item-header">
              <div>
                <div class="cv-item-title">${e.title}</div>
                <div class="cv-item-subtitle">${e.company}</div>
              </div>
              <div class="cv-item-date">${formatDate(e.startDate)} - ${e.current ? 'Atual' : formatDate(e.endDate)}</div>
            </div>
            ${e.description ? `<p class="mt-2">${e.description}</p>` : ''}
          </div>
        `;
      }
    });
    html += '</div>';
  }

  if (edu.length > 0 && edu[0].degree) {
    html += '<div class="cv-section"><h3 class="cv-section-title">Educação</h3>';
    edu.forEach(e => {
      if (e.degree || e.institution) {
        html += `
          <div class="cv-item">
            <div class="cv-item-header">
              <div>
                <div class="cv-item-title">${e.degree}</div>
                <div class="cv-item-subtitle">${e.institution}</div>
              </div>
              <div class="cv-item-date">${formatDate(e.startDate)} - ${formatDate(e.endDate)}</div>
            </div>
            ${e.description ? `<p class="mt-2">${e.description}</p>` : ''}
          </div>
        `;
      }
    });
    html += '</div>';
  }

  if (skills.length > 0 || langs.length > 0) {
    html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">';

    if (skills.length > 0) {
      html += `<div class="cv-section"><h3 class="cv-section-title">Habilidades</h3><div class="cv-skills">`;
      skills.forEach(s => html += `<div class="cv-skill">${s}</div>`);
      html += '</div></div>';
    }

    if (langs.length > 0) {
      html += `<div class="cv-section"><h3 class="cv-section-title">Idiomas</h3><div class="cv-languages">`;
      langs.forEach(l => html += `<div class="cv-language"><span>${l.name}</span><span>${l.level}</span></div>`);
      html += '</div></div>';
    }

    html += '</div>';
  }

  preview.innerHTML = html;
}

/**
 * Export CV as PDF
 */
async function exportPDF() {
  collectData();
  saveData();

  const name = $('name').value || 'curriculo';
  const originalTitle = document.title;
  document.title = `${name}_curriculo`;

  window.print();

  setTimeout(() => {
    document.title = originalTitle;
  }, 500);
}

/**
 * Print resume
 */
function printResume() {
  collectData();
  saveData();

  const name = $('name').value || 'curriculo';
  const originalTitle = document.title;
  document.title = `${name}_curriculo`;

  window.print();

  setTimeout(() => {
    document.title = originalTitle;
  }, 500);
}

/**
 * Save data to localStorage
 */
function saveData() {
  try {
    localStorage.setItem('resume_data', JSON.stringify(state.data));
    showNotification('Dados salvos automaticamente');
  } catch (e) {
    console.error('Save error:', e);
  }
}

/**
 * Load data from localStorage
 */
function loadData() {
  try {
    const saved = localStorage.getItem('resume_data');
    if (!saved) return;

    state.data = JSON.parse(saved);

    const { personalInfo: p, profile, experience: exp, education: edu, skills, languages: langs } = state.data;

    if (p) {
      $('name').value = p.name || '';
      $('title').value = p.title || '';
      $('email').value = p.email || '';
      $('phone').value = p.phone || '';
      $('location').value = p.location || '';
      $('linkedin').value = p.linkedin || '';
    }

    if (profile) {
      $('profile').value = profile;
      $('profile-counter').textContent = profile.length;
    }

    if (exp?.length > 0) {
      $('experience-container').innerHTML = '';
      exp.forEach((e, i) => {
        if (e.title || e.company || e.description) {
          addExperience();
          const item = document.querySelector(`.experience-item[data-index="${i}"]`);
          if (item) {
            item.querySelector('.exp-title').value = e.title || '';
            item.querySelector('.exp-company').value = e.company || '';
            item.querySelector('.exp-start').value = e.startDate || '';
            if (e.current) {
              item.querySelector('.exp-current').checked = true;
              item.querySelector('.exp-end').disabled = true;
            } else {
              item.querySelector('.exp-end').value = e.endDate || '';
            }
            item.querySelector('.exp-description').value = e.description || '';
          }
        }
      });
    }

    if (edu?.length > 0) {
      $('education-container').innerHTML = '';
      edu.forEach((e, i) => {
        if (e.degree || e.institution || e.description) {
          addEducation();
          const item = document.querySelector(`.education-item[data-index="${i}"]`);
          if (item) {
            item.querySelector('.edu-degree').value = e.degree || '';
            item.querySelector('.edu-institution').value = e.institution || '';
            item.querySelector('.edu-start').value = e.startDate || '';
            item.querySelector('.edu-end').value = e.endDate || '';
            item.querySelector('.edu-description').value = e.description || '';
          }
        }
      });
    }

    if (skills?.length > 0) renderSkills();
    if (langs?.length > 0) renderLanguages();

    updatePreview();
  } catch (e) {
    console.error('Load error:', e);
  }
}

/**
 * Show notification message
 */
function showNotification(msg) {
  const notif = $('autosave-notification');
  notif.textContent = msg;
  notif.style.transform = 'translateY(0)';
  notif.style.opacity = '1';
  setTimeout(() => {
    notif.style.transform = 'translateY(-20px)';
    notif.style.opacity = '0';
  }, 3000);
}

/**
 * Format date string (YYYY-MM to Mon YYYY)
 */
function formatDate(dateStr) {
  if (!dateStr || dateStr === 'Atual') return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}
