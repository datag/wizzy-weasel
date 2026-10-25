# WizzyWeasel 🦡

> **Vibe Coding project** — almost entirely and intentionally built with minimum effort for acceptable results. Don't expect production-grade engineering here.

A browser-based learning game app for primary-school children. Offline-first, tablet-friendly, and gamified — kids earn XP, level up, and lose boost charges when they make mistakes.

**Live demo:** https://datag.is-a.dev/wizzy-weasel/

---

## Games

| Game | Topic |
|---|---|
| 🧭 Direction-Quix | React to directional prompts (text or emoji) as fast as possible |
| 📝 Missing Letter | Fill in the missing letter to complete a word |
| 🔮 Mystical Times Table | Multiplication practice |
| ✨ Mystical Division Oracle | Division practice |
| 💻 IT Hardware Quiz | Identify computer hardware components |
| 🗺️ Bundesländer-Quiz | German federal states — map and names |
| 🕰️ Clock Detective | Read analog clocks |
| 🕵️ Language Detective | Identify the language of a sentence |
| 🚂 Sequence Train | Continue number and shape sequences |
| 🦁 Wortarten-Safari | German sentence endings, capitalization, and word classes |
| 🏴‍☠️ Präfix-Piraten | Prefix guessing game — German, Latin, Greek prefixes (DE/EN datasets) |


---

## Tech Stack

- **Vue 3** (Composition API + `<script setup>`) + **TypeScript**
- **Vite 6** · **Tailwind CSS v4** · **vue-i18n** (DE/EN)
- **Pinia** + `pinia-plugin-persistedstate` — all state in LocalStorage, no backend
- Deployed to **GitHub Pages** via GitHub Actions on push to `main`

---

## Getting Started

Requires [Node.js](https://nodejs.org/) 24+ and [pnpm](https://pnpm.io/) 10.

```bash
pnpm install
pnpm run dev        # http://localhost:5173/
```

Other commands:

```bash
pnpm run build      # typecheck + production build
pnpm run preview    # preview the production build locally
pnpm run typecheck  # vue-tsc --noEmit
pnpm run lint       # ESLint (auto-fix)
```

---

## Configuration

The footer (contact address and links to the privacy policy) is controlled by
build-time environment variables. Both are optional — the corresponding part of
the footer is only rendered when its variable is set.

| Variable | Purpose | Example |
|---|---|---|
| `APP_OPERATOR_MAIL` | Contact address of the operator, rendered as a `mailto:` link | `operator@example.com` |
| `APP_PRIVACY_POLICY_URL` | Base URL of the bilingual privacy policy; the footer links to the language sections via the anchors `#de` and `#en` | `https://www.example.com/privacy` |

The privacy policy page must provide both anchors (`#de` and `#en`).

**Locally:** copy the example file and adjust the values — `.env.local` is git-ignored.

```bash
cp .env.example .env.local
```

**In CI:** the values come from the repository variables
(*Settings → Secrets and variables → Actions → Variables*). They are public
values, so they are stored as variables and not as secrets.
`.github/workflows/gh-pages.yml` passes them to the build step.

---

## Deployment

Pushes to `main` automatically build and deploy to GitHub Pages. The build passes `--base=/<repo-name>/` so the app works under the GitHub Pages subdirectory. A `404.html` is generated to handle direct URL access.

---

## License

Released under the [MIT License](./LICENSE.md). Attribution required.
