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
  {
    id: 'mystical-times-table',
    titleKey: 'mysticalTimesTable.title',
    descriptionKey: 'mysticalTimesTable.description',
    icon: '🔮',
    color: 'from-indigo-500 to-purple-700',
    path: '/game/mystical-times-table',
    component: defineAsyncComponent(() => import('@/components/games/MysticalTimesTable.vue')),
  },
  {
    id: 'mystical-division-oracle',
    titleKey: 'mysticalDivisionOracle.title',
    descriptionKey: 'mysticalDivisionOracle.description',
    icon: '✨',
    color: 'from-cyan-500 to-blue-600',
    path: '/game/mystical-division-oracle',
    component: defineAsyncComponent(() => import('@/components/games/MysticalDivisionOracle.vue')),
  },
]
