# Contract: Question Generation & Game Component

Two contracts for "Präfix-Piraten": (1) the **generator contract** that turns curated data into one-answer tasks, and (2) the **game component contract** that the app shell (`GameView.vue`) relies on. Grounded in `data-model.md` and `spec.md` FR-004…FR-010 / FR-015…FR-016.

## 1. Generator contract

Module `src/data/prefixPirates/generator.ts`.

```ts
buildQuestion(opts: {
  dataset: PrefixDataset        // loaded for the round's language
  difficulty: PrefixDifficulty // 'easy' | 'medium' | 'hard'
  activeOrigins: PrefixOrigin[]  // ≥ 1
  usedEntryIds: string[]         // pool bookkeeping from previous questions
}): { question: PrefixQuestion, usedEntryIds: string[] }
```

**Rules (MUST hold):**

| Rule | Behaviour | Spec |
|---|---|---|
| G1 | Question type is drawn **uniformly at random** from the types allowed for the difficulty | FR-005 |
| G2 | Entry pool = entries whose `origin ∈ activeOrigins`; the previous question's entry is excluded from the immediate next draw; when the whole pool has been used, the draw **restarts** from the beginning | FR-007 |
| G3 | Option count = 2 (`easy`) / 3 (`medium`) / 4 (`hard`); exactly one option is correct | FR-006 |
| G4 | Distractors come from the same language pool per type and must not create a second valid answer (e.g. for `prefix-choice`, a distractor prefix + root must not form a real word; for `meaning-match`, distractor meanings must not match the prefix) | FR-014 |
| G5 | `validity-verdict` questions draw "yes" cases from `entries` (a real example word) and "no" cases from `invalidPairs`; the pair's `prefix + root` must not be a word | FR-012 + clarification |
| G6 | The returned `usedEntryIds` must grow monotonically and reset exactly on pool exhaustion | FR-007 |
| G7 | Each `PrefixQuestion` references its source `entry` (or `pair`) so the explanation card (meaning, origin, example sentence) can be rendered | FR-008 |

**Allowed types per difficulty** (`G1`): `easy` → `prefix-choice`, `prefix-in-word`, `sentence-gap`; `medium` → `meaning-match`, `sentence-gap`, `validity-verdict`; `hard` → `meaning-match`, `sentence-gap`, `origin-assignment`, `validity-verdict`. (FR-005)

**Language coupling**: the generator only sees the dataset for the round's language; it never mixes German and English content. (FR-011/FR-013)

## 2. Game component contract

Component file `src/components/games/PrefixPirates.vue`, rendered by `GameView.vue` (`fixed inset-0` container) with `@exit` wired to the router.

**Interface:**

- **Emits**: `exit` — fired exactly once to leave the game (pause dialog "Spiel beenden", summary "Zurück zum Menü").
- **Imports (shared project UI)**: `AppButton.vue`, `AppCard.vue`, `PauseModal.vue`. `PauseModal` emits `resume`/`exit` and stops Escape propagation while open.
- **Store usage**: `useUserStore()` (`addXp(XP_PER_CORRECT)`, `loseBoost(1)`), `useGameStore()` (`startGame('praefix-piraten')` at round start, `addScore(10)` per correct answer, `endGame()` once at round end).

**Phases & states:**

```text
intro ──▶ (question[i] ──▶ feedback ──▶ question[i+1]) ×10 ──▶ summary
             │                                              ▲
             └──(pause: resume | exit)──────────────────────┘
```

| Phase | Behaviour | Spec |
|---|---|---|
| intro | difficulty + origin selection, defaults Mittel / all origins, last origin cannot be deselected, "Segel setzen" | FR-002/FR-003 |
| question | renders current `PrefixQuestion`, tappable options (≥ 44×44 px), one answer lock (further taps ignored, feedback shown) | FR-006/FR-008, edge case "Rapid double-tapping" |
| feedback | verdict (green + coin / red + reveal) then explanation card; advance only via explicit action; coin chain increases/decreases visually | FR-008/FR-010 |
| summary | X/10, score, longest chain (visual), new-best indicator from `gameStore.bestScore`, "play again", "back to menu"; no pause here | FR-010/FR-016 |
| paused | `PauseModal` overlay, current question preserved; resume returns unchanged; exit returns to menu | FR-015 |

**Environment contract** (inherited from the app): hidden standard nav on `/game/*` (handled by `App.vue`), fullscreen via the global long-press/`FullscreenToggle` gesture, offline-first (no network access in the component).

**Validation**: every rule above is exercised manually by the scenarios in `quickstart.md` (A1–A8) and by `pnpm run typecheck`/`pnpm run build`.