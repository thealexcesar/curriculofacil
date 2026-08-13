/**
 * Profession data - sourced from the official CBO (Classificação Brasileira
 * de Ocupações) - public domain. Two files:
 *
 * - data/professions.json: every one of the ~2.460 CBO titles (name only),
 *   for the autocomplete below.
 * - data/profession-suggestions.json: the actual ready-to-use résumé
 *   content (`desc` / `habilidades` / `frases`), hand-written since there's
 *   no dataset for that part. `specific` has a few professions with their
 *   own tailored content; `categories` has one generic-but-still-useful
 *   entry per broad category, as a fallback for everything else.
 *
 * Category matching runs live against whatever text the user typed (see
 * classify() below) - not just against the fixed CBO list - so a close-
 * enough or free-typed title (e.g. "Analista de Desenvolvimento de
 * Sistemas") still gets a suggestion via keyword stems, not just an exact
 * CBO string. Keywords are short stems on purpose, to catch inflections
 * ("desenvolv" matches desenvolvedor, desenvolvimento, desenvolvendo...).
 *
 * Also home to the job-title autocomplete (a hand-rolled dropdown - a
 * native <datalist> was tried first, but its suggestion popup is
 * unreliably positioned by Chromium inside CSS Grid layouts, with no
 * CSS-level fix).
 */

import professions from '../../data/professions.json' with { type: 'json' };
import suggestions from '../../data/profession-suggestions.json' with { type: 'json' };
import {normalize} from '../utils/string-helpers.js';
import {initCombobox} from '../utils/combobox.js';

/** @type {[string, string[]][]} First matching category wins. */
const CATEGORY_KEYWORDS = [
  ['Tecnologia', ['program', 'desenvolv', 'software', 'sistema', 'banco de dados',
    'rede de computador', 'informat', 'suporte tecnico', 'telecomunica', 'devops',
    'tecnologia da informa']],
  ['Saúde', ['enferm', 'medic', 'saude', 'terapeut', 'fisioterap', 'odont', 'farmac',
    'socorr', 'hospital', 'fonoaudi', 'nutri', 'psicolog', 'veterinar',
    'cuidador de idos', 'radiolog', 'laboratorio clinico']],
  ['Comércio e Vendas', ['vend', 'comerci', 'balconista', 'caixa', 'promotor de vend']],
  ['Administração e Escritório', ['administra', 'secretari', 'recepcion', 'escritorio',
    'financeir', 'contab', 'recursos humanos', 'arquivist', 'escritur']],
  ['Construção e Manutenção', ['pedreiro', 'construc', 'eletricist', 'encanador',
    'mecanic', 'manutenc', 'montador', 'marcenei', 'pintor', 'soldador',
    'instalador', 'carpintei', 'telhad']],
  ['Alimentação', ['cozinh', 'garcom', 'confeit', 'padeiro', 'acougueiro', 'chef',
    'aliment', 'barman', 'docei', 'sorvet']],
  ['Educação', ['professor', 'educad', 'instrutor', 'pedagog', 'docente', 'ensino']],
  ['Transporte e Logística', ['motorist', 'entregador', 'estoque', 'almoxarif',
    'logistic', 'transport', 'condutor', 'carregador']],
  ['Serviços Gerais e Cuidados', ['diarista', 'limpeza', 'porteiro', 'seguranc',
    'vigilante', 'cuidador', 'baba', 'jardin', 'zelador', 'faxineir', 'domestic']],
  ['Indústria e Produção', ['operador', 'produc', 'industrial', 'fabric', 'textil',
    'confecc', 'extrusor', 'tecel', 'tingidor', 'fundic', 'usinagem', 'torneiro',
    'caldeireiro']],
];

/**
 * @param {string} normalizedText
 * @returns {string|undefined}
 */
function classify(normalizedText) {
  const found = CATEGORY_KEYWORDS.find(([, keywords]) => keywords.some(kw => normalizedText.includes(kw)));
  return found?.[0];
}

/**
 * Looks up résumé suggestion content for a typed job title. Tries an exact
 * profession match first (most specific), then a broad category guessed
 * from keywords in the text itself. Returns undefined if nothing matches -
 * most titles won't, and that's fine, it's a bonus not a requirement.
 *
 * @param {string} title
 * @returns {{desc: string, habilidades: string[], frases: string[], matchedBy: 'specific'|'category', label: string}|undefined}
 */
export function findProfessionSuggestion(title) {
  const normalized = normalize(title.trim());
  if (!normalized) return undefined;

  const exact = Object.keys(suggestions.specific).find(name => normalize(name) === normalized);
  if (exact) return { ...suggestions.specific[exact], matchedBy: 'specific', label: exact };

  const category = classify(normalized);
  if (category && suggestions.categories[category]) {
    return { ...suggestions.categories[category], matchedBy: 'category', label: category };
  }

  return undefined;
}

/** @returns {void} */
export function initProfessionAutocomplete() {
  const input = document.getElementById('job-title');
  const list = document.getElementById('job-title-suggestions');
  if (!input || !list) return;

  initCombobox(input, list, query => {
    const normalized = normalize(query.trim());
    if (!normalized) return [];
    return professions.filter(p => normalize(p.title).includes(normalized)).map(p => p.title);
  });
}
