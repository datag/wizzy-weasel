<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore, XP_PER_CORRECT } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import { useMysticalTimesTableStore } from '@/stores/mysticalTimesTable'
import type { TimesTableQuestion } from '@/types/index'
import AppButton from '@/components/ui/AppButton.vue'
import PauseModal from '@/components/ui/PauseModal.vue'

const emit = defineEmits<{ (e: 'exit'): void }>()

const { t } = useI18n()
const userStore = useUserStore()
const gameStore = useGameStore()
const mttStore = useMysticalTimesTableStore()

// ─── Constants ────────────────────────────────────────────────
const QUESTIONS_PER_ROUND = 20
const CODE_TRIGGER_STREAK = 5
const CODE_PROBABILITY = 0.03
const CODES = ['XAB5CAT', 'POL2DOG', 'YUT8SHEEP', 'EUR9BIRD', 'AMZ3COW'] as const
const ROLL_ANIMALS = [
  { emoji: '🐶', sx: '-35vmin', sy: '-30vmin' },
  { emoji: '🐱', sx:  '35vmin', sy: '-30vmin' },
  { emoji: '🦊', sx:  '42vmin', sy:    '0vmin' },
  { emoji: '🐸', sx: '-35vmin', sy:  '30vmin' },
  { emoji: '🐻', sx:  '35vmin', sy:  '30vmin' },
] as const

// ─── Phase ────────────────────────────────────────────────────
type Phase = 'config' | 'disclaimer' | 'playing' | 'feedback' | 'chance-roll' | 'code-reveal' | 'summary' | 'redeem-codes'
const phase = ref<Phase>('config')
// ─── Pause state ──────────────────────────────────────────────
const isPaused = ref(false)

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

// ─── Redeem Codes ─────────────────────────────────────────────
const MASTER_CODE = 'LEARN4TW'
const codeInputs = ref<string[]>(['', '', '', '', ''])
const codeStatuses = ref<Array<'idle' | 'animating' | 'correct' | 'incorrect' | 'duplicate'>>(['idle', 'idle', 'idle', 'idle', 'idle'])
const redeemResult = ref<'idle' | 'wrong' | 'correct'>('idle')
const masterCodeRevealed = ref('')
let masterCodeTimer: ReturnType<typeof setTimeout> | null = null
const codeInputRefs = ref<(HTMLInputElement | null)[]>([null, null, null, null, null])
const submitBtnRef = ref<HTMLButtonElement | null>(null)

function setCodeInputRef(el: unknown, i: number) {
  codeInputRefs.value[i] = el as HTMLInputElement | null
}

function openRedeemScreen() {
  codeInputs.value = ['', '', '', '', '']
  codeStatuses.value = ['idle', 'idle', 'idle', 'idle', 'idle']
  redeemResult.value = 'idle'
  masterCodeRevealed.value = ''
  phase.value = 'redeem-codes'
  nextTick(() => codeInputRefs.value[0]?.focus())
}

function cancelRedeem() {
  if (masterCodeTimer) clearTimeout(masterCodeTimer)
  phase.value = 'config'
}

function handleCodeInput(index: number) {
  // Clear validation state while the user is actively typing; also clear wrong banner
  if (redeemResult.value === 'wrong') redeemResult.value = 'idle'
  codeStatuses.value[index] = codeInputs.value[index].trim() !== '' ? 'animating' : 'idle'
  if (codeInputs.value[index].trim() !== '') {
    setTimeout(() => {
      if (codeStatuses.value[index] === 'animating') codeStatuses.value[index] = 'idle'
    }, 300)
  }
}

function revalidateStatuses() {
  codeInputs.value.forEach((raw, i) => {
    const val = normalizeCode(raw)
    if (val === '') { codeStatuses.value[i] = 'idle'; return }
    if (!(CODES as readonly string[]).includes(val)) { codeStatuses.value[i] = 'incorrect'; return }
    const isDup = codeInputs.value.some((other, j) => j !== i && normalizeCode(other) === val)
    codeStatuses.value[i] = isDup ? 'duplicate' : 'correct'
  })
}

