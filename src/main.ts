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
app.mount('#app')
