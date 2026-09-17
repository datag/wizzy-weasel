<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore, XP_PER_CORRECT } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import { useSequenceTrainStore } from '@/stores/sequenceTrain'
import type { SequenceQuestion, SequenceDifficulty, SequenceCategory } from '@/types'
import AppButton from '@/components/ui/AppButton.vue'
import PauseModal from '@/components/ui/PauseModal.vue'

const emit = defineEmits<{ (e: 'exit'): void }>()

const { t } = useI18n()
const userStore = useUserStore()
const gameStore = useGameStore()
const stStore = useSequenceTrainStore()

// ─── Constants ────────────────────────────────────────────────
const QUESTIONS_PER_ROUND = 10
const SHAPE_POOL = ['▲', '●', '■', '★', '◆', '♥'] as const

interface LevelConfig {
  arithmetic: { steps: number[]; max: number }
  geometric: { multipliers: number[]; max: number }
  alternating: { max: number }
  shape: { cycleLen: number; allowGrouped: boolean; groupSize: number }
  weights: Record<SequenceCategory, number>
}

const LEVEL_CONFIG: Record<SequenceDifficulty, LevelConfig> = {
  easy: {
    arithmetic: { steps: [1, 2, 5, 10], max: 30 },
    geometric: { multipliers: [2], max: 64 },
    alternating: { max: 60 },
    shape: { cycleLen: 2, allowGrouped: false, groupSize: 2 },
    weights: { arithmetic: 4, geometric: 3, alternating: 0, shape: 3 },
  },
  medium: {
    arithmetic: { steps: [3, 4, 6, 7, 8, 9], max: 100 },
    geometric: { multipliers: [2, 3], max: 162 },
    alternating: { max: 100 },
    shape: { cycleLen: 3, allowGrouped: true, groupSize: 2 },
    weights: { arithmetic: 3, geometric: 2, alternating: 2, shape: 3 },
  },
  hard: {
    arithmetic: { steps: [12, 15, 16, 18, 20], max: 200 },
    geometric: { multipliers: [2, 3, 4, 5], max: 500 },
    alternating: { max: 200 },
    shape: { cycleLen: 4, allowGrouped: true, groupSize: 3 },
    weights: { arithmetic: 3, geometric: 2, alternating: 2, shape: 3 },
  },
}

// ─── Phase ────────────────────────────────────────────────────
type Phase = 'intro' | 'playing' | 'feedback' | 'summary'
const phase = ref<Phase>('intro')
// ─── Pause state ──────────────────────────────────────────────
const isPaused = ref(false)

// ─── Intro / level select ─────────────────────────────────────
const selectedLevel = ref<SequenceDifficulty>(stStore.level)
const LEVELS: SequenceDifficulty[] = ['easy', 'medium', 'hard']

function startGame() {
  stStore.setLevel(selectedLevel.value)
  gameStore.startGame('sequence-train')
  questionIndex.value = 0
  correctCount.value = 0
  wrongCount.value = 0
  sessionScore.value = 0
  streak.value = 0
  phase.value = 'playing'
  nextQuestion()
}

// ─── Game state ───────────────────────────────────────────────
const question = ref<SequenceQuestion | null>(null)
const questionIndex = ref(0)
const answer = ref('')          // number input (string; parsed explicitly)
const selectedShape = ref<string | null>(null)
const correctCount = ref(0)
const wrongCount = ref(0)
const sessionScore = ref(0)
const streak = ref(0)
const feedbackMsg = ref('')
const feedbackPositive = ref(true)
const wrongCorrectAnswer = ref<number | string>('')
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

// ─── Mobile detection (touch primary input) ───────────────────
const isMobile = ref(false)
let mq: MediaQueryList | null = null

function onMqChange(e: MediaQueryListEvent) { isMobile.value = e.matches }

// ─── Auto-focus input ─────────────────────────────────────────
const inputRef = ref<HTMLInputElement | null>(null)

