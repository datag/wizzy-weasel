<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { GAMES } from '@/games/index'

const route = useRoute()
const router = useRouter()

const gameId = route.params.id as string
const game = GAMES.find(g => g.id === gameId)

function onExit() {
  router.push('/')
}
</script>

<template>
  <!-- Game view: full screen, no navbar -->
  <div class="fixed inset-0 bg-slate-900 overflow-hidden">
    <component
      v-if="game"
      :is="game.component"
      @exit="onExit"
    />
    <div v-else class="flex items-center justify-center h-full text-white">
      <p>Unknown game: {{ gameId }}</p>
    </div>
  </div>
</template>
