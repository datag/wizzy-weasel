# Research: Präfix-Piraten (Prefix Pirates)

Phase 0 output of `/speckit.plan`. Consolidates the decisions for every unknown, technology choice and integration pattern that the spec left open. Each item follows: *Decision → Rationale → Alternatives considered*.

## R1 — Content sourcing & dataset shape

- **Decision**: Ship two static TypeScript data modules — `src/data/prefixPirates/de.ts` and `en.ts` — typed by a shared `PrefixDataset` contract. Content is curated by summarizing/simplifying the cited Wikipedia articles (CC BY-SA; attribute the sources in the README entry). Datasets are **content**, not UI strings: they live in `src/data/`, i18n locale files carry only UI strings.
- **Rationale**: Matches the repository convention (`src/data/wortartenSafari.ts`, `src/data/bundeslaenderData.ts`, …); guarantees offline-first (spec FR-017); gives full control over kid-friendliness and the exactly-one-correct invariant (spec FR-014); keeps datasets per language fully separate and non-translated (spec FR-011/FR-013).
- **Alternatives considered**: (a) Runtime fetch of Wikipedia — rejected: offline-first requirement, latency, no stable table contract; (b) JSON assets — rejected: less type safety, repo convention is `.ts`; (c) single shared bilingual dataset — rejected: violates the "separate, non-translated datasets" requirement.

## R2 — Entry coverage planning

- **Decision**: ≥ 25 entries per origin family per language (≥ 75 per language) plus ≥ 10 curated invalid prefix+root pairs per language. German native prefixes from "Präfix" and "Präfix- und Partikelverben im Deutschen"; German Latin prefixes from "Liste lateinischer Präfixe"; German Greek prefixes from "Liste griechischer Präfixe". English: native/Germanic from "English prefix"; Latin/Greek from "Prefix" and "List of Greek and Latin roots in English".
- **Rationale**: The verified German Latin list uses the columns *Präfix (incl. variants) | lateinische Vokabel | Bedeutung | Derivate* — exactly the fields the data model needs (prefix, origin, meaning, example words). 25 per family makes every single-origin filter still produce a meaningful 10-question round (spec FR-003, edge cases).
- **Alternatives considered**: (a) Fewer entries (~10/family) — rejected: single-origin rounds would repeat distractors/entries visibly; (b) exhaustive lists — rejected: many listed forms are obscure or ambiguous for primary-school level; (c) equal volumes across languages — both languages target the same 75+, independently curated.

## R3 — Curation rules (kid-friendliness & unambiguity)

- **Decision**: Every entry provides one simple meaning (≤ ~6 words), ≥ 2 example words each with a short child-appropriate sentence, and merged spelling variants (e.g. `kon-/kom-/ko-`). Ambiguous combinations (e.g. separable/inseparable pairs like "umfahren") are excluded. Invalid pairs are curated so the prefix+root combination is definitely **not** a word; the repo documents that "un- + laufen" is usable while "um- + laufen" is not ("umlaufen" exists).
- **Rationale**: Satisfies spec FR-012 (fields + volume), FR-014 (exactly one correct answer) and the edge cases "Ambiguous combinations" and "Invalid pairs must not be real words"; keeps content suitable for Grades 2–4 (SC-006).
- **Alternatives considered**: Programmatically deriving distractors or invalid pairs (e.g. by string concatenation) — rejected: offline word-validity cannot be verified reliably at runtime, which would break the exactly-one-correct guarantee.

## R4 — Question generation & randomization

- **Decision**: A pure generator module `src/data/prefixPirates/generator.ts` exposes `buildQuestion(dataset, difficulty, activeOrigins, usedEntryIds) → PrefixQuestion`. It selects the type uniformly at random among the types allowed for the difficulty, draws an entry from the active-origin pool **without immediate repetition** (restart once exhausted), and builds distractors per type from the same language's pools so exactly one option is correct. Option counts are 2/3/4 for Leicht/Mittel/Schwer.
- **Rationale**: Mirrors spec FR-005–FR-007/FR-014 and the confirmed six types; keeps the component lean and the logic unit-testable in isolation; uniform random selection matches the clarified assumption.
- **Alternatives considered**: Generating questions inline inside `PrefixPirates.vue` — rejected: hard to validate, bloats the component; per-difficulty hard-coded sequences — rejected: contradicts the random-type requirement.

## R5 — Scoring & persistence integration

- **Decision**: Reuse the existing stores: `userStore.addXp(XP_PER_CORRECT)` on correct answers, `userStore.loseBoost(1)` on wrong ones, `gameStore.startGame('praefix-piraten')` / `addScore(...)` / `endGame()` with its persisted `bestScore` keyed by game id. Round = 10 questions; the coin chain is **purely visual** (spec FR-009/FR-010 + clarification).
- **Rationale**: Exactly matches the established quiz-style games (`LanguageDetective.vue`, `ClockDetective.vue`, `ItHardwareQuiz.vue` use `addXp(XP_PER_CORRECT)`/`loseBoost(1)`), the app-wide XP convention and the clarified flat-scoring decision.
- **Alternatives considered**: A dedicated score store or per-difficulty best-score records — rejected: duplicates the persisted `game.bestScore` mechanism without a spec requirement.

## R6 — Naming, i18n & registration

- **Decision**: Game id `praefix-piraten` (URL `/game/praefix-piraten`), component file `src/components/games/PrefixPirates.vue`, i18n block `prefixPirates` added to both `de.json` and `en.json` (title "Präfix-Piraten"/"Prefix Pirates" and description), GameConfig entry with a pirate flag icon and a sea-themed Tailwind gradient (e.g. 🏴☠️, `from-cyan-500 to-blue-700`). README Games table updated (spec FR-018).
- **Rationale**: ASCII-safe kebab-case ids match all existing entries; icon/color fields are required by `GameConfig`; the README table is the documented game index.
- **Alternatives considered**: Component named `PraefixPiraten.vue` — rejected: mixes transliteration with code-style naming; existing components use English names where the English name is clearer.

## R7 — Pause & Escape behavior

- **Decision**: Reuse the shared `PauseModal.vue` (emits `resume`/`exit` and stops Escape propagation while open). The game registers its own Escape keydown handler to open the pause dialog only during active questions; intro and summary must not offer pause (spec FR-015/FR-016, User Story 4).
- **Rationale**: `PauseModal` already implements the resume/exit contract and keyboard handling used by `WortartenSafari.vue`; no new shared UI needed.
- **Alternatives considered**: A custom pause overlay — rejected: duplicates an existing shared component.

## R8 — Dataset validation (content quality gate)

- **Decision**: Add a small self-check (dev-time script or a `pnpm run` npm script, and inline sanity assertions at module load) that verifies dataset invariants: per-origin counts ≥ 25, invalid-pair counts ≥ 10, non-empty prefix/meaning/examples/sentences, unique entry ids, examples and invalid pairs disjoint (an invalid pair's "word" must not appear as an example anywhere), and no entry text identical across languages.
- **Rationale**: Protects spec FR-012/FR-014 and SC-005 cheaply; the data is a plain TS module so the check is trivial to run.
- **Alternatives considered**: A full test suite — rejected: the repository intentionally has none; a lightweight script covers the critical content invariants.