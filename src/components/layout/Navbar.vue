<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Settings } from 'lucide-vue-next'
import FullscreenToggle from './FullscreenToggle.vue'
import ProfileIndicator from './ProfileIndicator.vue'

const { t } = useI18n()
const route = useRoute()
</script>

<template>
  <header class="sticky top-0 z-50 bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg">
    <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
      <!-- Logo -->
      <RouterLink
        to="/"
        class="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight hover:opacity-90 transition-opacity"
        :aria-label="t('nav.home')"
      >
        <span class="text-2xl">🦡</span>
        <span class="hidden sm:inline">EduPlay Kids</span>
      </RouterLink>

      <!-- Right side actions -->
      <div class="flex items-center gap-1">
        <ProfileIndicator />
        <FullscreenToggle />
        <RouterLink
          to="/settings"
          class="flex items-center justify-center w-11 h-11 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          :aria-label="t('nav.settings')"
          :class="route.path === '/settings' ? 'bg-white/20 text-white' : ''"
        >
          <Settings :size="20" />
        </RouterLink>
      </div>
    </div>
  </header>
</template>
