<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore, XP_PER_CORRECT } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import type { MissingLetterWord } from '@/types/index'
import { WORD_LISTS } from '@/data/missingLetterWords'
import AppButton from '@/components/ui/AppButton.vue'
import PauseModal from '@/components/ui/PauseModal.vue'

const emit = defineEmits<{ (e: 'exit'): void }>()

const { t, locale } = useI18n()
const userStore = useUserStore()
const gameStore = useGameStore()

// ─── Constants ───────────────────────────────────────────────
const TOTAL_TASKS = 15

// ─── Game state ───────────────────────────────────────────────
type Phase = 'ready' | 'playing' | 'feedback-correct' | 'feedback-wrong' | 'gameover'
const phase = ref<Phase>('ready')
const sessionScore = ref(0)
const correctCount = ref(0)
const input = ref('')
const lastUserAnswer = ref('')
const feedbackWord = ref<MissingLetterWord | null>(null)
const missedWords = ref<MissingLetterWord[]>([])

// ─── Pause state ──────────────────────────────────────────────
const isPaused = ref(false)

// ─── Task session ─────────────────────────────────────────────
const taskIndex = ref(0)
const sessionWords = ref<MissingLetterWord[]>([])
const currentWord = computed(() => sessionWords.value[taskIndex.value] ?? null)
const currentDisplayWord = computed(() => feedbackWord.value ?? currentWord.value)
const progressPct = computed(() => (taskIndex.value / TOTAL_TASKS) * 100)

let advanceTimer: ReturnType<typeof setTimeout> | null = null

function getWordList(): MissingLetterWord[] {
  const lang = locale.value.startsWith('en') ? 'en' : 'de'
  return WORD_LISTS[lang] ?? WORD_LISTS['de']
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Game flow ────────────────────────────────────────────────
function startGame() {
  sessionScore.value = 0
  correctCount.value = 0
  missedWords.value = []
  taskIndex.value = 0
  feedbackWord.value = null
  input.value = ''
  lastUserAnswer.value = ''
  if (advanceTimer) {
    clearTimeout(advanceTimer)
    advanceTimer = null
  }

  const list = getWordList()
  sessionWords.value = shuffle(list).slice(0, TOTAL_TASKS)

  gameStore.startGame('missing-letter')
  phase.value = 'playing'
  nextTick(() => letterInput.value?.focus())
}

function pauseGame() {
  if (!['playing', 'feedback-correct', 'feedback-wrong'].includes(phase.value) || isPaused.value) return
  isPaused.value = true
}

function resumeGame() {
  if (!isPaused.value) return
  isPaused.value = false
  if (phase.value === 'playing') {
    nextTick(() => letterInput.value?.focus())
  }
}

function exitGame() {
  if (advanceTimer) {
    clearTimeout(advanceTimer)
    advanceTimer = null
  }
  isPaused.value = false
  gameStore.endGame()
  emit('exit')
}

function endGame() {
  if (advanceTimer) {
    clearTimeout(advanceTimer)
    advanceTimer = null
  }
  gameStore.endGame()
  phase.value = 'gameover'
}

function nextTask() {
  if (advanceTimer) {
    clearTimeout(advanceTimer)
    advanceTimer = null
  }

  if (taskIndex.value + 1 >= TOTAL_TASKS) {
    endGame()
    return
  }

  taskIndex.value++
  feedbackWord.value = null
  input.value = ''
  lastUserAnswer.value = ''
  phase.value = 'playing'
  nextTick(() => letterInput.value?.focus())
}

function isNoLetter(val: string | null | undefined): boolean {
  if (!val) return false
  const trimmed = val.trim().toLowerCase()
  return trimmed === '-' || trimmed === '–' || trimmed === '—' || trimmed === 'ø' || trimmed === '0'
}

const lastUserAnswerDisplay = computed(() => {
  if (isNoLetter(lastUserAnswer.value)) {
    return t('missingLetter.noLetter')
  }
  return lastUserAnswer.value
})

function evaluateAnswer(userIsNoLetter: boolean, rawInput: string) {
  if (phase.value !== 'playing' || !currentWord.value) return
  const targetIsNoLetter = isNoLetter(currentWord.value.solution)

  lastUserAnswer.value = userIsNoLetter ? '–' : rawInput

  const correct = targetIsNoLetter
    ? userIsNoLetter
    : !userIsNoLetter && rawInput.toLowerCase() === currentWord.value.solution.toLowerCase()

  feedbackWord.value = currentWord.value

  if (correct) {
    userStore.addXp(XP_PER_CORRECT)
    gameStore.addScore(XP_PER_CORRECT)
    sessionScore.value += XP_PER_CORRECT
    correctCount.value++
    phase.value = 'feedback-correct'
    advanceTimer = setTimeout(() => nextTask(), 700)
  } else {
    missedWords.value.push(currentWord.value)
    phase.value = 'feedback-wrong'
    // Stays on feedback-wrong until user clicks Continue or presses Enter
  }
}

function submit() {
  const raw = input.value.trim()
  if (!raw) return
  const userIsNoLetter = isNoLetter(raw)
  evaluateAnswer(userIsNoLetter, raw)
}

function submitNoLetter() {
  if (hasInput.value) return
  evaluateAnswer(true, '')
}

// ─── Input ───────────────────────────────────────────────────
const letterInput = ref<HTMLInputElement | null>(null)

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    pauseGame()
    return
  }
  if (isPaused.value) return

  if (e.key === 'Enter') {
    if (phase.value === 'playing') {
      submit()
    } else if (phase.value === 'feedback-correct' || phase.value === 'feedback-wrong') {
      nextTask()
    }
  }
}

