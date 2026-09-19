/**
 * Best-effort résumé extraction shared by PDF and .txt/.md import - pattern
 * matching on section headers, not "intelligent reading" (same limits as a
 * real ATS parser). Company/role/date aren't split into separate fields:
 * each section becomes one entry with the raw text in `description`.
 */

import {applyPhoneMask, applyCpfMask} from "../utils/masks.js";

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
/** Dots required - without them this also matches an 11-digit phone number. */
const CPF_RE = /\d{3}\.\d{3}\.\d{3}-?\d{2}/;
const PHONE_RE = /\(?\d{2}\)?[\s.-]*\d{4,5}[\s.-]*\d{4}\b/;
const NAME_LINE_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ'.\s-]{4,60}$/;
const LINKEDIN_URL_RE = /(?:https?:\/\/)?(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_%]+/i;

const LANGUAGE_LEVEL_RE = /\b(A1|A2|B1|B2|C1|C2|nativ[oa]|native|fluente|fluent|básico|basico|basic|intermediári[oa]|intermediate|avançado|avancado|advanced)\b/i;

const SECTION_KEYWORDS = {
  profile: ['perfil', 'resumo', 'sobre mim', 'sobre', 'summary', 'about', 'objetivo', 'objective'],
  experience: ['experiência', 'experiencia', 'experience', 'emprego'],
  education: ['formação', 'formacao', 'educação', 'educacao', 'education', 'acadêmica', 'academica'],
  skills: ['habilidades', 'competências', 'competencias', 'skills'],
  languages: ['idiomas', 'línguas', 'linguas', 'languages'],
};

/** Headers this app has no field for - kept out of whatever section came before them. */
const IGNORED_HEADER_KEYWORDS = [
  'contato', 'contact', 'certifications', 'certificações', 'certificacoes',
  'projetos', 'projects', 'referências', 'referencias', 'references',
  'publicações', 'publicacoes', 'publications', 'prêmios', 'premios', 'honors', 'awards',
  'cursos', 'interesses', 'interests', 'voluntariado', 'volunteering', 'licenças', 'licencas', 'licenses',
];

/**
 * @param {string} line
 * @returns {string | null | undefined} section key, null for a recognized-
 *   but-unmapped header (resets current section), undefined for body text
 */
function matchSectionHeader(line) {
  const normalized = line.toLowerCase().trim();
  if (!normalized) return undefined;
  /** Undoes letter-spaced headers ("P E R F I L" -> "perfil") for matching and the length gate below. */
  const compact = normalized.replace(/\s+/g, '');
  if (compact.length > 30) return undefined;
  const matches = keyword => normalized.includes(keyword) || compact.includes(keyword.replace(/\s+/g, ''));
  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (keywords.some(matches)) return section;
  }
  if (IGNORED_HEADER_KEYWORDS.some(matches)) return null;
  return undefined;
}

/**
 * @param {string[]} lines
 * @returns {Record<'profile'|'experience'|'education'|'skills'|'languages', string[]>}
 */
export function groupSections(lines) {
  const sections = {profile: [], experience: [], education: [], skills: [], languages: []};
  let current;
  for (const line of lines) {
    const match = matchSectionHeader(line);
    if (match !== undefined) {
      current = match;
      continue;
    }
    if (current) sections[current].push(line);
  }
  return sections;
}

/** @returns {string | undefined} */
function buildProfile(lines) {
  const text = lines.join(' ').replace(/\s+/g, ' ').trim();
  return text || undefined;
}

/**
 * No reliable delimiter in some templates, so a long line is split on
 * whitespace as a last resort - can shred a multi-word skill.
 *
 * @param {string[]} lines
 * @returns {string[]}
 */
function buildSkills(lines) {
  const skills = [];
  for (const line of lines) {
    if (/[,;·|]/.test(line)) {
      skills.push(...line.split(/[,;·|]/));
    } else if (line.split(/\s+/).filter(Boolean).length <= 3) {
      skills.push(line);
    } else {
      skills.push(...line.split(/\s+/));
    }
  }
  return skills.map(s => s.trim()).filter(Boolean);
}

/**
 * @param {string[]} lines
 * @returns {{name: string, level: string}[]}
 */
function buildLanguages(lines) {
  return lines
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const level = line.match(LANGUAGE_LEVEL_RE);
      if (!level) return {name: line, level: ''};
      const name = line.slice(0, level.index).trim().replace(/[-:,]+$/, '');
      return {name: name || line, level: level[0]};
    });
}

/**
 * @param {string[]} lines
 * @returns {{description: string}[]}
 */
function buildSingleEntry(lines) {
  const description = lines.join('\n').trim();
  return description ? [{description}] : [];
}

/**
 * @param {string[]} allLines - every line in the document, in order
 * @param {{text: string, height: number}[]} [firstPageLines] - PDF only, for font-size name detection
 * @returns {Partial<import('./storage.service.js').ResumeData>}
 */
export function extractResumeFromLines(allLines, firstPageLines) {
  const text = allLines.join('\n');
  const personal = {};

  const email = text.match(EMAIL_RE);
  if (email) personal.email = email[0];

  const cpf = text.match(CPF_RE);
  if (cpf) personal.cpf = applyCpfMask(cpf[0]);

  const phone = text.match(PHONE_RE);
  if (phone) personal.phone = applyPhoneMask(phone[0]);

  const linkedin = text.match(LINKEDIN_URL_RE);
  if (linkedin) personal.linkedin = linkedin[0].startsWith('http') ? linkedin[0] : `https://${linkedin[0]}`;

  /** Biggest text on page 1 is the name; no font size (plain text) falls back to the first name-shaped line. */
  const name = firstPageLines
    ? firstPageLines.filter(l => NAME_LINE_RE.test(l.text)).sort((a, b) => b.height - a.height)[0]?.text
    : allLines.slice(0, 5).find(l => NAME_LINE_RE.test(l));
  if (name) personal.name = name;

  /** Job title/headline is almost always the line right after the name. */
  const nextLine = name ? (allLines[allLines.indexOf(name) + 1] ?? '').trim() : '';
  if (nextLine && nextLine.length <= 80 && matchSectionHeader(nextLine) === undefined &&
      !EMAIL_RE.test(nextLine) && !PHONE_RE.test(nextLine) && !LINKEDIN_URL_RE.test(nextLine)) {
    personal.jobTitle = nextLine;
  }

  const sections = groupSections(allLines);
  const result = {};
  if (Object.keys(personal).length) result.personal = personal;

  const profile = buildProfile(sections.profile);
  if (profile) result.profile = profile;

  const experience = buildSingleEntry(sections.experience);
  if (experience.length) result.experience = experience;

  const education = buildSingleEntry(sections.education);
  if (education.length) result.education = education;

  const skills = buildSkills(sections.skills);
  if (skills.length) result.skills = skills;

  const languages = buildLanguages(sections.languages);
  if (languages.length) result.languages = languages;

  return result;
}
