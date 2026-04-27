<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import { useFullscreen } from '@/composables/useFullscreen'
import { useUpdateCheck } from '@/composables/useUpdateCheck'
import UpdateOverlay from '@/components/ui/UpdateOverlay.vue'

const route = useRoute()
const isGameView = computed(() => route.path.startsWith('/game/'))

// ─── Long-press fullscreen gesture ───────────────────────────
const { toggle } = useFullscreen()

// ─── Production update check ─────────────────────────────────
const { updateAvailable } = useUpdateCheck()

const LONG_PRESS_MS = 600
const MOVE_THRESHOLD_PX = 12

const ripple = ref<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false })

let pressTimer: ReturnType<typeof setTimeout> | null = null
let startX = 0
let startY = 0

function isInteractive(el: EventTarget | null): boolean {
  let node = el as HTMLElement | null
  while (node && node !== document.body) {
    const tag = node.tagName?.toLowerCase()
    if (
      tag === 'button' || tag === 'a' || tag === 'input' ||
      tag === 'select' || tag === 'textarea' ||
      node.getAttribute('role') === 'button' ||
      node.hasAttribute('data-no-longpress')
    ) return true
    node = node.parentElement
  }
  return false
}

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse') return   // desktop only needs the navbar button
  if (isInteractive(e.target)) return

  startX = e.clientX
  startY = e.clientY

  pressTimer = setTimeout(() => {
    pressTimer = null
    ripple.value = { x: startX, y: startY, visible: true }
    toggle()
    setTimeout(() => { ripple.value.visible = false }, 500)
  }, LONG_PRESS_MS)
}

function cancelPress() {
  if (pressTimer !== null) {
    clearTimeout(pressTimer)
    pressTimer = null
  }
}

function onPointerMove(e: PointerEvent) {
  if (pressTimer === null) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  if (Math.sqrt(dx * dx + dy * dy) > MOVE_THRESHOLD_PX) cancelPress()
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', cancelPress)
  document.addEventListener('pointercancel', cancelPress)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', cancelPress)
  document.removeEventListener('pointercancel', cancelPress)
})
</script>

<template>
  <div class="min-h-screen">
    <Navbar v-if="!isGameView" />
    <main>
      <RouterView />
    </main>

    <!-- Long-press fullscreen ripple feedback -->
    <Transition name="ripple-fade">
      <div
        v-if="ripple.visible"
        class="fullscreen-ripple"
        :style="{ left: `${ripple.x}px`, top: `${ripple.y}px` }"
      />
    </Transition>

    <!-- Production update overlay -->
    <UpdateOverlay v-if="updateAvailable" @dismiss="updateAvailable = false" />
  </div>
</template>

<style scoped>
.fullscreen-ripple {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.25);
  border: 3px solid rgba(255, 255, 255, 0.7);
  animation: ripple-expand 0.5s ease-out forwards;
}

@keyframes ripple-expand {
  from { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
  to   { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
}

.ripple-fade-enter-active { animation: ripple-expand 0.5s ease-out forwards; }
.ripple-fade-leave-active { opacity: 0; }
</style>
