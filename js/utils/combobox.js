/**
 * Wires a text input + a sibling <ul class="autocomplete-list"> into a
 * simple combobox: type to filter, click/Enter to pick a suggestion,
 * arrow keys to navigate, Escape to close. Typing something not on the
 * list is always allowed - the list only ever suggests, never restricts.
 *
 * Shared by the job title (professions.service.js) and language name
 * (language.component.js) fields.
 */

const MAX_RESULTS = 8;

/**
 * @param {HTMLInputElement} input
 * @param {HTMLElement} list
 * @param {(query: string) => string[]} getSuggestions - Already filtered/sorted; only the first MAX_RESULTS are shown.
 * @returns {void}
 */
export function initCombobox(input, list, getSuggestions) {
  let activeIndex = -1;

  input.addEventListener('input', () => {
    // A field can be set programmatically (e.g. restoring saved data) - that
    // shouldn't pop this open on its own, only genuine typing should.
    if (document.activeElement !== input) return;
    render(getSuggestions(input.value).slice(0, MAX_RESULTS));
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
