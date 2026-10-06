<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore, XP_PER_CORRECT } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import {
  SAFARI_STORIES,
  SAFARI_WORD_CLASSES,
  WORD_CLASS_MAP,
} from '@/data/wortartenSafari'
import type {
  SafariStory,
  SafariToken,
  SafariWordClass,
  SafariWordClassConfig,
} from '@/types'
import AppButton from '@/components/ui/AppButton.vue'
import PauseModal from '@/components/ui/PauseModal.vue'

const emit = defineEmits<{ (e: 'exit'): void }>()

const { t } = useI18n()
const userStore = useUserStore()
const gameStore = useGameStore()

// ─── Game Phases ──────────────────────────────────────────────
type Phase = 'intro' | 'step1' | 'step2' | 'step3' | 'step4' | 'gameover'
const phase = ref<Phase>('intro')
const isPaused = ref(false)
const containerRef = ref<HTMLElement | null>(null)

function scrollToTop() {
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTop = 0
    }
    window.scrollTo(0, 0)
  })
}

// ─── Config / Intro State ─────────────────────────────────────
const selectedWordClasses = ref<Set<SafariWordClass>>(
  new Set(SAFARI_WORD_CLASSES.filter(c => c.defaultActive).map(c => c.key))
)

function toggleWordClass(key: SafariWordClass) {
  const next = new Set(selectedWordClasses.value)
  if (next.has(key)) {
    if (next.size > 1) {
      next.delete(key)
    }
  } else {
    next.add(key)
  }
  selectedWordClasses.value = next
}

// ─── Round Data & State ───────────────────────────────────────
const currentStory = ref<SafariStory | null>(null)
let usedStoryIndices: number[] = []

// Step 1: Set of token indices after which a period was placed (0 .. tokens.length - 1)
const selectedGaps = ref<Set<number>>(new Set())

// Step 2: Set of token IDs marked as capitalized
const capitalizedTokenIds = ref<Set<string>>(new Set())

// Step 3: Map of token ID -> selected SafariWordClass
const tokenWordClasses = ref<Map<string, SafariWordClass>>(new Map())
const activeWordClassBrush = ref<SafariWordClass>('noun')

const targetActiveTokensCount = computed(() => {
  if (!currentStory.value) return 0
  return currentStory.value.tokens.filter(tok =>
    selectedWordClasses.value.has(tok.wordClass)
  ).length
})

// Step 4: Active Popover / Inspector
interface PopoverData {
  title: string
  statusType: 'correct' | 'wrong'
  badgeText?: string
  details: string[]
  explanation: string
}
const activePopover = ref<PopoverData | null>(null)

// Scores & Statistics
const stats = ref({
  endsCorrect: 0,
  endsTotal: 5,
  casingCorrect: 0,
  casingTotal: 0,
  classesCorrect: 0,
  classesTotal: 0,
  totalXp: 0,
})

// ─── Word Class Configurations active for this round ──────────
const activeWordClassConfigs = computed<SafariWordClassConfig[]>(() => {
  return SAFARI_WORD_CLASSES.filter(c => selectedWordClasses.value.has(c.key))
})

// ─── Start Game ───────────────────────────────────────────────
function pickRandomStory(): SafariStory {
  if (usedStoryIndices.length >= SAFARI_STORIES.length) {
    usedStoryIndices = []
  }
  const availableIndices = SAFARI_STORIES.map((_, i) => i).filter(
    i => !usedStoryIndices.includes(i)
  )
  const chosenIndex =
    availableIndices[Math.floor(Math.random() * availableIndices.length)]
  usedStoryIndices.push(chosenIndex)
  return SAFARI_STORIES[chosenIndex]
}

function startGame() {
  currentStory.value = pickRandomStory()
  selectedGaps.value = new Set()
  capitalizedTokenIds.value = new Set()
  tokenWordClasses.value = new Map()
  activePopover.value = null
  activeWordClassBrush.value = activeWordClassConfigs.value[0]?.key ?? 'noun'

  gameStore.startGame('word-class-safari')
  phase.value = 'step1'
  scrollToTop()
}

