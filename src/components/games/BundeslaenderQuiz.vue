<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import mapRaw from '@/assets/bundeslaender/map-germany.svg?raw'
import { BUNDESLAENDER, VALID_SVG_IDS, FLAG_URLS, ROUND_SIZE, buildSession } from '@/data/bundeslaenderData'
import type { BundeslandQuestion } from '@/types'
import { useUserStore, XP_PER_CORRECT } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import AppButton from '@/components/ui/AppButton.vue'
import PauseModal from '@/components/ui/PauseModal.vue'

const emit = defineEmits<{ (e: 'exit'): void }>()

const { t } = useI18n()
const userStore = useUserStore()
const gameStore = useGameStore()

// ─── SVG map preprocessing ────────────────────────────────────
const mapSvgHtml = mapRaw
  .replace(/<\?xml[^?]*\?>\s*/, '')
  .replace(/width="[^"]*"/, 'width="100%"')
  .replace(/height="[^"]*"/, 'height="100%"')

const DEFAULT_FILL = '#e7e7e7'
const HIGHLIGHT_FILL = '#f59e0b'   // amber-400 – target state in map-to-name
const SELECTED_FILL = '#60a5fa'    // blue-400 – user-selected state in name-to-map
const CORRECT_FILL = '#4ade80'     // green-400
const WRONG_FILL = '#f87171'       // red-400

// ─── Game state ───────────────────────────────────────────────
type Phase = 'ready' | 'playing' | 'feedback-correct' | 'feedback-wrong' | 'gameover'
const phase = ref<Phase>('ready')
const sessionScore = ref(0)
const correctCount = ref(0)
const wrongCount = ref(0)
const isPaused = ref(false)

// ─── Session / question state ─────────────────────────────────
let session: BundeslandQuestion[] = []
const questionIndex = ref(0)
const current = computed<BundeslandQuestion | null>(() => session[questionIndex.value] ?? null)

// For name-to-map mode: the SVG path ID the user has clicked
const selectedSvgId = ref<string | null>(null)

// DOM ref for the map container
const mapContainer = ref<HTMLDivElement | null>(null)

// ─── Computed helpers ─────────────────────────────────────────
const progressPct = computed(() =>
  ROUND_SIZE > 0 ? (questionIndex.value / ROUND_SIZE) * 100 : 0
)

const canConfirm = computed(() =>
  selectedSvgId.value !== null && phase.value === 'playing'
)

// ─── Map DOM helpers ──────────────────────────────────────────
function getPathEl(svgPathId: string): SVGElement | null {
  if (!mapContainer.value) return null
  return mapContainer.value.querySelector(`[id="${svgPathId}"]`) as SVGElement | null
}

function setFill(svgPathId: string, color: string) {
  const el = getPathEl(svgPathId)
  if (el) el.style.fill = color
}

function resetAllFills() {
  BUNDESLAENDER.forEach(b => setFill(b.svgPathId, DEFAULT_FILL))
}

function applyQuestionHighlight() {
  if (!current.value) return
  resetAllFills()
  const { bundesland, mode } = current.value

  if (mode === 'map-to-name') {
    setFill(bundesland.svgPathId, HIGHLIGHT_FILL)
  }
  // name-to-map: all neutral until user selects
  if (selectedSvgId.value) {
    setFill(selectedSvgId.value, SELECTED_FILL)
  }
}

function applyFeedbackHighlight(correct: boolean) {
  if (!current.value) return
  const { bundesland } = current.value

  resetAllFills()
  if (correct) {
    setFill(bundesland.svgPathId, CORRECT_FILL)
  } else {
    // Show correct state in green and selected (wrong) in red
    setFill(bundesland.svgPathId, CORRECT_FILL)
    if (selectedSvgId.value && selectedSvgId.value !== bundesland.svgPathId) {
      setFill(selectedSvgId.value, WRONG_FILL)
    }
  }
}

// ─── Game flow ────────────────────────────────────────────────
function startGame() {
  session = buildSession()
  questionIndex.value = 0
  sessionScore.value = 0
  correctCount.value = 0
  wrongCount.value = 0
  selectedSvgId.value = null
  gameStore.startGame('bundeslaender-quiz')
  phase.value = 'playing'
  nextTick(() => applyQuestionHighlight())
}

