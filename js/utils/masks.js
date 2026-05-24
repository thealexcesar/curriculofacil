/**
 * Applies Brazilian phone mask to a raw string.
 * Supports landline (10 digits) and mobile (11 digits).
 *
 * @param {string} value - Raw input value
 * @returns {string} Formatted phone string
 *
 * @example
 * applyPhoneMask('11987654321') // → '(11) 98765-4321'
 */
export function applyPhoneMask(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Checks if a phone value has a valid digit count.
 *
 * @param {string} value - Raw or masked phone string
 * @returns {boolean}
 */
export function isValidPhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}