// ─── Step Transitions ─────────────────────────────────────────
function goToStep2() {
  phase.value = 'step2'
  scrollToTop()
}

function goToStep3() {
  phase.value = 'step3'
  scrollToTop()
}

function goBackToStep1() {
  phase.value = 'step1'
  scrollToTop()
}

function goBackToStep2() {
  phase.value = 'step2'
  scrollToTop()
}

function evaluateAndGoToStep4() {
  if (!currentStory.value) return

  const tokens = currentStory.value.tokens
  let endsCorrect = 0
  let casingCorrect = 0
  let classesCorrect = 0

  // 1. Sentence ends
  tokens.forEach((tok, idx) => {
    const isActualEnd = tok.isSentenceEnd
    const isSelected = selectedGaps.value.has(idx)
    if (isActualEnd && isSelected) {
      endsCorrect++
    }
  })

  // 2. Capitalization
  tokens.forEach(tok => {
    const isMarked = capitalizedTokenIds.value.has(tok.id)
    if (tok.isCapitalized === isMarked) {
      casingCorrect++
    }
  })

  // 3. Word Classes (only for active configured word classes)
  const activeKeys = selectedWordClasses.value
  let activeTokensCount = 0
  tokens.forEach(tok => {
    if (activeKeys.has(tok.wordClass)) {
      activeTokensCount++
      const userChoice = tokenWordClasses.value.get(tok.id)
      if (userChoice === tok.wordClass) {
        classesCorrect++
      }
    }
  })

  const earnedXp =
    endsCorrect * XP_PER_CORRECT +
    casingCorrect * 5 +
    classesCorrect * 8

  stats.value = {
    endsCorrect,
    endsTotal: 5,
    casingCorrect,
    casingTotal: tokens.length,
    classesCorrect,
    classesTotal: activeTokensCount,
    totalXp: earnedXp,
  }

  userStore.addXp(earnedXp)
  gameStore.addScore(earnedXp)

  phase.value = 'step4'
  scrollToTop()
}

function finishGame() {
  gameStore.endGame()
  phase.value = 'gameover'
  scrollToTop()
}

// ─── Step 1 Interactions: Sentence Ends ───────────────────────
function toggleGap(index: number) {
  if (phase.value !== 'step1') return
  const next = new Set(selectedGaps.value)
  if (next.has(index)) {
    next.delete(index)
  } else {
    next.add(index)
  }
  selectedGaps.value = next
}

// ─── Step 2 Interactions: Capitalization ──────────────────────
function toggleCapitalization(tokenId: string) {
  if (phase.value !== 'step2') return
  const next = new Set(capitalizedTokenIds.value)
  if (next.has(tokenId)) {
    next.delete(tokenId)
  } else {
    next.add(tokenId)
  }
  capitalizedTokenIds.value = next
}

// ─── Step 3 Interactions: Word Classes ────────────────────────
function selectWordClassBrush(key: SafariWordClass) {
  activeWordClassBrush.value = key
}

function applyWordClassToToken(token: SafariToken) {
  if (phase.value !== 'step3') return
  if (!selectedWordClasses.value.has(token.wordClass)) return
  const next = new Map(tokenWordClasses.value)
  const current = next.get(token.id)
  if (current === activeWordClassBrush.value) {
    next.delete(token.id)
  } else {
    next.set(token.id, activeWordClassBrush.value)
  }
  tokenWordClasses.value = next
}

// ─── Display Helpers ──────────────────────────────────────────
function formatTokenText(token: SafariToken): string {
  const isCap =
    phase.value === 'step2' || phase.value === 'step3'
      ? capitalizedTokenIds.value.has(token.id)
      : phase.value === 'step4'
      ? token.isCapitalized
      : false

  if (isCap) {
    // Capitalize first letter, remainder lowercase
    return token.raw.charAt(0).toUpperCase() + token.raw.slice(1).toLowerCase()
  } else {
    return token.raw.toLowerCase()
  }
}