function pauseGame() {
  if (phase.value !== 'playing' || isPaused.value) return
  isPaused.value = true
}

function resumeGame() {
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
  nextTick(() => resetAllFills())
}

// ─── Answer handling ──────────────────────────────────────────
function processAnswer(isCorrect: boolean) {
  if (isCorrect) {
    userStore.addXp(XP_PER_CORRECT)
    gameStore.addScore(XP_PER_CORRECT)
    sessionScore.value += XP_PER_CORRECT
    correctCount.value++
    phase.value = 'feedback-correct'
    nextTick(() => applyFeedbackHighlight(true))
  } else {
    userStore.loseBoost(1)
    wrongCount.value++
    phase.value = 'feedback-wrong'
    nextTick(() => applyFeedbackHighlight(false))
  }
}

/** map-to-name: user clicked a name button */
function onNameOptionClick(optionId: string) {
  if (phase.value !== 'playing' || !current.value) return
  const isCorrect = optionId === current.value.bundesland.id
  processAnswer(isCorrect)
}

/** name-to-map: user clicked a region in the SVG */
function onMapClick(e: MouseEvent) {
  if (phase.value !== 'playing' || !current.value) return
  if (current.value.mode !== 'name-to-map') return

  const target = (e.target as Element).closest('[id]') as SVGElement | null
  const id = target?.id
  if (!id || !VALID_SVG_IDS.has(id)) return

  // Deselect if same state clicked again
  if (selectedSvgId.value === id) {
    setFill(id, DEFAULT_FILL)
    selectedSvgId.value = null
    return
  }

  // Clear previous selection
  if (selectedSvgId.value) setFill(selectedSvgId.value, DEFAULT_FILL)
  selectedSvgId.value = id
  setFill(id, SELECTED_FILL)
}

/** name-to-map: user clicks confirm button */
function onConfirm() {
  if (!canConfirm.value || !current.value) return
  const correctSvgId = current.value.bundesland.svgPathId
  const isCorrect = selectedSvgId.value === correctSvgId
  processAnswer(isCorrect)
}

function nextQuestion() {
  selectedSvgId.value = null
  if (questionIndex.value + 1 >= ROUND_SIZE) {
    endGame()
  } else {
    questionIndex.value++
    phase.value = 'playing'
    nextTick(() => applyQuestionHighlight())
  }
}

// Re-apply highlights when question changes (e.g., after nextTick from nextQuestion)
watch(questionIndex, () => {
  if (phase.value === 'playing') nextTick(() => applyQuestionHighlight())
})

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
</script>

