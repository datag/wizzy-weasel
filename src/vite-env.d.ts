/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Contact address of the site operator, rendered as a mailto link in the footer. */
  readonly APP_OPERATOR_MAIL?: string
  /** Base URL of the bilingual privacy policy. The footer appends `#de` / `#en`. */
  readonly APP_PRIVACY_POLICY_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