watch([phase, questionIndex], async () => {
  if (phase.value === 'playing' && !isMobile.value && !isShapeQuestion.value) {
    await nextTick()
    inputRef.value?.focus()
  }
})

// ─── Helpers ──────────────────────────────────────────────────
function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickHiddenIndex(len: number): number {
  // ~50% next term (last index), else a hidden middle term
  if (Math.random() < 0.5) return len - 1
  return randInt(1, len - 2)
}

// ─── Question generation ──────────────────────────────────────
function pickCategory(): SequenceCategory {
  const cfg = LEVEL_CONFIG[selectedLevel.value]
  const pool: SequenceCategory[] = []
  ;(Object.keys(cfg.weights) as SequenceCategory[]).forEach(cat => {
    for (let i = 0; i < cfg.weights[cat]; i++) pool.push(cat)
  })
  return randomItem(pool)
}

function buildArithmetic(): SequenceQuestion {
  const cfg = LEVEL_CONFIG[selectedLevel.value].arithmetic
  const step = randomItem(cfg.steps)
  const direction = Math.random() < 0.5 ? 1 : -1
  const len = randInt(4, 5)
  const lastIndex = len - 1
  let startMin: number
  let startMax: number
  if (direction === 1) {
    startMin = 1
    startMax = cfg.max - step * lastIndex
  } else {
    startMin = 1 + step * lastIndex
    startMax = cfg.max
  }
  const start = randInt(Math.min(startMin, startMax), Math.max(startMin, startMax))
  const terms = Array.from({ length: len }, (_, i) => start + direction * step * i)
  const hiddenIndex = pickHiddenIndex(len)
  const explanation = direction === 1
    ? t('sequenceTrain.pattern.add', { n: step })
    : t('sequenceTrain.pattern.subtract', { n: step })
  return { category: 'arithmetic', terms, hiddenIndex, solution: terms[hiddenIndex], explanation }
}

function buildGeometric(): SequenceQuestion {
  const cfg = LEVEL_CONFIG[selectedLevel.value].geometric
  const mult = randomItem(cfg.multipliers)
  const len = randInt(4, 5)
  const maxStart = Math.floor(cfg.max / Math.pow(mult, len - 1))
  const start = randInt(1, Math.max(1, maxStart))
  const terms = Array.from({ length: len }, (_, i) => start * Math.pow(mult, i))
  const hiddenIndex = pickHiddenIndex(len)
  const explanation = t('sequenceTrain.pattern.multiply', { n: mult })
  return { category: 'geometric', terms, hiddenIndex, solution: terms[hiddenIndex], explanation }
}

function buildAlternating(): SequenceQuestion {
  const max = LEVEL_CONFIG[selectedLevel.value].alternating.max
  const cycle = selectedLevel.value === 'hard'
    ? [randInt(2, 5), randInt(2, 5), -randInt(2, 4)]
    : [randInt(2, 4), -randInt(1, 3)]
  const len = randInt(4, 6)
  const rel: number[] = []
  let v = 0
  for (let i = 0; i < len; i++) {
    if (i === 0) rel.push(0)
    else { v += cycle[(i - 1) % cycle.length]; rel.push(v) }
  }
  const relMin = Math.min(...rel)
  const relMax = Math.max(...rel)
  const t0 = randInt(1 - relMin, max - relMax)
  const terms = rel.map(r => t0 + r)
  const hiddenIndex = pickHiddenIndex(len)
  const steps = cycle.map(s => `${s > 0 ? '+' : '−'}${Math.abs(s)}`).join(', ')
  const explanation = t('sequenceTrain.pattern.alternating', { steps })
  return { category: 'alternating', terms, hiddenIndex, solution: terms[hiddenIndex], explanation }
}

