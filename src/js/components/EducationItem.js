/**
 * Step 4 — Education
 */

export function initStep4Education() {
  document.getElementById('add-education').addEventListener('click', addEducation);
}

function addEducation(prefill = {}) {
  const container = document.getElementById('education-list');
  const idx = container.children.length;

  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.innerHTML = `
    <div class="dynamic-item-header">
      <span class="dynamic-item-title">Educação ${idx + 1}</span>
      <button type="button" class="btn-remove" title="Remover">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Curso / Título *</label>
        <input type="text" class="edu-degree" placeholder="Ex: Análise e Desenvolvimento de Sistemas" value="${prefill.degree || ''}">
      </div>
      <div class="field">
        <label>Instituição *</label>
        <input type="text" class="edu-institution" placeholder="Ex: UNINTER" value="${prefill.institution || ''}">
      </div>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Data de Início</label>
        <input type="month" class="edu-start" value="${prefill.startDate || ''}">
      </div>
      <div class="field">
        <label>Data de Conclusão</label>
        <input type="month" class="edu-end" value="${prefill.endDate || ''}">
      </div>
    </div>
    <div class="field">
      <label>Descrição (opcional)</label>
      <textarea class="edu-description" rows="2" placeholder="Informações adicionais, projetos relevantes...">${prefill.description || ''}</textarea>
    </div>
  `;

  div.querySelector('.btn-remove').addEventListener('click', () => div.remove());
  container.appendChild(div);
}
