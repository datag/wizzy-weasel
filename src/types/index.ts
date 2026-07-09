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
  before: string    // text before the gap
  solution: string  // the missing letter(s)
  after: string     // text after the gap
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
