import { defineAsyncComponent } from 'vue'
import type { GameConfig } from '@/types'

export const GAMES: GameConfig[] = [
  {
    id: 'direction-quix',
    titleKey: 'directionQuix.title',
    descriptionKey: 'directionQuix.description',
    icon: '🧭',
    color: 'from-violet-500 to-purple-600',
    path: '/game/direction-quix',
    component: defineAsyncComponent(() => import('@/components/games/DirectionQuix.vue')),
  },
  {
    id: 'missing-letter',
    titleKey: 'missingLetter.title',
    descriptionKey: 'missingLetter.description',
    icon: '📝',
    color: 'from-emerald-500 to-teal-600',
    path: '/game/missing-letter',
    component: defineAsyncComponent(() => import('@/components/games/MissingLetter.vue')),
  },
]
