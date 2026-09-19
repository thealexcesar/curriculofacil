/**
 * PDF text extraction via pdf.js (CDN, loaded on demand). Field/section
 * guessing itself lives in resume-text-extract.service.js.
 */

import {extractResumeFromLines, groupSections} from "./resume-text-extract.service.js";
import {isLinkedInPdf, parseLinkedInExperience} from "./linkedin-pdf-import.service.js";

const PDFJS_VERSION = '4.10.38';
const PDFJS_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.min.mjs`;
const PDFJS_WORKER_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

/** @type {Promise<any> | null} */
let pdfjsLibPromise = null;

/** @returns {Promise<any>} */
function loadPdfjs() {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = import(PDFJS_URL).then(lib => {
      lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
      return lib;
    });
  }
  return pdfjsLibPromise;
}

/**
 * Groups text items into lines by position; a space is only inserted on a
 * real horizontal gap, since pdf.js can split one word into several items.
 *
 * @param {{items: {str: string, transform: number[], width?: number, height?: number}[]}} content
 * @returns {{text: string, height: number}[]}
 */
function linesFromTextContent(content) {
  const lines = [];
  let current = '';
  let currentHeight = 0;
  let lastY = null;
  let lastEndX = null;
  const flush = () => { if (current.trim()) lines.push({text: current.trim(), height: currentHeight}); };
  for (const item of content.items) {
    const [, , , , x, y] = item.transform;
    if (lastY !== null && Math.abs(y - lastY) > 2) {
      flush();
      current = '';
      currentHeight = 0;
      lastEndX = null;
    }
    if (lastEndX !== null && x - lastEndX > (item.height || 5) * 0.25) {
      current += ' ';
    }
    current += item.str;
    currentHeight = Math.max(currentHeight, item.height ?? 0);
    lastEndX = x + (item.width ?? 0);
    lastY = y;
  }
  flush();
  return lines;
}

/**
 * @param {File} file
 * @returns {Promise<{firstPageLines: {text: string, height: number}[], allLines: string[], isLinkedIn: boolean}>}
 */
async function extractLines(file) {
  const pdfjsLib = await loadPdfjs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({data: buffer}).promise;
  let firstPageLines = [];
  const allLines = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const lines = linesFromTextContent(await page.getTextContent());
    if (i === 1) firstPageLines = lines;
    /** "Page N of M" page-footer artifacts, not part of the résumé's actual content. */
    allLines.push(...lines.map(l => l.text).filter(text => !/^page\s+\d+\s+of\s+\d+$/i.test(text)));
  }
  return {firstPageLines, allLines, isLinkedIn: await isLinkedInPdf(pdf)};
}

/**
 * @param {File} file
 * @returns {Promise<{data: Partial<import('./storage.service.js').ResumeData>, isLinkedIn: boolean}>}
 */
export async function importFromPdf(file) {
  const {firstPageLines, allLines, isLinkedIn} = await extractLines(file);
  const data = extractResumeFromLines(allLines, firstPageLines);
  if (isLinkedIn) {
    const experience = parseLinkedInExperience(groupSections(allLines).experience);
    if (experience.length) data.experience = experience;
  }
  return {data, isLinkedIn};
}
