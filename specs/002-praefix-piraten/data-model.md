# Data Model: Präfix-Piraten (Prefix Pirates)

Phase 1 output of `/speckit.plan`. Entities are derived from `spec.md` (Key Entities section) and `research.md`. Field lists describe the **information each entity carries**; the exact TypeScript representation is defined in `contracts/dataset.md` and `contracts/question-generation.md`.

## Glossary

| Term | Meaning |
|---|---|
| Prefix | A bound morpheme placed at the front of a root word (e.g. `un-` in `unglücklich`). German: Präfix/Vorsilbe. |
| Origin family | The linguistic source: **Germanic** (German-native prefixes in the German dataset; native Old English/Germanic prefixes in the English dataset), **Latin**, **Greek**. |
| Difficulty | One of three levels controlling which question types may appear and how many answer options exist. |
| Question type / Abfrageart | The way a task is posed and answered; one of six (see `PrefixQuestionType`). |
| Invalid pair | A curated (prefix, root) combination that does NOT form a real word; supplies the "no" cases of the verdict type. |
| Coin chain | Number of consecutive correct answers; purely visual, never affects the score. |

## Entities

### PrefixOrigin

- Values: `germanic` | `latin` | `greek`
- Display names are per-language UI strings (e.g. GER: "Deutsch/ererbte Wörter", "Lateinisch", "Griechisch"; EN: "Germanic", "Latin", "Greek").
- A `PrefixOriginFilter` is the set of active origins during a round; **at least one must remain active** (spec FR-003).

### PrefixQuestionType

Six values (spec FR-004), each with a distinct answer mode:

| Value | Mode | Task prompt example |
|---|---|---|
| `prefix-choice` (Schatzsucher-Wahl) | Multiple choice | "___ + bauen" → pick the prefix (ein-) |
| `meaning-match` (Bedeutungs-Juwel) | Multiple choice | "What does re- mean?" → pick the meaning |
| `prefix-in-word` (Wort-Schmiede) | Multiple choice | "Which part of `entdecken` is the prefix?" |
| `sentence-gap` (Satz-Schatz) | Multiple choice | "Ich ___steige in den Bus." → pick ein- |
| `origin-assignment` (Ursprungs-Inseln) | Multiple choice | Assign the prefix to Germanic/Latin/Greek |
| `validity-verdict` (Falschmünzer) | Yes/No | "Does un- + laufen form a real word?" → No |

Per-difficulty availability and option counts (spec FR-005/FR-006):

| Difficulty | Allowed types | Options |
|---|---|---|
| `easy` (Leicht) | `prefix-choice`, `sentence-gap` | 2 |
| `medium` (Mittel) | `prefix-choice`, `meaning-match`, `prefix-in-word`, `sentence-gap` | 3 |
| `hard` (Schwer) | all six | 4 |

### PrefixEntry

One curated prefix of a dataset.

- `id` — stable unique key within the language (used for no-immediate-repeat bookkeeping).
- `prefix` — the prefix string as typically shown (e.g. `un-`).
- `variants` — spelling variants (e.g. `kon-, kom-, ko-`); optional, merged with the prefix for display.
- `origin` — `PrefixOrigin`.
- `meaning` — child-friendly meaning, at most a few words (spec FR-012).
- `examples` — at least 2 `PrefixExample`: each carries a `word` (prefix+root combination) and a short `sentence` using that word.
- `poolIndex` (derived) — assigned by the generator to enable origin filtering and pool bookkeeping; not part of the authored data.

### PrefixExample

- `word` — a real word formed with the prefix.
- `sentence` — a short, child-appropriate example sentence containing the word.

### PrefixInvalidPair

Curated non-word combination for the verdict type (spec FR-012 + clarification).

- `id` — unique within the language.
- `prefix` — e.g. `un-`.
- `root` — e.g. `laufen`.
- `explanation` — child-friendly note why the combination is not a word.
- Invariant: `prefix + root` MUST NOT be a real word in the language (e.g. "unlaufen" ok, "umlaufen" is a word and must never be used).

