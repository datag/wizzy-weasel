<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore, XP_PER_CORRECT } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import { loadDataset } from '@/data/prefixPirates'
import { buildRound, ROUND_LENGTH, ORIGIN_ORDER, OPTION_COUNTS } from '@/data/prefixPirates'
import type { PrefixDifficulty, PrefixOrigin, PrefixQuestion, PrefixRound } from '@/types'
import AppButton from '@/components/ui/AppButton.vue'
import PauseModal from '@/components/ui/PauseModal.vue'

const emit = defineEmits<{ (e: 'exit'): void }>()

const { t, locale } = useI18n()
const userStore = useUserStore()
const gameStore = useGameStore()

// ─── Phases ────────────────────────────────────────────────────
type Phase = 'intro' | 'quiz' | 'summary'
const phase = ref<Phase>('intro')
const isPaused = ref(false)

// ─── Config (intro) ────────────────────────────────────────────
const GAME_ID = 'praefix-piraten'
const difficulty = ref<PrefixDifficulty>('easy')
const activeOrigins = ref<Set<PrefixOrigin>>(new Set(ORIGIN_ORDER))

function toggleOrigin(origin: PrefixOrigin) {
  const next = new Set(activeOrigins.value)
  if (next.has(origin)) {
    if (next.size > 1) next.delete(origin)
  } else {
    next.add(origin)
  }
  activeOrigins.value = next
}

// ─── Round state ───────────────────────────────────────────────
const round = ref<PrefixRound | null>(null)
const answered = ref(false)
const selectedIndex = ref<number | null>(null)
const isCorrect = ref(false)
const newBest = ref(false)

const currentQuestion = computed<PrefixQuestion | null>(() => {
  if (!round.value) return null
  return round.value.questions[round.value.index]
})

const progressPercent = computed(() =>
  round.value ? ((round.value.index + (answered.value ? 1 : 0)) / ROUND_LENGTH) * 100 : 0
)

// ─── Start a round ─────────────────────────────────────────────
function startRound() {
  const lang = locale.value.startsWith('en') ? 'en' : 'de'
  const dataset = loadDataset(lang)
  round.value = buildRound(dataset, difficulty.value, [...activeOrigins.value])
  answered.value = false
  selectedIndex.value = null
  isCorrect.value = false
  newBest.value = false
  gameStore.startGame(GAME_ID)
  phase.value = 'quiz'
  scrollTop()
}

// ─── Answer handling ───────────────────────────────────────────
function submitOption(index: number) {
  if (answered.value || !round.value || !currentQuestion.value) return
  const q = currentQuestion.value
  if (q.type === 'validity-verdict') return // verdict answered via submitVerdict
  selectedIndex.value = index
  resolveAnswer(index === q.correctIndex)
}

function submitVerdict(isReal: boolean) {
  if (answered.value || !round.value || !currentQuestion.value) return
  const q = currentQuestion.value
  if (q.type !== 'validity-verdict') return
  resolveAnswer(isReal === q.isReal)
}

function resolveAnswer(correct: boolean) {
  const r = round.value!
  answered.value = true
  isCorrect.value = correct
  if (correct) {
    r.correctCount++
    r.coinChain++
    r.longestChain = Math.max(r.longestChain, r.coinChain)
    userStore.addXp(XP_PER_CORRECT)
    gameStore.addScore(XP_PER_CORRECT)
    r.score += XP_PER_CORRECT
  } else {
    userStore.loseBoost(1)
    r.coinChain = 0
  }
}

// ─── Progress through a round ──────────────────────────────────
function nextQuestion() {
  if (!round.value) return
  answered.value = false
  selectedIndex.value = null
  isCorrect.value = false
  if (round.value.index >= ROUND_LENGTH - 1) {
    finishRound()
  } else {
    round.value.index++
    scrollTop()
  }
}

