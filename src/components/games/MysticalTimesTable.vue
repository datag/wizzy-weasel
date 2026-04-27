<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore, XP_PER_CORRECT } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import { useMysticalTimesTableStore } from '@/stores/mysticalTimesTable'
import type { TimesTableQuestion } from '@/types/index'
import AppButton from '@/components/ui/AppButton.vue'

const emit = defineEmits<{ (e: 'exit'): void }>()

const { t } = useI18n()
const userStore = useUserStore()
const gameStore = useGameStore()
const mttStore = useMysticalTimesTableStore()

// ─── Constants ────────────────────────────────────────────────
const QUESTIONS_PER_ROUND = 20
const CODE_TRIGGER_STREAK = 5
const CODE_PROBABILITY = 0.1
const CODES = ['XAB5CAT', 'POL2DOG', 'YUT8SHEEP', 'EUR9BIRD', 'AMZ3COW'] as const
const ROLL_ANIMALS = [
  { emoji: '🐶', sx: '-35vmin', sy: '-30vmin' },
  { emoji: '🐱', sx:  '35vmin', sy: '-30vmin' },
  { emoji: '🦊', sx:  '42vmin', sy:    '0vmin' },
  { emoji: '🐸', sx: '-35vmin', sy:  '30vmin' },
  { emoji: '🐻', sx:  '35vmin', sy:  '30vmin' },
] as const

// ─── Phase ────────────────────────────────────────────────────
type Phase = 'config' | 'disclaimer' | 'playing' | 'feedback' | 'chance-roll' | 'code-reveal' | 'summary'
const phase = ref<Phase>('config')

// ─── Config phase ─────────────────────────────────────────────
const factorsInput = ref(mttStore.factorsDisplay)

function applyConfig() {
  if (factorsInput.value.trim() === '') {
    mttStore.resetFactors()
  } else {
    mttStore.setFactorsFromString(factorsInput.value)
  }
  factorsInput.value = mttStore.factorsDisplay
  phase.value = 'disclaimer'
}

// ─── Game state ───────────────────────────────────────────────
const question = ref<TimesTableQuestion | null>(null)
const questionIndex = ref(0)
const answer = ref('')   // always kept as string; parsed explicitly
const correctCount = ref(0)
const wrongCount = ref(0)
const sessionScore = ref(0)
const streak = ref(0)
const feedbackMsg = ref('')
const feedbackPositive = ref(true)
const wrongCorrectAnswer = ref(0)   // stored separately so template can highlight it
const unlockedCode = ref('')
const chanceRollKey = ref(0)        // bumped to restart the animal animation

// ─── Auto-focus input ─────────────────────────────────────────
const inputRef = ref<HTMLInputElement | null>(null)

watch([phase, questionIndex], async () => {
  if (phase.value === 'playing') {
    await nextTick()
    inputRef.value?.focus()
  }
})

// ─── Question generation ──────────────────────────────────────
function randomItem<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildQuestion(): TimesTableQuestion {
  const factorA = randomItem(mttStore.allowedFactorsA)
  const factorB = Math.ceil(Math.random() * 10) // 1–10
  const product = factorA * factorB
  const questionType = Math.random() < 0.5 ? 'find-product' : 'find-factor'
  return { questionType, factorA, factorB, product }
}

// Parts for visual rendering
const termParts = computed(() => {
  if (!question.value) return null
  const { questionType, factorA, factorB, product } = question.value
  if (questionType === 'find-product') {
    return { a: String(factorA), op1: '·', b: String(factorB), eq: '=', c: '?' }
  }
  return { a: String(factorA), op1: '·', b: '?', eq: '=', c: String(product) }
})

const correctAnswer = computed(() => {
  if (!question.value) return 0
  return question.value.questionType === 'find-product'
    ? question.value.product
    : question.value.factorB
})

// ─── Game flow ────────────────────────────────────────────────
function startGame() {
  gameStore.startGame('mystical-times-table')
  questionIndex.value = 0
  correctCount.value = 0
  wrongCount.value = 0
  sessionScore.value = 0
  streak.value = 0
  phase.value = 'playing'
  nextQuestion()
}

function nextQuestion() {
  answer.value = ''
  question.value = buildQuestion()
  questionIndex.value++
}