### PrefixDataset

One complete language corpus (spec FR-011/FR-012/FR-013).

- `language` — `de` | `en`.
- `entries` — ≥ 75 entries, split ≥ 25 per `PrefixOrigin`.
- `invalidPairs` — ≥ 10 `PrefixInvalidPair`.
- Relationships: `invalidPairs` and `entries.examples.words` must be **disjoint** (a valid example word must not appear as an invalid pair, and vice versa). Datasets are independent per language — the English dataset is not a translation of the German one.

### PrefixQuestion

A concrete, rendered task (discriminated union over `type`):

- Shared: `type`, `correctIndex` (for multiple choice) or `isReal` (for verdict), and a reference to the source `entry` (and/or `pair`) used for the explanation card.
- Type-specific prompt data:
  - `prefix-choice` → `root` + `options: prefix[]`
  - `meaning-match` → `prefix` + `options: meaning[]`
  - `prefix-in-word` → `word` + `options: part[]` (prefix vs. non-prefix parts)
  - `sentence-gap` → `sentenceWithGap` + `options: prefix[]`
  - `origin-assignment` → `prefix` + `options: origin[]`
  - `validity-verdict` → `prefix` + `root` + `isReal: boolean`
- Invariants: exactly one correct option; options are tappable touch targets (≥ 44×44 px); the option count matches the difficulty.

### PrefixRound (session)

State of one round (10 questions, spec FR-009):

- `language` — dataset language (equals the app language at round start; clarified decision).
- `difficulty` — `PrefixDifficulty`.
- `activeOrigins` — `PrefixOrigin[]`, ≥ 1.
- `questions` — the 10 `PrefixQuestion`s (built ahead or lazily).
- `index` — current question (0–9).
- `correctCount`, `score` — round tally.
- `coinChain`, `longestChain` — visual only, never scoring (FR-010).
- Feedback state per question: answered `correct|wrong`, revealed correct option, explanation shown.
- Lifespan: intro → question loop → summary; pause preserves the current question unchanged; exit returns to the menu without double-counting XP (FR-015).

## State transitions

```text
intro ──(Segel setzen)──▶ question 1 … question 10 ──(end)──▶ summary
  ▲                                                            │
  └────────────────────────(play again)───────────────────────┘

question (tap answer) → feedback (verdict + explanation card) → next question
question → (pause ⏸ / Esc) → pause dialog → resume | exit to menu
```

- A round records `bestScore` via the app's `game` store on completion; `endGame()` is called exactly once per round to avoid double-counting XP/score (FR-015, edge case "Interrupted round").

## Validation rules (derived from spec)

| # | Rule | Source |
|---|---|---|
| V1 | ≥ 25 entries per origin family per language | FR-012 |
| V2 | ≥ 10 invalid pairs per language; pairs never form a real word | FR-012 + clarification |
| V3 | Exactly one correct answer per task; distractors never create a second valid word | FR-014, SC-005 |
| V4 | No immediate repetition of an entry between consecutive questions; pool restarts when exhausted | FR-007 |
| V5 | Option count = 2/3/4 by difficulty; allowed types per difficulty as in table above | FR-005/FR-006 |
| V6 | All entry fields non-empty (prefix, origin, meaning, ≥ 2 examples with sentences); ids unique; example words and invalid pairs disjoint | FR-012, edge cases |
| V7 | Round = 10 questions; correct = +10 XP; wrong = −1 boost (min 0); chain purely visual | FR-009/FR-010 |
| V8 | At least one origin active; identical Latin/Greek prefixes (e.g. tele-, re-) exist independently in both datasets | FR-003, assumptions |

Referenced by: [contracts/dataset.md](./contracts/dataset.md), [contracts/question-generation.md](./contracts/question-generation.md).