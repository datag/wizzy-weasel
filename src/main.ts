import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './assets/main.css'

import de from './locales/de.json'
import en from './locales/en.json'

import router from './router/index'

// i18n
const detectedLocale = navigator.language.startsWith('en') ? 'en' : 'de'
const i18n = createI18n({
  legacy: false,
  locale: detectedLocale,
  fallbackLocale: 'de',
  messages: { de, en },
})

// Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(i18n)

const BASE_URL = import.meta.env.BASE_URL

// GitHub Pages serves the SPA as 404.html (HTTP 404) for any path that isn't a real
// file. So in production, a pathname other than the base URL IS the 404 document.
// Valid routes are forwarded to the entry point (?r=) to obtain a clean 200 and have
// the URL restored; invalid ones stay here with the genuine 404 status.
const is404Document = import.meta.env.PROD && window.location.pathname !== BASE_URL

if (is404Document) {
  const route = window.location.pathname.slice(BASE_URL.length).replace(/^\/+/, '')
  const target = `/${route}`
  const matched = router.resolve(target).matched
  const isValid = matched.length > 0 && !matched.some(r => r.name === 'not-found')

  if (isValid) {
    window.location.replace(`${BASE_URL}?r=${encodeURIComponent(route)}`)
  } else {
    app.mount('#app')
  }
} else {
  const redirect = new URLSearchParams(window.location.search).get('r')
  if (redirect) {
    history.replaceState(null, '', window.location.pathname)
    router.replace(redirect.startsWith('/') ? redirect : `/${redirect}`).then(() => app.mount('#app'))
  } else {
    app.mount('#app')
  }
}
