<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  /** Hour value 0–11 */
  hours: number
  /** Minute value 0–55 (multiples of 5) */
  minutes: number
  /** Enable drag interaction */
  interactive?: boolean
  /** Size in px */
  size?: number
}>(), {
  interactive: false,
  size: 240,
})

const emit = defineEmits<{
  'update:hours': [value: number]
  'update:minutes': [value: number]
}>()

// ─── Geometry ─────────────────────────────────────────────────
const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)
const r  = computed(() => props.size / 2 - 8)

// Hour hand angle: each hour = 30°, each minute adds 0.5°
const hourAngleDeg = computed(() => props.hours * 30 + props.minutes * 0.5)
// Minute hand angle: each minute = 6°
const minuteAngleDeg = computed(() => props.minutes * 6)

function handCoords(angleDeg: number, length: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return {
    x: cx.value + length * Math.cos(rad),
    y: cy.value + length * Math.sin(rad),
  }
}

const hourHandEnd = computed(() => handCoords(hourAngleDeg.value, r.value * 0.55))
const minuteHandEnd = computed(() => handCoords(minuteAngleDeg.value, r.value * 0.82))

// Tick marks
const ticks = Array.from({ length: 60 }, (_, i) => {
  const isHour = i % 5 === 0
  const ang = (i * 6 - 90) * (Math.PI / 180)
  const inner = isHour ? r.value * 0.83 : r.value * 0.90
  return {
    x1: cx.value + inner * Math.cos(ang),
    y1: cy.value + inner * Math.sin(ang),
    x2: cx.value + r.value * Math.cos(ang),
    y2: cy.value + r.value * Math.sin(ang),
    isHour,
  }
})

// Hour numbers
const hourNumbers = Array.from({ length: 12 }, (_, i) => {
  const num = i === 0 ? 12 : i
  const ang = (i * 30 - 90) * (Math.PI / 180)
  const dist = r.value * 0.70
  return {
    num,
    x: cx.value + dist * Math.cos(ang),
    y: cy.value + dist * Math.sin(ang),
  }
})

// ─── Interactive drag ─────────────────────────────────────────
type DragTarget = 'hour' | 'minute' | null
const dragging = ref<DragTarget>(null)
const svgRef = ref<SVGSVGElement | null>(null)

function svgAngle(clientX: number, clientY: number): number {
  if (!svgRef.value) return 0
  const rect = svgRef.value.getBoundingClientRect()
  const x = clientX - rect.left - cx.value
  const y = clientY - rect.top - cy.value
  // atan2 gives angle from positive X, we want from 12 o'clock
  const deg = Math.atan2(y, x) * (180 / Math.PI) + 90
  return (deg + 360) % 360
}

function startDrag(target: DragTarget, e: MouseEvent | TouchEvent) {
  if (!props.interactive) return
  e.preventDefault()
  dragging.value = target
}

function onMove(e: MouseEvent | TouchEvent) {
  if (!dragging.value) return
  e.preventDefault()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  const deg = svgAngle(clientX, clientY)

  if (dragging.value === 'minute') {
    // Snap to nearest 5-minute step
    const rawMin = Math.round(deg / 6)
    const snapped = (Math.round(rawMin / 5) * 5) % 60
    if (snapped !== props.minutes) emit('update:minutes', snapped)
  } else {
    // Snap to nearest hour (30° each)
    const rawHour = Math.round(deg / 30) % 12
    if (rawHour !== props.hours) emit('update:hours', rawHour)
  }
}

function stopDrag() {
  dragging.value = null
}

onMounted(() => {
  if (!props.interactive) return
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onMove, { passive: false })
  window.addEventListener('touchend', stopDrag)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('touchend', stopDrag)
})
</script>

<template>
  <svg
    ref="svgRef"
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    :class="['select-none', interactive ? 'cursor-pointer' : '']"
    role="img"
    aria-label="Analoguhr"
  >
    <!-- Clock face -->
    <circle :cx="cx" :cy="cy" :r="r" fill="white" stroke="#94a3b8" stroke-width="3" />

    <!-- Tick marks -->
    <line
      v-for="(tick, i) in ticks"
      :key="i"
      :x1="tick.x1"
      :y1="tick.y1"
      :x2="tick.x2"
      :y2="tick.y2"
      :stroke="tick.isHour ? '#475569' : '#cbd5e1'"
      :stroke-width="tick.isHour ? 2.5 : 1"
    />

    <!-- Hour numbers -->
    <text
      v-for="h in hourNumbers"
      :key="h.num"
      :x="h.x"
      :y="h.y"
      text-anchor="middle"
      dominant-baseline="central"
      :font-size="size * 0.075"
      font-weight="600"
      fill="#1e293b"
    >{{ h.num }}</text>

    <!-- Hour hand (visual) -->
    <line
      :x1="cx"
      :y1="cy"
      :x2="hourHandEnd.x"
      :y2="hourHandEnd.y"
      stroke="#1e293b"
      :stroke-width="size * 0.038"
      stroke-linecap="round"
      pointer-events="none"
    />

    <!-- Minute hand (visual) -->
    <line
      :x1="cx"
      :y1="cy"
      :x2="minuteHandEnd.x"
      :y2="minuteHandEnd.y"
      stroke="#3b82f6"
      :stroke-width="size * 0.018"
      stroke-linecap="round"
      pointer-events="none"
    />

    <!-- Center dot -->
    <circle :cx="cx" :cy="cy" :r="size * 0.025" fill="#1e293b" pointer-events="none" />

    <!-- Hit areas (interactive only) — order matters for z/pointer priority:
         Minute hit area is rendered first (full length → active in outer zone).
         Hour hit area is rendered last (shorter → sits on top in inner zone).
         Where both overlap (inner zone) the hour area wins; beyond the hour tip only
         the minute area exists, so the minute hand wins there. -->
    <template v-if="interactive">
      <!-- Minute hand hit area (full length) -->
      <line
        :x1="cx"
        :y1="cy"
        :x2="minuteHandEnd.x"
        :y2="minuteHandEnd.y"
        stroke="transparent"
        :stroke-width="size * 0.11"
        stroke-linecap="round"
        class="cursor-grab active:cursor-grabbing"
        @mousedown="startDrag('minute', $event)"
        @touchstart.prevent="startDrag('minute', $event)"
      />
      <!-- Hour hand hit area (inner zone, rendered on top → higher priority when overlapping) -->
      <line
        :x1="cx"
        :y1="cy"
        :x2="hourHandEnd.x"
        :y2="hourHandEnd.y"
        stroke="transparent"
        :stroke-width="size * 0.11"
        stroke-linecap="round"
        class="cursor-grab active:cursor-grabbing"
        @mousedown="startDrag('hour', $event)"
        @touchstart.prevent="startDrag('hour', $event)"
      />
    </template>
  </svg>
</template>