function buildShape(): SequenceQuestion {
  const cfg = LEVEL_CONFIG[selectedLevel.value].shape
  const len = randInt(4, 6)
  const distinct = shuffle(SHAPE_POOL).slice(0, cfg.cycleLen)
  const grouped = cfg.allowGrouped && Math.random() < 0.5
  const shapes = Array.from({ length: len }, (_, i) => {
    if (grouped) return distinct[Math.floor(i / cfg.groupSize) % distinct.length]
    return distinct[i % distinct.length]
  })
  const hiddenIndex = pickHiddenIndex(len)
  const solution = shapes[hiddenIndex]
  const distractors = shuffle(SHAPE_POOL.filter(s => s !== solution)).slice(0, 3)
  const options = shuffle([solution, ...distractors])
  const cycle = distinct.join(' ')
  const explanation = t('sequenceTrain.pattern.shape', { shapes: cycle })
  return { category: 'shape', shapes, hiddenIndex, solution, options, explanation }
}

function buildQuestion(): SequenceQuestion {
  const cat = pickCategory()
  if (cat === 'arithmetic') return buildArithmetic()
  if (cat === 'geometric') return buildGeometric()
  if (cat === 'alternating') return buildAlternating()
  return buildShape()
}

// ─── Rendering helpers ────────────────────────────────────────
const isShapeQuestion = computed(() => question.value?.category === 'shape')

const displayTerms = computed<Array<number | string>>(() => {
  if (!question.value) return []
  return question.value.category === 'shape' ? question.value.shapes : question.value.terms
})

const shapeOptions = computed<string[]>(() => {
  if (question.value?.category !== 'shape') return []
  return question.value.options
})

const userAnswerText = computed<string>(() => {
  if (!question.value) return ''
  return question.value.category === 'shape' ? (selectedShape.value ?? '') : answer.value
})

function shapeBtnClass(opt: string) {
  if (phase.value !== 'feedback') return ''
  if (!question.value || question.value.category !== 'shape') return ''
  const isCorrect = opt === question.value.solution
  const isSelectedWrong = opt === selectedShape.value && !isCorrect
  if (isCorrect) return 'shape-btn-correct'
  if (isSelectedWrong) return 'shape-btn-wrong'
  return 'shape-btn-dim'
}

function trainCarClass(i: number) {
  if (question.value && i === question.value.hiddenIndex) {
    if (phase.value === 'feedback') return feedbackPositive.value ? 'train-car-reveal' : 'train-car-wrong'
    if (phase.value === 'playing') return 'train-car-missing'
  }
  return 'train-car-known'
}

function hiddenTermDisplay(): string {
  if (!question.value) return ''
  if (phase.value === 'feedback' && !feedbackPositive.value) return userAnswerText.value || '?'
  if (phase.value === 'feedback') return String(displayTerms.value[question.value.hiddenIndex])
  return '?'
}

// ─── Game flow ────────────────────────────────────────────────
function nextQuestion() {
  answer.value = ''
  selectedShape.value = null
  question.value = buildQuestion()
  questionIndex.value++
}

function submitNumber() {
  if (phase.value !== 'playing' || isPaused.value || isShapeQuestion.value) return
  const userAnswer = parseInt(answer.value, 10)
  if (isNaN(userAnswer)) return
  evaluateAnswer(userAnswer === (question.value as Extract<SequenceQuestion, { solution: number }>).solution)
}

function chooseShape(choice: string) {
  if (phase.value !== 'playing' || isPaused.value || !isShapeQuestion.value) return
  selectedShape.value = choice
  const correct = choice === (question.value as Extract<SequenceQuestion, { solution: string }>).solution
  evaluateAnswer(correct)
}

function evaluateAnswer(correct: boolean) {
  if (!question.value) return
  if (correct) {
    userStore.addXp(XP_PER_CORRECT)
    gameStore.addScore(XP_PER_CORRECT)
    sessionScore.value += XP_PER_CORRECT
    correctCount.value++
    streak.value++
    feedbackMsg.value = t('sequenceTrain.feedback.correct', { xp: XP_PER_CORRECT })
    feedbackPositive.value = true
  } else {
    wrongCount.value++
    streak.value = 0
    wrongCorrectAnswer.value = question.value.solution
    feedbackMsg.value = t('sequenceTrain.feedback.wrongPrefix')
    feedbackPositive.value = false
  }

  phase.value = 'feedback'
  if (correct) {
    feedbackTimer = setTimeout(() => advance(), 900)
  }
  // wrong answers stay in the feedback phase until the user taps "Weiter"
}

