<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore, XP_PER_CORRECT } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import { useSettingsStore } from '@/stores/settings'
import { buildSession, FLAG_URLS, LANGUAGE_NAME_KEYS } from '@/data/languageQuiz'
import type { LanguageId, LanguageQuestion } from '@/types'
import AppButton from '@/components/ui/AppButton.vue'
import PauseModal from '@/components/ui/PauseModal.vue'

const emit = defineEmits<{ (e: 'exit'): void }>()

const { t } = useI18n()
const userStore = useUserStore()
const gameStore = useGameStore()
const settingsStore = useSettingsStore()

// ─── Game state ───────────────────────────────────────────────
type Phase = 'ready' | 'playing' | 'feedback-correct' | 'feedback-wrong' | 'gameover'
const phase = ref<Phase>('ready')
const sessionScore = ref(0)
const correctCount = ref(0)
const wrongCount = ref(0)
const isPaused = ref(false)

// ─── Session / question state ─────────────────────────────────
let session: LanguageQuestion[] = []
let selectedLanguage: LanguageId | null = null
const questionIndex = ref(0)
const current = computed(() => session[questionIndex.value] ?? null)
const totalQuestions = computed(() => session.length)

const progressPct = computed(() =>
  totalQuestions.value > 0 ? (questionIndex.value / totalQuestions.value) * 100 : 0
)

// ─── Translation ──────────────────────────────────────────────
const translationCache = new Map<string, string>()
const translation = ref('')
const translating = ref(false)
const translationError = ref(false)

async function toggleTranslation() {
  const q = current.value
  if (!q) return
  if (translation.value) {
    translation.value = ''
    return
  }
  if (translationCache.has(q.sentence)) {
    translation.value = translationCache.get(q.sentence)!
    return
  }

  translating.value = true
  translationError.value = false
  try {
    const url = 'https://api.mymemory.translated.net/get'
      + `?q=${encodeURIComponent(q.sentence)}`
      + `&langpair=autodetect%7C${encodeURIComponent(settingsStore.locale)}`
    const res = await fetch(url)
    const data = await res.json()
    const text = data?.responseData?.translatedText
    if (typeof text === 'string' && text) {
      translationCache.set(q.sentence, text)
      translation.value = text
    } else {
      translationError.value = true
    }
  } catch {
    translationError.value = true
  } finally {
    translating.value = false
  }
}

// ─── Game flow ────────────────────────────────────────────────
function startGame() {
  // Exclude the current app locale from sentences and answer options
  const appLocale: LanguageId = settingsStore.locale
  session = buildSession(appLocale)
  questionIndex.value = 0
  sessionScore.value = 0
  correctCount.value = 0
  wrongCount.value = 0
  selectedLanguage = null
  gameStore.startGame('language-detective')
  phase.value = 'playing'
}

function pauseGame() {
  if (!['playing'].includes(phase.value) || isPaused.value) return
  isPaused.value = true
}

function resumeGame() {
  if (!isPaused.value) return
  isPaused.value = false
}

function exitGame() {
  isPaused.value = false
  gameStore.endGame()
  emit('exit')
}

function endGame() {
  gameStore.endGame()
  phase.value = 'gameover'
}

// ─── Answer selection ─────────────────────────────────────────
function selectLanguage(lang: LanguageId) {
  if (phase.value !== 'playing' || !current.value) return
  selectedLanguage = lang

  if (lang === current.value.language) {
    userStore.addXp(XP_PER_CORRECT)
    gameStore.addScore(XP_PER_CORRECT)
    sessionScore.value += XP_PER_CORRECT
    correctCount.value++
    phase.value = 'feedback-correct'
  } else {
    userStore.loseBoost(1)
    wrongCount.value++
    phase.value = 'feedback-wrong'
  }
}

function nextQuestion() {
  if (questionIndex.value + 1 >= totalQuestions.value) {
    endGame()
  } else {
    questionIndex.value++
    selectedLanguage = null
    translation.value = ''
    translationError.value = false
    phase.value = 'playing'
  }
}

// ─── Keyboard ─────────────────────────────────────────────────
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    if (isPaused.value) resumeGame()
    else pauseGame()
    return
  }
  if (isPaused.value) return

  if ((phase.value === 'feedback-correct' || phase.value === 'feedback-wrong') && e.key === 'Enter') {
    nextQuestion()
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))

// ─── Style helpers ────────────────────────────────────────────
function answerClass(lang: LanguageId): string {
  const base = 'w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all min-h-[44px] sm:min-h-[52px] border-2 flex items-center gap-3 '

  if (phase.value === 'playing') {
    return base + 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 active:scale-95'
  }

  // Feedback phase
  if (!current.value) return base
  if (lang === current.value.language) {
    return base + 'bg-green-500 border-green-400 text-white'
  }
  if (lang === selectedLanguage) {
    return base + 'bg-red-500 border-red-400 text-white'
  }
  return base + 'bg-white/10 border-white/10 text-white/40'
}
</script>

