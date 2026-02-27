import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const detectedLocale = navigator.language.startsWith('en') ? 'en' : 'de'
  const locale = ref<'de' | 'en'>(detectedLocale)
  const soundEnabled = ref(true)
  const openAiApiKey = ref('')

  return { locale, soundEnabled, openAiApiKey }
}, {
  persist: true,
})
