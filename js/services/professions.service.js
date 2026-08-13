/**
 * Autocomplete suggestions for the job title field, sourced from the
 * official CBO (Classificação Brasileira de Ocupações) - public domain
 * data, see data/professions.json.
 *
 * A native <datalist> was tried first but its suggestion popup is
 * unreliably positioned by Chromium inside CSS Grid layouts (the popup
 * can render disconnected from the input) - a long-standing browser
 * bug with no CSS-level fix, so this is a small hand-rolled dropdown
 * instead. Typing a profession not on the list is always allowed;
 * the list is just a suggestion, never a restriction.
 */

import professions from '../../data/professions.json' with { type: 'json' };

const MAX_RESULTS = 8;

/** @returns {void} */
export function initProfessionAutocomplete() {
  const input = document.getElementById('job-title');
  const list = document.getElementById('job-title-suggestions');
  if (!input || !list) return;

  let activeIndex = -1;

  input.addEventListener('input', () => {
    render(matches(input.value));
  });

  input.addEventListener('keydown', event => {
    if (list.hidden) return;

    const items = Array.from(list.children);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive(items, Math.min(activeIndex + 1, items.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(items, Math.max(activeIndex - 1, 0));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      choose(items[activeIndex].textContent);
    } else if (event.key === 'Escape') {
      close();
    }
  });

  input.addEventListener('blur', () => {
    // Delay so a click on an option (which also blurs the input) still registers.
    setTimeout(close, 150);
  });

  /**
   * @param {string} query
   * @returns {string[]}
   */
  function matches(query) {
    const normalized = normalize(query.trim());
    if (!normalized) return [];
    return professions.filter(p => normalize(p).includes(normalized)).slice(0, MAX_RESULTS);
  }

  /**
   * @param {string[]} results
   * @returns {void}
   */
  function render(results) {
    const wasHidden = list.hidden;
    activeIndex = -1;
    list.innerHTML = results
      .map(name => `<li role="option" class="autocomplete-option">${name}</li>`)
      .join('');
    list.hidden = results.length === 0;
    input.setAttribute('aria-expanded', String(results.length > 0));

    // The keyboard covers the bottom half of the screen on mobile, and it's
    // already open by the time the list first appears (input focus happens
    // before typing) - nudge just enough to keep the list visible above it,
    // without a jarring full scroll if it's already in view.
    if (wasHidden && !list.hidden) {
      list.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    list.querySelectorAll('.autocomplete-option').forEach(option => {
      option.addEventListener('mousedown', event => {
        event.preventDefault(); // keep focus on input so the blur-close doesn't race the click
        choose(option.textContent);
      });
    });
  }

  /**
   * @param {HTMLElement[]} items
   * @param {number} index
   * @returns {void}
   */
  function setActive(items, index) {
    items.forEach(item => item.classList.remove('autocomplete-option--active'));
    activeIndex = index;
    items[index]?.classList.add('autocomplete-option--active');
    items[index]?.scrollIntoView({ block: 'nearest' });
  }

  /**
   * @param {string} name
   * @returns {void}
   */
  function choose(name) {
    input.value = name;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    close();
    input.focus();
  }

  /** @returns {void} */
  function close() {
    list.hidden = true;
    list.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
  }
}

/**
 * @param {string} str
 * @returns {string}
 */
function normalize(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
