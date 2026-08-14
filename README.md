# Currículo Fácil

> Build your professional resume in minutes — free, no sign-up, no server.

🔗 **[Live Demo](https://thealexcesar.github.io/curriculofacil/)**

---

## About

Currículo Fácil is a browser-only SPA. No data is sent to any server — everything is saved locally on the user's device.

Built as part of **Atividade Extensionista I** — Systems Analysis and Development, UNINTER.

---

## Features

- 5-step guided form
- Real-time A4 CV preview, in a Classic or Modern template with a 9-color picker
- Export / Print as PDF
- Export / import resume data as a JSON file
- Cover letter with an auto-generated draft, printed separately from the resume
- Personal documents: CNH category, plus a collapsible block for RG, CPF and título de eleitor
- Profession-based résumé suggestions - autocomplete over ~2,460 CBO occupations, with a ready-to-edit summary/skills/bullet-point suggestion for common professions (or their broad category as a fallback)
- One-click "×" to clear any text field or textarea, instead of deleting character by character
- Voice dictation for long text fields (native Web Speech API)
- Native spellcheck on all free-text fields
- Share a text summary of the resume via WhatsApp / the system share sheet
- Fill-in progress bar
- Text size toggle for accessibility
- Auto-save to localStorage
- pt-BR only - the personal documents are Brazil-specific and don't translate meaningfully
- Mobile toggle: Form / Preview
- "Current job" and "In progress" badge toggles

---

## Tech Stack

```
HTML · CSS (custom properties) · Vanilla JS (ES Modules)
```

No build tools. No frameworks. No npm dependencies. Runs directly on GitHub Pages.

---

## Architecture

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

---

## Lighthouse Scores

| Metric | Score |
|---|---|
| Performance | 95 |
| Accessibility | 94 |
| Best Practices | 78 |
| SEO | 100 |

_Best Practices is dragged down by missing security headers (CSP, HSTS) that only apply once deployed over HTTPS — not meaningful on `localhost`._

---

## License

[MIT](LICENSE)
