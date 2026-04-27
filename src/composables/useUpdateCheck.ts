import { ref, onMounted, onUnmounted } from 'vue'

const CHECK_INTERVAL_MS = 60_000

// Matches the hashed Vite entry script, e.g. /path/to/assets/index-AbCd.js
const SCRIPT_SRC_RE = /src="([^"]*\/assets\/[^"]+\.js)"/

function extractScriptSrc(html: string): string | null {
  return SCRIPT_SRC_RE.exec(html)?.[1] ?? null
}

export function useUpdateCheck() {
  const updateAvailable = ref(false)

  if (!import.meta.env.PROD) {
    return { updateAvailable }
  }

  let currentSrc: string | null = null
  let lastChecked = 0

  async function check() {
    if (document.hidden) return
    const now = Date.now()
    if (now - lastChecked < CHECK_INTERVAL_MS) {
      console.log(`[UpdateCheck] Skip check because recently checked (again in ${(CHECK_INTERVAL_MS - (now - lastChecked))/1000} seconds)`)
      return
    }
    lastChecked = now

    try {
      const html = await fetch(import.meta.env.BASE_URL, { cache: 'no-store' }).then(r => r.text())
      const fetchedSrc = extractScriptSrc(html)
      console.log(`[UpdateCheck] current: ${currentSrc} | fetched: ${fetchedSrc}`)
      if (fetchedSrc && currentSrc && fetchedSrc !== currentSrc) {
        console.log('[UpdateCheck] New version detected!')
        updateAvailable.value = true
      }
    } catch (err) {
      console.warn('[UpdateCheck] Check failed:', err)
    }
  }

  function onVisibilityChange() {
    if (!document.hidden) check()
  }

  onMounted(() => {
    // Capture the fingerprint of the currently loaded build
    const el = document.querySelector<HTMLScriptElement>('script[type="module"][src*="/assets/"]')
    if (el?.src) {
      // el.src is absolute; keep only the pathname for comparison
      currentSrc = new URL(el.src).pathname
    }
    lastChecked = Date.now()

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('focus', check)
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('focus', check)
  })

  return { updateAvailable }
}
