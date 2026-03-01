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
  color: string           // Tailwind bg class
  path: string
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