function handleCodeBlur(index: number) {
  const val = normalizeCode(codeInputs.value[index])
  if (val === '') { codeStatuses.value[index] = 'idle'; return }
  // Validate this box first, then revalidate all to update duplicate highlights
  codeStatuses.value[index] = (CODES as readonly string[]).includes(val) ? 'correct' : 'incorrect'
  revalidateStatuses()
}

function handleCodeEnter(index: number) {
  if (index < codeInputs.value.length - 1) {
    codeInputRefs.value[index + 1]?.focus()
  } else {
    submitBtnRef.value?.focus()
  }
}

function normalizeCode(code: string): string {
  return code.replace(/\s+/g, '').toUpperCase()
}

function submitCodes() {
  const entered = codeInputs.value.map(normalizeCode)
  const expected = new Set([...CODES])
  const allCorrect = entered.every(c => expected.has(c as typeof CODES[number]))
    && new Set(entered).size === CODES.length

  if (!allCorrect) {
    redeemResult.value = 'wrong'
    return
  }

  redeemResult.value = 'correct'
  masterCodeRevealed.value = ''
  let i = 0
  function revealNext() {
    if (i < MASTER_CODE.length) {
      masterCodeRevealed.value += MASTER_CODE[i]
      i++
      masterCodeTimer = setTimeout(revealNext, 180)
    }
  }
  masterCodeTimer = setTimeout(revealNext, 400)
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

// ─── Mobile detection (touch primary input) ───────────────────
const isMobile = ref(false)
let mq: MediaQueryList | null = null

function onMqChange(e: MediaQueryListEvent) { isMobile.value = e.matches }

// ─── Auto-focus input ─────────────────────────────────────────
const inputRef = ref<HTMLInputElement | null>(null)

watch([phase, questionIndex], async () => {
  if (phase.value === 'playing' && !isMobile.value) {
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
  if (phase.value !== 'playing' || !question.value || isPaused.value) return
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

// ─── Pause / Resume ───────────────────────────────────────────
function pauseGame() {
  if (phase.value !== 'playing' || isPaused.value) return
  isPaused.value = true
}

function resumeGame() {
  if (!isPaused.value) return
  isPaused.value = false
  if (phase.value === 'playing' && !isMobile.value) {
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

// Immediate-response handler for touch devices: react on first contact
function handleNumpadPointerDown(key: string) {
  if (phase.value !== 'playing' || isPaused.value) return
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
    submitAnswer()
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
  if (masterCodeTimer) clearTimeout(masterCodeTimer)
})
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
        <AppButton variant="secondary" size="sm" @click="openRedeemScreen">{{ t('mysticalTimesTable.redeemCodes.buttonLabel') }}</AppButton>
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

          <!-- Desktop: native input -->
          <input
            v-if="!isMobile"
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

          <AppButton v-if="!isMobile" size="lg" full-width @click="submitAnswer">
            {{ t('mysticalTimesTable.question.confirm') }}
          </AppButton>

          <!-- Mobile: custom answer display + numpad (no system keyboard) -->
          <template v-else>
            <div class="answer-display" :class="{ 'has-value': answer.length > 0 }">
              <span v-if="answer.length === 0" class="answer-placeholder">
                {{ t('mysticalTimesTable.question.inputPlaceholder') }}
              </span>
              <span v-else>{{ answer }}</span>
              <span class="cursor-blink">|</span>
            </div>

            <div class="numpad-grid">
              <template v-for="row in NUMPAD_ROWS" :key="row.join('')">
                <!-- Submit answer button listens on click/tap, while digits/correct buttons already on pointer down -->
                <template v-for="key in row" :key="key">
                  <button
                    v-if="key === '✓'"
                    class="numpad-btn numpad-confirm"
                    @click="submitAnswer"
                  >{{ key }}</button>

                  <button
                    v-else
                    class="numpad-btn"
                    :class="key === '⌫' ? 'numpad-delete' : ''"
                    @pointerdown.prevent="handleNumpadPointerDown(key)"
                  >{{ key }}</button>
                </template>
              </template>
            </div>
          </template>
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

    <!-- ── REDEEM CODES phase ── -->
    <Transition name="fade">
      <div v-if="phase === 'redeem-codes'" class="flex flex-col items-center justify-center min-h-full gap-6 px-6 py-10 text-center">
        <div class="text-6xl">🔐</div>
        <h2 class="text-3xl font-extrabold text-amber-300">{{ t('mysticalTimesTable.redeemCodes.title') }}</h2>
        <p class="text-white/70 text-base max-w-sm">{{ t('mysticalTimesTable.redeemCodes.subtitle') }}</p>

        <!-- Code inputs -->
        <div v-if="redeemResult !== 'correct'" class="w-full max-w-sm flex flex-col gap-3">
          <div
            v-for="(_, i) in codeInputs"
            :key="i"
            class="code-input-wrapper"
            :class="{
              'code-input-animating': codeStatuses[i] === 'animating',
              'code-input-correct':   codeStatuses[i] === 'correct',
              'code-input-incorrect': codeStatuses[i] === 'incorrect',
              'code-input-duplicate': codeStatuses[i] === 'duplicate',
            }"
          >
            <input
              :ref="(el) => setCodeInputRef(el, i)"
              v-model="codeInputs[i]"
              type="text"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="characters"
              spellcheck="false"
              :placeholder="t('mysticalTimesTable.redeemCodes.codePlaceholder', { n: i + 1 })"
              class="code-input-field w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-white/35 focus:outline-none text-base font-mono tracking-wider text-center uppercase"
              style="min-height: 48px"
              @input="handleCodeInput(i)"
              @blur="handleCodeBlur(i)"
              @keydown.enter.prevent="handleCodeEnter(i)"
            />
          </div>
        </div>

        <!-- Wrong result (inline feedback, no retry button — submit button below stays) -->
        <Transition name="shake-in">
          <div
            v-if="redeemResult === 'wrong'"
            class="redeem-wrong flex flex-col items-center gap-2"
          >
            <span class="text-5xl">❌</span>
            <p class="text-rose-300 font-semibold text-base">{{ t('mysticalTimesTable.redeemCodes.wrong') }}</p>
          </div>
        </Transition>

        <!-- Correct result: master code typewriter reveal -->
        <Transition name="fade">
          <div v-if="redeemResult === 'correct'" class="flex flex-col items-center gap-5 w-full max-w-sm">
            <div class="text-4xl animate-bounce">🌟</div>
            <h3 class="text-2xl font-extrabold text-amber-300">{{ t('mysticalTimesTable.redeemCodes.correctTitle') }}</h3>
            <p class="text-white/60 text-sm">{{ t('mysticalTimesTable.redeemCodes.masterCodeLabel') }}</p>
            <div class="bg-amber-400 text-indigo-950 font-mono font-black text-4xl sm:text-5xl rounded-2xl px-8 py-6 shadow-2xl tracking-widest border-4 border-amber-200 min-w-[14ch] text-center" style="min-height: 5rem">
              <span
                v-for="(char, ci) in masterCodeRevealed.split('')"
                :key="ci"
                class="master-code-char"
                :style="{ animationDelay: `${ci * 20}ms` }"
              >{{ char }}</span>
              <span v-if="masterCodeRevealed.length < 8" class="master-code-cursor">|</span>
            </div>
            <div class="bg-amber-500/15 border border-amber-400/30 rounded-2xl px-5 py-4 w-full">
              <p class="text-amber-100 font-semibold text-sm text-center leading-relaxed">{{ t('mysticalTimesTable.redeemCodes.masterCodeParentInstruction') }}</p>
            </div>
          </div>
        </Transition>

        <!-- Action buttons: always visible until success -->
        <div v-if="redeemResult !== 'correct'" class="flex flex-col gap-3 w-full max-w-sm mt-2">
          <button
            ref="submitBtnRef"
            class="redeem-submit-btn w-full min-h-[64px] px-8 text-lg font-bold rounded-2xl transition-all active:scale-95"
            :disabled="codeInputs.some(c => c.trim() === '')"
            @click="submitCodes"
          >
            {{ t('mysticalTimesTable.redeemCodes.submit') }}
          </button>
          <button class="text-white/50 text-sm underline" @click="cancelRedeem">← {{ t('mysticalTimesTable.redeemCodes.cancel') }}</button>
        </div>
        <div v-else class="mt-2">
          <button class="text-white/50 text-sm underline" @click="cancelRedeem">← {{ t('game.backToMenu') }}</button>
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
.answer-display.has-value {
  border-color: rgba(251, 191, 36, 0.5);
}
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
.numpad-btn:active {
  background: rgba(255,255,255,0.25);
  transform: scale(0.94);
}
.numpad-confirm {
  background: rgba(34, 197, 94, 0.3);
  border-color: rgba(34, 197, 94, 0.5);
  color: #bbf7d0;
}
.numpad-confirm:active {
  background: rgba(34, 197, 94, 0.5);
}
.numpad-delete {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.35);
  color: #fca5a5;
}
.numpad-delete:active {
  background: rgba(239, 68, 68, 0.4);
}

/* ── Redeem codes screen ─────────────────────────────────────── */
.code-input-wrapper {
  transition: transform 0.2s ease;
}
.code-input-field {
  border: 3px solid rgba(255, 255, 255, 0.2);
  transition: border-color 0.2s ease, background 0.2s ease;
}
.code-input-field:focus {
  border-color: rgba(251, 191, 36, 0.8);
}
.code-input-correct .code-input-field {
  border-color: rgba(74, 222, 128, 0.85) !important;
  background: rgba(74, 222, 128, 0.08) !important;
}
.code-input-incorrect .code-input-field {
  border-color: rgba(248, 113, 113, 0.9) !important;
  background: rgba(239, 68, 68, 0.08) !important;
}
.code-input-duplicate .code-input-field {
  border-color: rgba(250, 204, 21, 0.9) !important;
  background: rgba(234, 179, 8, 0.08) !important;
}
.code-input-animating {
  animation: code-bounce 0.3s ease-out;
}
@keyframes code-bounce {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.06); }
  70%  { transform: scale(0.97); }
  100% { transform: scale(1); }
}

/* Shake for wrong result */
.redeem-wrong {
  animation: shake 0.4s ease-out;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-10px); }
  40%       { transform: translateX(10px); }
  60%       { transform: translateX(-7px); }
  80%       { transform: translateX(7px); }
}

/* Master code char fade-in */
.master-code-char {
  display: inline-block;
  animation: char-pop 0.2s ease-out both;
}
@keyframes char-pop {
  from { opacity: 0; transform: scale(0.5) translateY(-8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.master-code-cursor {
  display: inline-block;
  color: rgba(30, 27, 75, 0.6);
  animation: blink 0.8s step-start infinite;
  font-weight: 300;
}

/* shake-in transition for wrong result */
.shake-in-enter-active { animation: shake 0.4s ease-out; }
.shake-in-leave-active { transition: opacity 0.2s; }
.shake-in-leave-to { opacity: 0; }

/* Redeem submit button */
.redeem-submit-btn {
  background: rgb(124, 58, 237); /* violet-600 */
  color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}
.redeem-submit-btn:hover:not(:disabled) {
  background: rgb(109, 40, 217); /* violet-700 */
}
.redeem-submit-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.7);
}
.redeem-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