function getTokenStyleClass(token: SafariToken): string {
  // Step 3: words not in selectedWordClasses are dimmed / greyed out
  if (phase.value === 'step3' && !selectedWordClasses.value.has(token.wordClass)) {
    return 'bg-white/5 text-white/60 border-dashed border-white/20 opacity-70'
  }

  // Step 3: painted word class for active tokens
  if (phase.value === 'step3') {
    const assigned = tokenWordClasses.value.get(token.id)
    if (assigned && WORD_CLASS_MAP.has(assigned)) {
      const cfg = WORD_CLASS_MAP.get(assigned)!
      return `${cfg.bgClass} shadow-sm font-semibold`
    }
    return 'bg-white/10 hover:bg-white/20 text-white'
  }

  // Step 4: Show painted word classes for active words, neutral for non-active
  if (phase.value === 'step4') {
    if (selectedWordClasses.value.has(token.wordClass) && WORD_CLASS_MAP.has(token.wordClass)) {
      const cfg = WORD_CLASS_MAP.get(token.wordClass)!
      return `${cfg.bgClass} shadow-sm font-semibold`
    }
    return 'bg-white/10 text-white/80'
  }

  return 'bg-white/10 hover:bg-white/20 text-white'
}

// ─── Evaluation / Popover Inspection (Step 4) ─────────────────
function inspectGap(index: number) {
  if (phase.value !== 'step4' || !currentStory.value) return

  const tokens = currentStory.value.tokens
  const token = tokens[index]
  const isActualEnd = token.isSentenceEnd
  const isSelected = selectedGaps.value.has(index)

  let sentenceNum = 1
  for (let i = 0; i <= index; i++) {
    if (tokens[i].isSentenceEnd && i < index) sentenceNum++
  }

  if (isActualEnd && isSelected) {
    activePopover.value = {
      title: t('wortartenSafari.step4.popoverTitle'),
      statusType: 'correct',
      badgeText: `Satz ${sentenceNum}`,
      details: [t('wortartenSafari.step4.popoverSentenceEndCorrect', { num: sentenceNum })],
      explanation: 'Hier ist der Gedanke zu Ende und ein Satzzeichen schließt den Satz ab.',
    }
  } else if (isActualEnd && !isSelected) {
    activePopover.value = {
      title: t('wortartenSafari.step4.popoverTitle'),
      statusType: 'wrong',
      badgeText: `Satz ${sentenceNum}`,
      details: [t('wortartenSafari.step4.popoverSentenceEndMissing', { num: sentenceNum })],
      explanation: 'Jeder vollständige Hauptsatz endet mit einem Punkt.',
    }
  } else if (!isActualEnd && isSelected) {
    const isComma = !!token.hasComma
    activePopover.value = {
      title: t('wortartenSafari.step4.popoverTitle'),
      statusType: 'wrong',
      badgeText: isComma
        ? t('wortartenSafari.step4.popoverSentenceEndCommaBadge')
        : t('wortartenSafari.step4.popoverSentenceEndExtraBadge'),
      details: [
        isComma
          ? t('wortartenSafari.step4.popoverSentenceEndComma')
          : t('wortartenSafari.step4.popoverSentenceEndExtra'),
      ],
      explanation: isComma
        ? t('wortartenSafari.step4.popoverSentenceEndCommaExpl')
        : t('wortartenSafari.step4.popoverSentenceEndExtraExpl'),
    }
  }
}

