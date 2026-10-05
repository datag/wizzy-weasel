# Quickstart: Präfix-Piraten (Prefix Pirates)

Validation/run guide for the feature — proves it works end-to-end. Implementation details live in `tasks.md` (Phase 2); this guide links to the contracts instead of duplicating them.

## Prerequisites

- Node.js 24+ and pnpm 10+ (project requirement, see `README.md`).
- Repository checkout on the feature branch `002-praefix-piraten`.

## Setup & commands

```bash
pnpm install         # install dependencies
pnpm run dev         # start dev server → http://localhost:5173/
pnpm run typecheck   # vue-tsc --noEmit — must pass
pnpm run build       # typecheck + production build — must pass
pnpm run preview     # preview the production build locally
pnpm run lint        # ESLint auto-fix — must leave no errors
```

> Reuse an already-running dev server on `http://localhost:5173/` if present (project convention).

## Functional validation scenarios

Play through the scenarios below (browser at `/`, navigate to the game card "Präfix-Piraten"). Expected outcomes map to the spec (`spec.md`) and contracts (`contracts/dataset.md`, `contracts/question-generation.md`).

| # | Scenario | Steps | Expected outcome | Spec ref |
|---|---|---|---|
| A1 | **Registration** | Dashboard shows a pirate-themed card; tap it | Game opens in fullscreen game view without nav; i18n title/description correct in current language | FR-001, FR-018, User Story 1 |
| A2 | **Intro & options** | Inspect intro | Difficulty (Leicht/Mittel/Schwer, default Mittel), origin filters (Germanic/Latin/Greek, all active); deselecting the last origin is impossible | FR-002, FR-003 |
| A3 | **Default round (Mittel)** | Start a round with default settings | 10 questions; choice-based questions have exactly **3 options**; types come from the Mittel set (incl. Falschmünzer); no question repeats its entry immediately; then start a "Leicht" round and verify **2 options** with only `prefix-choice`/`sentence-gap` | FR-002, FR-005, FR-007 |
| A4 | **Feedback & explanation** | Answer one correctly, one wrongly | Correct: green + coin + "Schatz gefunden!"; wrong: red + revealed correct option; both followed by an explanation card with prefix, meaning, origin, example sentence; second tap on the same question is ignored | FR-008, FR-010, User Story 2 |
| A5 | **Scoring** | Complete the round, wrong answers included | +10 XP per correct answer (profile page), boost −1 per mistake (min 0); summary shows X/10, score, longest coin chain (visual only), new-best indicator; **no streak bonus** changes the score | FR-009, FR-010 (clarified) |
| A6 | **Summary & replay** | On summary: play again, then back to menu | Fresh 10-question round starts; "back to menu" returns to dashboard and `endGame()` ran exactly once (no double-counted XP) | FR-009, FR-016, edge case "Interrupted round" |
| A7 | **English dataset** | Switch app language to English (Settings) and play | Title/UI/feedback in English; 100 % of task text from the English dataset; no German leaks into tasks; datasets are visibly not translations (compare example sentences) | FR-011, FR-013, SC-004 |
| A8 | **Schwer & types** | Play 3 rounds at "Schwer" (4 options), then 1 at "Mittel" | Across the three Schwer rounds all four hard types appear (Bedeutungs-Juwel, Satz-Schatz, Ursprungs-Inseln, Falschmünzer); ≥ 2 different types per round; Wortbilden/Vorsilbe-Erkennen never appear at Schwer; the Mittel round also shows Falschmünzer; verdict tasks include both real-word ("yes") and curated-invalid ("no") cases | FR-005, SC-002, SC-005 |
| A9 | **Origin filter** | Play with only Latin active | 100 % of questions drawn from Latin entries; filters combined (e.g. Greek+Latin) work likewise | FR-007, SC-003 |
| A10 | **Pause & exit** | During a question press Escape, then resume; pause again and end | Pause dialog via icon or Escape; resume shows the same question unchanged; exit returns to menu; intro and summary show **no** pause dialog | FR-015, FR-016, User Story 4 |

## Data-quality validation

- Run the dataset self-check (npm script added with the feature, `contracts/dataset.md` §Validation):
  - ≥ 25 entries per origin family per language (≥ 75/language), ≥ 10 invalid pairs/language, non-empty fields, unique ids, example words vs. invalid pairs disjoint, no identical sentences across languages.
- Spot-check a sample of `validity-verdict` "no" cases and all distractors against a dictionary (`contracts/dataset.md` invariants 4 & 6).

## Non-functional checks

- **Offline**: `pnpm run build && pnpm run preview` — play a full round with network disabled; everything must work (no runtime Wikipedia/API calls).
- **Touch**: verify all option buttons/targets ≥ 44×44 px on a tablet viewport, and that rapid double-taps never score twice (edge case "Rapid double-tapping").
- **Timing**: feedback appears instantly (< ~300 ms perceived), a full round stays under 5 minutes (SC-001).

## Definition of done (gates)

1. `pnpm run typecheck`, `pnpm run build`, `pnpm run lint` pass.
2. Scenarios A1–A10 pass in both languages.
3. Dataset self-check passes.
4. README Games table lists the new game (FR-018).