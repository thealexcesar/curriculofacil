/** LinkedIn's "Save to PDF" export is metadata-identifiable and has a fixed layout - parsed with higher confidence than the generic importer. */

const MONTH = '(?:jan(?:eiro)?|fev(?:ereiro)?|mar(?:ço)?|abr(?:il)?|mai(?:o)?|jun(?:ho)?|jul(?:ho)?|ago(?:sto)?|set(?:embro)?|out(?:ubro)?|nov(?:embro)?|dez(?:embro)?|january|february|march|april|may|june|july|august|september|october|november|december)';
const DATE_TOKEN = `(${MONTH})\\.?\\s*de\\s*(\\d{4})`;
const DATE_RANGE_RE = new RegExp(`^${DATE_TOKEN}\\s*[-–]\\s*(?:${DATE_TOKEN}|present|atual(?:mente)?)\\s*\\([^)]*\\)$`, 'i');
const DURATION_ONLY_RE = /^\d+\s*anos?(\s*e?\s*\d+\s*mes(?:es)?)?$|^\d+\s*mes(?:es)?$/i;

const MONTH_NUM = {
  jan: 1, feb: 2, fev: 2, mar: 3, apr: 4, abr: 4, may: 5, mai: 5, jun: 6, jul: 7,
  aug: 8, ago: 8, sep: 9, set: 9, oct: 10, out: 10, nov: 11, dec: 12, dez: 12,
};

/**
 * @param {any} pdf - pdf.js document proxy
 * @returns {Promise<boolean>}
 */
export async function isLinkedInPdf(pdf) {
  const meta = await pdf.getMetadata().catch(() => null);
  return meta?.info?.Author === 'LinkedIn';
}

/** @returns {boolean} whether lines[idx] is itself a role (same company as before) */
function isRoleAhead(lines, idx) {
  return DATE_RANGE_RE.test((lines[idx + 1] ?? '').trim());
}

/** @returns {boolean} whether lines[idx] looks like a new company name */
function isCompanyAhead(lines, idx) {
  const afterMaybeDuration = DURATION_ONLY_RE.test(lines[idx + 1] ?? '') ? idx + 2 : idx + 1;
  return DATE_RANGE_RE.test((lines[afterMaybeDuration + 1] ?? '').trim());
}

/** @returns {{startDate: string, endDate: string, current: boolean}} */
function parseDateRange(dateLine) {
  const match = dateLine.match(DATE_RANGE_RE);
  if (!match) return {startDate: '', endDate: '', current: false};
  const [, m1, y1, m2, y2] = match;
  const toYm = (m, y) => `${y}-${String(MONTH_NUM[m.toLowerCase().slice(0, 3)] ?? 1).padStart(2, '0')}`;
  return {startDate: toYm(m1, y1), endDate: m2 ? toYm(m2, y2) : '', current: !m2};
}

/**
 * Known limitation: when a role has a multi-line description before the
 * next role at the SAME company, there is no text pattern to tell that
 * description apart from a genuine new company name - that case gets a
 * wrong `company`. Everything else (title, dates, description) stays right.
 *
 * @param {string[]} lines - lines of the "Experiência"/"Experience" section only
 * @returns {{title: string, company: string, startDate: string, endDate: string, current: boolean, description: string}[]}
 */
export function parseLinkedInExperience(lines) {
  if (!lines.length) return [];
  const entries = [];
  let i = 0;
  let company = (lines[i] ?? '').trim();
  i++;
  if (DURATION_ONLY_RE.test(lines[i] ?? '')) i++;

  while (i < lines.length) {
    const title = (lines[i] ?? '').trim();
    const dateLine = (lines[i + 1] ?? '').trim();
    if (!DATE_RANGE_RE.test(dateLine)) break;
    const location = (lines[i + 2] ?? '').trim();
    let j = i + 3;
    const desc = [];
    while (j < lines.length && !isRoleAhead(lines, j) && !isCompanyAhead(lines, j)) {
      desc.push(lines[j]);
      j++;
    }
    entries.push({
      company,
      title,
      ...parseDateRange(dateLine),
      description: [location, desc.join('\n')].filter(Boolean).join('\n').trim(),
    });

    if (j >= lines.length) break;
    if (isRoleAhead(lines, j)) {
      i = j;
      continue;
    }
    company = (lines[j] ?? '').trim();
    i = j + 1;
    if (DURATION_ONLY_RE.test(lines[i] ?? '')) i++;
  }
  return entries;
}
