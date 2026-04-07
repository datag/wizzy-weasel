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
const GAME_DURATION = 60 // seconds

// ─── Game state ───────────────────────────────────────────────
type Phase = 'ready' | 'playing' | 'feedback-correct' | 'feedback-wrong' | 'gameover'
const phase = ref<Phase>('ready')
const sessionScore = ref(0)
const input = ref('')
const feedbackWord = ref<MissingLetterWord | null>(null)
const missedWords = ref<MissingLetterWord[]>([])

// ─── Pause state ──────────────────────────────────────────────
const isPaused = ref(false)

// ─── Timer ────────────────────────────────────────────────────
const timeLeft = ref(GAME_DURATION)
const progressPct = computed(() => (timeLeft.value / GAME_DURATION) * 100)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// ─── Word queue ───────────────────────────────────────────────
let queue: MissingLetterWord[] = []
const currentWord = ref<MissingLetterWord | null>(null)

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

function refillQueue() {
  queue = shuffle(getWordList())
}

function nextWord() {
  if (queue.length === 0) refillQueue()
  currentWord.value = queue.shift()!
  input.value = ''
  phase.value = 'playing'
  nextTick(() => letterInput.value?.focus())
}

// ─── Game flow ────────────────────────────────────────────────
function startGame() {
  sessionScore.value = 0
  missedWords.value = []
  timeLeft.value = GAME_DURATION
  gameStore.startGame('missing-letter')
  refillQueue()
  nextWord()
  startCountdown()
}

function startCountdown() {
  countdownTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      stopCountdown()
      endGame()
    }
  }, 1000)
}

function stopCountdown() {
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null }
}

function pauseGame() {
  if (!['playing', 'feedback-correct', 'feedback-wrong'].includes(phase.value) || isPaused.value) return
  stopCountdown()
  isPaused.value = true
}

function resumeGame() {
  if (!isPaused.value) return
  isPaused.value = false
  if (phase.value === 'playing') startCountdown()
}

function exitGame() {
  stopCountdown()
  isPaused.value = false
  gameStore.endGame()
  emit('exit')
}

function endGame() {
  stopCountdown()
  gameStore.endGame()
  phase.value = 'gameover'
}

function submit() {
  if (phase.value !== 'playing' || !currentWord.value) return
  const answer = input.value.trim()
  if (!answer) return

  const correct = answer.toLowerCase() === currentWord.value.solution.toLowerCase()
  feedbackWord.value = currentWord.value

  if (correct) {
    userStore.addXp(XP_PER_CORRECT)
    gameStore.addScore(XP_PER_CORRECT)
    sessionScore.value += XP_PER_CORRECT
    phase.value = 'feedback-correct'
    setTimeout(() => nextWord(), 700)
  } else {
    missedWords.value.push(currentWord.value)
    phase.value = 'feedback-wrong'
    setTimeout(() => nextWord(), 2000)
  }
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
  if (e.key === 'Enter') submit()
}

// ─── Display helpers ─────────────────────────────────────────
function gapPlaceholder(word: MissingLetterWord): string {
  return '_'.repeat(Math.max(word.solution.length, 1))
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => { window.removeEventListener('keydown', onKeyDown); stopCountdown() })
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
      <!-- Timer bar -->
      <div class="w-full h-2 bg-white/10 flex-shrink-0">
        <div
          class="h-full rounded-r-full transition-none"
          :class="progressPct > 40 ? 'bg-green-400' : progressPct > 20 ? 'bg-yellow-400' : 'bg-red-400'"
          :style="{ width: `${progressPct}%` }"
        />
      </div>

      <!-- HUD -->
      <div class="flex items-center justify-between px-5 pt-3 pb-1 flex-shrink-0">
        <span class="text-sm font-semibold text-white/70">
          {{ t('missingLetter.timeLeft', { seconds: timeLeft }) }}
        </span>
        <span class="text-sm font-bold bg-white/10 rounded-full px-3 py-1">
          {{ t('game.score', { score: sessionScore }) }}
        </span>
      </div>

      <!-- Word display -->
      <div class="flex-1 flex flex-col items-center justify-center gap-8 px-6">

        <!-- The word with gap -->
        <div class="text-5xl sm:text-7xl font-black tracking-widest text-center leading-tight">
          <template v-if="phase === 'feedback-wrong' && feedbackWord">
            <span>{{ feedbackWord.before }}</span>
            <span class="bg-red-500 text-white rounded-lg px-2 mx-1">{{ feedbackWord.solution }}</span>
            <span>{{ feedbackWord.after }}</span>
          </template>
          <template v-else-if="phase === 'feedback-correct' && feedbackWord">
            <span>{{ feedbackWord.before }}</span>
            <span class="bg-green-500 text-white rounded-lg px-2 mx-1">{{ feedbackWord.solution }}</span>
            <span>{{ feedbackWord.after }}</span>
          </template>
          <template v-else-if="currentWord">
            <span>{{ currentWord.before }}</span>
            <span class="inline-block border-b-4 border-white/80 min-w-[2ch] text-white/30 tracking-normal px-1">
              {{ gapPlaceholder(currentWord) }}
            </span>
            <span>{{ currentWord.after }}</span>
          </template>
        </div>

        <!-- Feedback message -->
        <Transition name="pop">
          <div
            v-if="phase === 'feedback-correct'"
            class="text-2xl font-extrabold text-green-300"
          >
            {{ t('missingLetter.correct', { xp: XP_PER_CORRECT }) }}
          </div>
          <div
            v-else-if="phase === 'feedback-wrong'"
            class="text-2xl font-extrabold text-red-300"
          >
            {{ t('missingLetter.wrong') }}
          </div>
        </Transition>

        <!-- Input area (only while playing) -->
        <div v-if="phase === 'playing'" class="flex gap-3 w-full max-w-xs">
          <input
            ref="letterInput"
            v-model="input"
            type="text"
            :placeholder="t('missingLetter.placeholder')"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            class="flex-1 bg-white/15 border-2 border-white/30 rounded-2xl px-4 py-3 text-white text-xl font-bold placeholder-white/30 outline-none focus:border-white/60 transition-colors text-center min-h-[56px]"
          />
          <button
            class="bg-violet-500 hover:bg-violet-400 active:scale-95 transition-all rounded-2xl px-5 py-3 font-bold text-white text-lg min-h-[56px]"
            @click="submit"
          >
            {{ t('missingLetter.check') }}
          </button>
        </div>
      </div>
    </template>

    <!-- ── GAME OVER screen ── -->
    <Transition name="fade">
      <div v-if="phase === 'gameover'" class="flex flex-col items-center h-full gap-5 px-6 pt-8 pb-6 overflow-y-auto">
        <div class="text-6xl">🏁</div>
        <h2 class="text-4xl font-extrabold">{{ t('game.gameOver') }}</h2>
        <p class="text-2xl font-bold text-yellow-300">{{ t('game.finalScore', { score: sessionScore }) }}</p>

        <!-- Missed words list -->
        <div v-if="missedWords.length > 0" class="w-full max-w-sm">
          <p class="text-white/60 font-semibold mb-3 text-center">{{ t('missingLetter.missedWords') }}</p>
          <ul class="space-y-2">
            <li
              v-for="(w, i) in missedWords"
              :key="i"
              class="bg-white/10 rounded-xl px-4 py-2 text-xl font-bold text-center tracking-wide"
            >
              <span>{{ w.before }}</span>
              <span class="bg-red-500 text-white rounded px-1 mx-0.5">{{ w.solution }}</span>
              <span>{{ w.after }}</span>
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