function advance() {
  if (questionIndex.value >= QUESTIONS_PER_ROUND) {
    gameStore.endGame()
    phase.value = 'summary'
  } else {
    phase.value = 'playing'
    nextQuestion()
  }
}

function restartGame() {
  phase.value = 'intro'
  selectedLevel.value = stStore.level
}

// ─── Pause / Resume ───────────────────────────────────────────
function pauseGame() {
  if (phase.value !== 'playing' || isPaused.value) return
  isPaused.value = true
}

function resumeGame() {
  if (!isPaused.value) return
  isPaused.value = false
  if (phase.value === 'playing' && !isMobile.value && !isShapeQuestion.value) {
    nextTick(() => inputRef.value?.focus())
  }
}

function exitGame() {
  isPaused.value = false
  gameStore.endGame()
  emit('exit')
}

// ─── Numpad (mobile) ──────────────────────────────────────────
const NUMPAD_ROWS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['⌫', '0', '✓'],
] as const

function handleNumpadPointerDown(key: string) {
  if (phase.value !== 'playing' || isPaused.value || isShapeQuestion.value) return
  if (key === '✓') return
  if (key === '⌫') {
    answer.value = answer.value.slice(0, -1)
  } else if (answer.value.length < 3) {
    answer.value += key
  }
}

// ─── Keyboard support ─────────────────────────────────────────
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    if (phase.value === 'playing' && !isPaused.value) {
      pauseGame()
    }
    return
  }
  if (isPaused.value) return
  if (phase.value === 'playing' && e.key === 'Enter') {
    e.preventDefault()
    submitNumber()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  mq = window.matchMedia('(pointer: coarse)')
  isMobile.value = mq.matches
  mq.addEventListener('change', onMqChange)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  mq?.removeEventListener('change', onMqChange)
  if (feedbackTimer) clearTimeout(feedbackTimer)
})
</script>

