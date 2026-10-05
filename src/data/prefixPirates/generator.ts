import type {
  PrefixDataset,
  PrefixDifficulty,
  PrefixEntry,
  PrefixOrigin,
  PrefixQuestion,
  PrefixQuestionType,
  PrefixRound,
} from '@/types'
import { entriesByOrigin } from './dataset'

/**
 * Question generation for "Präfix-Piraten" (contracts/question-generation.md).
 * All rules G1–G7 apply. Every question is constructed so that exactly one
 * answer is correct by construction (spec FR-014).
 */

export const ROUND_LENGTH = 10

/** G1: allowed question types per difficulty (spec FR-005). */
export const TYPES_BY_DIFFICULTY: Record<PrefixDifficulty, PrefixQuestionType[]> = {
  easy: ['prefix-choice', 'prefix-in-word', 'sentence-gap'],
  medium: ['meaning-match', 'sentence-gap', 'validity-verdict'],
  hard: ['meaning-match', 'sentence-gap', 'origin-assignment', 'validity-verdict'],
}

/** FR-006: option counts. Origin assignment always shows the 3 families and the
 *  verdict always shows exactly 2 options (yes/no) — those two types have fewer
 *  possible answers than the count allows (spec FR-004 defines them as-is). */
export const OPTION_COUNTS: Record<PrefixDifficulty, number> = {
  easy: 2,
  medium: 3,
  hard: 4,
}

export const ORIGIN_ORDER: PrefixOrigin[] = ['germanic', 'latin', 'greek']

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** display form of a prefix including its spelling variants */
export function prefixLabel(entry: PrefixEntry): string {
  if (entry.variants && entry.variants.length > 0) {
    return [entry.prefix, ...entry.variants].join('/')
  }
  return entry.prefix
}

function prefixWithoutDash(entry: PrefixEntry): string {
  return entry.prefix.replace(/-$/, '')
}

/** all spellings of the entry, without the trailing dash (canonical + variants) */
function prefixSpellings(entry: PrefixEntry): string[] {
  const variants = entry.variants?.map(v => v.replace(/-$/, '')) ?? []
  const spellings = [prefixWithoutDash(entry), ...variants]
  // Match the LONGEST spelling first so assimilated forms split correctly:
  // "anonymous" must be matched by "an-" (not the shorter "a-"); this fixes
  // both languages at once (de "anonym", en "anonymous"). Order is stable for
  // equal lengths. Note: entries must not own a word identical to a spelling
  // (empty root) – the dataset validator enforces this.
  return spellings.sort((a, b) => b.length - a.length)
}

/** which spelling of the entry does the word start with (case-insensitive) */
function matchedPrefix(word: string, entry: PrefixEntry): string | null {
  const w = word.toLowerCase()
  for (const spelling of prefixSpellings(entry)) {
    if (w.startsWith(spelling)) return spelling
  }
  return null
}

/** strip the actually-matching prefix spelling (canonical or variant) from a word */
function stripPrefix(word: string, entry: PrefixEntry): string {
  const match = matchedPrefix(word, entry)
  return match ? word.slice(match.length) : word
}

/** pick `count` distinct distractors for the correct value from the full dataset */
function distractors(
  dataset: PrefixDataset,
  correct: string,
  map: (entry: PrefixEntry) => string,
  count: number
): string[] {
  const seen = new Set<string>([correct])
  const result: string[] = []
  const candidates = shuffle(dataset.entries)
  for (const entry of candidates) {
    if (result.length >= count) break
    const value = map(entry)
    if (!seen.has(value)) {
      seen.add(value)
      result.push(value)
    }
  }
  return result
}

function withCorrect(options: string[], correct: string): { options: string[]; correctIndex: number } {
  const pool = shuffle([correct, ...options])
  return { options: pool, correctIndex: pool.findIndex(v => v === correct) }
}