function submitAnswer() {
  if (phase.value !== 'playing' || !question.value) return
  const userAnswer = parseInt(answer.value, 10)
  if (isNaN(userAnswer)) return   // ignore empty / non-numeric submission
  const correct = userAnswer === correctAnswer.value

  if (correct) {
    userStore.addXp(XP_PER_CORRECT)
    gameStore.addScore(XP_PER_CORRECT)
    sessionScore.value += XP_PER_CORRECT
    correctCount.value++
    streak.value++
    feedbackMsg.value = t('mysticalTimesTable.feedback.correct', { xp: XP_PER_CORRECT })
    feedbackPositive.value = true
  } else {
    wrongCount.value++
    streak.value = 0
    wrongCorrectAnswer.value = correctAnswer.value
    feedbackMsg.value = t('mysticalTimesTable.feedback.wrongPrefix')
    feedbackPositive.value = false
  }

  phase.value = 'feedback'
  const feedbackDuration = correct ? 900 : 2500

  setTimeout(() => {
    if (correct && streak.value >= CODE_TRIGGER_STREAK) {
      // show the animal animation before the dice roll
      chanceRollKey.value++
      phase.value = 'chance-roll'
      setTimeout(() => {
        if (Math.random() < CODE_PROBABILITY) {
          unlockedCode.value = randomItem(CODES)
          phase.value = 'code-reveal'
        } else {
          advance()
        }
      }, 1000)
      return
    }
    advance()
  }, feedbackDuration)
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

function continueAfterCode() {
  streak.value = 0   // must re-earn the streak before the next code can trigger
  unlockedCode.value = ''
  advance()
}

function restartGame() {
  phase.value = 'config'
  factorsInput.value = mttStore.factorsDisplay
}

// ─── Keyboard support ─────────────────────────────────────────
function onKeyDown(e: KeyboardEvent) {
  if (phase.value === 'playing' && e.key === 'Enter') {
    e.preventDefault()
    submitAnswer()
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <div class="w-full h-full select-none bg-gradient-to-br from-indigo-950 to-purple-950 text-white overflow-y-auto">

    <!-- ── CONFIG phase ── -->
    <Transition name="fade">
      <div v-if="phase === 'config'" class="flex flex-col items-center justify-center min-h-full gap-6 px-6 py-10">
        <div class="text-7xl">🔮</div>
        <h1 class="text-4xl font-extrabold text-center text-amber-300">{{ t('mysticalTimesTable.title') }}</h1>
        <p class="text-white/70 text-center text-lg max-w-sm">{{ t('mysticalTimesTable.description') }}</p>

        <div class="w-full max-w-sm bg-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <h2 class="text-xl font-bold text-amber-200">{{ t('mysticalTimesTable.config.title') }}</h2>
          <label class="text-sm text-white/80">{{ t('mysticalTimesTable.config.factorsLabel') }}</label>
          <input
            v-model="factorsInput"
            type="text"
            :placeholder="t('mysticalTimesTable.config.factorsPlaceholder')"
            class="w-full rounded-xl bg-white/15 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400 text-lg"
            style="min-height: 48px"
          />
          <p class="text-xs text-white/50">{{ t('mysticalTimesTable.config.factorsHint') }}</p>
        </div>

        <AppButton size="lg" @click="applyConfig">{{ t('mysticalTimesTable.config.start') }}</AppButton>
        <button class="text-white/50 text-sm underline" @click="emit('exit')">{{ t('game.backToMenu') }}</button>
      </div>
    </Transition>

    <!-- ── DISCLAIMER phase ── -->
    <Transition name="fade">
      <div v-if="phase === 'disclaimer'" class="flex flex-col items-center justify-center min-h-full gap-6 px-6 py-10">
        <div class="text-6xl animate-pulse">🐱</div>
        <h2 class="text-3xl font-extrabold text-center text-amber-300">{{ t('mysticalTimesTable.disclaimer.title') }}</h2>

        <div class="w-full max-w-lg bg-white/10 rounded-2xl p-6 flex flex-col gap-4 border border-amber-400/30">
          <p
            v-for="(paragraph, i) in t('mysticalTimesTable.disclaimer.body').split('\n\n')"
            :key="i"
            class="text-white/90 leading-relaxed text-base"
          >
            {{ paragraph }}
          </p>
        </div>

        <div class="text-sm text-amber-300/80 text-center max-w-sm">
          {{ t('mysticalTimesTable.disclaimer.codesHint') }}
        </div>

        <AppButton size="lg" @click="startGame">{{ t('mysticalTimesTable.disclaimer.accept') }}</AppButton>
        <button class="text-white/50 text-sm underline" @click="phase = 'config'">← {{ t('game.backToMenu') }}</button>
      </div>
    </Transition>

    <!-- ── PLAYING phase ── -->
    <Transition name="fade">
      <div v-if="phase === 'playing' && question && termParts" class="flex flex-col items-center justify-center min-h-full gap-6 px-6 py-8">
        <!-- HUD -->
        <div class="w-full max-w-lg flex items-center justify-between text-sm">
          <span class="bg-white/10 rounded-full px-3 py-1 font-bold">
            {{ t('mysticalTimesTable.question.progress', { current: questionIndex, total: QUESTIONS_PER_ROUND }) }}
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
        <div class="w-full max-w-lg bg-white/10 border border-white/20 rounded-3xl p-8 flex flex-col items-center gap-8 shadow-2xl">
          <div class="text-5xl">🌙</div>

          <!-- Styled math term -->
          <div class="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <span class="term-number" :class="termParts.b === '?' ? 'term-known' : 'term-known'">{{ termParts.a }}</span>
            <span class="term-operator">{{ termParts.op1 }}</span>
            <span class="term-number" :class="termParts.b === '?' ? 'term-unknown' : 'term-known'">{{ termParts.b }}</span>
            <span class="term-operator">{{ termParts.eq }}</span>
            <span class="term-number" :class="termParts.c === '?' ? 'term-unknown' : 'term-known'">{{ termParts.c }}</span>
          </div>

          <input
            ref="inputRef"
            v-model="answer"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            :placeholder="t('mysticalTimesTable.question.inputPlaceholder')"
            class="w-full max-w-xs rounded-2xl bg-white/15 border border-white/20 px-5 py-4 text-white text-2xl text-center placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
            style="min-height: 64px"
            @keydown.enter.prevent="submitAnswer"
          />

          <AppButton size="lg" full-width @click="submitAnswer">
            {{ t('mysticalTimesTable.question.confirm') }}
          </AppButton>
        </div>
      </div>
    </Transition>

    <!-- ── FEEDBACK overlay ── -->
    <Transition name="pop">
      <div
        v-if="phase === 'feedback'"
        class="fixed inset-0 flex items-center justify-center pointer-events-none z-20"
      >
        <!-- Correct -->
        <div
          v-if="feedbackPositive"
          class="text-2xl sm:text-3xl font-extrabold px-8 py-5 rounded-3xl shadow-2xl text-center bg-green-500 text-white"
        >
          {{ feedbackMsg }}
        </div>

        <!-- Wrong: label + highlighted answer -->
        <div
          v-else
          class="flex flex-col items-center gap-3 bg-rose-700 rounded-3xl shadow-2xl px-10 py-6 text-white"
        >
          <span class="text-xl sm:text-2xl font-bold">{{ feedbackMsg }}</span>
          <span class="feedback-answer">{{ wrongCorrectAnswer }}</span>
        </div>
      </div>
    </Transition>

    <!-- ── CHANCE-ROLL animation ── -->
    <Transition name="fade">
      <div
        v-if="phase === 'chance-roll'"
        class="fixed inset-0 flex items-center justify-center z-30 bg-indigo-950/80"
      >
        <div :key="chanceRollKey" class="chance-roll-stage relative flex items-center justify-center">
          <!-- Central question mark -->
          <span class="chance-roll-qmark font-black text-amber-300 select-none z-10">?</span>
          <!-- Animals rushing inward -->
          <span
            v-for="animal in ROLL_ANIMALS"
            :key="animal.emoji"
            class="animal-rush absolute"
            :style="{ '--sx': animal.sx, '--sy': animal.sy } as any"
          >{{ animal.emoji }}</span>
        </div>
      </div>
    </Transition>

    <!-- ── CODE REVEAL phase ── -->
    <Transition name="fade">
      <div
        v-if="phase === 'code-reveal'"
        class="flex flex-col items-center justify-center min-h-full gap-6 px-6 py-10 text-center"
      >
        <div class="text-6xl animate-bounce">🌟</div>
        <h2 class="text-3xl font-extrabold text-amber-300">{{ t('mysticalTimesTable.code.title') }}</h2>
        <p class="text-white/80 max-w-sm">{{ t('mysticalTimesTable.code.body') }}</p>

        <!-- Code display -->
        <div class="bg-amber-400 text-indigo-950 font-mono font-black text-4xl sm:text-5xl rounded-2xl px-8 py-6 shadow-2xl tracking-widest select-all border-4 border-amber-200">
          {{ unlockedCode }}
        </div>

        <div class="bg-rose-500/20 border border-rose-400/40 rounded-2xl px-6 py-4 max-w-sm">
          <p class="text-rose-200 font-semibold text-base">{{ t('mysticalTimesTable.code.writeItDown') }}</p>
        </div>

        <div class="flex gap-2 text-3xl">
          <span v-for="_ in 5" :key="_">⭐</span>
        </div>

        <AppButton size="lg" @click="continueAfterCode">{{ t('mysticalTimesTable.code.continue') }}</AppButton>
      </div>
    </Transition>

    <!-- ── SUMMARY phase ── -->
    <Transition name="fade">
      <div v-if="phase === 'summary'" class="flex flex-col items-center justify-center min-h-full gap-6 px-6 py-10 text-center">
        <div class="text-7xl">🐱</div>
        <h2 class="text-4xl font-extrabold text-amber-300">{{ t('mysticalTimesTable.summary.title') }}</h2>
        <p class="text-2xl font-bold text-white">{{ t('mysticalTimesTable.summary.score', { score: sessionScore }) }}</p>

        <div class="flex gap-6 text-lg font-semibold">
          <span class="text-green-400">{{ t('mysticalTimesTable.summary.correct', { count: correctCount }) }}</span>
          <span class="text-rose-400">{{ t('mysticalTimesTable.summary.wrong', { count: wrongCount }) }}</span>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-4">
          <AppButton size="lg" full-width @click="restartGame">{{ t('mysticalTimesTable.summary.playAgain') }}</AppButton>
          <AppButton variant="secondary" size="lg" full-width @click="emit('exit')">{{ t('mysticalTimesTable.summary.backToMenu') }}</AppButton>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
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

/* Highlighted correct answer in wrong feedback */
.feedback-answer {
  font-size: clamp(3rem, 12vw, 5rem);
  font-weight: 900;
  color: #fde68a;
  background: rgba(251, 191, 36, 0.18);
  border: 3px solid rgba(251, 191, 36, 0.5);
  border-radius: 1rem;
  padding: 0.1em 0.5em;
  line-height: 1.1;
}

/* Chance-roll stage: responsive, up to full screen */
.chance-roll-stage {
  width:  min(90vw, 90vh);
  height: min(90vw, 90vh);
  max-width:  100vw;
  max-height: 100vh;
}
.chance-roll-qmark {
  font-size: clamp(5rem, 25vmin, 14rem);
}

/* Animal rush animation */
.animal-rush {
  font-size: clamp(2.5rem, 10vmin, 6rem);
  animation: rush-to-center 0.96s ease-in forwards;
}
@keyframes rush-to-center {
  from {
    transform: translate(var(--sx), var(--sy)) scale(1.4);
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  to {
    transform: translate(0, 0) scale(0.1);
    opacity: 0;
  }
}
.term-number {
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 900;
  line-height: 1;
  min-width: 2ch;
  text-align: center;
  border-radius: 0.75rem;
  padding: 0.2em 0.35em;
}
.term-known {
  color: #fde68a; /* amber-200 */
  background: rgba(251, 191, 36, 0.12);
  border: 2px solid rgba(251, 191, 36, 0.25);
}
.term-unknown {
  color: #c4b5fd; /* violet-300 */
  background: rgba(139, 92, 246, 0.2);
  border: 2px dashed rgba(167, 139, 250, 0.6);
  animation: pulse-unknown 1.2s ease-in-out infinite;
}
.term-operator {
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  font-weight: 700;
  color: rgba(255,255,255,0.45);
  line-height: 1;
}
@keyframes pulse-unknown {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.55; }
}
</style>
