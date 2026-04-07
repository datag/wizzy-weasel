<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppButton from '@/components/ui/AppButton.vue'

const emit = defineEmits<{
  (e: 'resume'): void
  (e: 'exit'): void
}>()

const { t } = useI18n()

function onKeyDown(e: KeyboardEvent) {
  // ESC or any key resumes; prevent triggering game input
  e.preventDefault()
  e.stopPropagation()
  emit('resume')
}

onMounted(() => window.addEventListener('keydown', onKeyDown, { capture: true }))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown, { capture: true }))
</script>

<template>
  <div class="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="bg-slate-800 border border-white/10 rounded-3xl shadow-2xl px-8 py-8 flex flex-col items-center gap-6 w-full max-w-xs mx-4">
      <div class="text-5xl">⏸️</div>
      <h2 class="text-3xl font-extrabold text-white">{{ t('game.paused') }}</h2>
      <div class="flex flex-col gap-3 w-full">
        <AppButton size="lg" full-width @click="emit('resume')">
          {{ t('game.resume') }}
        </AppButton>
        <AppButton variant="danger" size="lg" full-width @click="emit('exit')">
          {{ t('game.endGame') }}
        </AppButton>
      </div>
    </div>
  </div>
</template>
