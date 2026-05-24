/**
 * @template T
 * @typedef {Object} State
 * @property {() => T} get
 * @property {(value: T) => void} set
 * @property {(fn: (value: T) => void) => void} subscribe
 */

/**
 * Creates a reactive state atom.
 *
 * @template T
 * @param {T} initialValue - Initial state value
 * @returns {State<T>}
 */
export function createState(initialValue) {
  let value = initialValue;
  const subscribers = [];

  return {
    get: () => value,

    set: (newValue) => {
      value = newValue;
      subscribers.forEach(fn => fn(value));
    },

    subscribe: (fn) => {
      subscribers.push(fn);
    },
  };
}
