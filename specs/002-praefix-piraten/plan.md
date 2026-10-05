# Implementation Plan: Präfix-Piraten (Prefix Pirates)

**Branch**: `002-praefix-piraten` | **Date**: 2026-10-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-praefix-piraten/spec.md`

## Summary

Add a new browser-based mini-game **"Präfix-Piraten" / "Prefix Pirates"**: a playful, pirate-themed quiz about word prefixes for primary-school children (approx. Grades 2–4). Children configure a difficulty (Leicht/Mittel/Schwer) and an origin filter (Germanic/German, Latin, Greek — at least one), then play a 10-question round in which the question type (one of six) is chosen randomly and every question comes from the app's current language dataset. The game is fully bilingual with **two separate, non-translated datasets** (German and English) curated from the cited German and English Wikipedia articles, bundled offline. Correct answers award 10 XP through the existing profile system; mistakes reduce boost by 1. The coin chain of consecutive correct answers is purely visual. See `research.md`, `data-model.md`, `contracts/` and `quickstart.md` in this directory.

## Technical Context

**Language/Version**: TypeScript; Vue 3 (Composition API + `<script setup>`); Vite 6

**Primary Dependencies**: vue-i18n (DE/EN UI), Pinia + `pinia-plugin-persistedstate` (state & LocalStorage), Tailwind CSS v4, Lucide-vue-next (icons), vite-svg-loader (unused here — no custom SVGs)

**Storage**: LocalStorage via persisted Pinia stores. Reuse the existing `user` store (`addXp`, `loseBoost`, `XP_PER_CORRECT`) and `game` store (`startGame`/`addScore`/`endGame`, `bestScore` per game id). No new persisted store is required: round configuration (difficulty, origins) is session-scoped in the game component; best score persistence is already provided by the `game` store.

**Testing**: No test suite exists in the repository (Vibe Coding project). Gates: `pnpm run typecheck` (vue-tsc --noEmit) and `pnpm run build` must pass; `pnpm run lint` must clean up. Functional validation is manual per `quickstart.md`.

**Target Platform**: Modern browsers on tablets and phones (touch-first); deployed to GitHub Pages with base path `/wizzy-weasel/`.

**Project Type**: Browser-based SPA with offline-first, gamified learning games (single Vue app, no backend).

**Performance Goals**: Feedback on an answer is instant (no artificial delay above ~300 ms); a complete 10-question round stays under 5 minutes (spec SC-001). The game component is lazy-loaded via `defineAsyncComponent`, so the base bundle is unaffected.

**Constraints**: Offline-capable (no network, no runtime Wikipedia access); all state in LocalStorage; interactive touch targets ≥ 44×44 px; mobile-first, tablet-optimized layout; game view uses `100dvh`/`100vw` and the standard nav is hidden on `/game/*` (handled by `App.vue`).

**Scale/Scope**: 2 languages × 3 origin families ≥ 25 curated entries each (≥ 75 per language), ≥ 10 curated invalid prefix+root pairs per language, 6 question types, 3 difficulty levels, 10 questions per round.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` is the unfilled template — it defines no principles or gates. There are therefore no constitutional violations to check or justify.

## Project Structure

### Documentation (this feature)

```text
specs/002-praefix-piraten/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── dataset.md
│   └── question-generation.md
├── spec.md              # Feature specification (+ Clarifications)
└── checklists/requirements.md
```

### Source Code (repository root)

```text
src/
├── games/index.ts                          # register GameConfig entry (id: 'praefix-piraten')
├── types/index.ts                          # add prefix-game types (PrefixDataset, PrefixEntry, PrefixQuestion, …)
├── data/prefixPirates/
│   ├── de.ts                               # German dataset: native/Latin/Greek entries + invalid pairs
│   ├── en.ts                               # English dataset: Germanic/Latin/Greek entries + invalid pairs
│   ├── dataset.ts                          # shared PrefixDataset helpers (origin filtering, locale lookup)
│   └── generator.ts                        # question generation: types, options, pool bookkeeping
├── components/games/PrefixPirates.vue      # game component (intro → question → feedback → summary, pause)
└── locales/
    ├── de.json                             # add "prefixPirates" UI string block
    └── en.json                             # add "prefixPirates" UI string block
```

**Structure Decision**: Extend the existing single-project Vue app in place — no new project, no new route (the existing `/game/:id` route + `GameView.vue` renders the component dynamically from `GAMES`). New files follow the established patterns: types in `src/types/index.ts`, curated content in `src/data/<game>/`, component in `src/components/games/`, i18n blocks per game in both locale files, no new Pinia store needed.