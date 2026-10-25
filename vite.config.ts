import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'
import { resolve } from 'path'

// Optional build-time variables. They are exposed to the client as
// `import.meta.env.APP_*` and control which parts of the app footer are
// rendered. Missing variables simply hide the corresponding section.
//
// The `APP_` prefix makes them available from `.env` files as well as from
// the process environment (e.g. GitHub Actions `vars` passed via `env:`).
const APP_ENV_VARS = {
  APP_OPERATOR_MAIL: 'footer contact link',
  APP_PRIVACY_POLICY_URL: 'footer privacy policy links',
} as const

// Prints which variables are present during a build. Since the footer only
// renders what is configured, this makes a missing section visible in the
// build log (also in CI) instead of silently disappearing.
function reportAppConfig(): Plugin {
  return {
    name: 'report-app-config',
    apply: 'build',
    configResolved(config) {
      for (const [key, description] of Object.entries(APP_ENV_VARS)) {
        const value = config.env[key]
        console.log(
          value
            ? `[app-config] ${key} is set — ${description} will be rendered.`
            : `[app-config] ${key} is not set — ${description} will be hidden.`,
        )
      }
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    svgLoader({ svgo: false }),
    reportAppConfig(),
  ],
  envPrefix: ['VITE_', 'APP_'],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
    },
  },
})
