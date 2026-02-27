<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore, XP_PER_LEVEL } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import { GAMES } from '@/router/index'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const gameStore = useGameStore()
const { name, avatar, level, xp, xpProgress } = storeToRefs(userStore)
const { bestScore } = storeToRefs(gameStore)

const xpInLevel = computed(() => xp.value % XP_PER_LEVEL)

import { computed } from 'vue'
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8 space-y-8">
    <!-- Profile hero -->
    <AppCard>
      <div class="flex items-center gap-5">
        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-4xl shadow-lg flex-shrink-0">
          {{ avatar }}
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-extrabold text-slate-800">{{ t('dashboard.greeting', { name }) }}</h1>
          <p class="text-violet-600 font-semibold mt-0.5">{{ t('dashboard.level', { level }) }} · {{ t('dashboard.xp', { xp }) }}</p>
          <!-- XP progress bar -->
          <div class="mt-3 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full transition-all duration-500"
              :style="{ width: `${xpProgress * 100}%` }"
            />
          </div>
          <p class="text-xs text-slate-400 mt-1">{{ xpInLevel }} / {{ XP_PER_LEVEL }} XP</p>
        </div>
      </div>
    </AppCard>

    <!-- Game list -->
    <div>
      <h2 class="text-xl font-extrabold text-slate-700 mb-4">{{ t('dashboard.chooseGame') }}</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AppCard
          v-for="game in GAMES"
          :key="game.id"
          :padding="false"
          class="overflow-hidden"
        >
          <div :class="`bg-gradient-to-br ${game.color} p-6 text-white`">
            <div class="text-5xl mb-3">{{ game.icon }}</div>
            <h3 class="text-xl font-extrabold">{{ t(game.titleKey) }}</h3>
            <p class="text-white/80 text-sm mt-1">{{ t(game.descriptionKey) }}</p>
          </div>
          <div class="p-4 flex items-center justify-between">
            <span class="text-sm text-slate-500">
              {{ bestScore[game.id] != null ? t('dashboard.bestScore', { score: bestScore[game.id] }) : '—' }}
            </span>
            <AppButton size="sm" @click="router.push(game.path)">
              {{ t('dashboard.play') }}
            </AppButton>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>