function finishRound() {
  const r = round.value
  if (!r) return
  const prevBest = gameStore.bestScore[GAME_ID] ?? 0
  newBest.value = r.score > prevBest
  gameStore.endGame()
  phase.value = 'summary'
  scrollTop()
}

function playAgain() {
  startRound()
}

function scrollTop() {
  nextTick(() => {
    window.scrollTo(0, 0)
  })
}

// ─── Pause / exit (User Story 4) ───────────────────────────────
function pauseGame() {
  if (phase.value === 'quiz' && !isPaused.value) {
    isPaused.value = true
  }
}
function resumeGame() {
  isPaused.value = false
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    pauseGame()
  }
}
onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))

// ─── Prompt & explanation helpers ──────────────────────────────
function promptText(q: PrefixQuestion): string {
  switch (q.type) {
    case 'prefix-choice':
      return t('prefixPirates.question.prefixChoice', { prefix: q.entry.prefix, root: q.root })
    case 'meaning-match':
      return t('prefixPirates.question.meaningMatch', { prefix: q.prefix })
    case 'prefix-in-word':
      return t('prefixPirates.question.prefixInWord', { word: q.word })
    case 'sentence-gap':
      return t('prefixPirates.question.sentenceGap')
    case 'origin-assignment':
      return t('prefixPirates.question.originAssignment', { prefix: q.prefix })
    case 'validity-verdict':
      return t('prefixPirates.question.validityVerdict')
  }
}

function originLabel(origin: PrefixOrigin): string {
  return t(`prefixPirates.origins.${origin}`)
}

function optionText(option: string): string {
  return originLabel(option as PrefixOrigin)
}

/** display value for the central word/prefix badge of a question */
function primaryText(q: PrefixQuestion): string {
  if (q.type === 'prefix-in-word') return q.word
  if (q.type === 'meaning-match' || q.type === 'origin-assignment') return q.prefix
  return ''
}

function correctAnswerText(q: PrefixQuestion): string {
  if (q.type === 'validity-verdict') return ''
  const raw = q.options[q.correctIndex]
  return q.type === 'origin-assignment' ? originLabel(raw as PrefixOrigin) : raw
}

function explanationLines(q: PrefixQuestion): Array<{ label: string; value: string }> {
  if (q.type === 'validity-verdict') {
    if (q.isReal && q.entry) {
      const ex = q.entry.examples[0]
      return [
        { label: t('prefixPirates.expl.meaning'), value: q.entry.meaning },
        { label: t('prefixPirates.expl.origin'), value: originLabel(q.entry.origin) },
        { label: t('prefixPirates.expl.example'), value: `${ex.word} — ${ex.sentence}` },
      ]
    }
    if (q.pair) {
      return [{ label: t('prefixPirates.expl.pairWhy'), value: q.pair.explanation }]
    }
  }
  const entry = q.entry
  if (!entry) return []
  const ex = entry.examples[0]
  return [
    { label: t('prefixPirates.expl.meaning'), value: entry.meaning },
    { label: t('prefixPirates.expl.origin'), value: originLabel(entry.origin) },
    { label: t('prefixPirates.expl.example'), value: `${ex.word} — ${ex.sentence}` },
  ]
}

function optionHighlight(index: number): string {
  const q = currentQuestion.value
  if (!answered.value || selectedIndex.value === null || !q) {
    return 'bg-emerald-800/50 border-emerald-400 text-white hover:bg-emerald-700/60'
  }
  if (q.type === 'validity-verdict') return 'bg-black/30 border-white/10 text-white/60'
  if (index === selectedIndex.value) {
    return isCorrect.value
      ? 'bg-emerald-500 text-white border-emerald-300 scale-[0.98]'
      : 'bg-rose-600 text-white border-rose-400 scale-[0.98]'
  }
  if (index === q.correctIndex) {
    return 'border-emerald-400/80 bg-emerald-900/30 text-white'
  }
  return 'bg-black/30 border-white/10 text-white/60'
}

