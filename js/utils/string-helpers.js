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