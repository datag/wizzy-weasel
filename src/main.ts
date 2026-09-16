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

// GH Pages 404.html redirects unknown client-side routes to the entry point with
// the original path in the ?r= query param. Restore the route and clean the URL.
const redirect = new URLSearchParams(window.location.search).get('r')
if (redirect) {
  history.replaceState(null, '', window.location.pathname)
  router.replace(redirect.startsWith('/') ? redirect : `/${redirect}`).then(() => app.mount('#app'))
} else {
  app.mount('#app')
}
