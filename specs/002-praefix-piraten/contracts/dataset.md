# Contract: Prefix Dataset

The **dataset contract** — the typed shape the curated content must satisfy and that the game consumes. Content is authored by humans (curated from the cited Wikipedia articles, see `spec.md` FR-011); the contract guarantees every consumer (generator, component, validation script) can rely on it. Grounded in `data-model.md`.

## Module surface

`src/data/prefixPirates/de.ts` and `src/data/prefixPirates/en.ts` each export exactly one dataset:

```ts
// de.ts
export const DE_DATASET: PrefixDataset
// en.ts
export const EN_DATASET: PrefixDataset
```

`src/data/prefixPirates/dataset.ts` provides lookups (not part of the authored content):

```ts
loadDataset(language: 'de' | 'en'): PrefixDataset
entriesByOrigin(dataset, origins: PrefixOrigin[]): PrefixEntry[]
```

## Types (contract fields)

| Type | Fields | Constraints |
|---|---|---|
| `PrefixOrigin` | `'germanic' \| 'latin' \| 'greek'` | display labels come from i18n, not the dataset |
| `PrefixExample` | `word: string`, `sentence: string` | word must contain the entry's prefix; sentence ≤ ~12 words, child-appropriate |
| `PrefixEntry` | `id: string`, `prefix: string`, `variants?: string[]`, `origin: PrefixOrigin`, `meaning: string`, `examples: PrefixExample[]`, `tier?: 1 \| 2 \| 3` | id unique per language; meaning ≤ ~6 words; examples.length ≥ 2; tier defaults to 1 (spec FR-020) |
| `PrefixInvalidPair` | `id: string`, `prefix: string`, `root: string`, `explanation: string` | id unique per language; `prefix + root` must NOT be a word |
| `PrefixDataset` | `language: 'de' \| 'en'`, `entries: PrefixEntry[]`, `invalidPairs: PrefixInvalidPair[]` | language matches the file; counts per invariants |
| `PrefixDifficulty` | `'easy' \| 'medium' \| 'hard'` | see allowed types/option counts in `question-generation.md` |
| `PrefixQuestionType` | six values (see `data-model.md`) | — |

## Invariants (MUST hold; enforced by the dataset self-check, see `research.md` R8)

1. **Volume**: `entries` ≥ 75 with ≥ 25 per `origin`; `invalidPairs` ≥ 10. (FR-012)
2. **Integrity**: every required field non-empty; `meaning` ≤ ~6 words; `examples` ≥ 2 per entry; each example word MUST start with one spelling of the entry's prefix (canonical or variant) and MUST NOT equal that spelling (non-empty root, e.g. no `zoo-` → `Zoo`); each example sentence MUST contain the example word verbatim (case-insensitive). (FR-012, edge cases – enforced by `validatePrefixDataset`)
3. **Uniqueness**: entry ids and invalid-pair ids are unique within the language. (V6)
4. **Disjointness**: no example `word` of any entry appears as `prefix + root` of an invalid pair, and no invalid-pair combination is a real word. (FR-014, edge case "Invalid pairs must not be real words")
5. **Non-translation**: the German and English datasets share no identical example sentences; identical Latin/Greek prefixes (e.g. `tele-`, `re-`) appear independently with language-appropriate examples. (FR-011/FR-013)
6. **No-ambiguity**: for every example word, the prefix's contribution to the meaning is the intended one; ambiguous combinations (e.g. "umfahren") are excluded. (FR-014, edge case "Ambiguous combinations")
7. **Tier coverage (FR-020)**: each `tier` is 1–3; per origin family at least 10 entries with `tier` 1 (easy rounds) and at least 10 with `tier` ≤ 2 (medium rounds), so every difficulty × origin combination keeps a full round of 10 entries (V9).

## Illustrative entry (German, shape only — not final content)

```ts
{
  id: 'de-un',
  prefix: 'un-',
  origin: 'germanic',
  meaning: 'nicht',
  examples: [
    { word: 'unglücklich', sentence: 'Ich bin unglücklich, weil es regnet.' },
    { word: 'unfair',      sentence: 'Das Spiel war unfair.' },
  ],
}
```

```ts
// invalid pair (German)
{
  id: 'de-inv-1',
  prefix: 'un-',
  root: 'laufen',          // "unlaufen" ist kein deutsches Wort
  explanation: 'Es gibt kein Wort „unlaufen“.',
}
```

## Validation

- Dev-time self-check script asserts all invariants; run via the generic app-wide npm script `pnpm run check:datasets` (spec FR-019, auto-discovery of `datasetCheck` exports under `src/data/`).
- Behavioral guarantees derived from this contract map to spec acceptance criteria in `quickstart.md` (scenarios B1–B8).