<template>
  <div class="w-full h-full select-none bg-gradient-to-br from-orange-950 via-red-950 to-rose-950 text-white overflow-y-auto">

    <!-- ── INTRO phase ── -->
    <Transition name="fade">
      <div v-if="phase === 'intro'" class="flex flex-col items-center justify-center min-h-full gap-6 px-6 py-10">
        <div class="text-7xl">🚂</div>
        <h1 class="text-4xl font-extrabold text-center text-amber-300">{{ t('sequenceTrain.title') }}</h1>
        <p class="text-white/70 text-center text-lg max-w-sm">{{ t('sequenceTrain.description') }}</p>

        <div class="w-full max-w-sm bg-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <h2 class="text-xl font-bold text-amber-200">{{ t('sequenceTrain.config.title') }}</h2>
          <div class="flex gap-2">
            <button
              v-for="level in LEVELS"
              :key="level"
              class="level-btn flex-1 rounded-xl px-3 py-3 font-bold text-base transition-all active:scale-95"
              :class="selectedLevel === level ? 'level-btn-active' : 'level-btn-idle'"
              style="min-height: 48px"
              @click="selectedLevel = level"
            >
              {{ t(`sequenceTrain.config.${level}`) }}
            </button>
          </div>
          <p class="text-xs text-white/50">{{ t(`sequenceTrain.config.${selectedLevel}Hint`) }}</p>
        </div>

        <AppButton size="lg" @click="startGame">{{ t('sequenceTrain.config.start') }}</AppButton>
        <button class="text-white/50 text-sm underline" @click="emit('exit')">{{ t('game.backToMenu') }}</button>
      </div>
    </Transition>

    <!-- ── PLAYING / FEEDBACK phase ── -->
    <Transition name="fade">
      <div v-if="phase === 'playing' || phase === 'feedback'" class="flex flex-col items-center justify-center min-h-full gap-5 px-6 py-8">
        <!-- HUD -->
        <div class="w-full max-w-lg flex items-center justify-between text-sm">
          <span class="bg-white/10 rounded-full px-3 py-1 font-bold">
            {{ t('sequenceTrain.question.progress', { current: questionIndex, total: QUESTIONS_PER_ROUND }) }}
          </span>
          <span class="bg-amber-500/20 text-amber-300 rounded-full px-3 py-1 font-bold">
            🔥 {{ streak }}
          </span>
          <span class="bg-white/10 rounded-full px-3 py-1 font-bold">
            {{ sessionScore }} XP
          </span>
        </div>

        <!-- Progress bar -->
        <div class="w-full max-w-lg h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            class="h-full bg-amber-400 rounded-full transition-all duration-300"
            :style="{ width: `${(questionIndex / QUESTIONS_PER_ROUND) * 100}%` }"
          />
        </div>

        <!-- Question card -->
        <div class="w-full max-w-lg bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col items-center gap-6 shadow-2xl">
          <!-- Train -->
          <div class="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
            <span class="train-loco text-5xl sm:text-6xl">🚂</span>
            <template v-for="(term, i) in displayTerms" :key="i">
              <span class="train-connector">・</span>
              <span
                class="train-car"
                :class="trainCarClass(i)"
              >
                {{ i === question?.hiddenIndex ? hiddenTermDisplay() : term }}
              </span>
            </template>
          </div>

          <!-- Number input (numbers only) -->
          <template v-if="!isShapeQuestion">
            <!-- Desktop: native input -->
            <input
              v-if="!isMobile"
              ref="inputRef"
              v-model="answer"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              :disabled="phase === 'feedback'"
              :placeholder="t('sequenceTrain.question.inputPlaceholder')"
              class="w-full max-w-xs rounded-2xl bg-white/15 border border-white/20 px-5 py-4 text-white text-2xl text-center placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-40"
              style="min-height: 64px"
              @keydown.enter.prevent="submitNumber"
            />

            <AppButton v-if="!isMobile" size="lg" full-width :disabled="phase === 'feedback'" @click="submitNumber">
              {{ t('sequenceTrain.question.confirm') }}
            </AppButton>

            <!-- Mobile: custom answer display + numpad -->
            <template v-else>
              <div class="answer-display" :class="{ 'has-value': answer.length > 0, 'is-disabled': phase === 'feedback' }">
                <span v-if="answer.length === 0" class="answer-placeholder">
                  {{ t('sequenceTrain.question.inputPlaceholder') }}
                </span>
                <span v-else>{{ answer }}</span>
                <span class="cursor-blink">|</span>
              </div>

              <div class="numpad-grid">
                <template v-for="row in NUMPAD_ROWS" :key="row.join('')">
                  <template v-for="key in row" :key="key">
                    <button
                      v-if="key === '✓'"
                      class="numpad-btn numpad-confirm"
                      :disabled="phase === 'feedback'"
                      @click="submitNumber"
                    >{{ key }}</button>

                    <button
                      v-else
                      class="numpad-btn"
                      :class="key === '⌫' ? 'numpad-delete' : ''"
                      :disabled="phase === 'feedback'"
                      @pointerdown.prevent="handleNumpadPointerDown(key)"
                    >{{ key }}</button>
                  </template>
                </template>
              </div>
            </template>
          </template>

          <!-- Shape multiple-choice (shapes only) -->
          <template v-else>
            <p class="text-white/70 text-sm">{{ t('sequenceTrain.question.chooseShape') }}</p>
            <div class="grid grid-cols-2 gap-3 w-full max-w-sm">
              <button
                v-for="opt in shapeOptions"
                :key="opt"
                class="shape-btn rounded-2xl text-4xl sm:text-5xl font-bold transition-all active:scale-95"
                :class="shapeBtnClass(opt)"
                :disabled="phase === 'feedback'"
                style="min-height: 72px"
                @click="chooseShape(opt)"
              >{{ opt }}</button>
            </div>
          </template>
        </div>

        <!-- ── FEEDBACK banner ── -->
        <Transition name="pop">
          <div
            v-if="phase === 'feedback'"
            class="feedback-banner fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            :class="feedbackPositive ? 'feedback-correct' : 'feedback-wrong'"
          >
            <span class="text-xl sm:text-2xl font-extrabold text-center">{{ feedbackMsg }}</span>
            <template v-if="!feedbackPositive">
              <span class="feedback-answer">{{ wrongCorrectAnswer }}</span>
              <span class="text-sm sm:text-base text-white/90 text-center max-w-xs leading-snug">
                {{ t('sequenceTrain.feedback.explanation', { rule: question?.explanation }) }}
              </span>
              <AppButton size="lg" full-width class="feedback-continue" @click="advance">
                {{ t('sequenceTrain.feedback.continue') }}
              </AppButton>
            </template>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- ── SUMMARY phase ── -->
    <Transition name="fade">
      <div v-if="phase === 'summary'" class="flex flex-col items-center justify-center min-h-full gap-6 px-6 py-10 text-center">
        <div class="text-7xl">🚂</div>
        <h2 class="text-4xl font-extrabold text-amber-300">{{ t('sequenceTrain.summary.title') }}</h2>
        <p class="text-2xl font-bold text-white">{{ t('sequenceTrain.summary.score', { score: sessionScore }) }}</p>

        <div class="flex gap-6 text-lg font-semibold">
          <span class="text-green-400">{{ t('sequenceTrain.summary.correct', { count: correctCount }) }}</span>
          <span class="text-rose-400">{{ t('sequenceTrain.summary.wrong', { count: wrongCount }) }}</span>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-4">
          <AppButton size="lg" full-width @click="restartGame">{{ t('sequenceTrain.summary.playAgain') }}</AppButton>
          <AppButton variant="secondary" size="lg" full-width @click="emit('exit')">{{ t('sequenceTrain.summary.backToMenu') }}</AppButton>
        </div>
      </div>
    </Transition>

  <PauseModal v-if="isPaused" @resume="resumeGame" @exit="exitGame" />
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.pop-enter-active { animation: pop-in 0.15s ease-out; }
.pop-leave-active { animation: pop-out 0.15s ease-in; }
@keyframes pop-in {
  from { opacity: 0; transform: translateY(-8px) scale(0.8); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes pop-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(-8px) scale(0.8); }
}

