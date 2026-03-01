import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import GameView from '@/views/GameView.vue'
import Settings from '@/views/Settings.vue'

export const GAMES = [
  {
    id: 'direction-quix',
    titleKey: 'directionQuix.title',
    descriptionKey: 'directionQuix.description',
    icon: '🧭',
    color: 'from-violet-500 to-purple-600',
    path: '/game/direction-quix',
  },
  {
    id: 'missing-letter',
    titleKey: 'missingLetter.title',
    descriptionKey: 'missingLetter.description',
    icon: '📝',
    color: 'from-emerald-500 to-teal-600',
    path: '/game/missing-letter',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Dashboard },
    { path: '/game/:id', component: GameView },
    { path: '/settings', component: Settings },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
