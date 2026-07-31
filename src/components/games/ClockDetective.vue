<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import AppButton from '@/components/ui/AppButton.vue'
import PauseModal from '@/components/ui/PauseModal.vue'
import AnalogClock from '@/components/games/clock/AnalogClock.vue'

const emit = defineEmits<{ (e: 'exit'): void }>()

const { t } = useI18n()
const userStore = useUserStore()
const gameStore = useGameStore()

// ─── Constants ────────────────────────────────────────────────
const ROUNDS_PER_SESSION = 15
const STREAK_TO_ADVANCE = 5
const ERRORS_TO_RETREAT = 3
const XP_CORRECT = 10

// ─── Difficulty & minute pools ────────────────────────────────
function minutePool(level: number): number[] {
  if (level === 1) return [0]
  if (level === 2) return [0, 30]
  if (level === 3) return [0, 15, 30, 45]
  return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Format a 24 h display hour + minutes as HH:MM */
function formatTime(displayHour: number, m: number): string {
  return `${String(displayHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// ─── Phase ────────────────────────────────────────────────────
type Phase = 'intro' | 'playing' | 'feedback' | 'summary'
const phase = ref<Phase>('intro')
const isPaused = ref(false)

// ─── Session state ────────────────────────────────────────────
const difficulty = ref(1)
const streak = ref(0)
const errorStreak = ref(0)
const roundNumber = ref(0)
const sessionScore = ref(0)
const correctCount = ref(0)

// ─── Round state ──────────────────────────────────────────────
type RoundMode = 'read-mc' | 'set-hands'
interface Round {
  mode: RoundMode
  /** Analog clock position 0–11 */
  analogHour: number
  /** 24 h display hour 0–23 */
  displayHour: number
  minutes: number
  /** Choices in HH:MM format (read-mc only) */
  choices: string[]
  correctChoice: string
}

const currentRound = ref<Round | null>(null)
const selectedChoice = ref<string | null>(null)
const isCorrect = ref<boolean | null>(null)

// Drag state for set-hands mode
const dragHours = ref(0)
const dragMinutes = ref(0)

// ─── Round generation ─────────────────────────────────────────
function generateRound(): Round {
  const pool = minutePool(difficulty.value)
  const analogHour = Math.floor(Math.random() * 12)          // 0–11
  const displayHour = Math.random() < 0.5 ? analogHour : analogHour + 12  // AM or PM
  const minutes = pickRandom(pool)
  const mode: RoundMode = Math.random() < 0.5 ? 'read-mc' : 'set-hands'
  const correct = formatTime(displayHour, minutes)

  // Wrong choices must use a DIFFERENT analogHour to avoid visual ambiguity
  // (e.g. 01:00 and 13:00 look identical on the clock face → never pair them)
  const wrongs = new Set<string>()
  while (wrongs.size < 3) {
    let wAnalog: number
    do { wAnalog = Math.floor(Math.random() * 12) } while (wAnalog === analogHour)
    const wDisplay = Math.random() < 0.5 ? wAnalog : wAnalog + 12
    const wm = pickRandom(pool)
    const candidate = formatTime(wDisplay, wm)
    if (candidate !== correct) wrongs.add(candidate)
  }

  const choices = [correct, ...wrongs].sort(() => Math.random() - 0.5)

  return { mode, analogHour, displayHour, minutes, choices, correctChoice: correct }
}

// ─── Game flow ────────────────────────────────────────────────
function startGame() {
  gameStore.startGame('clock-detective')
  roundNumber.value = 0
  sessionScore.value = 0
  correctCount.value = 0
  difficulty.value = 1
  streak.value = 0
  errorStreak.value = 0
  phase.value = 'playing'
  nextRound()
}

function nextRound() {
  if (roundNumber.value >= ROUNDS_PER_SESSION) {
    endGame()
    return
  }
  roundNumber.value++
  const round = generateRound()
  currentRound.value = round
  selectedChoice.value = null
  isCorrect.value = null
  dragHours.value = 0
  dragMinutes.value = 0
}

function handleMCChoice(choice: string) {
  if (phase.value !== 'playing' || isCorrect.value !== null) return
  selectedChoice.value = choice
  evaluateAnswer(choice === currentRound.value!.correctChoice)
}

function handleHandsSubmit() {
  if (phase.value !== 'playing') return
  const round = currentRound.value!
  const correct =
    dragHours.value === round.analogHour &&
    Math.abs(dragMinutes.value - round.minutes) <= 5
  evaluateAnswer(correct)
}

function evaluateAnswer(correct: boolean) {
  isCorrect.value = correct
  if (correct) {
    userStore.addXp(XP_CORRECT)
    gameStore.addScore(XP_CORRECT)
    sessionScore.value += XP_CORRECT
    correctCount.value++
    streak.value++
    errorStreak.value = 0
    checkDifficultyUp()
  } else {
    userStore.loseBoost(1)
    streak.value = 0
    errorStreak.value++
    checkDifficultyDown()
  }
  phase.value = 'feedback'
  scheduleNextRound()
}

function checkDifficultyUp() {
  if (streak.value >= STREAK_TO_ADVANCE && difficulty.value < 4) {
    difficulty.value++
    streak.value = 0
  }
}

function checkDifficultyDown() {
  if (errorStreak.value >= ERRORS_TO_RETREAT && difficulty.value > 1) {
    difficulty.value--
    errorStreak.value = 0
  }
}

let nextRoundTimer: ReturnType<typeof setTimeout> | null = null
function scheduleNextRound() {
  nextRoundTimer = setTimeout(() => {
    phase.value = 'playing'
    nextRound()
  }, 1500)
}

function endGame() {
  gameStore.endGame()
  phase.value = 'summary'
}

function exitGame() {
  nextRoundTimer && clearTimeout(nextRoundTimer)
  gameStore.endGame()
  emit('exit')
}

onUnmounted(() => {
  nextRoundTimer && clearTimeout(nextRoundTimer)
})

// ─── Helpers ──────────────────────────────────────────────────
const difficultyLabel = computed(() => {
  const labels = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐']
  return labels[difficulty.value - 1]
})
</script>

<template>
  <!-- Intro screen -->
  <div v-if="phase === 'intro'" class="flex flex-col items-center justify-center min-h-full p-8 text-center gap-6">
    <div class="text-8xl">🕰️</div>
    <h1 class="text-3xl font-extrabold text-slate-800">{{ t('clockDetective.title') }}</h1>
    <p class="text-slate-600 text-lg max-w-md">{{ t('clockDetective.intro') }}</p>
    <AppButton size="lg" @click="startGame">{{ t('game.go') }}</AppButton>
  </div>

  <!-- Playing / Feedback -->
  <div v-else-if="phase === 'playing' || phase === 'feedback'" class="flex flex-col min-h-full">
    <!-- Top bar -->
    <div class="flex items-center justify-between px-4 pt-4 pb-2 gap-3">
      <div class="flex items-center gap-2 text-sm text-slate-500">
        <span>{{ t('clockDetective.round', { n: roundNumber, total: ROUNDS_PER_SESSION }) }}</span>
        <span>{{ difficultyLabel }}</span>
      </div>
      <button
        class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 touch-action-none"
        @click="isPaused = true"
      >⏸</button>
    </div>

    <!-- Score -->
    <div class="text-center text-sm text-slate-500 mb-2">
      {{ t('clockDetective.score', { score: sessionScore }) }}
    </div>

    <!-- Round content -->
    <div class="flex flex-col items-center flex-1 justify-center gap-6 px-4 pb-8" v-if="currentRound">

      <!-- MODE A: Read analog clock → Multiple Choice -->
      <template v-if="currentRound.mode === 'read-mc'">
        <p class="text-xl font-bold text-slate-700">{{ t('clockDetective.questionReadMC') }}</p>
        <AnalogClock :hours="currentRound.analogHour" :minutes="currentRound.minutes" :size="220" />
        <div class="grid grid-cols-2 gap-3 w-full max-w-xs">
          <button
            v-for="choice in currentRound.choices"
            :key="choice"
            class="min-h-[56px] rounded-2xl text-xl font-bold border-2 transition-all"
            :class="{
              'border-slate-300 bg-white hover:bg-slate-50 text-slate-800': selectedChoice !== choice && phase !== 'feedback',
              'border-emerald-500 bg-emerald-50 text-emerald-700': phase === 'feedback' && choice === currentRound.correctChoice,
              'border-red-400 bg-red-50 text-red-600': phase === 'feedback' && selectedChoice === choice && choice !== currentRound.correctChoice,
              'border-slate-200 bg-white text-slate-400': phase === 'feedback' && choice !== currentRound.correctChoice && selectedChoice !== choice,
              'opacity-50 pointer-events-none': phase === 'feedback',
            }"
            @click="handleMCChoice(choice)"
          >{{ choice }}</button>
        </div>
      </template>

      <!-- MODE B: Read digital time → Set hands -->
      <template v-else>
        <p class="text-xl font-bold text-slate-700">{{ t('clockDetective.questionSetHands') }}</p>
        <div class="text-5xl font-bold text-blue-600 tracking-widest">
          {{ formatTime(currentRound.displayHour, currentRound.minutes) }}
        </div>
        <AnalogClock
          :hours="dragHours"
          :minutes="dragMinutes"
          :interactive="phase === 'playing'"
          :size="220"
          @update:hours="dragHours = $event"
          @update:minutes="dragMinutes = $event"
        />
        <!-- Show correct clock in feedback -->
        <div v-if="phase === 'feedback'" class="text-center">
          <p class="text-sm text-slate-500 mb-2">{{ t('clockDetective.correct') }}</p>
          <AnalogClock :hours="currentRound.analogHour" :minutes="currentRound.minutes" :size="140" />
        </div>
        <AppButton
          v-if="phase === 'playing'"
          size="lg"
          class="mt-2"
          @click="handleHandsSubmit"
        >{{ t('clockDetective.confirm') }}</AppButton>
      </template>

      <!-- Feedback overlay -->
      <transition name="pop">
        <div v-if="phase === 'feedback'" class="flex flex-col items-center gap-1">
          <span class="text-5xl">{{ isCorrect ? '✅' : '❌' }}</span>
          <span class="font-bold text-lg" :class="isCorrect ? 'text-emerald-600' : 'text-red-600'">
            {{ isCorrect ? t('clockDetective.feedbackCorrect') : t('clockDetective.feedbackWrong') }}
          </span>
        </div>
      </transition>
    </div>
  </div>

  <!-- Summary screen -->
  <div v-else-if="phase === 'summary'" class="flex flex-col items-center justify-center min-h-full p-8 text-center gap-6">
    <div class="text-8xl">🏆</div>
    <h2 class="text-3xl font-extrabold text-slate-800">{{ t('game.gameOver') }}</h2>
    <div class="bg-white rounded-2xl shadow p-6 w-full max-w-xs space-y-3">
      <div class="flex justify-between text-slate-600">
        <span>{{ t('clockDetective.correct') }}</span>
        <span class="font-bold">{{ correctCount }} / {{ ROUNDS_PER_SESSION }}</span>
      </div>
      <div class="flex justify-between text-slate-600">
        <span>{{ t('clockDetective.xpEarned') }}</span>
        <span class="font-bold text-emerald-600">+{{ sessionScore }} XP</span>
      </div>
      <div class="flex justify-between text-slate-600">
        <span>{{ t('clockDetective.maxDifficulty') }}</span>
        <span class="font-bold">{{ difficultyLabel }}</span>
      </div>
    </div>
    <div class="flex gap-3">
      <AppButton variant="secondary" @click="exitGame">{{ t('game.backToMenu') }}</AppButton>
      <AppButton @click="startGame">{{ t('game.playAgain') }}</AppButton>
    </div>
  </div>

  <PauseModal v-if="isPaused" @resume="isPaused = false" @exit="exitGame" />
</template>

<style scoped>
.pop-enter-active { animation: pop-in 0.3s ease; }
@keyframes pop-in {
  0%   { transform: scale(0.6); opacity: 0; }
  70%  { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}
</style>