/* ── Level select ───────────────────────────────────────────── */
.level-btn-idle {
  background: rgba(255,255,255,0.12);
  border: 2px solid rgba(255,255,255,0.2);
  color: #fff;
}
.level-btn-idle:hover { background: rgba(255,255,255,0.2); }
.level-btn-active {
  background: rgba(251, 191, 36, 0.25);
  border: 2px solid rgba(251, 191, 36, 0.8);
  color: #fde68a;
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.15);
}

/* ── Train ──────────────────────────────────────────────────── */
.train-loco {
  line-height: 1;
}
.train-connector {
  color: rgba(255,255,255,0.35);
  font-size: 1.25rem;
  line-height: 1;
}
.train-car {
  font-size: clamp(1.75rem, 6vw, 3rem);
  font-weight: 900;
  line-height: 1;
  min-width: 2ch;
  text-align: center;
  border-radius: 0.75rem;
  padding: 0.2em 0.4em;
  display: inline-block;
}
.train-car-known {
  color: #fde68a;
  background: rgba(251, 191, 36, 0.12);
  border: 2px solid rgba(251, 191, 36, 0.3);
}
.train-car-missing {
  color: #fed7aa;
  background: rgba(249, 115, 22, 0.18);
  border: 2px dashed rgba(251, 146, 60, 0.7);
  animation: pulse-unknown 1.2s ease-in-out infinite;
}
.train-car-reveal {
  color: #bbf7d0;
  background: rgba(34, 197, 94, 0.18);
  border: 2px solid rgba(74, 222, 128, 0.8);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}
