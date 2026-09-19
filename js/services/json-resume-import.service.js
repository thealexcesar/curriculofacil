/** Maps the open JSON Resume schema (jsonresume.org) onto this app's data shape - 1:1, no guessing. */

/**
 * @param {any} data - parsed JSON
 * @returns {boolean} whether this looks like a JSON Resume document
 */
export function isJsonResume(data) {
  return Boolean(data && typeof data === 'object' && data.basics && typeof data.basics === 'object');
}

/**
 * @param {any} data - a JSON Resume document (see isJsonResume)
 * @returns {Partial<import('./storage.service.js').ResumeData>}
 */
export function fromJsonResume(data) {
  const basics = data.basics ?? {};
  const location = [basics.location?.city, basics.location?.region].filter(Boolean).join(', ');

  const personal = {
    name: basics.name ?? '',
    jobTitle: basics.label ?? '',
    email: basics.email ?? '',
    phone: basics.phone ?? '',
    location,
    linkedin: (basics.profiles ?? []).find(p => /linkedin/i.test(p.network ?? ''))?.url ?? '',
    website: basics.url ?? '',
  };

  const experience = (data.work ?? []).map(job => ({
    title: job.position ?? '',
    company: job.name ?? job.company ?? '',
    startDate: (job.startDate ?? '').slice(0, 7),
    endDate: (job.endDate ?? '').slice(0, 7),
    current: !job.endDate,
    description: [job.summary, ...(job.highlights ?? [])].filter(Boolean).join('\n'),
  }));

  const education = (data.education ?? []).map(edu => ({
    degree: [edu.studyType, edu.area].filter(Boolean).join(' - '),
    institution: edu.institution ?? '',
    startDate: (edu.startDate ?? '').slice(0, 7),
    endDate: (edu.endDate ?? '').slice(0, 7),
  }));

  const skills = (data.skills ?? []).flatMap(s => s.keywords?.length ? s.keywords : [s.name].filter(Boolean));

  const languages = (data.languages ?? []).map(l => ({name: l.language ?? '', level: l.fluency ?? ''}));

  return {
    personal,
    profile: basics.summary ?? '',
    experience,
    education,
    skills,
    languages,
  };
}
