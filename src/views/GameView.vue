<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import DirectionQuix from '@/components/games/DirectionQuix.vue'

const route = useRoute()
const router = useRouter()

const gameId = route.params.id as string

function onExit() {
  router.push('/')
}
</script>

<template>
  <!-- Game view: full screen, no navbar -->
  <div class="fixed inset-0 bg-slate-900 overflow-hidden">
    <DirectionQuix
      v-if="gameId === 'direction-quix'"
      @exit="onExit"
    />
    <!-- fallback for unknown games -->
    <div v-else class="flex items-center justify-center h-full text-white">
      <p>Unknown game: {{ gameId }}</p>
    </div>
  </div>
</template>