.train-car-wrong {
  color: #fecaca;
  background: rgba(239, 68, 68, 0.18);
  border: 2px solid rgba(248, 113, 113, 0.8);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}
@keyframes pulse-unknown {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.55; }
}

/* ── Shape choices ──────────────────────────────────────────── */
.shape-btn {
  background: rgba(255,255,255,0.12);
  border: 2px solid rgba(255,255,255,0.2);
  color: #fff;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  transition: background 0.1s, transform 0.08s, border-color 0.2s;
}
.shape-btn:hover:not(:disabled) { background: rgba(255,255,255,0.22); }
.shape-btn:disabled { opacity: 0.6; cursor: default; }
.shape-btn-correct {
  background: rgba(34, 197, 94, 0.35) !important;
  border-color: rgba(74, 222, 128, 0.9) !important;
  color: #bbf7d0 !important;
  opacity: 1 !important;
}
.shape-btn-wrong {
  background: rgba(239, 68, 68, 0.35) !important;
  border-color: rgba(248, 113, 113, 0.9) !important;
  color: #fecaca !important;
  opacity: 1 !important;
}
.shape-btn-dim {
  opacity: 0.4 !important;
}

/* ── Feedback banner ────────────────────────────────────────── */
.feedback-banner {
  max-width: min(90vw, 24rem);
  padding: 1rem 1.75rem;
  border-radius: 1.5rem;
  box-shadow: 0 12px 32px rgba(0,0,0,0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
}
.feedback-correct {
  background: rgb(34, 197, 94);
  color: #fff;
}
.feedback-wrong {
  background: rgb(190, 18, 60);
  color: #fff;
}
.feedback-continue {
  pointer-events: auto;
  min-width: 12rem;
}
.feedback-answer {
  font-size: clamp(2.5rem, 10vw, 4rem);
  font-weight: 900;
  color: #fde68a;
  background: rgba(251, 191, 36, 0.18);
  border: 3px solid rgba(251, 191, 36, 0.5);
  border-radius: 1rem;
  padding: 0.1em 0.5em;
  line-height: 1.1;
}

/* ── Custom numpad (mobile) ─────────────────────────────────── */
.answer-display {
  width: 100%;
  max-width: 20rem;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border-radius: 1rem;
  background: rgba(255,255,255,0.12);
  border: 2px solid rgba(255,255,255,0.2);
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  padding: 0 1.25rem;
}
.answer-placeholder {
  color: rgba(255,255,255,0.4);
  font-size: 1.25rem;
  font-weight: 400;
}
.answer-display.has-value { border-color: rgba(251, 191, 36, 0.5); }
.answer-display.is-disabled { opacity: 0.5; }
.cursor-blink {
  color: #fbbf24;
  animation: blink 1s step-start infinite;
  line-height: 1;
  font-weight: 300;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.numpad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  width: 100%;
  max-width: 20rem;
}
.numpad-btn {
  min-height: 58px;
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: 0.875rem;
  background: rgba(255,255,255,0.12);
  border: 2px solid rgba(255,255,255,0.18);
  color: #fff;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  transition: background 0.1s, transform 0.08s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.numpad-btn:active:not(:disabled) {
  background: rgba(255,255,255,0.25);
  transform: scale(0.94);
}
.numpad-btn:disabled { opacity: 0.5; cursor: default; }
.numpad-confirm {
  background: rgba(34, 197, 94, 0.3);
  border-color: rgba(34, 197, 94, 0.5);
  color: #bbf7d0;
}
.numpad-delete {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.35);
  color: #fca5a5;
}
</style>