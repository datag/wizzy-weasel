import type { PrefixDataset, PrefixEntry, PrefixLanguage, PrefixOrigin } from '@/types'

/**
 * Shared dataset helpers for "Präfix-Piraten" (contracts/dataset.md).
 * Datasets register themselves via `registerDataset` on module load;
 * `loadDataset(language)` therefore never creates a circular import.
 */

const registry: Partial<Record<PrefixLanguage, PrefixDataset>> = {}

export function registerDataset(dataset: PrefixDataset): void {
  registry[dataset.language] = dataset
}

export function loadDataset(language: PrefixLanguage): PrefixDataset {
  const dataset = registry[language]
  if (!dataset) {
    throw new Error(`[prefixPirates] Dataset for language "${language}" is not registered.`)
  }
  return dataset
}

export function entriesByOrigin(
  dataset: PrefixDataset,
  origins: PrefixOrigin[]
): PrefixEntry[] {
  return dataset.entries.filter(e => origins.includes(e.origin))
}

/**
 * Per-dataset invariant checks (data-model.md validation rules V1–V6,
 * contracts/dataset.md invariants 1–5). Returns a list of human-readable
 * violations; an empty list means the dataset is valid.
 */
export function validatePrefixDataset(dataset: PrefixDataset): string[] {
  const problems: string[] = []
  const label = `[prefixPirates:${dataset.language}]`

  const byOrigin: Record<PrefixOrigin, number> = { germanic: 0, latin: 0, greek: 0 }
  const entryIds = new Set<string>()
  const pairIds = new Set<string>()
  const exampleWords = new Set<string>()

  for (const entry of dataset.entries) {
    byOrigin[entry.origin]++
    if (entryIds.has(entry.id)) problems.push(`${label} duplicate entry id "${entry.id}"`)
    entryIds.add(entry.id)

    if (!entry.prefix || !entry.prefix.endsWith('-')) {
      problems.push(`${label} entry "${entry.id}" prefix must be non-empty and end with "-"`)
    }
    if (!entry.meaning || entry.meaning.split(/\s+/).length > 6) {
      problems.push(`${label} entry "${entry.id}" meaning must be ≤ ~6 words`)
    }
    if (entry.examples.length < 2) {
      problems.push(`${label} entry "${entry.id}" needs ≥ 2 examples`)
    }
    const spellings = [
      entry.prefix.replace(/-$/, ''),
      ...(entry.variants?.map(v => v.replace(/-$/, '')) ?? []),
    ]
    for (const ex of entry.examples) {
      if (!ex.word || !ex.sentence) {
        problems.push(`${label} entry "${entry.id}" has an empty example`)
      }
      const lowerWord = ex.word.toLowerCase()
      const matched = spellings.find(s => lowerWord.startsWith(s))
      if (!matched) {
        problems.push(
          `${label} entry "${entry.id}" example word "${ex.word}" does not start with a prefix spelling (${spellings.join('/')})`
        )
      } else if (ex.word.slice(matched.length) === '') {
        problems.push(
          `${label} entry "${entry.id}" example word "${ex.word}" equals the prefix spelling (root must not be empty)`
        )
      }
      if (!ex.sentence.toLowerCase().includes(lowerWord)) {
        problems.push(
          `${label} entry "${entry.id}" example sentence must contain the word "${ex.word}" verbatim (needed for Lückensatz)`
        )
      }
      if (ex.conflictsWith) {
        for (const c of ex.conflictsWith) {
          if (!c || !c.endsWith('-')) {
            problems.push(
              `${label} entry "${entry.id}" example "${ex.word}" conflictsWith entry "${c}" must end with "-"`
            )
          }
        }
      }
      exampleWords.add(lowerWord)
    }
  }

  for (const origin of ['germanic', 'latin', 'greek'] as PrefixOrigin[]) {
    if (byOrigin[origin] < 25) {
      problems.push(`${label} origin "${origin}" has ${byOrigin[origin]} entries (< 25)`)
    }
  }
  if (dataset.entries.length < 75) {
    problems.push(`${label} total entries ${dataset.entries.length} (< 75)`)
  }

  // FR-020 tier coverage: every (difficulty × origin) combination needs at least
  // one full round (ROUND_LENGTH = 10) of entries, otherwise random rounds starve.
  for (const origin of ['germanic', 'latin', 'greek'] as PrefixOrigin[]) {
    let tier1 = 0
    let tier2 = 0
    for (const entry of dataset.entries) {
      if (entry.origin !== origin) continue
      const tier = entry.tier ?? 1
      if (tier < 1 || tier > 3) {
        problems.push(`${label} entry "${entry.id}" has invalid tier ${tier} (must be 1–3)`)
      }
      if (tier <= 1) tier1++
      if (tier <= 2) tier2++
    }
    if (tier1 < 10) {
      problems.push(`${label} origin "${origin}" has only ${tier1} tier‑1 entries (< 10) – easy rounds would starve`)
    }
    if (tier2 < 10) {
      problems.push(`${label} origin "${origin}" has only ${tier2} entries with tier ≤ 2 (< 10) – medium rounds would starve`)
    }
  }

  if (dataset.invalidPairs.length < 10) {
    problems.push(`${label} invalid pairs ${dataset.invalidPairs.length} (< 10)`)
  }
  for (const pair of dataset.invalidPairs) {
    if (pairIds.has(pair.id)) problems.push(`${label} duplicate invalid pair id "${pair.id}"`)
    pairIds.add(pair.id)
    if (!pair.prefix || !pair.root || !pair.explanation) {
      problems.push(`${label} invalid pair "${pair.id}" has an empty field`)
    }
    const joined = (pair.prefix + pair.root).toLowerCase()
    if (exampleWords.has(joined)) {
      problems.push(`${label} invalid pair "${pair.id}" forms "${joined}" which is used as an example word`)
    }
  }

  return problems
}

/**
 * Cross-dataset check (contracts/dataset.md invariant 5): the two datasets must
 * not share identical example sentences, since they are not translations.
 */
export function validateCrossDataset(first: PrefixDataset, second: PrefixDataset): string[] {
  const problems: string[] = []
  const sentences = new Set<string>()
  for (const entry of first.entries) {
    for (const ex of entry.examples) sentences.add(ex.sentence.toLowerCase())
  }
  for (const entry of second.entries) {
    for (const ex of entry.examples) {
      if (sentences.has(ex.sentence.toLowerCase())) {
        problems.push(`identical example sentence "${ex.sentence}" in both datasets`)
      }
    }
  }
  return problems
}

/**
 * Fails fast on dataset violations. Called by each dataset file at module load so
 * a broken dataset surfaces during typecheck/dev/build (research.md R8).
 */
export function assertDatasetValid(dataset: PrefixDataset): void {
  const problems = validatePrefixDataset(dataset)
  if (problems.length > 0) {
    throw new Error(`[prefixPirates] Invalid ${dataset.language} dataset:\n- ${problems.join('\n- ')}`)
  }
}