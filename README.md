# 📄 Currículo Fácil

> Build a professional resume in minutes — free, no sign-up, no server.

[![Live Demo](https://img.shields.io/badge/demo-curriculo.facil.cc-1e3a8a?style=flat-square)](https://curriculo.facil.cc/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![No backend](https://img.shields.io/badge/backend-none-16a34a?style=flat-square)](#-why-curr%C3%ADculo-f%C3%A1cil)
[![Releases](https://img.shields.io/badge/releases-tags-6b7280?style=flat-square)](https://github.com/thealexcesar/curriculofacil/tags)

**[curriculo.facil.cc →](https://curriculo.facil.cc/)**

---

## 🎯 Why Currículo Fácil?

- 🔒 **Your data never leaves your device.** No account, no upload, no tracking — everything is saved locally in the browser.
- ⚡ **From blank page to finished PDF in minutes.** A guided 5-step form instead of a scary empty document.
- 🆓 **Completely free, no catch.** No paywall, no "unlock this template" gimmick.
- 🎨 **Looks professional without any design skill.** Three ready-made templates, live A4 preview as you type.
- 📥 **Already have a résumé somewhere else?** Import it straight from a PDF, a LinkedIn export, `.txt`/`.md`, or the open JSON Resume standard — no retyping from scratch.

---

## ✨ Features

### Building the résumé
- 📝 5-step guided form (personal info, profile, experience, education, skills & languages)
- 💼 Profession-based suggestions — autocomplete over ~2,460 CBO occupations, with a ready-to-edit summary/skills/bullet-point suggestion for common professions (or a broad category as fallback)
- 🎙️ Voice dictation on long text fields (native Web Speech API), plus native spellcheck everywhere
- 🏷️ "Current job" / "In progress" badge toggles, multiple phone numbers, extra skills and languages
- ❌ One-click "×" to clear any field instead of deleting character by character
- 📊 Fill-in progress bar and a text-size toggle for accessibility

### Preview, export & import
- 👀 Real-time A4 preview in a Classic, Modern or Executive (sidebar) template, with a custom accent color picker
- 🖨️ Export / print as a finished PDF
- ✉️ Auto-generated cover letter draft, printed as its own document
- 📤 Import from a previously exported `.json`, the open [JSON Resume](https://jsonresume.org/) standard, a `.pdf`, or a plain `.txt`/`.md` file — best-effort extraction of contact info, profile, experience, education, skills and languages
- 🔗 PDFs exported from LinkedIn are detected via PDF metadata and get a higher-confidence, structured experience list (company, role, dates)
- 🖱️ Drag-and-drop import anywhere on the page, or the regular file picker
- 📲 Share a text summary of the résumé via WhatsApp / the system share sheet

### Built for how it's actually used
- 💾 Auto-save to `localStorage` — safe to close the tab mid-fill and pick up later
- 📱 Mobile-first, with a Form/Preview toggle on narrow screens
- 🪪 Personal documents section (CNH category, RG, CPF, título de eleitor) with an explicit warning against sharing them with job listings that shouldn't need them
- 🇧🇷 pt-BR only, on purpose — the personal documents are Brazil-specific and don't translate meaningfully

---

## 🧱 Tech Stack

```
HTML · CSS (custom properties) · Vanilla JS (ES Modules)
```

No build tools. No frameworks. No npm dependencies — the one exception is [pdf.js](https://mozilla.github.io/pdf.js/), loaded from a CDN on demand only when a PDF is imported. Runs directly on GitHub Pages.

## 🏗️ Architecture

Components follow a factory pattern with a `{ element, getData, destroy }` interface:

```js
function createExperience(index, initialData = {}) {
  const element = document.createElement('div');
  element.innerHTML = experienceTemplate(index, initialData);
  // ...
  return { element, getData, destroy };
}
```

Reactive state via `createState()` with `.subscribe()`. i18n via `t('key')` for dynamic content and `translateDOM()` for static DOM.

## 🚦 Lighthouse Scores

| Metric | Score |
|---|---|
| Performance | 100 |
| Accessibility | 98 |
| Best Practices | 100 |
| SEO | 100 |

_Best Practices is dragged down by missing security headers (CSP, HSTS) that only apply once deployed over HTTPS — not meaningful on `localhost`._

---

## 📄 License

[MIT](LICENSE)