function verdictHighlight(correct: boolean): string {
  if (!answered.value) return 'bg-emerald-800/50 border-emerald-400 text-white hover:bg-emerald-700/60'
  if (correct === isCorrect.value) {
    return correct ? 'bg-emerald-500 text-white border-emerald-300' : 'bg-rose-600 text-white border-rose-400'
  }
  return 'bg-black/30 border-white/10 text-white/60'
  }
</script>

<template>
  <div
    class="w-full min-h-[100dvh] flex flex-col select-none bg-gradient-to-br from-cyan-950 via-sky-950 to-indigo-950 text-white overflow-y-auto"
  >
    <!-- ═════════ INTRO / CONFIG ═════════ -->
    <Transition name="fade">
      <div v-if="phase === 'intro'" class="flex flex-col items-center px-4 py-8 w-full max-w-lg mx-auto gap-5">
        <div class="text-6xl">🏴‍☠️</div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-center text-amber-300">
          {{ t('prefixPirates.title') }}
        </h1>
        <p class="text-sky-200/80 text-center text-sm sm:text-base leading-relaxed">
          {{ t('prefixPirates.intro.subtitle') }}
        </p>

        <!-- Difficulty -->
        <div class="w-full bg-slate-800/70 border border-amber-500/30 rounded-2xl p-4 flex flex-col gap-3">
          <h2 class="text-base sm:text-lg font-bold text-amber-200">
            {{ t('prefixPirates.intro.difficultyTitle') }}
          </h2>
          <div class="grid grid-cols-1 gap-2">
            <button
              v-for="d in (['easy', 'medium', 'hard'] as PrefixDifficulty[])"
              :key="d"
              type="button"
              class="flex items-center justify-between p-3 rounded-xl border transition-all active:scale-95 cursor-pointer min-h-[48px] text-left"
              :class="difficulty === d ? 'bg-amber-500/20 border-amber-400 text-white shadow-md' : 'bg-black/20 border-white/10 text-white/60 hover:bg-black/30'"
              @click="difficulty = d"
            >
              <span class="text-sm font-bold">{{ t(`prefixPirates.intro.difficulty.${d}`) }}</span>
              <span class="text-xs opacity-80">{{ OPTION_COUNTS[d] }} {{ t('prefixPirates.intro.options') }}</span>
            </button>
          </div>
        </div>

        <!-- Origin filter -->
        <div class="w-full bg-slate-800/70 border border-sky-400/30 rounded-2xl p-4 flex flex-col gap-3">
          <h2 class="text-base sm:text-lg font-bold text-sky-300">
            {{ t('prefixPirates.intro.originsTitle') }}
          </h2>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="o in ORIGIN_ORDER"
              :key="o"
              type="button"
              class="p-3 rounded-xl border flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer min-h-[48px]"
              :class="activeOrigins.has(o) ? 'bg-sky-500/25 border-sky-400 text-white shadow-md' : 'bg-black/20 border-white/10 text-white/50 hover:bg-black/30'"
              @click="toggleOrigin(o)"
            >
              <span class="text-sm font-bold">{{ originLabel(o) }}</span>
              <span class="text-xs">{{ activeOrigins.has(o) ? '✓' : '' }}</span>
            </button>
          </div>
        </div>

        <AppButton size="lg" class="w-full" @click="startRound">
          🚢 {{ t('prefixPirates.intro.start') }}
        </AppButton>
        <button
          class="text-sky-300/60 hover:text-sky-200 text-sm underline cursor-pointer py-2"
          @click="emit('exit')"
        >
          {{ t('game.backToMenu') }}
        </button>
      </div>
    </Transition>

    <!-- ═════════ HUD (playing) ═════════ -->
    <header
      v-if="phase === 'quiz' && round"
      class="w-full max-w-2xl mx-auto px-4 pt-3 pb-2 flex flex-col gap-2"
    >
      <div class="flex items-center justify-between text-xs sm:text-sm">
        <button
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
          :title="t('game.paused')"
          :aria-label="t('game.paused')"
          @click="pauseGame"
        >
          ⏸
        </button>
        <div class="flex items-center gap-2 bg-cyan-900/50 border border-cyan-400/30 px-3 py-1.5 rounded-full font-bold text-amber-200 text-xs sm:text-sm">
          🏴‍☠️
          {{ t('prefixPirates.hud.question', { current: round.index + 1, total: ROUND_LENGTH }) }}
        </div>
        <span class="bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl px-3 py-2 font-bold text-xs sm:text-sm">
          🏆 {{ round.score }} XP
        </span>
      </div>
      <div class="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-300"
          :style="{ width: progressPercent + '%' }"
        />
      </div>
    </header>

    <!-- ═════════ QUESTION (playing) ═════════ -->
    <main v-if="phase === 'quiz' && currentQuestion" class="w-full max-w-2xl mx-auto px-4 py-3 flex-1 flex flex-col justify-center gap-4">
      <div class="bg-slate-800/70 border border-white/10 rounded-2xl p-4 text-center">
        <h3 class="text-xs uppercase tracking-wider text-cyan-300 font-bold mb-1">
          {{ promptText(currentQuestion) }}
        </h3>

        <!-- Type-specific display -->
        <div v-if="currentQuestion.type === 'prefix-choice'" class="flex items-center justify-center gap-3 my-2">
          <span class="text-3xl font-extrabold text-cyan-300">{{ currentQuestion.entry.prefix }}</span>
          <span class="text-3xl font-extrabold text-amber-300">+</span>
          <span class="text-3xl font-extrabold text-white underline decoration-dotted">
            {{ currentQuestion.root || t('prefixPirates.question.placeholder') }}
          </span>
          <span class="text-3xl text-cyan-300">= ?</span>
        </div>

        <div v-else-if="currentQuestion.type === 'sentence-gap'" class="mt-2">
          <p class="text-lg sm:text-xl font-semibold text-sky-100 leading-relaxed">
            {{ currentQuestion.sentenceWithGap }}
          </p>
        </div>

        <div v-else-if="currentQuestion.type === 'validity-verdict'" class="my-2">
          <span class="text-4xl font-extrabold text-white">„{{ currentQuestion.displayWord }}“</span>
        </div>

        <div v-else class="my-2">
          <span class="text-3xl font-extrabold text-white">{{ primaryText(currentQuestion) }}</span>
        </div>
      </div>

      <!-- Options -->
      <div v-if="currentQuestion.type !== 'validity-verdict'" class="grid gap-3">
        <button
          v-for="(option, i) in currentQuestion.options"
          :key="i"
          type="button"
          class="flex items-center justify-center p-4 rounded-2xl border-2 text-base sm:text-lg font-extrabold transition-all cursor-pointer min-h-[56px] touch-manipulation"
          :class="optionHighlight(i)"
          @click="submitOption(i)"
        >
          <span v-if="currentQuestion.type === 'origin-assignment'">{{ optionText(option) }}</span>
          <span v-else>{{ option }}</span>
        </button>
      </div>

      <!-- Verdict (yes/no) -->
      <div v-else class="grid grid-cols-2 gap-3">
        <button
          type="button"
          class="flex-1 p-5 rounded-2xl border-2 text-2xl font-extrabold transition-all cursor-pointer min-h-[64px] touch-manipulation"
          :class="verdictHighlight(true)"
          @click="submitVerdict(true)"
        >
          ✓ {{ t('prefixPirates.answer.yes') }}
        </button>
        <button
          type="button"
          class="flex-1 p-5 rounded-2xl border-2 text-2xl font-extrabold transition-all cursor-pointer min-h-[64px] touch-manipulation"
          :class="verdictHighlight(false)"
          @click="submitVerdict(false)"
        >
          ✗ {{ t('prefixPirates.answer.no') }}
        </button>
      </div>

      <!-- Coin chain (visual only) -->
      <div v-if="round && round.coinChain > 0" class="flex items-center justify-center gap-1.5 text-xl">
        <span v-for="n in round.coinChain" :key="n">🪙</span>
      </div>
    </main>

    <!-- ═════════ FEEDBACK / EXPLANATION (playing) ═════════ -->
    <Transition name="fade">
      <div v-if="phase === 'quiz' && answered && currentQuestion" class="w-full max-w-2xl mx-auto px-4 py-4 mt-2">
        <div
          class="rounded-2xl p-4 border"
          :class="isCorrect ? 'bg-emerald-900/60 border-emerald-500/40' : 'bg-rose-900/60 border-rose-500/40'"
        >
          <h3 class="text-xl font-extrabold" :class="isCorrect ? 'text-emerald-300' : 'text-rose-300'">
            {{ isCorrect
              ? t('prefixPirates.feedback.correct', { xp: XP_PER_CORRECT })
              : t('prefixPirates.feedback.wrong') }}
          </h3>
          <p v-if="!isCorrect && currentQuestion.type !== 'validity-verdict'" class="text-sm text-white/80 mt-1">
            {{ t('prefixPirates.feedback.correctWas') }}
            <span class="font-bold text-emerald-300">
              {{ correctAnswerText(currentQuestion) }}
            </span>
          </p>

          <div class="mt-3 grid gap-2 text-sm sm:text-base">
            <div v-for="line in explanationLines(currentQuestion)" :key="line.label" class="flex flex-col gap-0.5">
              <span class="text-[11px] uppercase tracking-wider text-cyan-300 font-bold">
                {{ line.label }}
              </span>
              <span class="text-white/90">{{ line.value }}</span>
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <AppButton size="lg" @click="nextQuestion">
              {{ t('prefixPirates.feedback.continue') }}
            </AppButton>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═════════ SUMMARY ═════════ -->
    <Transition name="fade">
      <div v-if="phase === 'summary' && round" class="flex flex-col items-center px-4 py-10 w-full max-w-lg mx-auto gap-6">
        <div class="text-6xl">🗺️</div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-center text-amber-300">
          {{ t('prefixPirates.summary.title') }}
        </h1>

        <div class="w-full bg-slate-800/70 border border-white/15 rounded-2xl p-5 flex flex-col gap-3">
          <p class="flex items-center justify-between text-base">
            <span class="text-white/80">{{ t('prefixPirates.summary.correct') }}</span>
            <span class="font-extrabold text-emerald-300">
              {{ round.correctCount }} / {{ ROUND_LENGTH }}
            </span>
          </p>
          <p class="flex items-center justify-between text-base">
            <span class="text-white/80">{{ t('prefixPirates.summary.score') }}</span>
            <span class="font-extrabold text-amber-300">🏆 {{ round.score }} XP</span>
          </p>
          <p class="flex items-center justify-between text-base">
            <span class="text-white/80">{{ t('prefixPirates.summary.chain') }}</span>
            <span class="font-extrabold text-sky-300">🪙 {{ round.longestChain }}</span>
          </p>
          <p class="flex items-center justify-between text-base">
            <span class="text-white/80">{{ t('prefixPirates.summary.best') }}</span>
            <span class="font-extrabold text-white">
              {{ (gameStore.bestScore[GAME_ID] ?? 0) }} XP
            </span>
          </p>
          <p
            v-if="newBest"
            class="mt-1 text-center text-sm font-extrabold text-amber-300"
          >
            🎉 {{ t('prefixPirates.summary.newBest') }}
          </p>
        </div>

        <AppButton size="lg" class="w-full" @click="playAgain">
          {{ t('game.playAgain') }}
        </AppButton>
        <AppButton variant="secondary" size="lg" class="w-full" @click="emit('exit')">
          {{ t('game.backToMenu') }}
        </AppButton>
      </div>
    </Transition>

    <!-- Pause -->
    <PauseModal v-if="isPaused" @resume="resumeGame" @exit="emit('exit')" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>