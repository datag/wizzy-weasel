<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore, XP_PER_CORRECT } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import type { Direction, PromptMode, QuixRound } from '@/types/index'
import AppButton from '@/components/ui/AppButton.vue'

const emit = defineEmits<{ (e: 'exit'): void }>()

const { t } = useI18n()
const userStore = useUserStore()
const gameStore = useGameStore()

// ─── Constants ───────────────────────────────────────────────
const MAX_LIVES = 5
const DIRECTIONS: Direction[] = ['left', 'right', 'up', 'down']
const PROMPT_COLORS = [
  'text-yellow-300', 'text-cyan-300', 'text-pink-300',
  'text-green-300', 'text-orange-300', 'text-white',
]
const EMOJI_MAP: Record<Direction, string> = {
  left: '⬅️', right: '➡️', up: '⬆️', down: '⬇️',
}
const BASE_TIME = 3000   // ms for round 1
const MIN_TIME = 600     // minimum time window

// ─── Game state ───────────────────────────────────────────────
type Phase = 'ready' | 'playing' | 'feedback' | 'gameover'
const phase = ref<Phase>('ready')
const currentRound = ref<QuixRound | null>(null)
const feedbackMsg = ref('')
const feedbackPositive = ref(true)
const sessionScore = ref(0)
const round = ref(0)
const lives = ref(MAX_LIVES)
let timer: ReturnType<typeof setTimeout> | null = null
let progressTimer: ReturnType<typeof setInterval> | null = null
const timeLeft = ref(0)
const timeLimit = ref(0)
const progressPct = computed(() => timeLimit.value > 0 ? (timeLeft.value / timeLimit.value) * 100 : 0)

// ─── Swipe detection ─────────────────────────────────────────
let touchStartX = 0
let touchStartY = 0

function getTimeLimit(r: number): number {
  return Math.max(MIN_TIME, BASE_TIME - r * 120)
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildRound(r: number): QuixRound {
  const promptMode: PromptMode = r < 5 ? 'text' : randomItem(['text', 'emoji'] as PromptMode[])
  return {
    direction: randomItem(DIRECTIONS),
    promptMode,
    promptColor: randomItem(PROMPT_COLORS),
    positionX: 15 + Math.random() * 60,
    positionY: 20 + Math.random() * 50,
    timeLimit: getTimeLimit(r),
  }
}

// ─── Game flow ────────────────────────────────────────────────
function startGame() {
  gameStore.startGame('direction-quix')
  sessionScore.value = 0
  round.value = 0
  lives.value = MAX_LIVES
  phase.value = 'playing'
  nextRound()
}

function nextRound() {
  clearTimers()
  round.value++
  currentRound.value = buildRound(round.value)
  timeLimit.value = currentRound.value.timeLimit
  timeLeft.value = timeLimit.value
  phase.value = 'playing'

  // Countdown progress
  progressTimer = setInterval(() => {
    timeLeft.value = Math.max(0, timeLeft.value - 50)
  }, 50)

  // Timeout
  timer = setTimeout(() => {
    handleAnswer(null)
  }, timeLimit.value)
}

function handleAnswer(direction: Direction | null) {
  if (phase.value !== 'playing') return
  clearTimers()

  const correct = direction === currentRound.value?.direction

  if (correct) {
    userStore.addXp(XP_PER_CORRECT)
    gameStore.addScore(XP_PER_CORRECT)
    sessionScore.value += XP_PER_CORRECT
    feedbackMsg.value = t('game.correct', { xp: XP_PER_CORRECT })
    feedbackPositive.value = true
  } else {
    lives.value = Math.max(0, lives.value - 1)
    feedbackMsg.value = direction === null
      ? t('game.timeout')
      : t('game.wrong')
    feedbackPositive.value = false
  }

  phase.value = 'feedback'

  // Check game over (no lives left)
  if (lives.value <= 0) {
    setTimeout(() => {
      gameStore.endGame()
      phase.value = 'gameover'
    }, 900)
    return
  }

  setTimeout(() => {
    nextRound()
  }, 900)
}

function clearTimers() {
  if (timer) { clearTimeout(timer); timer = null }
  if (progressTimer) { clearInterval(progressTimer); progressTimer = null }
}

// ─── Input handling ───────────────────────────────────────────
function onKeyDown(e: KeyboardEvent) {
  const map: Record<string, Direction> = {
    ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
  }
  const dir = map[e.key]
  if (dir) {
    e.preventDefault()
    handleAnswer(dir)
  }
}

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  if (Math.max(absDx, absDy) < 30) return // too small, ignore

  if (absDx > absDy) {
    handleAnswer(dx > 0 ? 'right' : 'left')
  } else {
    handleAnswer(dy > 0 ? 'down' : 'up')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  clearTimers()
})

