const STORAGE_KEY = 'curriculofacil_v1';

/**
 * @typedef {Object} ResumeData
 * @property {Object}   personal   - Personal info fields
 * @property {string}   profile    - Professional profile text
 * @property {Object[]} experience - Work experience items
 * @property {Object[]} education  - Education items
 * @property {string[]} skills     - Skill chips
 * @property {Object[]} languages  - Language rows
 */

/**
 * Saves resume data to localStorage.
 *
 * @param {Partial<ResumeData>} data
 * @returns {void}
 */
export function saveResume(data) {
  const existing = loadResume();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...data }));
}

/**
 * Loads resume data from localStorage.
 *
 * @returns {Partial<ResumeData>}
 */
export function loadResume() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

/**
 * Clears all saved resume data from localStorage.
 *
 * @returns {void}
 */
export function clearResume() {
  localStorage.removeItem(STORAGE_KEY);
}
