/** Portuguese prepositions/articles that stay lowercase in a title, unless
 * they're the first word (e.g. a person literally named "Dos Santos"). */
const LOWERCASE_WORDS = new Set([
  'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'a', 'o', 'as', 'os',
  'com', 'para', 'por', 'no', 'na', 'nos', 'nas',
]);

/**
 * Converts a string to title case, keeping Portuguese prepositions/articles
 * lowercase (except as the first word) - "maria da silva" shouldn't become
 * "Maria Da Silva".
 *
 * @param {string} str
 * @returns {string}
 *
 * @example
 * toTitleCase('maria da silva') // → 'Maria da Silva'
 * toTitleCase('auxiliar de produção') // → 'Auxiliar de Produção'
 */
export function toTitleCase(str) {
  return str.replace(/\w\S*/g, (word, offset) => {
    const lower = word.toLowerCase();
    if (offset > 0 && LOWERCASE_WORDS.has(lower)) return lower;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
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