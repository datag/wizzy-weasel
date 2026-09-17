# Copilot Instructions – "WizzyWeasel"

## Project Overview
Browser-based SPA learning app for primary-school children. Key priorities: gamification, Offline-First via LocalStorage, and tablet-optimised touch UI.

## Tech Stack
- **Vue.js 3** (Composition API + `<script setup>`)
- **Vite 6** with `@tailwindcss/vite`, `vite-svg-loader` (SVGs imported as components, SVGO disabled)
- **TypeScript**
- **Pinia** + `pinia-plugin-persistedstate` (state & LocalStorage persistence)
- **Tailwind CSS v4**
- **vue-i18n** (DE/EN, fallback: `de`)
- **Lucide-vue-next** for icons

## Commands

```bash
pnpm install          # install dependencies
pnpm run dev          # start dev server (http://localhost:5173/)
pnpm run build        # vue-tsc typecheck + vite build
pnpm run preview      # preview production build
pnpm run typecheck    # vue-tsc --noEmit
pnpm run lint         # ESLint --fix on .vue/.ts/.tsx
```

No test suite exists yet.

## Architecture

### Adding a New Game
Games are registered in **`src/games/index.ts`** as `GameConfig[]`. Each entry has:
- `id`: kebab-case string, also the URL segment (`/game/:id`)
- `titleKey` / `descriptionKey`: i18n keys
- `icon`: emoji, `color`: Tailwind gradient classes (`from-X to-Y`)
- `component`: lazy-loaded via `defineAsyncComponent`

The router resolves `/game/:id` to `GameView.vue`, which looks up the game by `id` and renders its component. To add a game: create `src/components/games/MyGame.vue`, add i18n keys to both locale files, and register it in `src/games/index.ts`.

When adding a new game or substantially changing an existing one, also update the **Games table in `README.md`** so it always lists every registered game.

### State & Persistence
All user data lives in **LocalStorage via Pinia stores** — no backend.

| Store | Key state | Notes |
|---|---|---|
| `user` | `name`, `avatar` (emoji), `level`, `xp`, `boost` (0–5) | `XP_PER_LEVEL = 100`, `XP_PER_CORRECT = 10`; level-up restores full boost |
| `game` | `currentGame`, `round`, `sessionScore`, `bestScore` (per-game record) | Session-scoped; best scores persisted |
| `settings` | locale, sound, optional OpenAI API key | — |
| `mysticalTimesTable` | game-specific progress | separate store |
| `mysticalDivisionOracle` | game-specific progress | separate store |

Always pass `{ persist: true }` as the third argument to `defineStore` for stores that must survive page reload.

### Routes
- Use `createWebHistory(import.meta.env.BASE_URL)` — base URL can be `/` or `/wizzy-weasel/`.
- Routes: `/` → Dashboard, `/game/:id` → GameView, `/settings` → Settings; all others redirect to `/`.

### i18n
- Locale is auto-detected from `navigator.language`; fallback is `de`.
- All user-visible strings go through `vue-i18n` (`t()`). Never hardcode display text.
- Add keys to **both** `src/locales/de.json` and `src/locales/en.json`.

### UI Conventions
- **Mobile-first, tablet-optimised**: all interactive touch targets ≥ 44×44 px.
- Game views use `100dvh`/`100vw` and hide the standard nav.
- Fullscreen toggle in the Navbar uses the browser Fullscreen API via `src/composables/useFullscreen.ts`.
- Top-bar layout: logo left, boost indicator + profile status right.
- Reusable primitives: `AppButton.vue`, `AppCard.vue` in `src/components/ui/`.
- `PauseModal.vue` and `UpdateOverlay.vue` are shared game UI in `src/components/ui/`.

### SVG Assets
SVGs are imported as Vue components via `vite-svg-loader` (SVGO disabled to preserve `id` attributes). Bundesland flag SVGs live in `src/assets/bundeslaender/`.

### Path Alias
`@` resolves to `src/`. Always use `@/` for imports within `src/`.

## Test with browser automation

* You may use MCP for Chrome-Devtools (preferred) or Playwright.
* If you create screenshots for visual inspections, save them to a temporary location – not in the repository.
* The app runs locally during development at http://localhost:5173/. Depending on the task you may set the viewport (desktop, tablet, mobile).
* Use sparingly, as this task is token-intensive. Use it primarily for debugging and verifying complex changes.
