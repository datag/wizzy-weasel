# WizzyWeasel 🦡

> **Vibe Coding project** — almost entirely and intentionally built with minimum effort for acceptable results. Don't expect production-grade engineering here.

A browser-based learning game app for primary-school children. Offline-first, tablet-friendly, and gamified — kids earn XP, level up, and lose boost charges when they make mistakes.

**Live demo:** https://datag.github.io/wizzy-weasel/

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

## Deployment

Pushes to `main` automatically build and deploy to GitHub Pages. The build passes `--base=/<repo-name>/` so the app works under the GitHub Pages subdirectory. A `404.html` is generated to handle direct URL access.

---

## License

Do whatever you want with it.
