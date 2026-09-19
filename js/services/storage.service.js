const STORAGE_KEY = 'curriculofacil_v1';

/**
 * @typedef {Object} ResumeData
 * @property {Object}   personal   - Personal info fields
 * @property {string}   profile    - Professional profile text
 * @property {Object[]} experience - Work experience items
 * @property {Object[]} education  - Education items
 * @property {string[]} skills     - Skill chips
 * @property {Object[]} languages  - Language rows
 * @property {Object[]} extraPhones - Additional phone entries
 * @property {Object}   coverLetter - Cover letter company + body
 */

/**
 * Saves resume data to localStorage. The photo (a base64 data URL) is by far
 * the biggest field - if it pushes the save past the browser's per-origin
 * quota, it's dropped so the rest of the resume still saves instead of
 * silently losing everything.
 *
 * @param {Partial<ResumeData>} data
 * @returns {boolean} true if the photo had to be dropped to fit the save
 */
export function saveResume(data) {
  const existing = loadResume();
  const merged = { ...existing, ...data };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return false;
  } catch {
    const { photo, ...personal } = merged.personal ?? {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...merged, personal }));
    return true;
  }
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
