<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RefreshCw } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'

defineEmits<{ (e: 'dismiss'): void }>()

const { t } = useI18n()

function reload() {
  window.location.href = import.meta.env.BASE_URL + '?_cb=' + Date.now()
}
</script>

<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="bg-slate-800 border border-white/10 rounded-3xl shadow-2xl px-8 py-8 flex flex-col items-center gap-6 w-full max-w-sm mx-4">
      <RefreshCw class="text-violet-400 size-12" />
      <div class="text-center">
        <h2 class="text-2xl font-extrabold text-white mb-2">{{ t('update.title') }}</h2>
        <p class="text-slate-300 text-sm leading-relaxed">{{ t('update.body') }}</p>
      </div>
      <div class="flex flex-col gap-3 w-full">
        <AppButton size="lg" full-width @click="reload()">
          {{ t('update.confirm') }}
        </AppButton>
        <AppButton variant="secondary" size="lg" full-width @click="$emit('dismiss')">
          {{ t('update.dismiss') }}
        </AppButton>
      </div>
    </div>
  </div>
</template>
