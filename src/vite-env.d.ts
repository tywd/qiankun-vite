/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USER_MANAGEMENT_URL: string
  readonly VITE_SYSTEM_MANAGEMENT_URL: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
