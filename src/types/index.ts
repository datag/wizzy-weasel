import type { Component } from 'vue'

// Directions
export type Direction = 'left' | 'right' | 'up' | 'down'

export type PromptMode = 'text' | 'emoji'

// User profile
export interface User {
  name: string
  avatar: string  // emoji character, e.g. '🦡'
  level: number
  xp: number
  boost: number  // 0–5, global boost/power indicator (not used in game logic yet)
}

// Game configuration
export interface GameConfig {
  id: string
  titleKey: string        // i18n key
  descriptionKey: string  // i18n key
  icon: string            // emoji
  color: string           // Tailwind gradient classes
  path: string
  component: Component
}

// Direction-Quix round state
export interface QuixRound {
  direction: Direction
  promptMode: PromptMode
  promptColor: string
  positionX: number  // % offset for random placement
  positionY: number
  timeLimit: number  // ms
}

// Missing Letter word entry
export interface MissingLetterWord {
  sentenceBefore: string  // text in sentence before the target word
  before: string          // text before the gap inside target word
  solution: string        // the missing letter(s)
  after: string           // text after the gap inside target word
  sentenceAfter: string   // text in sentence after the target word
}

// Mystical Times Table question
export type TimesTableQuestionType = 'find-product' | 'find-factor'

export interface TimesTableQuestion {
  questionType: TimesTableQuestionType
  factorA: number
  factorB: number
  product: number   // factorA * factorB
}

// Mystical Division Oracle question
export type DivisionQuestionType = 'find-dividend' | 'find-divisor'

export interface DivisionQuestion {
  questionType: DivisionQuestionType
  dividend: number
  divisor: number
  quotient: number   // dividend / divisor (always clean division)
}

// IT Hardware Quiz
export interface HardwareAnswer {
  textKey: string   // i18n key for answer text
  correct: boolean
}

export interface HardwareQuestion {
  id: string
  questionKey: string          // i18n key for question text
  type: 'single' | 'multiple'
  correctCount?: number        // only for multiple-choice
  answers: HardwareAnswer[]    // always 5 entries
}

export interface HardwareItem {
  id: string
  nameKey: string        // i18n key for hardware name
  image: string          // path to SVG placeholder
  emoji: string
  questions: HardwareQuestion[]
}

// Bundesländer-Quiz
export type BundeslandMode = 'map-to-name' | 'name-to-map'

export interface Bundesland {
  id: string           // ISO 3166-2 code, e.g. 'DE-BY'
  svgPathId: string    // the `id` attribute of the <path> in map-germany.svg
  nameKey: string      // i18n key for the state name
  flagPath: string     // relative path to the flag SVG asset
  capital: string      // Landeshauptstadt
}

export interface BundeslandQuestion {
  bundesland: Bundesland
  mode: BundeslandMode
  options: Bundesland[]  // 4 choices for map-to-name mode (includes correct one)
}

// Language Detective
export type LanguageId = 'de' | 'en' | 'fr' | 'es' | 'it'

export interface LanguageQuestion {
  language: LanguageId  // correct answer
  sentence: string
  options: LanguageId[] // 4 choices (includes correct one)
}

// Sequence Train (Setze die Reihe fort)
export type SequenceDifficulty = 'easy' | 'medium' | 'hard'

export type SequenceCategory = 'arithmetic' | 'geometric' | 'alternating' | 'shape'

export type SequenceMode = SequenceCategory | 'all'

export type SequenceQuestion =
  | {
      category: 'arithmetic' | 'geometric' | 'alternating'
      terms: number[]
      hiddenIndex: number  // index of the missing term (the '?' carriage)
      solution: number
      explanation: string  // localized description of the pattern rule
    }
  | {
      category: 'shape'
      shapes: string[]
      hiddenIndex: number  // index of the missing term (the '?' carriage)
      solution: string
      options: string[]    // 4 choices (includes correct one)
      explanation: string  // localized description of the pattern rule
    }

// Wortarten-Safari
export type SafariWordClass =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'article'
  | 'pronoun'
  | 'preposition'
  | 'numeral'
  | 'adverb'
  | 'conjunction'
  | 'interjection'
  | 'other'

export interface SafariToken {
  id: string
  raw: string              // Wort in korrekter Groß-/Kleinschreibung
  wordClass: SafariWordClass
  isSentenceEnd: boolean  // Ist dieses Wort das letzte Wort eines Satzes?
  hasComma?: boolean      // Folgt auf dieses Wort im Satz ein Komma?
  isCapitalized: boolean  // Gehört dieses Wort großgeschrieben?
  explanation: string     // Kurzerklärung für das Popover
}

export interface SafariStory {
  id: string
  title: string
  tokens: SafariToken[]   // Alle Token der 5 Sätze in Reihenfolge
}

export interface SafariWordClassConfig {
  key: SafariWordClass
  nameKey: string
  childNameKey: string
  color: string
  bgClass: string
  textClass: string
  borderClass: string
  badgeClass: string
  defaultActive: boolean
}

// Präfix-Piraten (Prefix Pirates)
export type PrefixLanguage = 'de' | 'en'
export type PrefixOrigin = 'germanic' | 'latin' | 'greek'
export type PrefixDifficulty = 'easy' | 'medium' | 'hard'

export type PrefixQuestionType =
  | 'prefix-choice'
  | 'meaning-match'
  | 'prefix-in-word'
  | 'sentence-gap'
  | 'origin-assignment'
  | 'validity-verdict'

export interface PrefixExample {
  word: string
  sentence: string
}

export interface PrefixEntry {
  id: string
  prefix: string
  variants?: string[]
  origin: PrefixOrigin
  meaning: string
  examples: PrefixExample[]
}

export interface PrefixInvalidPair {
  id: string
  prefix: string
  root: string
  explanation: string
}

export interface PrefixDataset {
  language: PrefixLanguage
  entries: PrefixEntry[]
  invalidPairs: PrefixInvalidPair[]
}

export type PrefixQuestion =
  | {
      type: 'prefix-choice'
      root: string
      options: string[]
      correctIndex: number
      entry: PrefixEntry
    }
  | {
      type: 'meaning-match'
      prefix: string
      options: string[]
      correctIndex: number
      entry: PrefixEntry
    }
  | {
      type: 'prefix-in-word'
      word: string
      options: string[]
      correctIndex: number
      entry: PrefixEntry
    }
  | {
      type: 'sentence-gap'
      sentenceWithGap: string
      options: string[]
      correctIndex: number
      entry: PrefixEntry
    }
  | {
      type: 'origin-assignment'
      prefix: string
      options: string[]
      correctIndex: number
      entry: PrefixEntry
    }
  | {
      type: 'validity-verdict'
      prefix: string
      root: string
      displayWord: string
      isReal: boolean
      entry: PrefixEntry | null
      pair: PrefixInvalidPair | null
    }

export interface PrefixRound {
  language: PrefixLanguage
  difficulty: PrefixDifficulty
  activeOrigins: PrefixOrigin[]
  questions: PrefixQuestion[]
  index: number
  correctCount: number
  score: number
  coinChain: number
  longestChain: number
}

