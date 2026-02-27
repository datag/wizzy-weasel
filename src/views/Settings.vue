<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'

const { t } = useI18n()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

const { name: userName, avatar: userAvatar } = storeToRefs(userStore)
const { locale, soundEnabled, openAiApiKey } = storeToRefs(settingsStore)

// Local form state
const localName = ref(userName.value)
const localAvatar = ref(userAvatar.value)
const localLocale = ref(locale.value)
const localSound = ref(soundEnabled.value)
const localApiKey = ref(openAiApiKey.value)
const saved = ref(false)

const { locale: i18nLocale } = useI18n()

const AVATARS = ['🦡', '🦊', '🐸', '🐼', '🦄', '🐉', '🦁', '🐯', '🐺', '🦅', '🐧', '🐙']

function save() {
  userName.value = localName.value
  userAvatar.value = localAvatar.value
  locale.value = localLocale.value
  soundEnabled.value = localSound.value
  openAiApiKey.value = localApiKey.value
  i18nLocale.value = localLocale.value
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}

function resetProgress() {
  if (confirm(t('settings.resetConfirm'))) {
    userStore.reset()
    localName.value = userName.value
    localAvatar.value = userAvatar.value
  }
}

watch(localLocale, (l) => {
  i18nLocale.value = l
})
</script>

<template>
  <div class="max-w-lg mx-auto px-4 py-8 space-y-6">
    <h1 class="text-2xl font-extrabold text-slate-800">{{ t('settings.title') }}</h1>

    <!-- Profile -->
    <AppCard>
      <h2 class="text-base font-bold text-slate-600 mb-4">{{ t('settings.profile') }}</h2>

      <label class="block mb-4">
        <span class="text-sm font-semibold text-slate-600">{{ t('settings.yourName') }}</span>
        <input
          v-model="localName"
          type="text"
          maxlength="20"
          class="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </label>

      <div>
        <p class="text-sm font-semibold text-slate-600 mb-2">{{ t('avatars.pick') }}</p>
        <div class="grid grid-cols-6 gap-2">
          <button
            v-for="emoji in AVATARS"
            :key="emoji"
            class="w-full aspect-square rounded-xl text-2xl flex items-center justify-center transition-all active:scale-90"
            :class="localAvatar === emoji ? 'bg-violet-100 ring-2 ring-violet-400' : 'hover:bg-slate-100'"
            @click="localAvatar = emoji"
          >{{ emoji }}</button>
        </div>
      </div>
    </AppCard>

    <!-- Language -->
    <AppCard>
      <h2 class="text-base font-bold text-slate-600 mb-4">{{ t('settings.language') }}</h2>
      <div class="flex gap-3">
        <button
          class="flex-1 py-3 rounded-xl font-semibold border-2 transition-all"
          :class="localLocale === 'de' ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-600'"
          @click="localLocale = 'de'"
        >🇩🇪 {{ t('settings.german') }}</button>
        <button
          class="flex-1 py-3 rounded-xl font-semibold border-2 transition-all"
          :class="localLocale === 'en' ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-600'"
          @click="localLocale = 'en'"
        >🇬🇧 {{ t('settings.english') }}</button>
      </div>
    </AppCard>

    <!-- Sound -->
    <AppCard>
      <h2 class="text-base font-bold text-slate-600 mb-4">{{ t('settings.sound') }}</h2>
      <div class="flex gap-3">
        <button
          class="flex-1 py-3 rounded-xl font-semibold border-2 transition-all"
          :class="localSound ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-600'"
          @click="localSound = true"
        >🔊 {{ t('settings.soundOn') }}</button>
        <button
          class="flex-1 py-3 rounded-xl font-semibold border-2 transition-all"
          :class="!localSound ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-600'"
          @click="localSound = false"
        >🔇 {{ t('settings.soundOff') }}</button>
      </div>
    </AppCard>

    <!-- OpenAI API Key -->
    <AppCard>
      <label class="block">
        <span class="text-sm font-semibold text-slate-600">{{ t('settings.openAiKey') }}</span>
        <input
          v-model="localApiKey"
          type="password"
          autocomplete="off"
          class="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-violet-400 font-mono text-sm"
          placeholder="sk-…"
        />
      </label>
    </AppCard>

    <!-- Actions -->
    <div class="space-y-3">
      <AppButton full-width size="lg" @click="save">
        {{ saved ? t('settings.saved') : t('settings.save') }} {{ saved ? '✅' : '' }}
      </AppButton>
      <AppButton variant="danger" full-width @click="resetProgress">
        {{ t('settings.resetProgress') }}
      </AppButton>
    </div>
  </div>
</template>
