/**
 * Returns a debounced wrapper that delays calling `fn` until `wait` ms
 * have passed since the last call - avoids repeating expensive work
 * (full re-render, localStorage write) on every keystroke.
 *
 * @template {(...args: any[]) => void} F
 * @param {F} fn
 * @param {number} wait
 * @returns {F}
 */
export function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
