# Copilot Instructions – "WizzyWeasel"

## Project Overview
Browser-based SPA learning app for primary-school children. Key priorities: gamification, Offline-First via LocalStorage, and tablet-optimised touch UI.

## Tech Stack
- **Vue.js 3** (Composition API + `<script setup>`)
- **Vite** (build tool)
- **TypeScript**
- **Pinia** + `pinia-plugin-persistedstate` (state & LocalStorage persistence)
- **Tailwind CSS**
- **vue-i18n** (DE/EN, fallback: `de`)
- **Lucide-vue-next** for icons

## Build & Dev Commands
> Commands will follow standard Vite/Vue conventions once the project is scaffolded:

```bash
npm install          # install dependencies
npm run dev          # start dev server
npm run build        # production build
npm run preview      # preview production build
npm run typecheck    # TypeScript check (vue-tsc --noEmit)
npm run lint         # ESLint
```

## Architecture

### Folder Structure
```
src/
├── assets/          # Global styles, fonts, SVGs
├── components/
│   ├── ui/          # Reusable UI primitives (buttons, cards)
│   ├── layout/      # Navbar, FullscreenToggle, ProfileIndicator
│   └── games/       # Game-specific components
├── locales/         # de.json, en.json
├── stores/          # Pinia stores: user.ts, settings.ts, game.ts
├── views/           # Dashboard.vue, GameView.vue, Settings.vue
└── types/           # TypeScript interfaces (User, GameConfig, …)
```

### State & Persistence
- All user data lives in **LocalStorage via Pinia stores** — no backend.
- `user` store: name, avatar, level, XP, stamina.
- `settings` store: locale, sound options, optional OpenAI API key.
- Always use `pinia-plugin-persistedstate` for any store that must survive page reload.

### i18n
- Locale is auto-detected from `navigator.language`; fallback is `de`.
- All user-visible strings go through `vue-i18n` (`t()`). Never hardcode display text.
- Number/currency formatting uses the native `Intl` API.

### UI Conventions
- **Mobile-first, tablet-optimised**: all interactive touch targets ≥ 44×44 px.
- Game views use `100vh`/`100vw` and hide the standard nav.
- Fullscreen toggle in the Navbar uses the browser Fullscreen API (`document.requestFullscreen()`).
- Top-bar layout: logo left, Stamina indicator + profile status right.

## "Direction-Quix" Game Logic
The demo game is a directional-reaction test:
- Prompt modes: **text** ("links", "rechts", "oben", "unten") or **emoji** (⬅️ ➡️ ⬆️ ⬇️).
- Input: arrow keys (desktop) or swipe/on-screen buttons (tablet).
- Difficulty increases each round: random prompt position, colour changes, shrinking time window.
- **Scoring**: correct answer → +XP; wrong answer or timeout → −Stamina.
- Stamina and XP are written to the `user` Pinia store (persisted).

## Playwright / MCP
- Playwright (via the MCP Playwright bridge) can be used to simulate user interactions and take screenshots of the running app for testing and visual checks.
- The app runs locally during development at http://localhost:5173/; use the Playwright MCP tools (Playwright-browser_run_code or Playwright-browser_take_screenshot) to navigate to that URL, set a viewport (e.g., 1280x900), and save a full-page screenshot into the repository (for example: screenshot-localhost-5173.png).

