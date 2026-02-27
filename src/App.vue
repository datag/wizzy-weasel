<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'

const route = useRoute()
const isGameView = computed(() => route.path.startsWith('/game/'))
</script>

<template>
  <div class="min-h-screen">
    <Navbar v-if="!isGameView" />
    <main>
      <RouterView />
    </main>
  </div>
</template>
