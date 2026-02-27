<script setup lang="ts">
import { useUserStore, MAX_STAMINA } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
const { name, avatar, level, stamina } = storeToRefs(userStore)
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Stamina hearts -->
    <div class="flex items-center gap-0.5" :aria-label="t('game.stamina')">
      <span
        v-for="i in MAX_STAMINA"
        :key="i"
        class="text-lg leading-none transition-all"
        :class="i <= stamina ? 'opacity-100' : 'opacity-25 grayscale'"
      >❤️</span>
    </div>
    <!-- Profile chip -->
    <div class="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-white text-sm font-semibold">
      <span class="text-xl leading-none">{{ avatar }}</span>
      <span class="hidden sm:inline">{{ name }}</span>
      <span class="text-white/70 text-xs">Lv.{{ level }}</span>
    </div>
  </div>
</template>
