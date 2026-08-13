/**
 * Converts a string to title case.
 *
 * @param {string} str
 * @returns {string}
 *
 * @example
 * toTitleCase('maria da silva') // → 'Maria Da Silva'
 */
export function toTitleCase(str) {
  return str.replace(/\w\S*/g, word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

/**
 * Lowercases and strips accents, for accent-insensitive matching.
 *
 * @param {string} str
 * @returns {string}
 *
 * @example
 * normalize('José') // → 'jose'
 */
export function normalize(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}