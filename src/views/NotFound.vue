<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="min-h-[100dvh] flex items-center justify-center px-4">
    <div class="text-center space-y-6 max-w-md">
      <h1 class="text-3xl font-extrabold text-slate-800">{{ t('notFound.title') }}</h1>
      <p class="text-slate-500">{{ t('notFound.message') }}</p>
      <AppButton @click="router.push('/')">
        {{ t('notFound.home') }}
      </AppButton>
    </div>
  </div>
</template>