// ─── Display helpers ──────────────────────────────────────────
function promptText(round: QuixRound): string {
  if (round.promptMode === 'emoji') return EMOJI_MAP[round.direction]
  return t(`directionQuix.${round.direction}`)
}
</script>

<template>
  <div
    class="w-full h-full select-none"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- ── READY screen ── -->
    <Transition name="fade">
      <div v-if="phase === 'ready'" class="flex flex-col items-center justify-center h-full gap-6 text-white px-6">
        <div class="text-7xl">🧭</div>
        <h1 class="text-4xl font-extrabold text-center">{{ t('directionQuix.title') }}</h1>
        <p class="text-white/70 text-center text-lg max-w-sm">{{ t('directionQuix.description') }}</p>
        <AppButton size="lg" @click="startGame">{{ t('game.go') }}</AppButton>
        <button class="text-white/50 text-sm underline mt-2" @click="emit('exit')">{{ t('game.backToMenu') }}</button>
      </div>
    </Transition>

    <!-- ── PLAYING screen ── -->
    <Transition name="fade">
      <div v-if="phase === 'playing' && currentRound" class="relative h-full">
        <!-- HUD -->
        <div class="absolute top-0 left-0 right-0 z-10 px-5 pt-4 flex items-center justify-between">
          <div class="flex gap-0.5">
            <span
              v-for="i in MAX_LIVES"
              :key="i"
              class="text-xl transition-all"
              :class="i <= lives ? 'opacity-100' : 'opacity-20 grayscale'"
            >❤️</span>
          </div>
          <span class="text-white font-bold text-sm bg-white/10 rounded-full px-3 py-1">
            {{ t('game.round', { round }) }}
          </span>
          <span class="text-white font-bold text-sm bg-white/10 rounded-full px-3 py-1">
            {{ t('game.score', { score: sessionScore }) }}
          </span>
        </div>

        <!-- Timer bar -->
        <div class="absolute top-16 left-0 right-0 h-2 bg-white/10">
          <div
            class="h-full transition-none rounded-r-full"
            :class="progressPct > 40 ? 'bg-green-400' : progressPct > 20 ? 'bg-yellow-400' : 'bg-red-400'"
            :style="{ width: `${progressPct}%` }"
          />
        </div>

        <!-- Direction prompt (randomly positioned) -->
        <div
          class="absolute font-black text-6xl sm:text-8xl pointer-events-none drop-shadow-2xl"
          :class="currentRound.promptColor"
          :style="{
            left: `${currentRound.positionX}%`,
            top: `${currentRound.positionY}%`,
            transform: 'translate(-50%, -50%)',
          }"
        >
          {{ promptText(currentRound) }}
        </div>

        <!-- On-screen direction buttons -->
        <div class="absolute bottom-6 left-0 right-0 px-6">
          <div class="max-w-xs mx-auto grid grid-cols-3 gap-3">
            <!-- Up -->
            <button
              class="col-start-2 aspect-square rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white text-2xl flex items-center justify-center"
              style="min-height:64px"
              @click="handleAnswer('up')"
            >⬆️</button>
            <!-- Left -->
            <button
              class="col-start-1 aspect-square rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white text-2xl flex items-center justify-center"
              style="min-height:64px"
              @click="handleAnswer('left')"
            >⬅️</button>
            <!-- Down -->
            <button
              class="col-start-2 aspect-square rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white text-2xl flex items-center justify-center"
              style="min-height:64px"
              @click="handleAnswer('down')"
            >⬇️</button>
            <!-- Right -->
            <button
              class="col-start-3 row-start-2 aspect-square rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white text-2xl flex items-center justify-center"
              style="min-height:64px"
              @click="handleAnswer('right')"
            >➡️</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── FEEDBACK overlay ── -->
    <Transition name="pop">
      <div
        v-if="phase === 'feedback'"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          class="text-3xl sm:text-4xl font-extrabold px-8 py-5 rounded-3xl shadow-2xl"
          :class="feedbackPositive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
        >
          {{ feedbackMsg }}
        </div>
      </div>
    </Transition>

    <!-- ── GAME OVER screen ── -->
    <Transition name="fade">
      <div v-if="phase === 'gameover'" class="flex flex-col items-center justify-center h-full gap-6 text-white px-6">
        <div class="text-7xl">👾</div>
        <h2 class="text-4xl font-extrabold">{{ t('game.gameOver') }}</h2>
        <p class="text-2xl font-bold text-yellow-300">{{ t('game.finalScore', { score: sessionScore }) }}</p>
        <div class="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <AppButton size="lg" full-width @click="startGame">{{ t('game.playAgain') }}</AppButton>
          <AppButton variant="secondary" size="lg" full-width @click="emit('exit')">{{ t('game.backToMenu') }}</AppButton>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.pop-enter-active { animation: pop-in 0.15s ease-out; }
.pop-leave-active { animation: pop-out 0.15s ease-in; }
@keyframes pop-in {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes pop-out {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.7); }
}
</style>
