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
- Voice dictation for long text fields (native Web Speech API)
- Native spellcheck on all free-text fields
- Share a text summary of the resume via WhatsApp / the system share sheet
- Fill-in progress bar
- Text size toggle for accessibility
- Auto-save to localStorage
- i18n: 🇧🇷 pt-BR · 🇺🇸 en · 🇩🇪 de
- Mobile toggle: Form / Preview
- "Current job" and "In progress" badge toggles
- Country dial code selector for phone fields
- Skeleton shimmer while fonts load

---

## Tech Stack

```
HTML · CSS (custom properties) · Vanilla JS (ES Modules)
```

No build tools. No frameworks. No npm dependencies. Runs directly on GitHub Pages.

---

## Project Structure

```
curriculofacil/
├── assets/icons/
│   ├── favicon.svg
│   ├── logo.svg
│   └── whatsapp.svg
├── css/style.css
├── js/
│   ├── app.js
│   ├── components/
│   │   ├── cover-letter/
│   │   ├── education/
│   │   ├── experience/
│   │   ├── language/
│   │   ├── phone/
│   │   ├── preview/
│   │   ├── profile-section/
│   │   ├── skill/
│   │   └── toast/
│   ├── services/
│   │   ├── accessibility.service.js
│   │   ├── data-transfer.service.js
│   │   ├── i18n.js
│   │   ├── navigation.service.js
│   │   ├── progress.service.js
│   │   ├── resume-data.service.js
│   │   ├── share.service.js
│   │   ├── state.service.js
│   │   ├── storage.service.js
│   │   ├── validation.service.js
│   │   └── voice-input.service.js
│   └── utils/
│       ├── masks.js
│       └── string-helpers.js
├── locales/
│   ├── pt-BR.json
│   ├── en.json
│   └── de.json
├── package.json
└── index.html
```

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
