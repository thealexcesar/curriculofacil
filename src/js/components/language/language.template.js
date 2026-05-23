import {t} from "../../services/i18n.js";

/** @typedef {'A1'|'A2'|'B1'|'B2'|'C1'|'C2'|'native'} LanguageLevel */

/**
 * @typedef {Object} LanguageData
 * @property {string}        name  - Language name
 * @property {LanguageLevel} level - CEFR level or 'native'
 */


const LANGUAGES = [
  { value: 'arabic',     label: t('languages.arabic')     },
  { value: 'dutch',      label: t('languages.dutch')      },
  { value: 'english',    label: t('languages.english')    },
  { value: 'french',     label: t('languages.french')     },
  { value: 'german',     label: t('languages.german')     },
  { value: 'italian',    label: t('languages.italian')    },
  { value: 'japanese',   label: t('languages.japanese')   },
  { value: 'korean',     label: t('languages.korean')     },
  { value: 'mandarin',   label: t('languages.mandarin')   },
  { value: 'norwegian',  label: t('languages.norwegian')  },
  { value: 'polish',     label: t('languages.polish')     },
  { value: 'portuguese', label: t('languages.portuguese') },
  { value: 'russian',    label: t('languages.russian')    },
  { value: 'spanish',    label: t('languages.spanish')    },
  { value: 'swedish',    label: t('languages.swedish')    },
].sort((a, b) => a.label.localeCompare(b.label));

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native'];

/**
 * @param {Partial<LanguageData>} [data={}]
 * @returns {string}
 */
export function languageTemplate(data = {}) {
  const languageOptions = LANGUAGES
    .map(({ value, label }) => `<option value="${value}" ${data.name === value ? 'selected' : ''}>${label}</option>`)
    .join('');

  const levelOptions = LEVELS
    .map(lvl => `<option value="${lvl}" ${data.level === lvl ? 'selected' : ''}>${t(`field.language.level.${lvl}`)}</option>`)
    .join('');

  return `
    <div class="language-row">
      <select class="lang-name">
        <option value="" disabled ${!data.name ? 'selected' : ''}>${t('field.language.placeholder')}</option>
        ${languageOptions}
      </select>
      <select class="lang-level">
        <option value="" disabled ${!data.level ? 'selected' : ''}>${t('field.language.levelLabel')}</option>
        ${levelOptions}
      </select>
      <button type="button" class="btn-remove" title="${t('btn.remove')}">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
  `;
}
