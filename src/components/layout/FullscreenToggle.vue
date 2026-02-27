<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Maximize2, Minimize2 } from 'lucide-vue-next'

const { t } = useI18n()
const isFullscreen = ref(false)

document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})

function toggle() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<template>
  <button
    class="flex items-center justify-center w-11 h-11 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
    :aria-label="isFullscreen ? t('nav.exitFullscreen') : t('nav.fullscreen')"
    @click="toggle"
  >
    <Minimize2 v-if="isFullscreen" :size="20" />
    <Maximize2 v-else :size="20" />
  </button>
</template>
