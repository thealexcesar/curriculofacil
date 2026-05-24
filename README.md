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
- Real-time A4 CV preview
- Export / Print as PDF
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

No build tools. No frameworks. No dependencies. Runs directly on GitHub Pages.

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
│   │   ├── education/
│   │   ├── experience/
│   │   ├── language/
│   │   ├── phone/
│   │   ├── preview/
│   │   ├── profile-section/
│   │   ├── skill/
│   │   └── toast/
│   ├── services/
│   │   ├── i18n.js
│   │   ├── navigation.service.js
│   │   ├── state.service.js
│   │   ├── storage.service.js
│   │   └── validation.service.js
│   └── utils/
│       ├── masks.js
│       └── string-helpers.js
├── locales/
│   ├── pt-BR.json
│   ├── en.json
│   └── de.json
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
| Performance | ~90 |
| Accessibility | 92 |
| Best Practices | 100 |
| SEO | 100 |

---

## License

[MIT](LICENSE)