<template>
  <div class="relative w-full h-full select-none text-white flex flex-col bg-slate-900">

    <!-- ── READY screen ── -->
    <Transition name="fade">
      <div v-if="phase === 'ready'" class="flex flex-col items-center justify-center h-full gap-6 px-6 text-center">
        <div class="text-7xl">🕵️</div>
        <h1 class="text-4xl font-extrabold">{{ t('languageQuiz.title') }}</h1>
        <p class="text-white/70 text-lg max-w-sm">{{ t('languageQuiz.description') }}</p>
        <AppButton size="lg" @click="startGame">{{ t('game.go') }}</AppButton>
        <button class="text-white/50 text-sm underline mt-2" @click="emit('exit')">{{ t('game.backToMenu') }}</button>
      </div>
    </Transition>

    <!-- ── PLAYING / FEEDBACK screens ── -->
    <template v-if="phase === 'playing' || phase === 'feedback-correct' || phase === 'feedback-wrong'">

      <!-- Progress bar -->
      <div class="w-full h-2 bg-white/10 flex-shrink-0">
        <div
          class="h-full bg-fuchsia-500 rounded-r-full transition-all duration-300"
          :style="{ width: `${progressPct}%` }"
        />
      </div>

      <!-- HUD -->
      <div class="flex items-center gap-2 px-2 sm:px-3 pt-2 sm:pt-3 pb-1 flex-shrink-0">
        <!-- Pause button -->
        <button
          class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-base"
          :title="t('game.paused')"
          @click="pauseGame"
        >
          ⏸
        </button>
        <span class="flex-1 text-sm font-semibold text-white/70 text-center">
          {{ t('languageQuiz.questionOf', { current: questionIndex + 1, total: totalQuestions }) }}
        </span>
        <span class="flex-shrink-0 text-sm font-bold bg-white/10 rounded-full px-3 py-1">
          {{ t('game.score', { score: sessionScore }) }}
        </span>
      </div>

      <!-- Main content -->
      <div v-if="current" class="flex-1 min-h-0 flex flex-col items-center gap-2 sm:gap-4 px-4 pb-2 sm:pb-4 overflow-hidden">

        <!-- Sentence -->
        <div class="w-full max-w-lg rounded-2xl bg-white/10 border border-white/20 px-4 sm:px-6 py-4 sm:py-6 text-center flex-shrink-0">
          <p :key="questionIndex" class="text-2xl sm:text-4xl font-bold leading-snug">
            {{ current.sentence }}
          </p>

          <button
            class="mt-3 text-sm sm:text-base font-semibold text-fuchsia-300 underline underline-offset-2 transition-colors flex-shrink-0"
            :disabled="translating"
            @click="toggleTranslation"
          >
            {{ translation ? t('languageQuiz.hideTranslation') : t('languageQuiz.translate') }}
          </button>

          <Transition name="pop">
            <p v-if="translation" :key="questionIndex" class="mt-2 text-lg sm:text-2xl font-semibold text-white/80 leading-snug">
              {{ translation }}
            </p>
            <p v-else-if="translationError" class="mt-2 text-sm font-medium text-red-300">
              {{ t('languageQuiz.translationFailed') }}
            </p>
          </Transition>
        </div>

        <!-- Prompt -->
        <p class="text-sm sm:text-lg text-fuchsia-300 font-semibold text-center flex-shrink-0">
          {{ t('languageQuiz.whichLanguage') }}
        </p>

        <!-- Answer buttons -->
        <div class="w-full max-w-lg flex flex-col gap-2 sm:gap-3 flex-shrink-0">
          <button
            v-for="lang in current.options"
            :key="lang"
            :class="answerClass(lang)"
            :disabled="phase !== 'playing'"
            @click="selectLanguage(lang)"
          >
            <span class="flex items-center gap-3 justify-start w-full">
              <img
                :src="FLAG_URLS[lang]"
                :alt="t(LANGUAGE_NAME_KEYS[lang])"
                class="w-10 h-7 sm:w-12 sm:h-8 rounded-sm object-cover flex-shrink-0"
                draggable="false"
              />
              <span class="flex-1 text-left">{{ t(LANGUAGE_NAME_KEYS[lang]) }}</span>
            </span>
          </button>
        </div>

        <!-- Feedback message -->
        <Transition name="pop">
          <div v-if="phase === 'feedback-correct'" class="text-xl sm:text-2xl font-extrabold text-green-300 flex-shrink-0">
            {{ t('languageQuiz.correct', { xp: XP_PER_CORRECT }) }}
          </div>
          <div v-else-if="phase === 'feedback-wrong'" class="text-xl sm:text-2xl font-extrabold text-red-300 flex-shrink-0">
            {{ t('languageQuiz.wrong') }}
          </div>
        </Transition>

        <!-- Next button (feedback phase) -->
        <div v-if="phase === 'feedback-correct' || phase === 'feedback-wrong'" class="flex-shrink-0 w-full max-w-lg">
          <AppButton size="md" full-width @click="nextQuestion">
            {{ t('languageQuiz.next') }} →
          </AppButton>
        </div>

      </div>
    </template>

    <!-- ── GAME OVER screen ── -->
    <Transition name="fade">
      <div v-if="phase === 'gameover'" class="flex flex-col items-center justify-center h-full gap-5 px-6 text-center">
        <div class="text-6xl">🏁</div>
        <h2 class="text-4xl font-extrabold">{{ t('game.gameOver') }}</h2>
        <p class="text-2xl font-bold text-yellow-300">{{ t('game.finalScore', { score: sessionScore }) }}</p>

        <div class="flex gap-6 text-lg font-semibold mt-2">
          <span class="text-green-300">✅ {{ correctCount }}</span>
          <span class="text-red-300">❌ {{ wrongCount }}</span>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-4">
          <AppButton size="lg" full-width @click="startGame">{{ t('game.playAgain') }}</AppButton>
          <AppButton variant="secondary" size="lg" full-width @click="emit('exit')">{{ t('game.backToMenu') }}</AppButton>
        </div>
      </div>
    </Transition>

    <!-- ── PAUSE modal ── -->
    <PauseModal v-if="isPaused" @resume="resumeGame" @exit="exitGame" />

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.pop-enter-active { animation: pop-in 0.15s ease-out; }
.pop-leave-active { animation: pop-out 0.12s ease-in; }
@keyframes pop-in {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes pop-out {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.7); }
}
</style>