function inspectToken(token: SafariToken) {
  if (phase.value !== 'step4') return

  const isCapSelected = capitalizedTokenIds.value.has(token.id)
  const isCapCorrect = isCapSelected === token.isCapitalized
  const userClass = tokenWordClasses.value.get(token.id)
  const isClassMonitored = selectedWordClasses.value.has(token.wordClass)
  const isClassCorrect = !isClassMonitored || userClass === token.wordClass

  const details: string[] = []
  const isOverallCorrect = isCapCorrect && isClassCorrect

  // Capitalization detail
  if (isCapCorrect) {
    details.push(t('wortartenSafari.step4.popoverCasingCorrect'))
  } else {
    details.push(
      t('wortartenSafari.step4.popoverCasingWrong', {
        word: token.raw,
        expected: token.isCapitalized ? 'GROSSGESCHRIEBEN' : 'kleingeschrieben',
      })
    )
  }

  // Word class detail
  if (isClassMonitored) {
    const expectedName = t(`wortartenSafari.classes.${token.wordClass}Child`)
    if (isClassCorrect) {
      details.push(t('wortartenSafari.step4.popoverWordClassCorrect', { class: expectedName }))
    } else {
      const actualName = userClass
        ? t(`wortartenSafari.classes.${userClass}Child`)
        : 'Keine'
      details.push(
        t('wortartenSafari.step4.popoverWordClassWrong', {
          expected: expectedName,
          actual: actualName,
        })
      )
    }
  } else {
    const className = t(`wortartenSafari.classes.${token.wordClass}Child`)
    details.push(t('wortartenSafari.step4.popoverWordClassNotMonitored', { class: className }))
  }

  activePopover.value = {
    title: `„${token.raw}“`,
    statusType: isOverallCorrect ? 'correct' : 'wrong',
    badgeText: t(`wortartenSafari.classes.${token.wordClass}`),
    details,
    explanation: token.explanation,
  }
}

function closePopover() {
  activePopover.value = null
}

function isTokenFaulty(token: SafariToken): boolean {
  if (phase.value !== 'step4') return false
  const isCapSelected = capitalizedTokenIds.value.has(token.id)
  const isCapCorrect = isCapSelected === token.isCapitalized
  const isClassMonitored = selectedWordClasses.value.has(token.wordClass)
  const userClass = tokenWordClasses.value.get(token.id)
  const isClassCorrect = !isClassMonitored || userClass === token.wordClass
  return !isCapCorrect || !isClassCorrect
}

function isGapFaulty(index: number): boolean {
  if (phase.value !== 'step4' || !currentStory.value) return false
  const token = currentStory.value.tokens[index]
  const isActualEnd = token.isSentenceEnd
  const isSelected = selectedGaps.value.has(index)
  return isActualEnd !== isSelected
}