// ─── Display helpers ─────────────────────────────────────────
const hasInput = computed(() => input.value.trim().length > 0)

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  if (advanceTimer) {
    clearTimeout(advanceTimer)
    advanceTimer = null
  }
})
</script>

<template>
  <div class="relative w-full h-full select-none text-white flex flex-col">

    <!-- ── READY screen ── -->
    <Transition name="fade">
      <div v-if="phase === 'ready'" class="flex flex-col items-center justify-center h-full gap-6 px-6">
        <div class="text-7xl">📝</div>
        <h1 class="text-4xl font-extrabold text-center">{{ t('missingLetter.title') }}</h1>
        <p class="text-white/70 text-center text-lg max-w-sm">{{ t('missingLetter.description') }}</p>
        <AppButton size="lg" @click="startGame">{{ t('game.go') }}</AppButton>
        <button class="text-white/50 text-sm underline mt-2" @click="emit('exit')">{{ t('game.backToMenu') }}</button>
      </div>
    </Transition>

    <!-- ── PLAYING / FEEDBACK screens ── -->
    <template v-if="phase === 'playing' || phase === 'feedback-correct' || phase === 'feedback-wrong'">
      <!-- Progress bar -->
      <div class="w-full h-2 bg-white/10 flex-shrink-0">
        <div
          class="h-full bg-violet-400 rounded-r-full transition-all duration-300"
          :style="{ width: `${progressPct}%` }"
        />
      </div>

      <!-- HUD -->
      <div class="flex items-center justify-between px-3 sm:px-6 pt-2.5 sm:pt-4 pb-1 flex-shrink-0">
        <div class="flex items-center gap-2 sm:gap-3">
          <button
            class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-base"
            :aria-label="t('game.paused')"
            :title="t('game.paused')"
            @click="pauseGame"
          >
            ⏸
          </button>
          <span class="text-xs sm:text-base font-semibold text-white/80">
            {{ t('missingLetter.progress', { current: Math.min(taskIndex + 1, TOTAL_TASKS), total: TOTAL_TASKS }) }}
          </span>
        </div>
        <span class="text-xs sm:text-base font-bold bg-white/10 rounded-full px-2.5 sm:px-3 py-1">
          {{ t('game.score', { score: sessionScore }) }}
        </span>
      </div>

      <!-- Sentence and action area -->
      <div class="flex-1 min-h-0 flex flex-col items-center justify-start sm:justify-center gap-3 sm:gap-4 px-3 sm:px-8 pt-2.5 sm:pt-4 pb-4 sm:pb-6 overflow-y-auto">
        <div
          v-if="currentDisplayWord"
          class="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl sm:rounded-3xl p-3.5 sm:p-8 md:p-10 shadow-xl backdrop-blur-sm text-center leading-normal sm:leading-loose"
          :class="phase === 'playing' ? 'cursor-pointer' : ''"
          @click="phase === 'playing' && letterInput?.focus()"
        >
          <p class="text-lg sm:text-2xl md:text-3xl font-medium text-white/90">
            <span>{{ currentDisplayWord.sentenceBefore }}</span>
            <!-- Target word with bold highlight and gap/feedback -->
            <span class="inline-block font-extrabold text-amber-300 mx-1">
              <template v-if="phase === 'feedback-wrong' && feedbackWord">
                <template v-if="isNoLetter(feedbackWord.solution)">
                  <span class="bg-purple-600 text-white rounded-lg px-2.5 py-0.5 mx-0.5 font-black shadow-sm">
                    {{ feedbackWord.before }}{{ feedbackWord.after }}
                  </span>
                  <span class="text-sm sm:text-base font-bold text-purple-200 ml-1">
                    ({{ t('missingLetter.noLetter') }})
                  </span>
                </template>
                <template v-else>
                  <span>{{ feedbackWord.before }}</span>
                  <span class="bg-purple-600 text-white rounded-lg px-2 py-0.5 mx-0.5 font-black shadow-sm">{{ feedbackWord.solution }}</span>
                  <span>{{ feedbackWord.after }}</span>
                </template>
              </template>
              <template v-else-if="phase === 'feedback-correct' && feedbackWord">
                <template v-if="isNoLetter(feedbackWord.solution)">
                  <span class="bg-green-500 text-white rounded-lg px-2.5 py-0.5 mx-0.5 font-black shadow-sm">
                    {{ feedbackWord.before }}{{ feedbackWord.after }}
                  </span>
                  <span class="text-sm sm:text-base font-bold text-green-200 ml-1">
                    ({{ t('missingLetter.noLetter') }})
                  </span>
                </template>
                <template v-else>
                  <span>{{ feedbackWord.before }}</span>
                  <span class="bg-green-500 text-white rounded-lg px-2 py-0.5 mx-0.5 font-black shadow-sm">{{ feedbackWord.solution }}</span>
                  <span>{{ feedbackWord.after }}</span>
                </template>
              </template>
              <template v-else-if="currentWord">
                <span>{{ currentWord.before }}</span>
                <input
                  ref="letterInput"
                  v-model="input"
                  type="text"
                  :style="{ width: `${Math.max(currentWord.solution.length, input.length, 2) + 0.4}ch` }"
                  autocomplete="off"
                  autocorrect="off"
                  autocapitalize="off"
                  spellcheck="false"
                  class="inline-block border-b-4 border-amber-300 bg-white/10 rounded-t-md text-center font-extrabold text-blue-400 focus:bg-white/20 focus:border-amber-200 outline-none align-baseline px-0.5 mx-0.5 transition-all text-inherit leading-none"
                />
                <span>{{ currentWord.after }}</span>
              </template>
            </span>
            <span>{{ currentDisplayWord.sentenceAfter }}</span>
          </p>
        </div>

        <!-- Quick action: Kein Buchstabe button during playing phase -->
        <div v-if="phase === 'playing'" class="flex items-center justify-center pt-0.5">
          <button
            type="button"
            :disabled="hasInput"
            class="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all min-h-[44px] shadow-md select-none"
            :class="hasInput
              ? 'bg-white/5 text-white/30 border border-white/10 opacity-40 cursor-not-allowed'
              : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 active:scale-95 cursor-pointer'"
            @click="submitNoLetter"
          >
            <span class="text-lg leading-none font-extrabold">∅</span>
            <span class="text-sm sm:text-base">{{ t('missingLetter.noLetter') }}</span>
          </button>
        </div>

        <!-- Feedback message -->
        <Transition name="pop">
          <div
            v-if="phase === 'feedback-correct'"
            class="text-xl sm:text-2xl font-extrabold text-green-300"
          >
            {{ t('missingLetter.correct', { xp: XP_PER_CORRECT }) }}
          </div>
          <div
            v-else-if="phase === 'feedback-wrong'"
            class="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-center"
          >
            <span class="text-xl sm:text-2xl font-extrabold text-red-300">{{ t('missingLetter.wrong') }}</span>
            <div class="flex items-center gap-1.5 text-xs sm:text-base font-semibold text-white/80">
              <span>{{ t('missingLetter.yourInput') }}:</span>
              <span class="inline-flex items-center bg-red-500/25 border border-red-400/60 text-red-200 rounded-md px-2 py-0.5 text-sm sm:text-base font-bold shadow-sm">
                {{ lastUserAnswerDisplay }}
              </span>
            </div>
          </div>
        </Transition>

        <!-- Action button directly below task -->
        <div class="w-full max-w-xs flex items-center justify-center pt-1">
          <!-- Playing: Prüfen button -->
          <button
            v-if="phase === 'playing'"
            :disabled="!hasInput"
            class="w-full transition-all rounded-2xl px-6 py-2.5 sm:py-3 font-bold text-white text-base sm:text-lg min-h-[44px] sm:min-h-[50px] shadow-md flex items-center justify-center"
            :class="hasInput
              ? 'bg-violet-500 hover:bg-violet-400 active:scale-95 cursor-pointer'
              : 'bg-violet-500 opacity-40 cursor-not-allowed'"
            @click="submit"
          >
            {{ t('missingLetter.check') }}
          </button>

          <!-- Feedback: Continue button -->
          <AppButton
            v-else-if="phase === 'feedback-wrong' || phase === 'feedback-correct'"
            size="lg"
            class="w-full min-w-[180px] shadow-lg"
            @click="nextTask"
          >
            {{ t('missingLetter.continue') }} ➔
          </AppButton>
        </div>
      </div>
    </template>

    <!-- ── GAME OVER screen ── -->
    <Transition name="fade">
      <div v-if="phase === 'gameover'" class="flex flex-col items-center h-full gap-5 px-6 pt-8 pb-6 overflow-y-auto">
        <div class="text-6xl">🏁</div>
        <h2 class="text-4xl font-extrabold">{{ t('game.gameOver') }}</h2>
        <p class="text-2xl font-bold text-yellow-300">{{ t('game.finalScore', { score: sessionScore }) }}</p>
        <p class="text-white/70 font-semibold">{{ correctCount }} / {{ TOTAL_TASKS }} richtig</p>

        <!-- Missed words list -->
        <div v-if="missedWords.length > 0" class="w-full max-w-lg">
          <p class="text-white/60 font-semibold mb-3 text-center">{{ t('missingLetter.missedWords') }}</p>
          <ul class="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            <li
              v-for="(w, i) in missedWords"
              :key="i"
              class="bg-white/10 rounded-xl px-4 py-2.5 text-base sm:text-lg leading-snug"
            >
              <span class="text-white/70">{{ w.sentenceBefore }}</span>
              <span class="font-extrabold text-white">
                <template v-if="isNoLetter(w.solution)">
                  <span class="bg-purple-600 text-white rounded px-1.5 py-0.5 mx-0.5">{{ w.before }}{{ w.after }}</span>
                  <span class="text-xs sm:text-sm font-semibold text-purple-200 ml-1">({{ t('missingLetter.noLetter') }})</span>
                </template>
                <template v-else>
                  <span>{{ w.before }}</span>
                  <span class="bg-purple-600 text-white rounded px-1.5 py-0.5 mx-0.5">{{ w.solution }}</span>
                  <span>{{ w.after }}</span>
                </template>
              </span>
              <span class="text-white/70">{{ w.sentenceAfter }}</span>
            </li>
          </ul>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-auto pt-4">
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
