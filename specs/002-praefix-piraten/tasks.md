---

description: "Task list for feature implementation: Präfix-Piraten (Prefix Pirates)"
---

# Tasks: Präfix-Piraten (Prefix Pirates)

**Input**: Design documents from `/specs/002-praefix-piraten/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ (dataset.md, question-generation.md), quickstart.md

**Tests**: No automated test suite exists in this repository and none was requested — this feature's verification gates are the manual scenarios in `quickstart.md` (A1–A10) plus `pnpm run typecheck`, `pnpm run build`, `pnpm run lint`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4 from `spec.md`)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root (Vue 3 SPA, see `plan.md` → Project Structure)
- Source paths: `src/types/index.ts`, `src/data/prefixPirates/…`, `src/components/games/PrefixPirates.vue`, `src/games/index.ts`, `src/locales/{de,en}.json`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Feature scaffolding — the type layer and data module shared by every user story

- [x] T001 [P] Create `src/data/prefixPirates/` directory with `dataset.ts` containing the shared dataset helpers `loadDataset(language: 'de' | 'en'): PrefixDataset` and `entriesByOrigin(dataset, origins: PrefixOrigin[]): PrefixEntry[]` per `contracts/dataset.md` (module surface)
- [x] T002 [P] Add all prefix-game type declarations to `src/types/index.ts` per `data-model.md` glossary & entities — `PrefixOrigin`, `PrefixDifficulty` (`'easy' | 'medium' | 'hard'`), `PrefixQuestionType` (six values), `PrefixExample`, `PrefixEntry`, `PrefixInvalidPair`, `PrefixDataset`, the `PrefixQuestion` discriminated union (shared `type`, `correctIndex`/`isReal`, source `entry`/`pair` reference plus per-type prompt fields), and `PrefixRound`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Dataset integrity checks that MUST exist before any dataset is authored

**⚠️ CRITICAL**: Dataset authoring (US1/US3) may not start until this phase is complete

- [x] T003 Implement `validatePrefixDataset(dataset: PrefixDataset): string[]` and `validateCrossDataset(de, en): string[]` in `src/data/prefixPirates/dataset.ts` per `data-model.md` validation rules V1–V6 — per-language: ≥ 25 entries per origin family (≥ 75 total), ≥ 10 invalid pairs, every required field non-empty, `meaning` ≤ ~6 words, ≥ 2 examples each with non-empty sentence, unique ids, example words disjoint from invalid-pair `prefix + root`, invalid pairs verified as non-words; cross-language: no identical example sentences. Invoke both at module load of each dataset file so violations throw during dev/build.

**Checkpoint**: Foundation ready — dataset authoring and game implementation can begin.

---

## Phase 3: User Story 1 - Set sail: configure and play a full pirate round (Priority: P1) 🎯 MVP

**Goal**: A child opens the game, chooses difficulty and origins, plays 10 randomized questions (question type chosen randomly, 2–4 tappable options), gets verdict + basic explanation after each answer, and reaches a summary with score, coin chain and best score.

**Independent Test** (`quickstart.md` A1–A3, A5, A6, A8, A9): configure options → play a round → summary matches the right/wrong answers; option counts and allowed types follow the difficulty; every question comes from the active origins; no immediate entry repetition; all six types appear across three Schwer rounds.

### Implementation for User Story 1

- [x] T004 [P] [US1] Author the German dataset in `src/data/prefixPirates/de.ts` — ≥ 25 `PrefixEntry` per origin (germanic native prefixes; latin per "Liste lateinischer Präfixe"; greek per "Liste griechischer Präfixe"), ≥ 10 `PrefixInvalidPair`, fields exactly per `contracts/dataset.md` (id, prefix, variants?, origin, meaning ≤ ~6 words, ≥ 2 examples with word+sentence), kid-friendly, no ambiguous combinations (e.g. "umfahren" must be excluded), invoke `validatePrefixDataset` at module load
- [x] T005 [P] [US1] Implement the question generator `buildQuestion(opts)` in `src/data/prefixPirates/generator.ts` per `contracts/question-generation.md` rules G1–G7 — uniform random type among the types allowed for the difficulty (easy: prefix-choice, prefix-in-word, sentence-gap; medium: meaning-match, sentence-gap, validity-verdict; hard: meaning-match, sentence-gap, origin-assignment, validity-verdict), entry pool = `entriesByOrigin` for active origins, no immediate repetition (pool restarts on exhaustion), option counts 2/3/4 by difficulty, exactly-one-correct distractor construction per type, verdict "yes" cases from entries / "no" cases from invalidPairs, return `{ question, usedEntryIds }`
- [x] T006 [US1] Implement the intro phase in `src/components/games/PrefixPirates.vue` — difficulty selection (Leicht, Mittel/Kapitän default, Schwer/Piratenkönig) and origin filter (Germanic/Latin/Greek, all active by default, last origin may not be deselected) per FR-002/FR-003, "Segel setzen" starts the round with `gameStore.startGame('praefix-piraten')`
- [x] T007 [US1] Implement question and feedback phases in `src/components/games/PrefixPirates.vue` — render the current `PrefixQuestion` options as tappable targets ≥ 44×44 px, lock the answer after the first tap (further taps ignored, FR-008 edge case "Rapid double-tapping"), verdict correct = green + treasure coin / wrong = red + revealed correct option, plus a basic explanation card (prefix, meaning, origin, example sentence) and the purely visual coin chain counter (FR-010)
- [x] T008 [US1] Implement scoring in `src/components/games/PrefixPirates.vue` — a round is exactly 10 questions; each correct answer calls `userStore.addXp(XP_PER_CORRECT)` and `gameStore.addScore(XP_PER_CORRECT)`; each wrong answer calls `userStore.loseBoost(1)` per FR-009
- [x] T009 [US1] Implement the summary phase in `src/components/games/PrefixPirates.vue` — X of 10 correct, score, longest coin chain (visual only), new-best indicator from `gameStore.bestScore`, actions "play again" and "back to menu", and `gameStore.endGame()` called exactly once per FR-010/FR-016
- [x] T010 [US1] Register the game in `src/games/index.ts` — GameConfig entry with `id: 'praefix-piraten'`, `titleKey`/`descriptionKey` = `prefixPirates.title`/`prefixPirates.description`, pirate flag icon, sea-themed Tailwind gradient, `path: '/game/praefix-piraten'`, component lazy-loaded via `defineAsyncComponent(() => import('@/components/games/PrefixPirates.vue'))` per FR-001
- [x] T011 [P] [US1] Add the structural UI string blocks (`prefixPirates.title`, `description`, intro/options labels, score and summary labels, pause labels) to both `src/locales/de.json` and `src/locales/en.json` (structural subset; didactic feedback copy is T012)

**Checkpoint**: At this point User Story 1 is fully functional and playable in German — validate quickstart scenarios A1–A3, A5, A6, A8, A9.

---

## Phase 4: User Story 2 - Learn the pirate lore: read the explanations (Priority: P2)

**Goal**: The explanation card and feedback messages are didactically complete and encouraging — correct answers praise, wrong answers reveal the right answer without blame.

**Independent Test** (`quickstart.md` A4): answer one question correctly and one wrongly; both cards show prefix, child-friendly meaning, origin family and an example word in a sentence; wrong-answer card reveals the correct option with motivating wording; the card only advances via an explicit tap.

### Implementation for User Story 2

- [x] T012 [P] [US2] Add the didactic feedback/explanation i18n copy to `src/locales/de.json` and `src/locales/en.json` — correct/wrong messages (e.g. "Schatz gefunden!"), non-punishing wrong-answer wording, and explanation-card labels (prefix, meaning, origin, example) per User Story 2 scenarios 1–3
- [x] T013 [US2] Enhance the explanation card in `src/components/games/PrefixPirates.vue` — compose all four required fields (prefix with variants, child-friendly meaning, origin badge, example word inside its sentence) and reveal the correct answer clearly on wrong answers
- [x] T014 [US2] Add explicit advance behavior in `src/components/games/PrefixPirates.vue` — the explanation card advances to the next question only via an explicit tap ("Weiter"), never by timeout or auto-advance, per FR-008

**Checkpoint**: User Stories 1 and 2 both work — validate quickstart scenario A4 in German.

---

## Phase 5: User Story 3 - Sail the English word sea: separate datasets (Priority: P2)

**Goal**: In English app mode the game runs entirely on the separate, non-translated English dataset; German mode stays German-only.

**Independent Test** (`quickstart.md` A7, SC-004): switch the app to English and play — title/UI/tasks in English, no German leaks into tasks, example sentences visibly differ from the German dataset; switching mid-round applies to the next round.

### Implementation for User Story 3

- [x] T015 [P] [US3] Author the English dataset in `src/data/prefixPirates/en.ts` — ≥ 25 `PrefixEntry` per origin (germanic/native per "English prefix"; latin & greek per "Prefix" and "List of Greek and Latin roots in English"), ≥ 10 `PrefixInvalidPair`, own curated content that is NOT a translation of the German dataset (FR-013), language-appropriate example words for identical prefixes such as `tele-`/`re-` (assumption), invoke `validatePrefixDataset` + `validateCrossDataset`
- [x] T016 [US3] Wire dataset selection to the app language in `src/components/games/PrefixPirates.vue` — load the dataset via `loadDataset(locale)` at round start so the current app language decides the dataset; a language change during a round takes effect only with the next round (FR-011, confirmed assumption)

**Checkpoint**: Bilingual play validated — run quickstart A7 in both languages.

---

## Phase 6: User Story 4 - Pause, resume and safe exits (Priority: P3)

**Goal**: During questions the child can pause/resume/exit; the intro and summary never show pause; XP is never lost or double-counted.

**Independent Test** (`quickstart.md` A10): pause mid-question and resume (same question unchanged); pause again and end the round; Escape on intro/summary does nothing; starting a new round after an ended round shows no XP loss or double-count.

### Implementation for User Story 4

- [x] T017 [P] [US4] Integrate the shared `PauseModal` into `src/components/games/PrefixPirates.vue` — open the pause overlay via the pause icon during active questions only; "Weiterspielen" resumes with the current question untouched; "Spiel beenden" emits `exit` (FR-015)
- [x] T018 [US4] Add Escape keydown handling in `src/components/games/PrefixPirates.vue` — Escape opens the pause dialog only during active questions and must not trigger game input; while `PauseModal` is open its own stop-propagation handler wins; intro and summary never show the pause dialog (FR-015/FR-016)
- [x] T019 [US4] Guard XP/score double-counting in `src/components/games/PrefixPirates.vue` — `gameStore.endGame()` runs exactly once per round across the pause-exit path, and the summary/XP are only produced for completed rounds (FR-015, edge case "Interrupted round")

**Checkpoint**: All user stories independently functional — run quickstart A10 and a full A1–A10 pass.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and verification that affect the whole feature

- [x] T020 [P] Update the Games table in `README.md` with the new row (pirate icon, "Präfix-Piraten"/"Prefix Pirates", topic) per FR-018
- [x] T021 [P] Add CC BY-SA source-attribution comments to the dataset headers in `src/data/prefixPirates/de.ts` and `src/data/prefixPirates/en.ts`, referencing the Wikipedia articles named in spec FR-011
- [x] T022 [P] Run the full manual validation of `quickstart.md` scenarios A1–A10 in both languages (offline via `pnpm run preview`, touch-target and double-tap checks) and fix any failures found
- [x] T023 Run the final gates — `pnpm run typecheck`, `pnpm run build`, and `pnpm run lint` must pass per `quickstart.md` "Definition of done"

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — T001/T002 run in parallel
- **Foundational (Phase 2)**: Depends on T001 + T002 — T003 BLOCKS all dataset authoring
- **User Stories (Phase 3+)**: All depend on Phases 1–2
  - US1 (Phase 3) first — it owns the component file and generator
  - Then US2 → US3 → US4 **sequentially**, because US2–US4 all edit `src/components/games/PrefixPirates.vue` (same file ⇒ cannot run in parallel)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phases 1–2 — no dependency on other stories (MVP)
- **User Story 2 (P2)**: Starts after US1 — enhances the explanation card implemented in T007
- **User Story 3 (P2)**: Starts after US2 — adds the `en.ts` dataset (parallel-safe file) and a small wiring change in the component
- **User Story 4 (P3)**: Starts after US3 — pause integration in the same component file

### Within Each User Story

- Dataset/helper [P] tasks before component tasks
- Component tasks are sequential (same file)
- Story complete and validated before moving to the next story

### Parallel Opportunities

- Setup: T001 + T002 run in parallel
- US1: T004 (`de.ts`) + T005 (`generator.ts`) run in parallel; T011 (locales) + T010 (`games/index.ts`) run in parallel
- US2: T012 (locale copy) runs parallel to nothing else in the story but is independent of component work it precedes
- US3: T015 (`en.ts`) is a separate file and can be authored while US2 completes
- Polish: T020, T021, T022 run in parallel; T023 runs last after all other tasks

---

## Parallel Example: User Story 1

```bash
# Launch the two content/generator tasks together:
Task: "Author German dataset in src/data/prefixPirates/de.ts"
Task: "Implement question generator buildQuestion in src/data/prefixPirates/generator.ts"

