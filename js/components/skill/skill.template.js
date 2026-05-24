import {t} from "../../services/i18n.js";

/**
 * Template for the skill input row.
 * Chips are rendered separately via chipTemplate().
 *
 * @returns {string}
 */
export function skillInputTemplate() {
  return `
    <div class="skill-input-row">
      <input type="text" class="skill-input" placeholder="${t('field.skill.placeholder')}">
      <button type="button" class="btn btn-sm btn-primary skill-add-btn">
        ${t('btn.add', { item: t('field.skill.label') })}
      </button>
    </div>
    <div class="skill-chips"></div>
  `;
}

/**
 * Template for a single skill chip.
 *
 * @param {string} skill
 * @returns {string}
 */
export function chipTemplate(skill) {
  return `
    <span class="chip chip-primary">
      ${skill}
      <button type="button" class="chip-remove" title="${t('btn.remove')}">
        <span class="material-symbols-outlined">close</span>
      </button>
    </span>
  `;
}
