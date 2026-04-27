import { ref } from 'vue'

// Module-level singleton so all consumers share the same state
const isFullscreen = ref(false)

if (typeof document !== 'undefined') {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
}

export function useFullscreen() {
  function toggle() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  return { isFullscreen, toggle }
}