<template>
  <div class="relative w-full h-full select-none text-white flex flex-col bg-slate-900">

    <!-- ── READY screen ── -->
    <Transition name="fade">
      <div v-if="phase === 'ready'" class="flex flex-col items-center justify-center h-full gap-6 px-6 text-center">
        <div class="text-7xl">🗺️</div>
        <h1 class="text-4xl font-extrabold">{{ t('bundeslaenderQuiz.title') }}</h1>
        <p class="text-white/70 text-lg max-w-sm">{{ t('bundeslaenderQuiz.readyDesc') }}</p>
        <AppButton size="lg" @click="startGame">{{ t('game.go') }}</AppButton>
        <button class="text-white/50 text-sm underline mt-2" @click="emit('exit')">{{ t('game.backToMenu') }}</button>
      </div>
    </Transition>

    <!-- ── PLAYING / FEEDBACK ── -->
    <template v-if="phase === 'playing' || phase === 'feedback-correct' || phase === 'feedback-wrong'">

      <!-- Progress bar -->
      <div class="w-full h-2 bg-white/10 flex-shrink-0">
        <div class="h-full bg-amber-500 rounded-r-full transition-all duration-300" :style="{ width: `${progressPct}%` }" />
      </div>

      <!-- HUD -->
      <div class="flex items-center gap-2 px-3 pt-2 pb-1 flex-shrink-0">
        <button
          class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-base"
          @click="pauseGame"
        >⏸</button>
        <span class="flex-1 text-sm font-semibold text-white/70 text-center">
          {{ t('bundeslaenderQuiz.questionOf', { current: questionIndex + 1, total: ROUND_SIZE }) }}
        </span>
        <span class="text-sm font-bold bg-white/10 rounded-full px-3 py-1">
          {{ t('game.score', { score: sessionScore }) }}
        </span>
      </div>

      <!-- Main content -->
      <div v-if="current" class="flex-1 min-h-0 flex flex-col items-center gap-2 px-3 pb-3 overflow-hidden">

        <!-- ── map-to-name mode ── -->
        <template v-if="current.mode === 'map-to-name'">
          <p class="text-sm sm:text-base font-bold text-white/80 flex-shrink-0 pt-1">
            {{ t('bundeslaenderQuiz.chooseState') }}
          </p>

          <!-- Map -->
          <div
            ref="mapContainer"
            class="flex-1 min-h-0 w-full max-w-xs sm:max-w-sm cursor-default"
            v-html="mapSvgHtml"
          />

          <!-- Name options -->
          <div class="grid grid-cols-2 gap-2 w-full max-w-sm flex-shrink-0">
            <button
              v-for="option in current.options"
              :key="option.id"
              class="text-center px-2 py-3 rounded-xl font-semibold text-sm sm:text-base border-2 transition-all min-h-[44px]"
              :class="phase === 'playing'
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 active:scale-95'
                : option.id === current.bundesland.id
                  ? 'bg-green-500 border-green-400 text-white'
                  : 'bg-white/10 border-white/10 text-white/40'"
              :disabled="phase !== 'playing'"
              @click="onNameOptionClick(option.id)"
            >
              {{ t(option.nameKey) }}
            </button>
          </div>
        </template>

        <!-- ── name-to-map mode ── -->
        <template v-else>
          <!-- State name + flag -->
          <div class="flex items-center gap-3 flex-shrink-0 pt-1">
            <img
              :src="FLAG_URLS[current.bundesland.flagPath]"
              :alt="t(current.bundesland.nameKey)"
              class="h-8 sm:h-10 w-auto rounded shadow border border-white/20"
              draggable="false"
            />
            <p class="text-lg sm:text-2xl font-extrabold">
              {{ t(current.bundesland.nameKey) }}
            </p>
          </div>

          <p class="text-xs sm:text-sm text-white/60 flex-shrink-0 -mt-1">
            {{ t('bundeslaenderQuiz.clickState') }}
          </p>

          <!-- Map (clickable) -->
          <div
            ref="mapContainer"
            class="flex-1 min-h-0 w-full max-w-xs sm:max-w-sm cursor-pointer"
            :class="phase === 'playing' ? '' : 'pointer-events-none'"
            v-html="mapSvgHtml"
            @click="onMapClick"
          />

          <!-- Confirm button -->
          <div v-if="phase === 'playing'" class="flex-shrink-0 w-full max-w-sm">
            <AppButton size="md" full-width :disabled="!canConfirm" @click="onConfirm">
              {{ t('bundeslaenderQuiz.confirm') }}
            </AppButton>
          </div>
        </template>

        <!-- Feedback message -->
        <Transition name="pop">
          <div
            v-if="phase === 'feedback-correct'"
            class="flex-shrink-0 text-xl sm:text-2xl font-extrabold text-green-300"
          >
            {{ t('bundeslaenderQuiz.correct', { xp: XP_PER_CORRECT }) }}
          </div>
          <div
            v-else-if="phase === 'feedback-wrong'"
            class="flex-shrink-0 text-center"
          >
            <p class="text-xl sm:text-2xl font-extrabold text-red-300">{{ t('bundeslaenderQuiz.wrong') }}</p>
            <p class="text-sm text-white/60 mt-1">
              {{ t('bundeslaenderQuiz.wrongAnswer', { name: t(current.bundesland.nameKey) }) }}
            </p>
          </div>
        </Transition>

        <!-- Next button (feedback phase) -->
        <div v-if="phase === 'feedback-correct' || phase === 'feedback-wrong'" class="flex-shrink-0 w-full max-w-sm">
          <AppButton size="md" full-width @click="nextQuestion">
            {{ t('bundeslaenderQuiz.next') }} →
          </AppButton>
        </div>

      </div>
    </template>

    <!-- ── GAME OVER ── -->
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

/* Make SVG paths interactive */
:deep(svg [id]) {
  transition: fill 0.2s;
}
:deep(svg path[id]:hover) {
  opacity: 0.85;
}
</style>
