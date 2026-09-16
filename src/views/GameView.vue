<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { GAMES } from '@/games/index'
import NotFound from '@/views/NotFound.vue'

const route = useRoute()
const router = useRouter()

const gameId = route.params.id as string
const game = GAMES.find(g => g.id === gameId)

function onExit() {
  router.push('/')
}
</script>

<template>
  <div v-if="game" class="fixed inset-0 bg-slate-900 overflow-hidden">
    <component
      :is="game.component"
      @exit="onExit"
    />
  </div>
  <NotFound v-else />
</template>
