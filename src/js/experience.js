/**
 * Step 3 — Work experience
 */

function initStep3Experience() {
  document.getElementById('add-experience').addEventListener('click', addExperience);
}

function addExperience(prefill = {}) {
  const container = document.getElementById('experience-list');
  const idx = container.children.length;

  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.innerHTML = `
    <div class="dynamic-item-header">
      <span class="dynamic-item-title">Experiência ${idx + 1}</span>
      <button type="button" class="btn-remove" title="Remover">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Cargo *</label>
        <input type="text" class="exp-title" placeholder="Ex: Desenvolvedor Web" value="${prefill.title || ''}">
      </div>
      <div class="field">
        <label>Empresa *</label>
        <input type="text" class="exp-company" placeholder="Ex: Google" value="${prefill.company || ''}">
      </div>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Data de Início</label>
        <input type="month" class="exp-start" value="${prefill.startDate || ''}">
      </div>
      <div class="field">
        <label>Data de Fim</label>
        <input type="month" class="exp-end" value="${prefill.endDate && prefill.endDate !== 'Atual' ? prefill.endDate : ''}" ${prefill.current ? 'disabled' : ''}>
        <label class="checkbox-label" style="margin-top: 8px;">
          <input type="checkbox" class="exp-current" ${prefill.current ? 'checked' : ''}>
          <span>Trabalho atual</span>
        </label>
      </div>
    </div>
    <div class="field">
      <label>Descrição</label>
      <textarea class="exp-description" rows="3" placeholder="Descreva suas principais responsabilidades e conquistas...">${prefill.description || ''}</textarea>
    </div>
  `;

  div.querySelector('.btn-remove').addEventListener('click', () => div.remove());
  div.querySelector('.exp-current').addEventListener('change', (e) => {
    div.querySelector('.exp-end').disabled = e.target.checked;
    if (e.target.checked) div.querySelector('.exp-end').value = '';
  });

  container.appendChild(div);
}
