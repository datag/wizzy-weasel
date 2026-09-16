import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import GameView from '@/views/GameView.vue'
import NotFound from '@/views/NotFound.vue'
import Settings from '@/views/Settings.vue'

export { GAMES } from '@/games/index'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Dashboard },
    { path: '/game/:id', component: GameView },
    { path: '/settings', component: Settings },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  ],
})

export default router
