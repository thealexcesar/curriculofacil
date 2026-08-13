/**
 * Autocomplete suggestions for the job title field, sourced from the
 * official CBO (Classificação Brasileira de Ocupações) - public domain
 * data, see data/professions.json. Uses a native <datalist>, so typing
 * a profession not on the list is always allowed (browser doesn't
 * restrict input to the suggested options).
 */

import professions from '../../data/professions.json' with { type: 'json' };

/** @returns {void} */
export function initProfessionAutocomplete() {
  const datalist = document.getElementById('profession-suggestions');
  if (!datalist) return;

  const fragment = document.createDocumentFragment();
  professions.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    fragment.appendChild(option);
  });
  datalist.appendChild(fragment);
}
