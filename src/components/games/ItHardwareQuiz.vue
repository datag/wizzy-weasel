<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore, XP_PER_CORRECT } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import { buildSession } from '@/data/itHardwareQuiz'
import type { SessionQuestion } from '@/data/itHardwareQuiz'
import AppButton from '@/components/ui/AppButton.vue'
import PauseModal from '@/components/ui/PauseModal.vue'

const emit = defineEmits<{ (e: 'exit'): void }>()

const { t } = useI18n()
const userStore = useUserStore()
const gameStore = useGameStore()

// ─── Game state ───────────────────────────────────────────────
type Phase = 'ready' | 'playing' | 'feedback-correct' | 'feedback-wrong' | 'gameover'
const phase = ref<Phase>('ready')
const sessionScore = ref(0)
const correctCount = ref(0)
const wrongCount = ref(0)

// ─── Session / question state ─────────────────────────────────
let session: SessionQuestion[] = []
const questionIndex = ref(0)
const current = computed(() => session[questionIndex.value] ?? null)
const totalQuestions = computed(() => session.length)

// Selected answer indices for current question
const selected = ref<Set<number>>(new Set())

// For feedback: show which were right/wrong
const submittedAnswers = ref<{ index: number; correct: boolean }[]>([])

// ─── Pause state ──────────────────────────────────────────────
const isPaused = ref(false)

// ─── Computed helpers ─────────────────────────────────────────
const isMultiple = computed(() => current.value?.question.type === 'multiple')
const canSubmit = computed(() => selected.value.size > 0)

const progressPct = computed(() =>
  totalQuestions.value > 0 ? ((questionIndex.value) / totalQuestions.value) * 100 : 0
)

