<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Mail } from 'lucide-vue-next'
import { appConfig, privacyPolicyUrlFor, type PrivacyLang } from '@/config/app'

const { t } = useI18n()

const mailHref = computed(() =>
  appConfig.operatorMail ? `mailto:${appConfig.operatorMail}` : null,
)

const privacyLinks = computed<{ lang: PrivacyLang; href: string; label: string }[]>(() => {
  const links: { lang: PrivacyLang; href: string; label: string }[] = []
  for (const lang of ['en', 'de'] as const) {
    const href = privacyPolicyUrlFor(lang)
    if (!href) continue
    links.push({
      lang,
      href,
      label: lang === 'en' ? t('footer.privacyPolicyEn') : t('footer.privacyPolicyDe'),
    })
  }
  return links
})

// The footer only exists if at least one of the environment variables is set.
const visible = computed(() => mailHref.value !== null || privacyLinks.value.length > 0)
</script>

<template>
  <footer v-if="visible" class="border-t border-slate-200 bg-white">
    <div class="mx-auto flex max-w-5xl flex-col items-center gap-1 px-4 py-4 text-center">
      <a
        v-if="mailHref"
        :href="mailHref"
        class="inline-flex min-h-[44px] items-center gap-2 break-all text-sm font-bold text-violet-600 transition-colors hover:text-violet-700"
      >
        <Mail :size="18" class="shrink-0" aria-hidden="true" />
        {{ appConfig.operatorMail }}
      </a>

      <p
        v-if="privacyLinks.length"
        class="flex flex-wrap items-center justify-center gap-1 text-sm text-slate-500"
      >
        <template v-for="(link, index) in privacyLinks" :key="link.lang">
          <span v-if="index > 0" aria-hidden="true">·</span>
          <a
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-h-[44px] items-center px-1 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-700"
          >
            {{ link.label }}
          </a>
        </template>
      </p>
    </div>
  </footer>
</template>
