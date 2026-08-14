import {t} from "../../services/i18n.js";

/** @typedef {'A1'|'A2'|'B1'|'B2'|'C1'|'C2'|'native'} LanguageLevel */

/**
 * @typedef {Object} LanguageData
 * @property {string} name - Language name, typed or picked from suggestions
 * @property {LanguageLevel} level - CEFR level or 'native'
 */

/** The suggestion list is intentionally short - most common languages for
 * a Brazilian résumé. Anything else can still be typed freely. */
export const LANGUAGE_SUGGESTIONS = [
  'portuguese', 'english', 'spanish', 'german', 'french',
  'italian', 'chinese', 'japanese', 'russian', 'arabic',
].map(key => t(`languages.${key}`));

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native'];

/**
 * @param {Partial<LanguageData>} [data={}]
 * @returns {string}
 */
export function languageTemplate(data = {}) {
  const levelOptions = LEVELS
    .map(lvl => `<option value="${lvl}" ${data.level === lvl ? 'selected' : ''}>${t(`field.language.level.${lvl}`)}</option>`)
    .join('');

  return `
    <div class="language-row">
      <div class="lang-name-wrap">
        <input type="text" class="lang-name" placeholder="${t('field.language.placeholder')}"
          value="${data.name ?? ''}" autocomplete="off" spellcheck="true" autocorrect="on">
        <ul class="autocomplete-list lang-name-suggestions" role="listbox" hidden></ul>
      </div>
      <select class="lang-level">
        <option value="" disabled ${!data.level ? 'selected' : ''}>${t('field.language.levelLabel')}</option>
        ${levelOptions}
      </select>
      <button type="button" class="btn-remove" title="${t('btn.remove')}">
        <svg class="icon" aria-hidden="true"><use href="#icon-close"></use></svg>
      </button>
    </div>
  `;
}