// ─── Game flow ────────────────────────────────────────────────
function startGame() {
  session = buildSession()
  questionIndex.value = 0
  sessionScore.value = 0
  correctCount.value = 0
  wrongCount.value = 0
  selected.value = new Set()
  submittedAnswers.value = []
  gameStore.startGame('it-hardware-quiz')
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
function toggleAnswer(index: number) {
  if (phase.value !== 'playing') return
  const q = current.value?.question
  if (!q) return

  if (q.type === 'single') {
    // Single choice: immediately submit
    selected.value = new Set([index])
    submitAnswer()
  } else {
    // Multiple choice: toggle selection
    const s = new Set(selected.value)
    if (s.has(index)) {
      s.delete(index)
    } else {
      s.add(index)
    }
    selected.value = s
  }
}

function submitAnswer() {
  if (phase.value !== 'playing' || !current.value) return
  const q = current.value.question
  const answers = q.answers

  // Determine correctness
  const correctIndices = new Set(
    answers.map((a, i) => (a.correct ? i : -1)).filter(i => i >= 0)
  )

  submittedAnswers.value = [...selected.value].map(i => ({
    index: i,
    correct: correctIndices.has(i),
  }))

  const allCorrectSelected = [...correctIndices].every(i => selected.value.has(i))
  const noWrongSelected = [...selected.value].every(i => correctIndices.has(i))
  const isCorrect = allCorrectSelected && noWrongSelected

  if (isCorrect) {
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
    selected.value = new Set()
    submittedAnswers.value = []
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
  if (phase.value === 'playing' && isMultiple.value && e.key === 'Enter' && canSubmit.value) {
    submitAnswer()
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))

// ─── Style helpers ────────────────────────────────────────────
function answerClass(index: number): string {
  const base = 'w-full text-left px-4 py-3 rounded-2xl font-semibold text-base transition-all min-h-[52px] border-2 '

  if (phase.value === 'playing') {
    if (isMultiple.value) {
      return base + (selected.value.has(index)
        ? 'bg-violet-600 border-violet-400 text-white'
        : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40')
    }
    return base + 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 active:scale-95'
  }

  // Feedback phase
  const q = current.value?.question
  if (!q) return base
  const isCorrect = q.answers[index]?.correct

  if (isCorrect) {
    return base + 'bg-green-500 border-green-400 text-white'
  }
  if (selected.value.has(index) && !isCorrect) {
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
        <div class="text-7xl">💻</div>
        <h1 class="text-4xl font-extrabold">{{ t('itHardwareQuiz.title') }}</h1>
        <p class="text-white/70 text-lg max-w-sm">{{ t('itHardwareQuiz.description') }}</p>
        <AppButton size="lg" @click="startGame">{{ t('game.go') }}</AppButton>
        <button class="text-white/50 text-sm underline mt-2" @click="emit('exit')">{{ t('game.backToMenu') }}</button>
      </div>
    </Transition>

    <!-- ── PLAYING / FEEDBACK screens ── -->
    <template v-if="phase === 'playing' || phase === 'feedback-correct' || phase === 'feedback-wrong'">

      <!-- Progress bar -->
      <div class="w-full h-2 bg-white/10 flex-shrink-0">
        <div
          class="h-full bg-violet-500 rounded-r-full transition-all duration-300"
          :style="{ width: `${progressPct}%` }"
        />
      </div>

      <!-- HUD -->
      <div class="flex items-center justify-between px-5 pt-3 pb-1 flex-shrink-0">
        <span class="text-sm font-semibold text-white/70">
          {{ t('itHardwareQuiz.questionOf', { current: questionIndex + 1, total: totalQuestions }) }}
        </span>
        <span class="text-sm font-bold bg-white/10 rounded-full px-3 py-1">
          {{ t('game.score', { score: sessionScore }) }}
        </span>
      </div>

      <!-- Main content -->
      <div v-if="current" class="flex-1 min-h-0 flex flex-col items-center gap-4 px-4 pb-4 overflow-y-auto">

        <!-- Hardware image + name -->
        <div class="flex flex-col items-center gap-2 pt-2 flex-shrink-0">
          <img
            :key="questionIndex"
            :src="current.hardware.image"
            :alt="t(current.hardware.nameKey)"
            class="w-40 h-28 sm:w-56 sm:h-40 object-cover rounded-2xl shadow-lg"
            draggable="false"
          />
          <span class="text-xl font-extrabold tracking-wide">{{ t(current.hardware.nameKey) }}</span>
        </div>

        <!-- Question -->
        <p class="text-center text-lg font-bold text-white/90 max-w-lg leading-snug flex-shrink-0">
          {{ t(current.question.questionKey) }}
        </p>

        <!-- Multiple choice hint -->
        <p v-if="isMultiple" class="text-sm text-violet-300 font-semibold -mt-2 flex-shrink-0">
          {{ t('itHardwareQuiz.correctCount', { count: current.question.correctCount }) }}
        </p>

        <!-- Answer buttons -->
        <div class="w-full max-w-lg flex flex-col gap-2 flex-shrink-0">
          <button
            v-for="(answer, idx) in current.question.answers"
            :key="idx"
            :class="answerClass(idx)"
            :disabled="phase !== 'playing'"
            @click="toggleAnswer(idx)"
          >
            <span class="flex items-center gap-3">
              <!-- Checkbox indicator for multiple choice -->
              <span
                v-if="isMultiple && phase === 'playing'"
                class="w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors"
                :class="selected.has(idx)
                  ? 'bg-white border-white'
                  : 'border-white/40'"
              >
                <svg v-if="selected.has(idx)" class="w-3 h-3 text-violet-600" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M1 6l3.5 3.5L11 2"/>
                </svg>
              </span>
              {{ t(answer.textKey) }}
            </span>
          </button>
        </div>

        <!-- Feedback message -->
        <Transition name="pop">
          <div v-if="phase === 'feedback-correct'" class="text-2xl font-extrabold text-green-300 flex-shrink-0">
            {{ t('itHardwareQuiz.correct', { xp: XP_PER_CORRECT }) }}
          </div>
          <div v-else-if="phase === 'feedback-wrong'" class="text-2xl font-extrabold text-red-300 flex-shrink-0">
            {{ t('itHardwareQuiz.wrong') }}
          </div>
        </Transition>

        <!-- Submit button (multiple choice only, playing phase) -->
        <div v-if="isMultiple && phase === 'playing'" class="flex-shrink-0 w-full max-w-lg">
          <AppButton
            size="lg"
            full-width
            :disabled="!canSubmit"
            @click="submitAnswer"
          >
            {{ t('itHardwareQuiz.submit') }}
          </AppButton>
        </div>

        <!-- Next button (feedback phase) -->
        <div v-if="phase === 'feedback-correct' || phase === 'feedback-wrong'" class="flex-shrink-0 w-full max-w-lg">
          <AppButton size="lg" full-width @click="nextQuestion">
            {{ t('itHardwareQuiz.next') }} →
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

    <!-- Pause button (top-right, playing phase) -->
    <button
      v-if="phase === 'playing' || phase === 'feedback-correct' || phase === 'feedback-wrong'"
      class="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-lg"
      :title="t('game.paused')"
      @click="pauseGame"
    >
      ⏸
    </button>

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
