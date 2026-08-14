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
import courses from '../../data/courses.json' with { type: 'json' };
import {normalize} from '../utils/string-helpers.js';
import {initCombobox} from '../utils/combobox.js';

/** @type {[string, string[]][]} First matching category wins. */
const CATEGORY_KEYWORDS = [
  ['Tecnologia', ['program', 'desenvolv', 'software', 'sistema', 'banco de dados',
    'rede de computador', 'informat', 'suporte tecnico', 'telecomunica', 'devops',
    'tecnologia da informa', 'computa']],
  // Checked before "Construção e Manutenção" on purpose: "mecanic" and
  // "eletricist" are keywords there too, but "Engenheiro Mecânico" or
  // "Engenheiro Eletricista" is a different profession (and suggestion tone)
  // than "Mecânico" or "Eletricista" alone - the engineering match has to
  // win first for titles that actually say "engenheiro".
  ['Engenharia', ['engenh']],
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
 * The category guessed from the Step 1 job title, if any - used to give
 * category-relevant defaults elsewhere (experience "Cargo" suggestions,
 * education "Curso" suggestions) without asking the user to pick a
 * category explicitly a second time.
 *
 * @returns {string|undefined}
 */
export function getCurrentProfessionCategory() {
  const jobTitle = document.getElementById('job-title')?.value ?? '';
  return classify(normalize(jobTitle.trim()));
}

/**
 * Suggestions for the experience "Cargo" field: with no query yet, other
 * professions from the user's own category (a fast starting point); once
 * they type, a normal fuzzy search across every profession - a past job
 * can easily be in a different field than the one being applied for now,
 * so typing must never be limited to just the current category.
 *
 * @param {string} query
 * @returns {string[]}
 */
export function suggestCargoOptions(query) {
  const normalized = normalize(query.trim());

  if (!normalized) {
    const category = getCurrentProfessionCategory();
    if (!category) return [];
    return professions
      .filter(p => classify(normalize(p.title)) === category)
      .map(p => p.title);
  }

  return professions.filter(p => normalize(p.title).includes(normalized)).map(p => p.title);
}

/**
 * Suggestions for the education "Curso" field, from the small curated
 * data/courses.json list (there's no public dataset for this, same as the
 * résumé suggestion content). Falls back to every course across all
 * categories if there's no detected category yet, so the field is never
 * just empty for someone who hasn't filled in Step 1 yet.
 *
 * @param {string} query
 * @returns {string[]}
 */
export function suggestCourseOptions(query) {
  const normalized = normalize(query.trim());
  const category = getCurrentProfessionCategory();
  const pool = category ? (courses[category] ?? []) : Object.values(courses).flat();

  if (!normalized) return pool;
  return pool.filter(name => normalize(name).includes(normalized));
}

/**
 * A single ready-to-use bullet phrase for the experience "Descrição"
 * field, picked at random from the current category's whole pool (all 5
 * variants' frases combined, ~15 phrases) so repeat suggestions across
 * different experience entries don't feel identical. Returns undefined
 * if there's no detected category yet.
 *
 * @returns {string|undefined}
 */
export function suggestExperiencePhrase() {
  const category = getCurrentProfessionCategory();
  const variants = category && suggestions.categories[category];
  if (!variants?.length) return undefined;

  const pool = variants.flatMap(v => v.frases);
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Same idea as suggestExperiencePhrase, but for the education "Descrição"
 * field - drawn from a separate pool, since a course description reads
 * nothing like a job responsibility ("Formação com..." vs "Realizei...").
 *
 * @returns {string|undefined}
 */
export function suggestEducationPhrase() {
  const category = getCurrentProfessionCategory();
  const pool = category && suggestions.educationPhrases[category];
  if (!pool?.length) return undefined;

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Looks up résumé suggestion content for a typed job title. Tries an exact
 * profession match first (most specific), then a broad category guessed
 * from keywords in the text itself. Returns undefined if nothing matches -
 * most titles won't, and that's fine, it's a bonus not a requirement.
 *
 * Category suggestions pick a random variant out of a small pool (5 per
 * category) instead of always the same one - candidates applying to the
 * same job from the same broad category (e.g. two "Auxiliar de Produção"
 * applicants) shouldn't end up submitting identical résumé text.
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
  const variants = category && suggestions.categories[category];
  if (variants?.length) {
    const variant = variants[Math.floor(Math.random() * variants.length)];
    return { ...variant, matchedBy: 'category', label: category };
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
