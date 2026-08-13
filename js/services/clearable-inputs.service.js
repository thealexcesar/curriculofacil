/**
 * Adds an "×" button to text-like fields so the user can clear the whole
 * value in one click instead of deleting character by character. Scoped to
 * `.field > input[...]` and `.field > textarea` (name, job title, e-mail,
 * location, LinkedIn, RG, CPF, título de eleitor, profile summary, cover
 * letter, and any dynamically added experience/education field, since
 * those follow the same markup) - fields with their own different layout
 * (phone entry, skill input, language row) aren't wrapped here, that would
 * fight their existing inline controls.
 *
 * Textareas with voice dictation already have a mic button at the bottom
 * right (see voice-input.service.js) - the clear button sits at the top
 * right instead, so the two never overlap.
 *
 * A MutationObserver picks up fields added later (new experience/education
 * items, restored data) - no per-component wiring needed.
 */

const CLEARABLE_SELECTOR = '.field > input[type="text"], .field > input[type="email"], .field > input[type="tel"], .field > input[type="url"], .field > textarea';

/** @returns {void} */
export function initClearableInputs() {
  document.querySelectorAll(CLEARABLE_SELECTOR).forEach(wrapWithClearButton);

  new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches(CLEARABLE_SELECTOR)) wrapWithClearButton(node);
        node.querySelectorAll?.(CLEARABLE_SELECTOR).forEach(wrapWithClearButton);
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
}

/**
 * @param {HTMLInputElement|HTMLTextAreaElement} input
 * @returns {void}
 */
function wrapWithClearButton(input) {
  const wrap = document.createElement('span');
  wrap.className = 'input-clear-wrap';
  input.replaceWith(wrap);
  wrap.appendChild(input);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'input-clear-btn';
  btn.setAttribute('aria-label', 'Limpar campo');
  btn.hidden = !input.value;
  btn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-close"></use></svg>';

  btn.addEventListener('click', () => {
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  });

  input.addEventListener('input', () => { btn.hidden = !input.value; });

  wrap.appendChild(btn);
}