/** G4-relevant gap: find the example whose word appears verbatim in its sentence */
function buildSentenceGap(entry: PrefixEntry): string {
  for (const ex of entry.examples) {
    const lowerSentence = ex.sentence.toLowerCase()
    const lowerWord = ex.word.toLowerCase()
    const idx = lowerSentence.indexOf(lowerWord)
    if (idx >= 0) {
      const match = matchedPrefix(ex.word, entry)
      const prefixLen = match ? match.length : prefixWithoutDash(entry).length
      const gappedWord = '___' + ex.word.slice(prefixLen)
      return ex.sentence.slice(0, idx) + gappedWord + ex.sentence.slice(idx + ex.word.length)
    }
  }
  // Fallback: show the word with its prefix gapped off.
  const word = entry.examples[0].word
  return '___' + stripPrefix(word, entry)
}

function buildPrefixChoice(entry: PrefixEntry, dataset: PrefixDataset, count: number): PrefixQuestion {
  const root = stripPrefix(entry.examples[0].word, entry)
  const correctWord = entry.examples[0].word
  const match = matchedPrefix(correctWord, entry)
  const options = withCorrect(
    distractors(dataset, correctWord, e => e.examples[0].word, count - 1),
    correctWord
  )
  return {
    type: 'prefix-choice',
    prefix: (match ?? prefixWithoutDash(entry)) + '-',
    root,
    options: options.options,
    correctIndex: options.correctIndex,
    entry,
  }
}

function buildMeaningMatch(entry: PrefixEntry, dataset: PrefixDataset, count: number): PrefixQuestion {
  const options = withCorrect(
    distractors(dataset, entry.meaning, e => e.meaning, count - 1),
    entry.meaning
  )
  return {
    type: 'meaning-match',
    prefix: prefixLabel(entry),
    options: options.options,
    correctIndex: options.correctIndex,
    entry,
  }
}

function buildPrefixInWord(entry: PrefixEntry, dataset: PrefixDataset, count: number): PrefixQuestion {
  const word = entry.examples[0].word
  const prefixPart = prefixLabel(entry)
  const rest = stripPrefix(word, entry)
  // Ensure the "rest" part does not collide with any prefix option.
  const base = [prefixPart, rest]
  const extra = shuffle(
    dataset.entries
      .filter(e => e.id !== entry.id)
      .map(prefixLabel)
      .filter(label => label !== rest && !base.includes(label))
  ).slice(0, Math.max(0, count - 2))
  const options = withCorrect(extra, prefixPart)
  return { type: 'prefix-in-word', word, options: options.options, correctIndex: options.correctIndex, entry }
}

function buildSentenceGapQuestion(entry: PrefixEntry, dataset: PrefixDataset, count: number): PrefixQuestion {
  // Show the full spelling set on the answer tile ("syn-/sym-"), because the
  // gapped word may contain an assimilated variant ("___metrie" needs "sym-",
  // not the canonical "syn-") – prefixLabel matches the earlier Varianten-Fix.
  const correct = prefixLabel(entry)
  const options = withCorrect(
    distractors(dataset, correct, prefixLabel, count - 1),
    correct
  )
  return {
    type: 'sentence-gap',
    sentenceWithGap: buildSentenceGap(entry),
    options: options.options,
    correctIndex: options.correctIndex,
    entry,
  }
}

function buildOriginAssignment(entry: PrefixEntry): PrefixQuestion {
  // Exactly the three origin families (data-model.md): 3 options by nature.
  const options = shuffle(ORIGIN_ORDER)
  return {
    type: 'origin-assignment',
    prefix: prefixLabel(entry),
    options,
    correctIndex: options.findIndex(v => v === entry.origin),
    entry,
  }
}

