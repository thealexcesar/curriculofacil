/**
 * @typedef {string[]} SkillList
 */

import {skillInputTemplate, chipTemplate} from './skill.template.js';

/** @type {string[]} */
const skills = [];

/** @type {HTMLElement|null} */
let chipsContainer = null;

/** @returns {void} */
export function initStep5Skills() {
  const container = document.getElementById('skill-section');
  container.innerHTML = skillInputTemplate();

  const refs = {
    input:  /** @type {HTMLInputElement} */ (container.querySelector('.skill-input')),
    addBtn: /** @type {HTMLButtonElement} */ (container.querySelector('.skill-add-btn')),
    chips:  /** @type {HTMLElement} */ (container.querySelector('.skill-chips')),
  };

  chipsContainer = refs.chips;

  refs.addBtn.addEventListener('click', () => addSkill(refs));
  refs.input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(refs); }
  });
}

/** @returns {string[]} */
export function getSkillsData() {
  return [...skills];
}

/**
 * Restores skills from saved data.
 *
 * @param {string[]} savedSkills
 * @returns {void}
 */
export function restoreSkills(savedSkills) {
  savedSkills.forEach(value => {
    if (!value || skills.includes(value)) return;
    skills.push(value);
    renderChip(value, chipsContainer);
  });
}

/**
 * @param {{ input: HTMLInputElement, chips: HTMLElement }} refs
 * @returns {void}
 */
function addSkill(refs) {
  const value = refs.input.value.trim();
  if (!value || skills.includes(value)) return;
  skills.push(value);
  renderChip(value, refs.chips);
  refs.input.value = '';
  refs.input.focus();
}

/**
 * @param {string}      skill
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderChip(skill, container) {
  const wrapper = document.createElement('span');
  wrapper.innerHTML = chipTemplate(skill).trim();
  const chip = wrapper.firstChild;

  chip.querySelector('.chip-remove').addEventListener('click', () => {
    skills.splice(skills.indexOf(skill), 1);
    chip.remove();
  });

  container.appendChild(chip);
}