# Registration and locale structure together:
Task: "Register game in src/games/index.ts"
Task: "Add structural UI strings to src/locales/de.json and src/locales/en.json"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup): types + dataset helpers
2. Complete Phase 2 (Foundational): dataset validation
3. Complete Phase 3 (User Story 1): German dataset, generator, full play round in German
4. **STOP and VALIDATE**: quickstart A1–A3, A5, A6, A8, A9
5. Deploy/demo if ready

### Incremental Delivery

1. Phases 1–2 → foundation ready
2. Add US1 → validate independently → MVP available
3. Add US2 (explanation polish) → validate A4
4. Add US3 (English dataset) → validate A7
5. Add US4 (pause/safe exits) → validate A10
6. Polish → README, attribution, full A1–A10 pass, gates

### Parallel Team Strategy

With multiple developers:

1. Team completes Phases 1–2 together; then US1 (T004/T005/T010/T011 parallel)
2. US2–US4 are **serialized on the shared component file** `PrefixPirates.vue` — one developer owns the component while a second can author `en.ts` (T015) in parallel
3. Polish tasks (README, attribution, validation) fan out across the team

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps a task to a specific user story for traceability (US1–US4)
- No automated test suite exists in this repo — validation gates are the `quickstart.md` scenarios plus typecheck/build/lint; the dataset self-check (T003) runs at module load
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
- Avoid: vague tasks, same-file conflicts (US2–US4 share `PrefixPirates.vue`), cross-story dependencies that break independence