// ─── Pause & Exit ─────────────────────────────────────────────
function pauseGame() {
  if (['intro', 'gameover'].includes(phase.value) || isPaused.value) return
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

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (activePopover.value) {
      closePopover()
      return
    }
    if (!['intro', 'gameover'].includes(phase.value) && !isPaused.value) {
      pauseGame()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div
    ref="containerRef"
    class="w-full h-full select-none bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 text-white overflow-y-auto flex flex-col justify-between"
  >

    <!-- ── PHASE 1: INTRO & CONFIG ── -->
    <Transition name="fade">
      <div v-if="phase === 'intro'" class="flex flex-col items-center my-auto px-4 pt-12 pb-8 max-w-lg mx-auto w-full gap-6">
        <div class="text-7xl animate-bounce">🦁</div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-center text-amber-300">
          {{ t('wortartenSafari.intro.title') }}
        </h1>
        <p class="text-emerald-100/80 text-center text-sm sm:text-base leading-relaxed">
          {{ t('wortartenSafari.intro.subtitle') }}
        </p>

        <!-- Word classes selection card -->
        <div class="w-full bg-emerald-900/40 border border-emerald-500/30 rounded-2xl p-5 flex flex-col gap-3 shadow-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-base sm:text-lg font-bold text-amber-200">
              {{ t('wortartenSafari.intro.wordClassesTitle') }}
            </h2>
            <span class="text-xs text-emerald-300 font-medium">3. Klasse</span>
          </div>
          <p class="text-xs text-emerald-200/60">
            {{ t('wortartenSafari.intro.wordClassesHint') }}
          </p>

          <div class="grid grid-cols-2 gap-2 pt-1">
            <button
              v-for="cfg in SAFARI_WORD_CLASSES"
              :key="cfg.key"
              type="button"
              class="flex items-center gap-2 p-3 rounded-xl border text-left transition-all active:scale-95 touch-manipulation cursor-pointer"
              :class="[
                selectedWordClasses.has(cfg.key)
                  ? 'bg-emerald-500/30 border-emerald-400 text-white shadow-md'
                  : 'bg-black/20 border-white/10 text-white/50 hover:bg-black/30',
              ]"
              style="min-height: 48px"
              @click="toggleWordClass(cfg.key)"
            >
              <span
                class="w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0"
                :class="selectedWordClasses.has(cfg.key) ? 'bg-emerald-400 text-black' : 'border border-white/30'"
              >
                {{ selectedWordClasses.has(cfg.key) ? '✓' : '' }}
              </span>
              <div class="flex flex-col min-w-0">
                <span class="text-xs font-bold truncate">{{ t(cfg.nameKey) }}</span>
                <span class="text-[10px] opacity-75 truncate">({{ t(cfg.childNameKey) }})</span>
              </div>
            </button>
          </div>
        </div>

        <AppButton size="lg" class="w-full mt-2" @click="startGame">
          {{ t('wortartenSafari.intro.start') }}
        </AppButton>
        <button
          class="text-emerald-300/60 hover:text-emerald-200 text-sm underline cursor-pointer py-2"
          @click="emit('exit')"
        >
          {{ t('game.backToMenu') }}
        </button>
      </div>
    </Transition>

    <!-- ── HUD FOR PLAYING / REVIEW PHASES ── -->
    <header
      v-if="phase !== 'intro' && phase !== 'gameover'"
      class="w-full max-w-2xl mx-auto px-4 pt-4 pb-2 flex flex-col gap-2 shrink-0"
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

        <!-- Current Step Badge -->
        <div class="flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/30 px-3 py-1.5 rounded-full font-bold text-amber-300 text-xs sm:text-sm">
          <span>
            {{
              phase === 'step1'
                ? `🧭 ${t('wortartenSafari.hud.step1Name')}`
                : phase === 'step2'
                ? `🔤 ${t('wortartenSafari.hud.step2Name')}`
                : phase === 'step3'
                ? `🎨 ${t('wortartenSafari.hud.step3Name')}`
                : `🔍 ${t('wortartenSafari.hud.step4Name')}`
            }}
          </span>
          <span class="text-white/40">|</span>
          <span class="text-white/80">
            {{
              t('wortartenSafari.hud.step', {
                step: phase === 'step1' ? 1 : phase === 'step2' ? 2 : phase === 'step3' ? 3 : 4,
                total: 4,
              })
            }}
          </span>
        </div>

        <!-- Score counter -->
        <span class="bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl px-3 py-2 font-bold text-xs sm:text-sm">
          🏆 {{ gameStore.sessionScore }} XP
        </span>
      </div>

      <!-- Step Progress Bar -->
      <div class="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-300"
          :style="{
            width:
              phase === 'step1'
                ? '25%'
                : phase === 'step2'
                ? '50%'
                : phase === 'step3'
                ? '75%'
                : '100%',
          }"
        />
      </div>
    </header>

    <!-- ── MAIN TEXT CANVAS (STEPS 1 - 4) ── -->
    <main
      v-if="phase !== 'intro' && phase !== 'gameover' && currentStory"
      class="w-full max-w-2xl mx-auto px-4 py-3 flex-1 flex flex-col justify-center"
    >
      <!-- Instruction Banner -->
      <div class="bg-emerald-900/30 border border-emerald-500/20 rounded-2xl p-3.5 mb-3 text-center">
        <h3 class="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-0.5">
          {{ currentStory.title }}
        </h3>
        <p class="text-xs sm:text-sm text-white/90">
          {{
            phase === 'step1'
              ? t('wortartenSafari.step1.instruction')
              : phase === 'step2'
              ? t('wortartenSafari.step2.instruction')
              : phase === 'step3'
              ? t('wortartenSafari.step3.instruction')
              : t('wortartenSafari.step4.instruction')
          }}
        </p>
        <p v-if="phase === 'step1'" class="mt-1 text-xs text-white/40">
          {{ t('wortartenSafari.step1.commaHint') }}
        </p>
      </div>

      <!-- Interactive Story Canvas -->
      <div
        class="bg-stone-900/70 border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-sm flex flex-wrap items-center gap-y-3 leading-relaxed text-base sm:text-lg"
      >
        <template v-for="(token, idx) in currentStory.tokens" :key="token.id">
          <!-- Word Token Element -->
          <button
            type="button"
            class="relative inline-flex items-center justify-center px-3 py-1.5 rounded-xl border transition-all text-base sm:text-lg select-none"
            :class="[
              getTokenStyleClass(token),
              phase === 'step2' ? 'cursor-pointer hover:scale-105 active:scale-95' : '',
              phase === 'step3' && selectedWordClasses.has(token.wordClass)
                ? 'cursor-pointer hover:scale-105 active:scale-95'
                : '',
              phase === 'step3' && !selectedWordClasses.has(token.wordClass)
                ? 'cursor-not-allowed'
                : '',
              phase === 'step4' && isTokenFaulty(token)
                ? 'cursor-pointer ring-2 ring-red-400 border-red-500 bg-red-900/40 text-red-200 shadow-md animate-pulse'
                : '',
              phase === 'step4' && !isTokenFaulty(token)
                ? 'cursor-pointer border-emerald-500/50'
                : 'border-white/10',
            ]"
            style="min-height: 44px; min-width: 44px"
            @click="
              phase === 'step2'
                ? toggleCapitalization(token.id)
                : phase === 'step3' && selectedWordClasses.has(token.wordClass)
                ? applyWordClassToToken(token)
                : phase === 'step4'
                ? inspectToken(token)
                : undefined
            "
          >
            <!-- Capitalized letter badge preview in Step 2 -->
            <span
              v-if="phase === 'step2' && capitalizedTokenIds.has(token.id)"
              class="absolute -top-2 -right-1 text-[10px] bg-amber-400 text-stone-950 font-black rounded-full px-1.5 py-0.2 shadow"
            >
              Aa
            </span>

            <!-- Status Indicator in Step 4 -->
            <span
              v-if="phase === 'step4'"
              class="absolute -top-2 -right-2 text-[11px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow"
              :class="isTokenFaulty(token) ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'"
            >
              {{ isTokenFaulty(token) ? '?' : '✓' }}
            </span>

            <span>{{ formatTokenText(token) }}</span>
          </button>

          <!-- Inter-word or Sentence-End Gap Slot -->
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-xl transition-all select-none mx-0.5 touch-manipulation"
            :class="[
              phase === 'step1'
                ? 'cursor-pointer hover:bg-amber-400/20 active:scale-90 border border-dashed border-emerald-400/30'
                : phase === 'step4'
                ? 'cursor-pointer'
                : 'cursor-default pointer-events-none',
              selectedGaps.has(idx)
                ? 'bg-amber-500/20 text-amber-300 font-bold border-amber-400'
                : 'text-white/20',
              phase === 'step4' && isGapFaulty(idx)
                ? 'ring-2 ring-red-400 border-red-500 bg-red-950/60 animate-bounce'
                : '',
            ]"
            style="min-width: 44px; min-height: 44px"
            :title="phase === 'step1' ? 'Satzende setzen' : ''"
            @click="phase === 'step1' ? toggleGap(idx) : phase === 'step4' ? inspectGap(idx) : undefined"
          >
            <span
              v-if="selectedGaps.has(idx)"
              class="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center text-sm font-black shadow-lg"
            >
              .
            </span>
            <span
              v-else-if="phase === 'step4' && token.isSentenceEnd"
              class="w-6 h-6 rounded-full border border-dashed border-red-400 text-red-300 flex items-center justify-center text-xs font-bold"
            >
              .
            </span>
            <span
              v-else-if="phase !== 'step1' && token.hasComma"
              class="text-white/50 text-xl font-bold select-none"
            >
              ,
            </span>
            <span v-else-if="phase === 'step1'" class="text-xs opacity-40">␣</span>
          </button>
        </template>
      </div>

      <!-- Word Class Palette for Step 3 -->
      <div
        v-if="phase === 'step3'"
        class="mt-4 bg-emerald-950/80 border border-emerald-500/30 rounded-2xl p-3 shadow-lg"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-emerald-300 uppercase tracking-wider">
            {{ t('wortartenSafari.step3.activeTool') }}
          </span>
          <span class="text-[11px] text-white/50">
            {{ t('wortartenSafari.step3.tapToUnset') }}
          </span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cfg in activeWordClassConfigs"
            :key="cfg.key"
            type="button"
            class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer touch-manipulation"
            :class="[
              activeWordClassBrush === cfg.key
                ? `${cfg.bgClass} ring-2 ring-white scale-105 shadow-md`
                : 'bg-black/40 border-white/20 text-white/70 hover:bg-black/60',
            ]"
            style="min-height: 44px"
            @click="selectWordClassBrush(cfg.key)"
          >
            <span>{{ t(cfg.nameKey) }}</span>
            <span class="text-[10px] opacity-75">({{ t(cfg.childNameKey) }})</span>
          </button>
        </div>
      </div>
    </main>

    <!-- ── FOOTER CONTROLS ── -->
    <footer
      v-if="phase !== 'intro' && phase !== 'gameover'"
      class="w-full max-w-2xl mx-auto px-4 py-3 shrink-0 flex items-center justify-between gap-3"
    >
      <!-- Step 1 Footer -->
      <template v-if="phase === 'step1'">
        <div class="text-xs sm:text-sm text-emerald-200 font-medium">
          {{ t('wortartenSafari.step1.endsFound', { count: selectedGaps.size }) }}
        </div>
        <AppButton size="md" @click="goToStep2">
          {{ t('wortartenSafari.step1.next') }}
        </AppButton>
      </template>

      <!-- Step 2 Footer -->
      <template v-if="phase === 'step2'">
        <div class="flex flex-col items-start gap-1">
          <div class="text-xs sm:text-sm text-emerald-200 font-medium">
            {{ t('wortartenSafari.step2.capitalizedCount', { count: capitalizedTokenIds.size }) }}
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 min-h-[44px] -ml-3 px-3 rounded-xl text-xs sm:text-sm font-semibold text-emerald-200/70 hover:text-emerald-100 hover:bg-white/10 transition-colors cursor-pointer"
            @click="goBackToStep1"
          >
            <span aria-hidden="true">⬅</span>
            {{ t('wortartenSafari.step2.back') }}
          </button>
        </div>
        <AppButton size="md" @click="goToStep3">
          {{ t('wortartenSafari.step2.next') }}
        </AppButton>
      </template>

      <!-- Step 3 Footer -->
      <template v-if="phase === 'step3'">
        <div class="flex flex-col items-start gap-1">
          <div class="text-xs sm:text-sm text-emerald-200 font-medium">
            {{ tokenWordClasses.size }} von {{ targetActiveTokensCount }} Wörtern markiert
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 min-h-[44px] -ml-3 px-3 rounded-xl text-xs sm:text-sm font-semibold text-emerald-200/70 hover:text-emerald-100 hover:bg-white/10 transition-colors cursor-pointer"
            @click="goBackToStep2"
          >
            <span aria-hidden="true">⬅</span>
            {{ t('wortartenSafari.step3.back') }}
          </button>
        </div>
        <AppButton size="md" @click="evaluateAndGoToStep4">
          {{ t('wortartenSafari.step3.finish') }}
        </AppButton>
      </template>

      <!-- Step 4 Footer -->
      <template v-if="phase === 'step4'">
        <div class="text-xs text-emerald-200/80">
          💡 Tippe auf rote Markierungen für Erklärungen
        </div>
        <AppButton size="md" @click="finishGame">
          {{ t('wortartenSafari.step4.toSummary') }}
        </AppButton>
      </template>
    </footer>

    <!-- ── POPOVER INSPECTOR MODAL (STEP 4) ── -->
    <Transition name="fade">
      <div
        v-if="activePopover"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        @click.self="closePopover"
      >
        <div
          class="bg-stone-900 border-2 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4"
          :class="activePopover.statusType === 'correct' ? 'border-emerald-500' : 'border-amber-500'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ activePopover.statusType === 'correct' ? '🌟' : '🔍' }}</span>
              <h3 class="text-xl font-bold text-white">{{ activePopover.title }}</h3>
            </div>
            <span
              v-if="activePopover.badgeText"
              class="px-2.5 py-1 rounded-full text-xs font-bold bg-white/10 text-amber-300"
            >
              {{ activePopover.badgeText }}
            </span>
          </div>

          <!-- Status Details -->
          <div class="flex flex-col gap-2">
            <div
              v-for="(detail, i) in activePopover.details"
              :key="i"
              class="text-sm p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/90"
            >
              {{ detail }}
            </div>
          </div>

          <!-- Didactic Explanation -->
          <div class="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-xs sm:text-sm text-emerald-100 leading-relaxed">
            <span class="font-bold text-amber-300 block mb-1">🦁 Forscher-Regel:</span>
            {{ activePopover.explanation }}
          </div>

          <AppButton size="sm" class="w-full mt-2" @click="closePopover">
            {{ t('wortartenSafari.step4.close') }}
          </AppButton>
        </div>
      </div>
    </Transition>

    <!-- ── PHASE 5: SUMMARY & GAMEOVER SCREEN ── -->
    <Transition name="fade">
      <div
        v-if="phase === 'gameover'"
        class="flex flex-col items-center my-auto px-4 pt-12 pb-8 max-w-md mx-auto w-full gap-5"
      >
        <div class="text-7xl animate-bounce">🏆</div>
        <h1 class="text-3xl font-extrabold text-center text-amber-300">
          {{ t('wortartenSafari.summary.title') }}
        </h1>
        <p class="text-emerald-100/80 text-center text-sm">
          {{ t('wortartenSafari.summary.subtitle') }}
        </p>

        <!-- Stats breakdown cards -->
        <div class="w-full flex flex-col gap-3">
          <!-- Sentence ends -->
          <div class="bg-emerald-900/40 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">🧭</span>
              <span class="text-sm font-semibold">{{ t('wortartenSafari.summary.sentenceEnds') }}</span>
            </div>
            <span class="text-lg font-black text-amber-300">
              {{ stats.endsCorrect }} / {{ stats.endsTotal }}
            </span>
          </div>

          <!-- Capitalization -->
          <div class="bg-emerald-900/40 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">🔤</span>
              <span class="text-sm font-semibold">{{ t('wortartenSafari.summary.capitalization') }}</span>
            </div>
            <span class="text-lg font-black text-amber-300">
              {{ stats.casingCorrect }} / {{ stats.casingTotal }}
            </span>
          </div>

          <!-- Word classes -->
          <div class="bg-emerald-900/40 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">🎨</span>
              <span class="text-sm font-semibold">{{ t('wortartenSafari.summary.wordClasses') }}</span>
            </div>
            <span class="text-lg font-black text-amber-300">
              {{ stats.classesCorrect }} / {{ stats.classesTotal }}
            </span>
          </div>

          <!-- Total Score XP banner -->
          <div class="bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 rounded-2xl p-4 text-center">
            <span class="text-xs uppercase tracking-wider text-amber-200 font-bold block mb-1">
              Erfolgs-Prämie
            </span>
            <span class="text-2xl sm:text-3xl font-black text-amber-300">
              +{{ stats.totalXp }} XP
            </span>
          </div>
        </div>

        <AppButton size="lg" class="w-full mt-2" @click="startGame">
          {{ t('wortartenSafari.summary.playAgain') }}
        </AppButton>
        <button
          class="text-emerald-300/60 hover:text-emerald-200 text-sm underline cursor-pointer py-2"
          @click="emit('exit')"
        >
          {{ t('wortartenSafari.summary.backToMenu') }}
        </button>
      </div>
    </Transition>

    <!-- ── PAUSE MODAL ── -->
    <PauseModal
      v-if="isPaused"
      @resume="resumeGame"
      @exit="exitGame"
    />
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