function buildValidityVerdict(
  dataset: PrefixDataset,
  pool: PrefixEntry[]
): PrefixQuestion {
  const isReal = Math.random() < 0.5
  if (isReal) {
    const entry = pickRandom(pool)
    const word = entry.examples[0].word
    return {
      type: 'validity-verdict',
      prefix: prefixLabel(entry),
      root: stripPrefix(word, entry),
      // Show the actual (real) word – the child just decides whether it exists.
      displayWord: word,
      isReal: true,
      entry,
      pair: null,
    }
  }
  const pair = pickRandom(dataset.invalidPairs)
  const joined = pair.prefix.replace(/-$/, '') + pair.root
  // If the root is a noun (starts uppercase), present the compound the way German
  // orthography would write it if it existed ("Abhimbeere"), so the child has to
  // judge by vocabulary and not by the casing (e.g. "abHimbeere" would be an
  // instant tell). For English roots this never triggers (nouns are lowercase).
  const rootUpcased = pair.root.length > 0 && pair.root[0] === pair.root[0].toUpperCase()
  // German compounds lowercase the second part ("Fahrkarte", "Unfähigkeit") –
  // so a plausible non-word from ab- + Himbeere is written "Abhimbeere".
  const displayWord = rootUpcased
    ? joined.charAt(0).toUpperCase() + joined.slice(1).toLowerCase()
    : joined
  return {
    type: 'validity-verdict',
    prefix: pair.prefix,
    root: pair.root,
    displayWord,
    isReal: false,
    entry: null,
    pair,
  }
}

function buildOneQuestion(
  dataset: PrefixDataset,
  difficulty: PrefixDifficulty,
  pool: PrefixEntry[],
  entry: PrefixEntry
): PrefixQuestion {
  const allowed = TYPES_BY_DIFFICULTY[difficulty]
  const type = pickRandom(allowed)
  const count = OPTION_COUNTS[difficulty]

  switch (type) {
    case 'prefix-choice':
      return buildPrefixChoice(entry, dataset, count)
    case 'meaning-match':
      return buildMeaningMatch(entry, dataset, count)
    case 'prefix-in-word':
      return buildPrefixInWord(entry, dataset, count)
    case 'sentence-gap':
      return buildSentenceGapQuestion(entry, dataset, count)
    case 'origin-assignment':
      return buildOriginAssignment(entry)
    case 'validity-verdict':
      return buildValidityVerdict(dataset, pool)
  }
}

/** G2: entry selection without immediate repetition; restart once the pool is exhausted. */
function pickPoolEntry(pool: PrefixEntry[], entryIdBlacklist: readonly string[]): PrefixEntry {
  const available = pool.filter(e => !entryIdBlacklist.includes(e.id))
  return pickRandom(available.length > 0 ? available : pool)
}

export function buildQuestion(opts: {
  dataset: PrefixDataset
  difficulty: PrefixDifficulty
  activeOrigins: PrefixOrigin[]
  usedEntryIds: string[]
}): { question: PrefixQuestion; usedEntryIds: string[] } {
  const pool = entriesByOrigin(opts.dataset, opts.activeOrigins)
  if (pool.length === 0) {
    throw new Error('[prefixPirates] No entries match the active origins.')
  }
  const used = [...opts.usedEntryIds]
  if (used.length >= pool.length) {
    // pool exhausted → restart bookkeeping (FR-007)
    used.length = 0
  }
  const entry = pickPoolEntry(pool, used)
  used.push(entry.id)

  const question = buildOneQuestion(opts.dataset, opts.difficulty, pool, entry)
  return { question, usedEntryIds: used }
}

/** Convenience: build a complete round of 10 questions (FR-009). */
export function buildRound(
  dataset: PrefixDataset,
  difficulty: PrefixDifficulty,
  activeOrigins: PrefixOrigin[]
): PrefixRound {
  let usedEntryIds: string[] = []
  const questions: PrefixQuestion[] = []
  for (let i = 0; i < ROUND_LENGTH; i++) {
    const result = buildQuestion({ dataset, difficulty, activeOrigins, usedEntryIds })
    questions.push(result.question)
    usedEntryIds = result.usedEntryIds
  }
  return {
    language: dataset.language,
    difficulty,
    activeOrigins,
    questions,
    index: 0,
    correctCount: 0,
    score: 0,
    coinChain: 0,
    longestChain: 0,
  }
}